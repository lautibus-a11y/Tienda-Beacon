// FARO Main JS Initializer
document.addEventListener('DOMContentLoaded', () => {
    // Cinematic Preloader Logic
    const preloader = document.getElementById('cinematic-preloader');
    
    if (preloader) {
        // Force a minimum display time of 2.2 seconds for the cinematic effect
        const minTime = 2200;
        const startTime = Date.now();
        
        window.addEventListener('load', () => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minTime - elapsedTime);
            
            setTimeout(() => {
                preloader.classList.add('preloader-hidden');
                document.body.classList.remove('no-scroll-preloader');
            }, remainingTime);
        });
    }

    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuIcon = document.getElementById('mobile-menu-icon');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isMobileMenuOpen = false;

    if(mobileMenuBtn && mobileMenuOverlay) {
        function toggleMobileMenu() {
            isMobileMenuOpen = !isMobileMenuOpen;
            if (isMobileMenuOpen) {
                mobileMenuOverlay.classList.remove('translate-x-full');
                mobileMenuIcon.setAttribute('data-lucide', 'x');
                lucide.createIcons();
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            } else {
                mobileMenuOverlay.classList.add('translate-x-full');
                mobileMenuIcon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
                document.body.style.overflow = '';
            }
        }

        mobileMenuBtn.addEventListener('click', toggleMobileMenu);

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if(isMobileMenuOpen) toggleMobileMenu();
            });
        });
    }

    // 1. Dynamic Rendering of Products
    renderFeaturedSlider();
    renderCatalogGrid();

    // Initialize Lucide Icons (first pass)
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Lenis Smooth Scroll Setup
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 1.2,
        infinite: false,
    });

    // Sync GSAP with Lenis
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000) });
    gsap.ticker.lagSmoothing(0, 0);

    // 3. Magnetic Buttons
    const magnetics = document.querySelectorAll('[data-magnetic]');
    magnetics.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.5,
                ease: "power2.out"
            });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "power2.out" });
        });
    });

    // 4. Spotlight Hover Effect (Event Delegation)
    document.addEventListener('mousemove', (e) => {
        const card = e.target.closest('.spotlight-card');
        if (card) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }
    });

    // 5. GSAP Animations & ScrollTriggers

    // Text Split Animation (Hero)
    const splitTexts = new SplitType('.split-text', { types: 'words, chars' });
    if (splitTexts.chars) {
        gsap.from(splitTexts.chars, {
            y: 100,
            opacity: 0,
            rotateX: -90,
            stagger: 0.02,
            duration: 1,
            ease: "back.out(1.7)",
            delay: 0.2
        });
    }

    // Reveal Up general
    gsap.utils.toArray('.reveal-up').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });



    // Hero Parallax
    gsap.to('#hero-bg', {
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 250
    });

    // Navbar behavior (glassmorphism scroll transition with dynamic text color)
    const navbar = document.getElementById('navbar');
    const navLogo = document.getElementById('nav-logo');
    const navLinks = document.getElementById('nav-links');
    const cartBtn = document.getElementById('cart-btn');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('bg-background/85', 'backdrop-blur-lg', 'border-black/5', 'shadow-sm', 'py-2', 'md:py-3');
                navbar.classList.remove('bg-transparent', 'border-transparent', 'py-3', 'md:py-5');
                
                if (navLogo) {
                    navLogo.classList.remove('text-white');
                    navLogo.classList.add('text-dark');
                }
                if (navLinks) {
                    navLinks.classList.remove('text-white/80');
                    navLinks.classList.add('text-textSec');
                }
                if (cartBtn) {
                    cartBtn.classList.remove('text-white', 'hover:bg-white/10');
                    cartBtn.classList.add('text-dark', 'hover:bg-black/5');
                }
            } else {
                navbar.classList.remove('bg-background/85', 'backdrop-blur-lg', 'border-black/5', 'shadow-sm', 'py-2', 'md:py-3');
                navbar.classList.add('bg-transparent', 'border-transparent', 'py-3', 'md:py-5');
                
                if (navLogo) {
                    navLogo.classList.remove('text-dark');
                    navLogo.classList.add('text-white');
                }
                if (navLinks) {
                    navLinks.classList.remove('text-textSec');
                    navLinks.classList.add('text-white/80');
                }
                if (cartBtn) {
                    cartBtn.classList.remove('text-dark', 'hover:bg-black/5');
                    cartBtn.classList.add('text-white', 'hover:bg-white/10');
                }
            }
        });
    }

    // Scroll Indicator Line Anim
    gsap.to('.scroll-line-anim', {
        scaleY: 0,
        transformOrigin: "bottom",
        duration: 1.5,
        repeat: -1,
        ease: "power2.inOut",
        yoyo: true
    });

    // Timeline Progress Animation
    const timelineSteps = gsap.utils.toArray('.timeline-step');
    const timelineProgress = document.getElementById('timeline-progress');
    const timelineSection = document.getElementById('metodologia');
    
    if (timelineSection && timelineProgress && timelineSteps.length > 0) {
        let mm = gsap.matchMedia();
        
        // Desktop: Horizontal Line
        mm.add("(min-width: 768px)", () => {
            gsap.fromTo(timelineProgress, 
                { width: "0%", height: "100%" },
                {
                    width: "100%",
                    height: "100%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: timelineSection,
                        start: "top 80%",
                        end: "bottom 80%",
                        scrub: 1
                    }
                }
            );
        });

        // Mobile: Vertical Line
        mm.add("(max-width: 767px)", () => {
            gsap.fromTo(timelineProgress, 
                { height: "0%", width: "100%" },
                {
                    height: "100%",
                    width: "100%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: timelineSection,
                        start: "top 80%",
                        end: "bottom 80%",
                        scrub: 1
                    }
                }
            );
        });

        // Dots and Content reveal
        timelineSteps.forEach((step) => {
            const dot = step.querySelector('.step-dot');
            const innerDot = step.querySelector('.dot-inner');
            const content = step.querySelector('.bg-transparent');

            if (content) {
                // Light up dot and reveal card synced with timeline progress
                gsap.fromTo(content, 
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: step,
                            start: "top 80%",
                            onEnter: () => {
                                if (innerDot) innerDot.classList.remove('opacity-0');
                                if (dot) dot.classList.add('border-primary');
                            },
                            onLeaveBack: () => {
                                if (innerDot) innerDot.classList.add('opacity-0');
                            }
                        }
                    }
                );
            }
        });
    }



    // 6. Swiper Initializations
    
    // Products Gallery (Infinite Carousel - Faster, Linear, Non-stop)
    const productsSwiper = new Swiper('.products-slider', {
        slidesPerView: 'auto',
        spaceBetween: 24,
        loop: true,
        speed: 4000,
        freeMode: true,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
        },
        breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 16 },
            768: { slidesPerView: 'auto', spaceBetween: 24 }
        }
    });

    // Combos Slider
    const combosSwiper = new Swiper('.combos-slider', {
        slidesPerView: 1.2,
        spaceBetween: 16,
        centeredSlides: true,
        loop: true,
        navigation: {
            nextEl: '.combos-next',
            prevEl: '.combos-prev',
        },
        breakpoints: {
            640: { slidesPerView: 2.5, spaceBetween: 24 },
            1024: { slidesPerView: 3.5, spaceBetween: 32 }
        }
    });

    // Testimonials Slider (Faster and linear loop)
    const testimonialsSwiper = new Swiper('.testimonial-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        speed: 5000,
        freeMode: true,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: { slidesPerView: 1.5, spaceBetween: 20 },
            768: { slidesPerView: 2.2, spaceBetween: 30 },
            1024: { slidesPerView: 3.2, spaceBetween: 30 },
            1440: { slidesPerView: 4.2, spaceBetween: 40 }
        }
    });

    // 7. Catalog Tabs Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabIndicator = document.getElementById('tab-indicator');

    function updateIndicator(btn) {
        if (!tabIndicator || !btn) return;
        tabIndicator.style.width = `${btn.offsetWidth}px`;
        tabIndicator.style.left = `${btn.offsetLeft}px`;
    }

    // Init indicator
    if (tabBtns.length > 0) {
        setTimeout(() => updateIndicator(tabBtns[0]), 200);
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update styling
            tabBtns.forEach(b => {
                b.classList.remove('text-white', 'active-tab');
                b.classList.add('text-textSec');
            });
            btn.classList.remove('text-textSec');
            btn.classList.add('text-white', 'active-tab');
            
            updateIndicator(btn);

            const filter = btn.getAttribute('data-filter');
            const catalogItems = document.querySelectorAll('.catalog-item');
            
            gsap.to(catalogItems, {
                scale: 0.9,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    catalogItems.forEach(item => {
                        if (filter === 'all' || item.getAttribute('data-category') === filter) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                    
                    gsap.to(catalogItems, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.4,
                        stagger: 0.05,
                        ease: "power2.out",
                        clearProps: "all"
                    });
                }
            });
        });
    });

    // Fix resize issue for indicator
    window.addEventListener('resize', () => {
        const activeBtn = document.querySelector('.tab-btn.active-tab') || tabBtns[0];
        updateIndicator(activeBtn);
    });

    // 8. History Accordion Logic with GSAP
    const accordionHeaders = document.querySelectorAll('#history-accordion .accordion-header');
    
    // Initial setup for accordion
    document.querySelectorAll('#history-accordion .accordion-item').forEach(item => {
        const content = item.querySelector('.accordion-content');
        const progress = item.querySelector('.accordion-progress');
        
        if (item.classList.contains('is-open')) {
            gsap.set(content, { height: 'auto' });
            gsap.to(progress, { width: progress.getAttribute('data-width'), duration: 1, ease: "power2.out", delay: 0.2 });
        } else {
            gsap.set(content, { height: 0 });
            gsap.set(progress, { width: 0 });
        }
    });

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            const progress = item.querySelector('.accordion-progress');
            const iconBg = item.querySelector('.accordion-icon-bg');
            const icon = item.querySelector('.accordion-chevron');
            const title = item.querySelector('.accordion-title');
            const isOpen = item.classList.contains('is-open');

            if (isOpen) return; // Enforce one always open

            // Close all others
            document.querySelectorAll('#history-accordion .accordion-item.is-open').forEach(openItem => {
                openItem.classList.remove('is-open');
                const openContent = openItem.querySelector('.accordion-content');
                const openProgress = openItem.querySelector('.accordion-progress');
                const openIconBg = openItem.querySelector('.accordion-icon-bg');
                const openIcon = openItem.querySelector('.accordion-chevron');
                const openTitle = openItem.querySelector('.accordion-title');

                gsap.to(openContent, { height: 0, duration: 0.4, ease: "power2.inOut" });
                gsap.to(openProgress, { width: 0, duration: 0.3, ease: "power2.inOut" });
                openIconBg.classList.replace('bg-primary', 'bg-primary/10');
                openIconBg.classList.replace('text-white', 'text-primary');
                openIcon.classList.remove('rotate-180');
                openTitle.classList.remove('text-primary');
            });

            // Open clicked
            item.classList.add('is-open');
            gsap.to(content, { height: 'auto', duration: 0.4, ease: "power2.inOut" });
            gsap.to(progress, { width: progress.getAttribute('data-width'), duration: 0.8, ease: "power2.out", delay: 0.2 });
            
            iconBg.classList.replace('bg-primary/10', 'bg-primary');
            iconBg.classList.replace('text-primary', 'text-white');
            icon.classList.add('rotate-180');
            title.classList.add('text-primary');
        });
    });

    // 9. About Parallax Effect
    const aboutImg = document.getElementById('about-parallax-img');
    const aboutSection = document.getElementById('nosotros');
    if (aboutImg && aboutSection) {
        gsap.to(aboutImg, {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
                trigger: aboutSection,
                start: "top top",
                end: "+=120%",
                scrub: true
            }
        });
    }

    // 10. Title Animations
    if (typeof TextPlugin !== 'undefined') {
        gsap.registerPlugin(TextPlugin);
    }

    // Nuestros Servicios: underline loop
    const underlineServicios = document.getElementById('servicios-underline');
    if (underlineServicios) {
        gsap.to(underlineServicios, {
            scaleX: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '#title-servicios',
                start: "top 80%"
            },
            onComplete: () => {
                gsap.to(underlineServicios, {
                    scaleX: 0,
                    transformOrigin: "right",
                    duration: 0.8,
                    delay: 2,
                    ease: "power2.inOut",
                    repeat: -1,
                    yoyo: true,
                    repeatDelay: 2
                });
            }
        });
    }

    // Destacados: Rotate D and turn orange in an infinite loop
    const dDestacados = document.getElementById('destacados-d');
    if (dDestacados) {
        gsap.to(dDestacados, {
            rotateY: 360,
            color: "#FF5C2D",
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '#title-destacados',
                start: "top 80%"
            },
            onComplete: () => {
                // Loop the rotation back and forth with delay
                gsap.to(dDestacados, {
                    rotateY: -360,
                    duration: 1.5,
                    ease: "power2.inOut",
                    repeat: -1,
                    yoyo: true,
                    repeatDelay: 2
                });
            }
        });
    }

    // Catálogo Completo: Fade in up + O jump & color loop
    const titleCatalogo = document.getElementById('title-catalogo');
    const catalogoO = document.getElementById('catalogo-o');
    if (titleCatalogo) {
        gsap.to(titleCatalogo, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: titleCatalogo,
                start: "top 85%"
            },
            onComplete: () => {
                if (catalogoO) {
                    const tl = gsap.timeline({ repeat: -1 });
                    tl.to(catalogoO, {
                        y: -12,
                        color: "#FF5C2D",
                        duration: 0.35,
                        ease: "power1.out"
                    })
                    .to(catalogoO, {
                        y: 0,
                        color: "#2C2C2C",
                        duration: 0.45,
                        ease: "bounce.out"
                    })
                    .to(catalogoO, {
                        duration: 2.0 // delay between jumps
                    });
                }
            }
        });
    }

    // Metodología: Word Reveal (Title + Description)
    if (typeof SplitType !== 'undefined' && document.getElementById('title-metodologia')) {
        const textMetodologia = new SplitType('#title-metodologia, #desc-metodologia', { types: 'words' });
        gsap.set(textMetodologia.words, { opacity: 0, y: 20 });
        gsap.to(textMetodologia.words, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.02,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '#title-metodologia',
                start: "top 85%"
            }
        });
    }

    // 11. Bento Grid: Animation & Movement on scroll
    gsap.utils.toArray('.bento-item').forEach((item) => {
        gsap.fromTo(item, 
            { opacity: 0, y: 60, scale: 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "back.out(1.2)",
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // 12. Equipo Cards Blur Reveal
    gsap.fromTo('.equipo-card', 
        { filter: 'blur(20px)', opacity: 0, y: 30 },
        {
            filter: 'blur(0px)',
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: "#equipo-grid",
                start: "top 80%"
            }
        }
    );

    // 13. Sobre Nosotros Word Reveal
    if (typeof SplitType !== 'undefined' && document.getElementById('sobre-nosotros-title')) {
        const titleSobreNosotros = new SplitType('#sobre-nosotros-title', { types: 'words' });
        
        // Prevent layout shift by making container visible but content hidden initially
        gsap.set(titleSobreNosotros.words, { opacity: 0, y: 20 });
        
        gsap.to(titleSobreNosotros.words, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: "back.out(1.5)",
            scrollTrigger: {
                trigger: '#sobre-nosotros-title',
                start: "top 85%"
            }
        });
    }

    // 13.5 Nuestra Historia Word Reveal
    if (typeof SplitType !== 'undefined' && document.getElementById('title-historia-main')) {
        const textHistoria = new SplitType('#title-historia-sub, #title-historia-main', { types: 'words' });
        gsap.set(textHistoria.words, { opacity: 0, y: 20 });
        gsap.to(textHistoria.words, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.03,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '#title-historia-main',
                start: "top 85%"
            }
        });
    }
});

