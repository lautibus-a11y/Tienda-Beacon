// BEACON Main JS Initializer
document.addEventListener('DOMContentLoaded', () => {
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
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP with Lenis
    gsap.registerPlugin(ScrollTrigger);
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

    // Hero Parallax & Blur out
    gsap.to('#hero-bg', {
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 200,
        filter: 'blur(10px)',
        opacity: 0.3
    });

    // Navbar blur on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('backdrop-blur-xl', 'bg-black/50', 'border-b', 'border-white/10');
        } else {
            navbar.classList.remove('backdrop-blur-xl', 'bg-black/50', 'border-b', 'border-white/10');
        }
    });

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
    
    // Line fill
    gsap.to('#timeline-progress', {
        scrollTrigger: {
            trigger: '#metodologia',
            start: "top 60%",
            end: "bottom 80%",
            scrub: 1
        },
        height: "100%",
        ease: "none"
    });

    // Dots and Content reveal
    timelineSteps.forEach((step) => {
        const dot = step.querySelector('.step-dot');
        const innerDot = step.querySelector('.dot-inner');
        const content = step.querySelector('.glass-panel');

        // Light up dot
        gsap.to(innerDot, {
            scrollTrigger: {
                trigger: step,
                start: "top 75%",
                toggleClass: "opacity-100",
                onEnter: () => dot.classList.add('border-primary'),
                onLeaveBack: () => dot.classList.remove('border-primary')
            }
        });

        // Reveal content
        gsap.from(content, {
            scrollTrigger: {
                trigger: step,
                start: "top 85%",
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // Animated Pie Charts & Counters
    const charts = document.querySelectorAll('.pie-progress');
    charts.forEach(chart => {
        ScrollTrigger.create({
            trigger: chart.closest('.glass-panel'),
            start: "top 85%",
            once: true,
            onEnter: () => {
                // SVG Ring animation
                const targetPercent = +chart.getAttribute('data-percent');
                const circumference = 283; // 2 * pi * r (45)
                const offset = circumference - (targetPercent / 100) * circumference;
                
                gsap.to(chart, {
                    strokeDashoffset: offset,
                    duration: 2,
                    ease: "power2.out",
                    delay: 0.2
                });

                // Number animation
                const counter = chart.closest('.glass-panel').querySelector('.counter');
                gsap.to(counter, {
                    innerHTML: targetPercent,
                    duration: 2,
                    snap: { innerHTML: 1 },
                    ease: "power2.out",
                    delay: 0.2
                });
            }
        });
    });

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

    // Testimonials Slider (Faster and linear loop)
    const testimonialsSwiper = new Swiper('.testimonial-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        speed: 5000,
        centeredSlides: true,
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
        },
        on: {
            slideChangeTransitionStart: function () {
                document.querySelectorAll('.testimonial-card').forEach(el => {
                    el.classList.remove('opacity-100', 'scale-100', 'border-primary/50');
                    el.classList.add('opacity-50', 'scale-90');
                });
                const activeSlide = this.slides[this.activeIndex].querySelector('.testimonial-card');
                if(activeSlide) {
                    activeSlide.classList.remove('opacity-50', 'scale-90');
                    activeSlide.classList.add('opacity-100', 'scale-100', 'border-primary/50');
                }
            }
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
});

// Dynamic Products Renderers
function renderFeaturedSlider() {
    const wrapper = document.querySelector('.products-slider .swiper-wrapper');
    if (!wrapper) return;
    
    wrapper.innerHTML = window.PRODUCTS.map(product => {
        const badgeHtml = product.badge ? `<div class="absolute top-6 left-6 bg-primary text-black text-xs font-bold px-4 py-1.5 rounded-full z-10">${product.badge}</div>` : '';
        return `
            <div class="swiper-slide w-[300px] md:w-[450px]">
                <div class="relative w-full h-[450px] md:h-[550px] overflow-hidden rounded-[30px] group hover-target">
                    <img src="${product.image}" alt="${product.name}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer" onclick="openProductModal('${product.id}')"></div>
                    ${badgeHtml}
                    <div class="absolute bottom-0 left-0 w-full p-8 text-left translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-10 pointer-events-none">
                        <span class="text-primary text-xs font-semibold tracking-wider uppercase mb-2 block">${product.subtitle}</span>
                        <h3 class="text-3xl font-display font-bold mb-2 text-white">${product.name}</h3>
                        <div class="flex items-center justify-between mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 pointer-events-auto">
                            <span class="text-2xl font-medium text-white">$${product.price}</span>
                            <button onclick="openProductModal('${product.id}')" class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                                <i data-lucide="plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderCatalogGrid() {
    const grid = document.querySelector('.catalog-grid');
    if (!grid) return;
    
    grid.innerHTML = window.PRODUCTS.map(product => {
        return `
            <div class="glass-panel p-3 rounded-[20px] group catalog-item hover-target spotlight-card animate-grid" data-category="${product.category}">
                <div class="spotlight-content flex flex-col h-full">
                    <div class="w-full h-48 rounded-[12px] overflow-hidden mb-4 bg-white/5 relative cursor-pointer" onclick="openProductModal('${product.id}')">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    </div>
                    <h4 class="font-display font-bold text-lg leading-tight cursor-pointer" onclick="openProductModal('${product.id}')">${product.name}</h4>
                    <p class="text-textSec text-xs mb-4 mt-1">${product.subtitle}</p>
                    <div class="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                        <div class="flex flex-col">
                            <span class="text-textSec text-[10px] uppercase tracking-wider">Precio</span>
                            <span class="font-bold text-lg text-white">$${product.price}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="openProductModal('${product.id}')" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                                <i data-lucide="plus" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
