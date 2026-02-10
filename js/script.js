document.addEventListener('DOMContentLoaded', function() {
    
    // Funcionalidad Menú Móvil
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks && navLinks.classList.remove('active');
        });
    });

    // --- LÓGICA DE NOTICIAS ---
    const newsContainer = document.getElementById('news-container');
    const adminNewsForm = document.getElementById('admin-news-form');

    // Función para renderizar noticias desde LocalStorage
    function loadNews() {
        if (!newsContainer) return;

        const storedNews = JSON.parse(localStorage.getItem('colRosasNews')) || [];
        
        // Limpiamos y recargamos
        const dynamicNews = document.querySelectorAll('.dynamic-news');
        dynamicNews.forEach(el => el.remove());

        storedNews.forEach(news => {
             const article = document.createElement('article');
             article.className = 'news-card dynamic-news';
             article.innerHTML = `
                <div class="news-image" style="background: url('${news.image || 'https://source.unsplash.com/random/500x300/?school'}') center/cover; background-color: #008ba3;"></div>
                <div class="news-content">
                    <span class="date">${news.date}</span>
                    <h3>${news.title}</h3>
                    <p class="news-excerpt">${news.content.substring(0, 100)}...</p>
                    <a href="#" class="read-more" data-type="news" data-content="${encodeURIComponent(news.content)}" data-title="${encodeURIComponent(news.title)}" data-date="${news.date}" data-img="${news.image}">Leer más</a>
                </div>
            `;
            newsContainer.insertBefore(article, newsContainer.firstChild);
        });
    }

    if(newsContainer) loadNews();

    // Lógica del Formulario Admin
    if(adminNewsForm) {
        adminNewsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('news-title').value;
            const content = document.getElementById('news-content').value;
            const imageUrl = document.getElementById('news-image-url').value;
            const date = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

            const newArticle = { title, content, image: imageUrl, date };

            const currentNews = JSON.parse(localStorage.getItem('colRosasNews')) || [];
            currentNews.push(newArticle);
            localStorage.setItem('colRosasNews', JSON.stringify(currentNews));

            adminNewsForm.reset();
            alert('¡Noticia publicada correctamente! Ve a la página de Inicio para verla.');
        });
    }

    // --- LÓGICA DEL MODAL ---
    const modal = document.getElementById('info-modal');
    const modalBody = document.getElementById('modal-body-content');
    const closeModal = document.querySelector('.close-modal');

    if(modal) {
        // Cerrar modal
        closeModal.addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target == modal) modal.style.display = 'none';
        });

        // DATOS DE OFERTA ACADÉMICA
        const academicData = {
            'Preescolar': {
                subtitle: 'Iniciando el camino del saber',
                details: 'Nuestro preescolar ofrece un ambiente seguro y estimulante donde los niños desarrollan sus dimensiones cognitiva, comunicativa y corporal a través del juego y la exploración.',
                items: ['Grados: Transición y Jardín', 'Jornada: Mañana (7:00 AM - 12:00 PM)', 'Enfoque: Desarrollo Lúdico y Motriz'],
                tags: ['Lúdica', 'Motricidad', 'Valores', 'Inglés Inicial'],
                img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            'Primaria': {
                subtitle: 'Construyendo bases sólidas',
                details: 'En la básica primaria enfocamos nuestros esfuerzos en fortalecer las competencias básicas de lectura, escritura y pensamiento lógico-matemático, vivenciando los valores institucionales.',
                items: ['Grados: 1° a 5°', 'Jornada: Tarde (12:30 PM - 5:30 PM)', 'Proyectos transversales de medio ambiente'],
                tags: ['Matemáticas', 'Español', 'Ciencias', 'Inglés', 'Ética', 'Tecnología'],
                img: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            'Bachillerato': {
                subtitle: 'Hacia la excelencia académica y humana',
                details: 'Formamos jóvenes competentes, críticos y reflexivos. Nuestro currículo profundiza en las ciencias y humanidades, preparando a los estudiantes para la educación superior y la vida ciudadana.',
                items: ['Grados: 6° a 11°', 'Jornada: Mañana (6:30 AM - 1:00 PM)', 'Preparación ICFES intensiva en 10° y 11°'],
                tags: ['Física', 'Química', 'Cálculo', 'Filosofía', 'Programación', 'Emprendimiento'],
                img: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            }
        };

        // Click en Oferta Académica
        document.querySelectorAll('.academic-item').forEach(item => {
            item.addEventListener('click', () => {
                const title = item.querySelector('h3').innerText;
                const data = academicData[title];

                if(data) {
                    renderModal({
                        title: title,
                        subtitle: data.subtitle,
                        content: data.details,
                        image: data.img,
                        listTitle: 'Características:',
                        listItems: data.items,
                        tags: data.tags
                    });
                }
            });
        });

        // Click en Noticias (Delegación de eventos para ítems dinámicos y estáticos)
        document.addEventListener('click', function(e) {
            if(e.target && e.target.classList.contains('read-more')) {
                e.preventDefault();
                const btn = e.target;
                
                // Intentar sacar datos de atributos data (si es dinámica)
                let title = btn.getAttribute('data-title');
                let content = btn.getAttribute('data-content');
                let date = btn.getAttribute('data-date');
                let img = btn.getAttribute('data-img');
                
                // Si no tiene atributos (son las estáticas del HTML), sacar del DOM
                if(!title) {
                    const card = btn.closest('.news-card');
                    title = card.querySelector('h3').innerText;
                    content = card.querySelector('p').innerText + "\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
                    date = card.querySelector('.date').innerText;
                    // Imagen placeholder
                    img = 'https://source.unsplash.com/random/800x400/?school,news';
                } else {
                    content = decodeURIComponent(content);
                    title = decodeURIComponent(title);
                }

                renderModal({
                    title: title,
                    subtitle: date,
                    content: content,
                    image: img,
                    listTitle: '',
                    listItems: [],
                    tags: ['Noticia', 'Actualidad']
                });
            }
        });

        function renderModal(data) {
            let tagsHtml = data.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
            let listHtml = '';
            if(data.listItems && data.listItems.length > 0) {
                listHtml = `<span class="modal-list-title">${data.listTitle}</span><ul>` + 
                           data.listItems.map(item => `<li><i class="fas fa-check-circle" style="color:var(--secondary-color); margin-right:8px;"></i>${item}</li>`).join('') + 
                           `</ul>`;
            }

            modalBody.innerHTML = `
                <div class="modal-header-img" style="background-image: url('${data.image}')"></div>
                <div class="modal-text-content">
                    <h2 class="modal-title">${data.title}</h2>
                    <h4 class="modal-subtitle">${data.subtitle}</h4>
                    <div class="modal-details">${data.content}</div>
                    ${listHtml}
                    <div style="margin-top: 25px;">
                        ${tagsHtml}
                    </div>
                </div>
            `;
            modal.style.display = 'block';
        }
    }

    // Scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                const headerOffset = 90;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});

// Estilos dinámicos extra (animación)
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// PQRS modal (visual) interactions
document.addEventListener('DOMContentLoaded', function() {
    const pqrsBtn = document.getElementById('open-pqrs-btn');
    const pqrsModal = document.getElementById('pqrs-modal');
    const pqrsForm = document.getElementById('pqrs-form');
    const pqrsCancel = document.getElementById('pqrs-cancel');
    const pqrsCloseAfter = document.getElementById('pqrs-close-after');

    if(pqrsBtn && pqrsModal) {
        pqrsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            pqrsModal.style.display = 'block';
        });
    }

    if(pqrsCancel) pqrsCancel.addEventListener('click', () => pqrsModal.style.display = 'none');
    if(pqrsCloseAfter) pqrsCloseAfter.addEventListener('click', () => pqrsModal.style.display = 'none');

    window.addEventListener('click', function(e) {
        if (e.target == pqrsModal) pqrsModal.style.display = 'none';
    });

    if(pqrsForm) {
        pqrsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            pqrsForm.style.display = 'none';
            const success = pqrsModal.querySelector('.pqrs-success');
            if(success) success.style.display = 'block';
        });
    }
});

    const slides = document.querySelectorAll('.slide');
    let current = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    document.querySelector('.next').addEventListener('click', () => {
        current = (current + 1) % slides.length;
        showSlide(current);
    });

    document.querySelector('.prev').addEventListener('click', () => {
        current = (current - 1 + slides.length) % slides.length;
        showSlide(current);
    });

    setInterval(() => {
        current = (current + 1) % slides.length;
        showSlide(current);
    }, 6000);
// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== CARRUSEL =====
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Inicializar carrusel
    function initCarousel() {
        if (slides.length === 0) return;
        
        // Mostrar primer slide
        slides[0].classList.add('active');
        
        // Eventos controles
        if (prevBtn) prevBtn.addEventListener('click', showPrevSlide);
        if (nextBtn) nextBtn.addEventListener('click', showNextSlide);
        
        // Auto avanzar slides cada 5 segundos
        setInterval(showNextSlide, 5000);
    }
    
    function showNextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % totalSlides;
        slides[currentSlide].classList.add('active');
    }
    
    function showPrevSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        slides[currentSlide].classList.add('active');
    }
    
    // ===== MENÚ HAMBURGUESA =====
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Cerrar menú al hacer clic en un enlace (móvil)
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                    hamburger.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
    }
    
    // ===== DROPDOWNS PARA MÓVIL =====
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.dropdown > a').forEach(dropdownBtn => {
            dropdownBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdownMenu = this.nextElementSibling;
                dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
            });
        });
    }
    
    // ===== MODALES =====
    const openPqrsBtn = document.getElementById('open-pqrs-btn');
    const pqrsModal = document.getElementById('pqrs-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const pqrsCancelBtn = document.getElementById('pqrs-cancel');
    const pqrsCloseAfterBtn = document.getElementById('pqrs-close-after');
    const pqrsForm = document.getElementById('pqrs-form');
    const pqrsSuccess = document.querySelector('.pqrs-success');
    
    // Abrir modal PQRS
    if (openPqrsBtn && pqrsModal) {
        openPqrsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            pqrsModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Cerrar modales
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Eventos para cerrar modales
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Cerrar al hacer clic fuera del modal
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Cancelar PQRS
    if (pqrsCancelBtn && pqrsModal) {
        pqrsCancelBtn.addEventListener('click', function() {
            closeModal(pqrsModal);
        });
    }
    
    // Enviar formulario PQRS (demo)
    if (pqrsForm && pqrsSuccess) {
        pqrsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Aquí iría la lógica real de envío
            // Por ahora solo mostramos el mensaje de éxito
            pqrsForm.style.display = 'none';
            pqrsSuccess.style.display = 'block';
        });
    }
    
    // Cerrar después de éxito PQRS
    if (pqrsCloseAfterBtn && pqrsModal) {
        pqrsCloseAfterBtn.addEventListener('click', function() {
            closeModal(pqrsModal);
            // Resetear formulario
            if (pqrsForm) {
                pqrsForm.reset();
                pqrsForm.style.display = 'flex';
                pqrsSuccess.style.display = 'none';
            }
        });
    }
    
    // ===== SCROLL SUAVE =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== INICIALIZAR TODO =====
    initCarousel();
    
    // ===== RESPONSIVE DROPDOWNS =====
    window.addEventListener('resize', function() {
        // Resetear dropdowns en desktop
        if (window.innerWidth > 768) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.display = '';
            });
        }
    });
});

