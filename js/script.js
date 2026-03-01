document.addEventListener('DOMContentLoaded', function() {
    
    // ===== OCULTAR/MOSTRAR HEADER Y GOV BAR CON SCROLL =====
    const govBar = document.querySelector('.gov-bar');
    const mainHeader = document.querySelector('.main-header');
    let lastScrollTop = 0;

    // ===== ACTIVAR BOTÓN DE IDIOMA =====
    const langBtns = document.querySelectorAll('.lang-btn');
    if (langBtns.length) {
        const currentLang = document.documentElement.lang || (location.pathname.includes('-en') ? 'en' : 'es');
        langBtns.forEach(btn => {
            const text = btn.textContent.trim().toLowerCase();
            btn.classList.toggle('active', text === currentLang);
        });
    }

    window.addEventListener('scroll', function() {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > lastScrollTop) {
            // Scrolling DOWN - ocultar barras
            if(govBar) govBar.classList.add('hide');
            if(mainHeader) mainHeader.classList.add('hide');
        } else {
            // Scrolling UP - mostrar barras
            if(govBar) govBar.classList.remove('hide');
            if(mainHeader) mainHeader.classList.remove('hide');
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
    });
    
    // ===== FUNCIONALIDAD MENÚ (MÓVIL Y ESCRITORIO) =====
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Toggle menú móvil (solo si existen ambos elementos)
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace (excepto dropdowns en móvil)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.parentElement && this.parentElement.classList.contains('dropdown') && window.innerWidth <= 768) {
                    // permitir abrir submenu en móvil
                    e.preventDefault();
                    return;
                }

                // Cerrar menú después de hacer clic en cualquier enlace
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        // Cerrar menú al hacer clic fuera (solo cuando está abierto)
        document.addEventListener('click', function(e) {
            if (!navLinks.classList.contains('active')) return;
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });

        // Cerrar con Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });

        // Al redimensionar: limpiar estados que puedan quedar bloqueados
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
            }
        });
    }

    // ===== DROPDOWN FUNCIONAL (MÓVIL Y ESCRITORIO) =====
    document.querySelectorAll('.dropdown > a').forEach(function(btn) {
        const parent = btn.parentElement;

        // Click handler - móvil: abre submenu; escritorio: alterna (accesibilidad)
        btn.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();

                // Cerrar otros dropdowns en móvil
                document.querySelectorAll('.dropdown').forEach(function(item) {
                    if (item !== parent) item.classList.remove('open');
                });

                parent.classList.toggle('open');
            } else {
                // En escritorio permitimos toggle por click (útil en touchscreens grandes)
                e.preventDefault();
                e.stopPropagation();
                const isOpen = parent.classList.contains('open');
                document.querySelectorAll('.dropdown').forEach(function(item) {
                    if (item !== parent) item.classList.remove('open');
                });
                if (!isOpen) parent.classList.add('open');
            }
        });

        // Abrir en hover en escritorio
        parent.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) parent.classList.add('open');
        });
        parent.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) parent.classList.remove('open');
        });
    });

    // Cerrar dropdowns al clicar fuera (escritorio)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) return;
        document.querySelectorAll('.dropdown').forEach(function(d) {
            if (!d.contains(e.target)) d.classList.remove('open');
        });
    });

    // ===== FUNCIONALIDAD BARRA DE BÚSQUEDA =====
    const searchInput = document.getElementById('nav-search');
    const searchBtn = document.querySelector('.search-btn');
    
    if(searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if(e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
    
    if(searchBtn) {
        searchBtn.addEventListener('click', function() {
            const query = searchInput.value;
            if(query) performSearch(query);
        });
    }
    
    function performSearch(query) {
        // Redirigir a la página de búsqueda
        if(query && query.trim()) {
            window.location.href = 'buscarWeb.php?q=' + encodeURIComponent(query.trim());
        }
    }

    // ===== SLIDER AUTOMÁTICO =====
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let current = 0;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
        }

        const nextBtn = document.querySelector('.next');
        const prevBtn = document.querySelector('.prev');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                current = (current + 1) % slides.length;
                showSlide(current);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                current = (current - 1 + slides.length) % slides.length;
                showSlide(current);
            });
        }

        // Auto-slide
        setInterval(() => {
            current = (current + 1) % slides.length;
            showSlide(current);
        }, 6000);
    }

    // ===== LÓGICA DE NOTICIAS =====
    const newsContainer = document.getElementById('news-container');
    const adminNewsForm = document.getElementById('admin-news-form');

    // Función para renderizar noticias desde LocalStorage
    function loadNews() {
        if (!newsContainer) return;

        const storedNews = JSON.parse(localStorage.getItem('colRosasNews')) || [];
        
        // Limpiamos noticias dinámicas existentes
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

    // ===== LÓGICA DEL MODAL =====
    const modal = document.getElementById('info-modal');
    const modalBody = document.getElementById('modal-body-content');
    const closeModal = document.querySelector('.close-modal');

    if(modal) {
        // Cerrar modal
        if(closeModal) {
            closeModal.addEventListener('click', () => modal.style.display = 'none');
        }
        
        window.addEventListener('click', (e) => {
            if (e.target == modal) modal.style.display = 'none';
        });

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

        // Click en Noticias (Delegación de eventos)
        document.addEventListener('click', function(e) {
            if(e.target && e.target.classList.contains('read-more')) {
                e.preventDefault();
                const btn = e.target;
                
                // Intentar sacar datos de atributos data
                let title = btn.getAttribute('data-title');
                let content = btn.getAttribute('data-content');
                let date = btn.getAttribute('data-date');
                let img = btn.getAttribute('data-img');
                let adjuntoNombre = btn.getAttribute('data-adjunto-nombre');
                let adjuntoRuta = btn.getAttribute('data-adjunto-ruta');
                
                // Si no tiene atributos (noticias estáticas)
                if(!title) {
                    const card = btn.closest('.news-card');
                    title = card.querySelector('h3').innerText;
                    content = card.querySelector('p').innerText + "\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.";
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

    // ===== SCROLL SUAVE =====
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

    // ===== PQRS MODAL =====
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
                // Fallback visual
                pqrsForm.style.display = 'none';
                const success = pqrsModal.querySelector('.pqrs-success');
                if(success) success.style.display = 'block';
            });
        });
    }

    // ===== MODAL MAPA DE UBICACIÓN =====
    const openMapBtn = document.getElementById('open-map-btn');
    const mapModal = document.getElementById('map-modal');
    const closeMapBtn = document.getElementById('close-map');

    if (openMapBtn && mapModal) {
        // Abrir modal del mapa
        openMapBtn.addEventListener('click', function(e) {
            e.preventDefault();
            mapModal.style.display = 'block';
        });

        // Cerrar modal al hacer clic en X
        if (closeMapBtn) {
            closeMapBtn.addEventListener('click', () => mapModal.style.display = 'none');
        }

        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', function(e) {
            if (e.target == mapModal) mapModal.style.display = 'none';
        });
    }

    // ===== CARRUSEL DE ALIADOS =====
    const allyLogos = document.querySelector('.allies-logos');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    
    if (allyLogos && prevBtn && nextBtn) {
        const logoWidth = 155; // Ancho aproximado de cada logo con gap
        const logosContainer = document.querySelector('.allies-slides');
        let currentPosition = 0;
        
        function scrollLogos(direction) {
            const logoItems = allyLogos.querySelectorAll('.logo-item');
            const maxScroll = (logoItems.length - 1) * logoWidth;
            
            currentPosition += direction * logoWidth;
            
            if (currentPosition < 0) currentPosition = 0;
            if (currentPosition > maxScroll) currentPosition = 0;
            
            allyLogos.style.animation = 'none';
            allyLogos.style.transform = `translateX(-${currentPosition}px)`;
        }
        
        prevBtn.addEventListener('click', () => scrollLogos(-1));
        nextBtn.addEventListener('click', () => scrollLogos(1));
    }

    // ===== BOTÓN "VOLVER ARRIBA" =====
    const backBtn = document.createElement('button');
    backBtn.id = 'back-to-top';
    backBtn.title = 'Volver arriba';
    backBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(backBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) backBtn.classList.add('visible');
        else backBtn.classList.remove('visible');
    });

    backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });});

