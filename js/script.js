document.addEventListener('DOMContentLoaded', function() {
    
    // Funcionalidad Menú Móvil
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Cerrar menú SOLO si NO es un dropdown
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {

        // Si es un botón que abre dropdown, no cerrar menú
        if (this.parentElement.classList.contains('dropdown')) {
            return;
        }

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
                img: 'https://scontent.feoh3-1.fna.fbcdn.net/v/t39.30808-6/482020495_1498761891043992_7230074861855181528_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGj89Jqe38YaZ6gttKo_hmIluYWTtVQfIeW5hZO1VB8h1VLTj0fcnZgNgGxB-peAgOz1ipOFZ4YLGkIDZ-lXobQ&_nc_ohc=mGWpz_pzmikQ7kNvwFcGVLE&_nc_oc=AdmYVo3ybqoJ4RRw2n-RfKdrZceejtYSiVgoo68iv10ny37W9JB00kxp7jcTAThoKtvGEXuLDFUMKxcOsk226T1o&_nc_zt=23&_nc_ht=scontent.feoh3-1.fna&_nc_gid=fjq9ipo5qSaLNmnDL41vTg&oh=00_AfsU2ZqO-goxPuMJ6DE_bGNCKYe_VfCqZmOEC26GftQbrQ&oe=699199E6'
            },
            'Primaria': {
                subtitle: 'Construyendo bases sólidas',
                details: 'En la básica primaria enfocamos nuestros esfuerzos en fortalecer las competencias básicas de lectura, escritura y pensamiento lógico-matemático, vivenciando los valores institucionales.',
                items: ['Grados: 1° a 5°', 'Jornada: Tarde (12:30 PM - 5:30 PM)', 'Proyectos transversales de medio ambiente'],
                tags: ['Matemáticas', 'Español', 'Ciencias', 'Inglés', 'Ética', 'Tecnología'],
                img: 'https://scontent.fpei1-1.fna.fbcdn.net/v/t39.30808-6/482876798_1498458674407647_4556078082087907064_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFbWM17KQz8sdS7_F_Jp37oeEXnqbqnP7Z4Reepuqc_tlOfy0wRMe0WuKfHEF0gPVBlt5_iiYrmIn2PvoVO-HA-&_nc_ohc=m1YuUxYc-0sQ7kNvwFXgYKm&_nc_oc=AdmUZwpjrKX8qbrAIbWQ1F2hMjPVH0i4aCwZnrQnhCE9-UPMK3fZppXdYknOpH5tiVDlb9xU9oBHf_0x6EWciAMz&_nc_zt=23&_nc_ht=scontent.fpei1-1.fna&_nc_gid=yPVUIunHfNQUpP23uk3mVQ&oh=00_Afs6vuD9IRxXVFQBNIxwPZ5eOscRxjiMjiMR_G8m_WZIlA&oe=6991909A'
            },
            'Bachillerato': {
                subtitle: 'Hacia la excelencia académica y humana',
                details: 'Formamos jóvenes competentes, críticos y reflexivos. Nuestro currículo profundiza en las ciencias y humanidades, preparando a los estudiantes para la educación superior y la vida ciudadana.',
                items: ['Grados: 6° a 11°', 'Jornada: Mañana (6:30 AM - 1:00 PM)', 'Preparación ICFES intensiva en 10° y 11°'],
                tags: ['Física', 'Química', 'Cálculo', 'Filosofía', 'Programación', 'Emprendimiento'],
                img: 'https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808-6/480278564_1482927265960788_5685815749057112333_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeELwQsUmhRV2WttXq9ZRN0mqE8kD5f7lSuoTyQPl_uVKxtu9uxK-Q-qjTfc9eKW6DWuSOGQ7waMcZqkEMO42Uj2&_nc_ohc=qyBV38tM6_0Q7kNvwG8f7Rf&_nc_oc=Admm3z1_BfmcINj-rDWy29cfQ1GYflVq3fKb2xsAfRF9_D8XLwsN3ewp6j1rzZ28wEQ&_nc_zt=23&_nc_ht=scontent.feoh1-1.fna&_nc_gid=MkZ7xijfAgE9ECaVeOutkA&oh=00_AfshZp8alTn9nqKE0dov2TdlIj2rgapNSk6Td2w6jrQ8kQ&oe=69917A76'
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
                let adjuntoNombre = btn.getAttribute('data-adjunto-nombre');
                let adjuntoRuta = btn.getAttribute('data-adjunto-ruta');
                
                // Si no tiene atributos (son las estáticas del HTML), sacar del DOM
                if(!title) {
                    const card = btn.closest('.news-card');
                    title = card.querySelector('h3').innerText;
                    content = card.querySelector('p').innerText + "\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
                    date = card.querySelector('.date').innerText;
                    img = 'https://scontent.feoh4-3.fna.fbcdn.net/v/t39.30808-6/498245975_1549371602649687_6980932980967919817_n.jpg';
                    adjuntoNombre = '';
                    adjuntoRuta = '';
                } else {
                    content = decodeURIComponent(content);
                    title = decodeURIComponent(title);
                    adjuntoNombre = adjuntoNombre ? decodeURIComponent(adjuntoNombre) : '';
                }

                renderModal({
                    title: title,
                    subtitle: date,
                    content: content,
                    image: img,
                    listTitle: '',
                    listItems: [],
                    tags: ['Noticia', 'Actualidad'],
                    adjuntoNombre: adjuntoNombre,
                    adjuntoRuta: adjuntoRuta
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

            let adjuntoHtml = '';
            if(data.adjuntoRuta) {
                adjuntoHtml = `
                    <div style="margin-top:18px;padding:12px 16px;background:#f0f7ff;border-radius:8px;border:1px solid #d0e3f7;display:inline-flex;align-items:center;gap:10px;">
                        <i class="fas fa-file-download" style="font-size:1.3rem;color:var(--primary-color);"></i>
                        <a href="${data.adjuntoRuta}" target="_blank" style="color:var(--primary-color);font-weight:600;text-decoration:none;">
                            ${data.adjuntoNombre || 'Descargar archivo adjunto'}
                        </a>
                    </div>
                `;
            }

            modalBody.innerHTML = `
                <div class="modal-header-img" style="background-image: url('${data.image}')"></div>
                <div class="modal-text-content">
                    <h2 class="modal-title">${data.title}</h2>
                    <h4 class="modal-subtitle">${data.subtitle}</h4>
                    <div class="modal-details">${data.content}</div>
                    ${listHtml}
                    ${adjuntoHtml}
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
            
            const data = {
                nombre: document.getElementById('pqrs-name').value,
                correo: document.getElementById('pqrs-email').value,
                tipo: document.getElementById('pqrs-type').value,
                asunto: document.getElementById('pqrs-subject').value,
                mensaje: document.getElementById('pqrs-message').value
            };

            fetch('api/pqrs.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(result => {
                pqrsForm.style.display = 'none';
                const success = pqrsModal.querySelector('.pqrs-success');
                if(success) success.style.display = 'block';
            })
            .catch(() => {
                // Fallback visual si no hay conexión
                pqrsForm.style.display = 'none';
                const success = pqrsModal.querySelector('.pqrs-success');
                if(success) success.style.display = 'block';
            });
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
// ===== DROPDOWN FUNCIONAL EN CELULAR =====
document.querySelectorAll('.dropdown > a').forEach(function(btn) {
    btn.addEventListener('click', function(e) {

        // Solo en móvil
        if (window.innerWidth > 768) return;

        e.preventDefault();

        const parent = this.parentElement;

        // Cerrar otros dropdowns
        document.querySelectorAll('.dropdown').forEach(function(item) {
            if (item !== parent) {
                item.classList.remove('open');
            }
        });

        // Abrir/cerrar actual
        document.querySelectorAll(".dropdown > a").forEach(link => {
    link.addEventListener("click", function(e) {

        if (window.innerWidth <= 768) {

            e.preventDefault();
            e.stopPropagation(); 

            this.parentElement.classList.toggle("open");
        }

    });
});
    });
});