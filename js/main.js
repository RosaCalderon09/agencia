document.addEventListener('DOMContentLoaded', () => {
    // Add scroll class to header
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.92)';
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.82)';
            header.style.boxShadow = 'none';
        }
    });

    // Intersection Observer for reveal animations
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal, .service-card, .section-header').forEach(el => {
        revealObserver.observe(el);
    });

    // Particle System
    initParticles();
});

function initParticles() {
    const canvas = document.createElement('canvas');
    const container = document.getElementById('particles-js');
    if (!container) return;
    
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 80;
    
    const mouse = {
        x: null,
        y: null,
        radius: 150
    };

    window.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('resize', resizeCanvas);

    function resizeCanvas() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        init();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
        }

        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].draw();
            particles[i].update();
        }
        connect();
        requestAnimationFrame(animate);
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    opacityValue = 1 - (distance / 100);
                    ctx.strokeStyle = `rgba(255,255,255,${opacityValue * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    resizeCanvas();
    animate();
}

// Chatbot Functionality
const chatbotKnowledge = {
    "hola": "¡Hola! Bienvenido a IMROCA. ¿En qué puedo ayudarle hoy con sus trámites aduaneros?",
    "precio": "Nuestros precios varían según el tipo de carga y la complejidad del trámite. Por favor, contáctenos directamente para una cotización formal.",
    "cotización": "Para una cotización exacta, por favor visite nuestra página de Contacto o hable con un asesor por WhatsApp.",
    "facturabot": "Facturabot es nuestro sistema exclusivo que automatiza la digitación y acelera el proceso de aforo en aduanas.",
    "servicios": "Ofrecemos nacionalización de carga aérea, marítima, terrestre y servicios de exportación.",
    "transporte": "Lo sentimos, IMROCA solo gestiona procesos aduaneros. No ofrecemos servicios logísticos o de transporte.",
    "logistica": "IMROCA se especializa puramente en aduanas. No realizamos transporte ni logística de carga.",
    "nosotros": "IMROCA fue fundada en 2020 con el objetivo de agilizar el comercio exterior mediante tecnología y precisión.",
    "donde": "Estamos ubicados en Ciudad de Panamá, pero operamos en todos los puertos y fronteras del país.",
    "contacto": "Puede escribirnos a gestion@imroca.com o llamarnos al +1 (123) 456-7890.",
    "gracias": "¡De nada! Estamos aquí para servirle. ¿Necesita algo más?"
};

function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.classList.toggle('active');
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message === '') return;

    appendMessage('user', message);
    input.value = '';

    setTimeout(() => {
        const response = getChatbotResponse(message);
        appendMessage('bot', response);
    }, 600);
}

function getChatbotResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    for (let key in chatbotKnowledge) {
        if (msg.includes(key)) {
            return chatbotKnowledge[key];
        }
    }
    
    return `Lo siento, no tengo una respuesta específica para eso. ¿Desea hablar con un asesor especializado? <br> <a href="https://wa.me/50495307141" target="_blank" class="chat-wa-link"><i class="fab fa-whatsapp"></i> Hablar por WhatsApp</a>`;
}

function appendMessage(sender, text) {
    const body = document.getElementById('chat-body');
    if (!body) return;
    const div = document.createElement('div');
    div.classList.add('chat-message', sender === 'user' ? 'message-user' : 'message-bot');
    div.innerHTML = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
}

// Global Header, Footer and Chatbot Injection
function injectGlobalComponents() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    const headerHTML = `
        <div class="container nav-container">
            <a href="index.html" class="logo">
                <img src="images/logo.png" alt="IMROCA Logo">
            </a>
            <nav>
                <ul class="nav-links">
                    <li><a href="index.html" class="${currentPage === 'index.html' ? 'active' : ''}">Inicio</a></li>
                    <li><a href="nosotros.html" class="${currentPage === 'nosotros.html' ? 'active' : ''}">Nosotros</a></li>
                    <li><a href="servicios.html" class="${currentPage === 'servicios.html' ? 'active' : ''}">Servicios</a></li>
                    <li><a href="tecnologia.html" class="${currentPage === 'tecnologia.html' ? 'active' : ''}">Tecnología</a></li>
                    <li><a href="contacto.html" class="${currentPage === 'contacto.html' ? 'active' : ''}">Contacto</a></li>
                </ul>
            </nav>
            <a href="contacto.html" class="nav-cta">Cotizar Trámite</a>
        </div>
    `;

    const footerHTML = `
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <a href="index.html" class="logo" style="margin-bottom: 20px;">
                        <img src="images/logo.png" alt="IMROCA Logo" style="filter: brightness(0) invert(1);">
                    </a>
                    <p style="opacity: 0.7; margin-top: 15px;">Especialistas en procesos aduaneros y nacionalización de mercancías. Innovando el comercio exterior desde 2020.</p>
                </div>
                <div class="footer-col">
                    <h4>Navegación</h4>
                    <ul class="footer-links">
                        <li><a href="index.html">Inicio</a></li>
                        <li><a href="nosotros.html">Nosotros</a></li>
                        <li><a href="servicios.html">Servicios</a></li>
                        <li><a href="tecnologia.html">Tecnología</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Contacto</h4>
                    <ul class="footer-links">
                        <li><i class="fas fa-envelope" style="margin-right: 10px;"></i> info@imroca.com</li>
                        <li><i class="fas fa-phone" style="margin-right: 10px;"></i> (+504) 9530-7141</li>
                        <li><i class="fas fa-location-dot" style="margin-right: 10px;"></i> Ciudad de San Pedro Sula, Honduras</li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Horario</h4>
                    <ul class="footer-links">
                        <li>Lun - Vie: 8:00 AM - 5:00 PM</li>
                        <li>Sábados: 8:00 AM - 12:00 PM</li>
                        <li>Domingos: Cerrado</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 IMROCA SAS. Todos los derechos reservados.</p>
            </div>
        </div>
    `;

    const chatbotHTML = `
        <button class="chatbot-float" onclick="toggleChat()">
            <i class="fas fa-comment-dots"></i>
        </button>

        <div id="chat-window" class="chat-window">
            <div class="chat-header">
                <h4><i class="fas fa-robot"></i> Asistente IMROCA</h4>
                <i class="fas fa-times chat-close" onclick="toggleChat()"></i>
            </div>
            <div id="chat-body" class="chat-body">
                <div class="chat-message message-bot">
                    ¡Hola! Soy el asistente virtual de IMROCA. ¿Cómo puedo ayudarle con sus trámites aduaneros hoy?
                </div>
            </div>
            <div class="chat-footer">
                <input type="text" id="chat-input" placeholder="Escriba su mensaje..." onkeypress="handleChatKeyPress(event)">
                <button onclick="sendChatMessage()"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;

    const header = document.querySelector('header');
    if (header) header.innerHTML = headerHTML;

    const footer = document.querySelector('footer');
    if (footer) footer.innerHTML = footerHTML;

    const chatContainer = document.createElement('div');
    chatContainer.id = 'chatbot-container';
    chatContainer.innerHTML = chatbotHTML;
    document.body.appendChild(chatContainer);
}

// Parallax Effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroes = document.querySelectorAll('.hero');
    
    heroes.forEach(hero => {
        // Parallax background movement
        const speed = 0.5;
        hero.style.backgroundPositionY = -(scrolled * speed) + 'px';
        
        // Content fade and slight zoom
        const content = hero.querySelector('.hero-content');
        if (content) {
            content.style.opacity = 1 - (scrolled / 700);
            content.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
    });
});

// Run injection when DOM is ready
document.addEventListener('DOMContentLoaded', injectGlobalComponents);