// Contador animado (opcional)
function animateCounter(element, finalValue, duration = 2000) {
    let start = 0;
    const increment = finalValue / (duration / 16); // 60fps
    const counterElement = element;
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= finalValue) {
            clearInterval(timer);
            start = finalValue;
        }
        
        // Formatear número con separadores de miles
        counterElement.textContent = Math.floor(start).toLocaleString('es-CO');
    }, 16);
}

// Inicializar contadores cuando sean visibles
function initCounters() {
    const counterNumbers = document.querySelectorAll('.counter-number');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const value = parseInt(counter.textContent.replace(/,/g, ''));
                    
                    // Animar solo una vez
                    if (!counter.dataset.animated) {
                        animateCounter(counter, value);
                        counter.dataset.animated = 'true';
                    }
                    
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counterNumbers.forEach(counter => observer.observe(counter));
    }
}

// Agregar esta función al DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... código existente ...
    
    // Inicializar contadores animados
    initCounters();
    
    // Actualizar contador de visitas del día (ejemplo simulado)
    function updateDailyCounter() {
        const dailyCounter = document.querySelector('.counter-number:last-child');
        if (dailyCounter) {
            let current = parseInt(dailyCounter.textContent.replace(/,/g, ''));
            current += Math.floor(Math.random() * 10) + 1; // Incremento simulado
            dailyCounter.textContent = current.toLocaleString('es-CO');
        }
    }
    
    // Simular actualización cada 5 minutos
    setInterval(updateDailyCounter, 300000);
});

// Carrusel de Instituciones Aliadas
function initAlliesCarousel() {
    const carousel = document.querySelector('.allies-carousel');
    if (!carousel) return;

    const slides = document.querySelectorAll('.ally-slide');
    const prevBtn = carousel.querySelector('.ally-prev');
    const nextBtn = carousel.querySelector('.ally-next');
    const indicators = carousel.querySelectorAll('.ally-indicator');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Función para mostrar slide
    function showSlide(index) {
        // Actualizar slides
        slides.forEach((slide, i) => {
            slide.style.transform = `translateX(-${index * 100}%)`;
        });
        
        // Actualizar indicadores
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
    }
    
    // Eventos controles
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const newIndex = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(newIndex);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const newIndex = (currentSlide + 1) % totalSlides;
            showSlide(newIndex);
        });
    }
    
    // Eventos indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Auto slide cada 5 segundos
    let autoSlide = setInterval(() => {
        const newIndex = (currentSlide + 1) % totalSlides;
        showSlide(newIndex);
    }, 5000);
    
    // Pausar auto slide al interactuar
    carousel.addEventListener('mouseenter', () => clearInterval(autoSlide));
    carousel.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => {
            const newIndex = (currentSlide + 1) % totalSlides;
            showSlide(newIndex);
        }, 5000);
    });
    
    // Inicializar
    showSlide(0);
}

// Agregar al DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... código existente ...
    
    // Inicializar carrusel de aliados
    initAlliesCarousel();
    
    // Efecto de clic en logos
    document.querySelectorAll('.ally-logo-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Efecto visual al hacer clic
            this.style.transform = 'translateY(-8px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-10px)';
            }, 150);
        });
    });
});