// Dynamic Products Renderers
function getProductIcon(product) {
    return product.icon || window.CATEGORY_ICONS[product.category] || 'package';
}

function renderProductVisual(product, size = 'lg') {
    const icon = getProductIcon(product);
    const sizeClasses = size === 'lg'
        ? 'h-[450px] md:h-[550px]'
        : 'h-48';
    const iconSize = size === 'lg' ? 'w-20 h-20' : 'w-12 h-12';
    return `
        <div class="absolute inset-0 w-full ${sizeClasses} bg-gradient-to-br from-primary/10 via-tertiary to-background flex items-center justify-center">
            <div class="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <i data-lucide="${icon}" class="${iconSize} text-primary"></i>
            </div>
        </div>
    `;
}

function renderFeaturedSlider() {
    const wrapper = document.querySelector('.products-slider .swiper-wrapper');
    if (!wrapper) return;
    
    wrapper.innerHTML = window.PRODUCTS.map(product => {
        const badgeHtml = product.badge ? `<div class="absolute top-6 left-6 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full z-10">${product.badge}</div>` : '';
        return `
            <div class="swiper-slide w-[300px] md:w-[450px]">
                <div class="relative w-full h-[450px] md:h-[550px] overflow-hidden rounded-[30px] group hover-target spotlight-card">
                    ${renderProductVisual(product, 'lg')}
                    <div class="spotlight-card absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer" onclick="openProductModal('${product.id}')"></div>
                    ${badgeHtml}
                    <div class="absolute bottom-0 left-0 w-full p-8 text-left translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-10 pointer-events-none">
                        <span class="text-primary text-xs font-semibold tracking-wider uppercase mb-2 block">${product.subtitle}</span>
                        <h3 class="text-3xl font-display font-bold mb-2 text-white">${product.name}</h3>
                        <div class="flex items-center justify-between mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 pointer-events-auto">
                            <span class="text-2xl font-medium text-white">$${product.price.toLocaleString('es-AR')}</span>
                            <button onclick="openProductModal('${product.id}')" class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                                <i data-lucide="plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
}

function renderCatalogGrid() {
    const grid = document.querySelector('.catalog-grid');
    if (!grid) return;
    
    grid.innerHTML = window.PRODUCTS.map(product => {
        const icon = getProductIcon(product);
        return `
            <div class="glass-panel p-3 rounded-[20px] group catalog-item hover-target spotlight-card animate-grid" data-category="${product.category}">
                <div class="spotlight-content flex flex-col h-full">
                    <div class="w-full h-48 rounded-[12px] overflow-hidden mb-4 bg-gradient-to-br from-primary/10 to-tertiary relative cursor-pointer flex items-center justify-center" onclick="openProductModal('${product.id}')">
                        <div class="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <i data-lucide="${icon}" class="w-8 h-8 text-primary"></i>
                        </div>
                    </div>
                    <h4 class="font-display font-bold text-lg leading-tight cursor-pointer" onclick="openProductModal('${product.id}')">${product.name}</h4>
                    <p class="text-textSec text-xs mb-4 mt-1">${product.subtitle}</p>
                    <div class="mt-auto pt-4 border-t border-black/5 flex justify-between items-center">
                        <div class="flex flex-col">
                            <span class="text-textSec text-[10px] uppercase tracking-wider">Precio</span>
                            <span class="font-bold text-lg text-dark">$${product.price.toLocaleString('es-AR')}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="openProductModal('${product.id}')" class="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                                <i data-lucide="plus" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
}

// --- Service Modal Logic ---
window.SERVICES_DATA = {
    web: {
        title: "Diseño y Desarrollo Web",
        desc: "Creamos sitios web modernos, rápidos y optimizados para potenciar tu negocio.",
        services: [
            "Landing Pages", "Sitios Institucionales", "Tiendas Online", 
            "Catálogos Digitales", "Menús QR", "Aplicaciones Web", 
            "Hosting y Dominio", "Mantenimiento Web", "SEO", "Optimización de Velocidad"
        ],
        images: ["assets/images/steps/paso1.webp", "assets/images/steps/paso2.webp", "assets/images/steps/paso3.webp"]
    },
    graphic: {
        title: "Diseño Gráfico e Identidad",
        desc: "Diseñamos la imagen visual de tu marca para destacar frente a la competencia.",
        services: [
            "Diseño de Logo", "Branding", "Tarjetas Personales", "Flyers",
            "Banners", "Folletos", "Packaging", "Etiquetas", "Stickers", "Papelería Corporativa"
        ],
        images: ["assets/images/steps/paso2.webp", "assets/images/steps/paso3.webp", "assets/images/steps/paso4.webp"]
    },
    merch: {
        title: "Sublimación y Merchandising",
        desc: "Productos personalizados para empresas, comercios y emprendedores.",
        services: [
            "Remeras", "Buzos", "Tazas", "Botellas", "Mousepads",
            "Llaveros", "Gorras", "Rompecabezas", "Almohadones", "Cuadros"
        ],
        images: ["assets/images/steps/paso1.webp", "assets/images/steps/paso3.webp", "assets/images/steps/paso4.webp"]
    },
    signs: {
        title: "Cartelería Comercial",
        desc: "Todo lo necesario para potenciar la imagen física de tu negocio.",
        services: [
            "Carteles", "Roll Up", "Banners", "Señalética",
            "Carteles Promocionales", "Placas", "Individuales", "Menús Físicos"
        ],
        images: ["assets/images/steps/paso4.webp", "assets/images/steps/paso2.webp", "assets/images/steps/paso1.webp"]
    }
};

let serviceSwiperInstance = null;

window.openServiceModal = function(serviceId) {
    const data = window.SERVICES_DATA[serviceId];
    if (!data) return;

    // Populate Data
    document.getElementById('service-modal-title').textContent = data.title;
    document.getElementById('service-modal-desc').textContent = data.desc;
    
    const listContainer = document.getElementById('service-modal-list');
    listContainer.innerHTML = data.services.map(s => `<li class="flex items-center gap-2"><i data-lucide="check-circle-2" class="w-4 h-4 text-primary"></i> ${s}</li>`).join('');
    
    const galleryContainer = document.getElementById('service-modal-gallery');
    galleryContainer.innerHTML = data.images.map(img => `
        <div class="swiper-slide w-full h-full">
            <img src="${img}" class="w-full h-full object-cover opacity-80" alt="Service Image">
        </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();

    // Init or Update Swiper
    if (serviceSwiperInstance) {
        serviceSwiperInstance.destroy(true, true);
    }
    serviceSwiperInstance = new Swiper('.service-gallery-slider', {
        slidesPerView: 1,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        }
    });

    // Show Modal
    const modal = document.getElementById('service-modal');
    const modalBox = document.getElementById('service-modal-box');
    modal.classList.remove('pointer-events-none', 'opacity-0');
    if (modalBox) {
        modalBox.classList.remove('scale-95');
        modalBox.classList.add('scale-100');
    }
    document.body.style.overflow = 'hidden'; // lock scroll
};

window.closeServiceModal = function() {
    const modal = document.getElementById('service-modal');
    const modalBox = document.getElementById('service-modal-box');
    modal.classList.add('pointer-events-none', 'opacity-0');
    if (modalBox) {
        modalBox.classList.remove('scale-100');
        modalBox.classList.add('scale-95');
    }
    document.body.style.overflow = ''; // restore scroll
    
    if (serviceSwiperInstance) {
        serviceSwiperInstance.autoplay.stop();
    }
};

// Event Listeners for closing modal
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('service-modal-close');
    const backdrop = document.getElementById('service-modal-backdrop');
    
    if (closeBtn) closeBtn.addEventListener('click', closeServiceModal);
    if (backdrop) backdrop.addEventListener('click', closeServiceModal);
});
