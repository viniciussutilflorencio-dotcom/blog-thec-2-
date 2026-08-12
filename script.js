// ===============================================
// 1. CONTADOR DE LIKES (COM PERSISTÊNCIA)
// ===============================================
const likeBtn = document.getElementById('likeBtn');
const likeCounter = document.getElementById('likeCounter');

let likes = parseInt(localStorage.getItem('viniciusBlogLikes')) || 0;

function updateDisplay() {
    likeCounter.textContent = `${likes} ${likes === 1 ? 'curtida' : 'curtidas'}`;
}

updateDisplay();

likeBtn.addEventListener('click', () => {
    likes++;
    localStorage.setItem('viniciusBlogLikes', likes);
    updateDisplay();
});

// ===============================================
// 2. BARRA DE PROGRESSO DE LEITURA
// ===============================================
const progressBar = document.getElementById('progress-bar');

window.addEventListener('scroll', () => {
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (windowScroll / height) * 100;
    
    progressBar.style.width = scrolled + '%';
});

// ===============================================
// 3. BOTÃO VOLTAR AO TOPO
// ===============================================
const backToTopBtn = document.getElementById('backToTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===============================================
// 4. EFEITO DE PARTÍCULAS INTERATIVAS (CANVAS)
// ===============================================
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const numberOfParticles = 60;

// Redimensiona o canvas quando a janela muda de tamanho
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Objeto para rastrear a posição do mouse
const mouse = {
    x: null,
    y: null,
    radius: 120
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Classe Partícula
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
        this.color = Math.random() > 0.5 ? '#00f3ff' : '#00ff88';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebater nas bordas da tela
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

        // Interação com o mouse (se aproximar, afasta levemente)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * 2;
            this.y -= Math.sin(angle) * 2;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Limpa o brilho para performance
    }
}

// Inicializar Partículas
function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

// Conectar partículas próximas com linhas neon
function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const opacity = 1 - (distance / 100);
                ctx.strokeStyle = `rgba(0, 243, 255, ${opacity * 0.2})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Loop de Animação
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    
    connectParticles();
    requestAnimationFrame(animate);
}

initParticles();
animate();
