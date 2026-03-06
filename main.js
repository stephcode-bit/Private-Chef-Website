/**
 * Private Chef Website - Main JavaScript
 * =======================================
 * Handles all interactions across the website
 */

(function() {
    'use strict';

    // ============================================
    // Mobile Navigation
    // ============================================
    function initMobileNav() {
        const menuToggle = document.getElementById('menu-toggle');
        const mainNav = document.getElementById('main-nav');
        
        if (!menuToggle || !mainNav) return;

        menuToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close nav when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !mainNav.contains(e.target)) {
                closeNav();
            }
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
                closeNav();
                menuToggle.focus();
            }
        });

        // Close on link click
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeNav);
        });

        function closeNav() {
            mainNav.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }

    // ============================================
    // Testimonials Slider
    // ============================================
    function initTestimonialsSlider() {
        const slider = document.getElementById('testimonials-slider');
        if (!slider) return;

        const track = slider.querySelector('.testimonials__track');
        const cards = track.querySelectorAll('.testimonial-card');
        const prevBtn = slider.querySelector('.testimonials__btn--prev');
        const nextBtn = slider.querySelector('.testimonials__btn--next');
        const dots = slider.querySelectorAll('.testimonials__dot');

        if (cards.length === 0) return;

        let currentIndex = 0;
        let cardsPerView = getCardsPerView();
        let maxIndex = Math.max(0, cards.length - cardsPerView);

        function getCardsPerView() {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
        }

        function updateSlider() {
            const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(track).gap);
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('is-active', i === currentIndex);
                dot.setAttribute('aria-selected', i === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, maxIndex));
            updateSlider();
        }

        prevBtn?.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn?.addEventListener('click', () => goToSlide(currentIndex + 1));

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => goToSlide(i));
        });

        // Handle resize
        window.addEventListener('resize', () => {
            cardsPerView = getCardsPerView();
            maxIndex = Math.max(0, cards.length - cardsPerView);
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            updateSlider();
        });

        // Auto-play
        let autoPlay = setInterval(() => {
            if (currentIndex < maxIndex) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(0);
            }
        }, 5000);

        slider.addEventListener('mouseenter', () => clearInterval(autoPlay));
        slider.addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => {
                if (currentIndex < maxIndex) {
                    goToSlide(currentIndex + 1);
                } else {
                    goToSlide(0);
                }
            }, 5000);
        });
    }

    // ============================================
    // Gallery Filter
    // ============================================
    function initGalleryFilter() {
        const filterBtns = document.querySelectorAll('.gallery-filter__btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        if (filterBtns.length === 0 || galleryItems.length === 0) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                // Update active button
                filterBtns.forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');

                // Filter items
                galleryItems.forEach((item, index) => {
                    const category = item.dataset.category;
                    const shouldShow = filter === 'all' || category === filter;

                    if (shouldShow) {
                        item.style.display = '';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, index * 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ============================================
    // Lightbox
    // ============================================
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxCategory = document.getElementById('lightbox-category');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxDescription = document.getElementById('lightbox-description');
        const closeBtn = lightbox?.querySelector('.lightbox__close');
        const prevBtn = lightbox?.querySelector('.lightbox__nav--prev');
        const nextBtn = lightbox?.querySelector('.lightbox__nav--next');
        const backdrop = lightbox?.querySelector('.lightbox__backdrop');

        const viewBtns = document.querySelectorAll('.gallery-item__view');
        if (viewBtns.length === 0 || !lightbox) return;

        let currentIndex = 0;
        const items = Array.from(document.querySelectorAll('.gallery-item'));

        function openLightbox(index) {
            currentIndex = index;
            const item = items[index];
            if (!item) return;

            const img = item.querySelector('img');
            const category = item.querySelector('.gallery-item__category')?.textContent || '';
            const title = item.querySelector('.gallery-item__title')?.textContent || '';
            const description = item.querySelector('.gallery-item__description')?.textContent || '';

            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxCategory.textContent = category;
            lightboxTitle.textContent = title;
            lightboxDescription.textContent = description;

            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
            
            // Focus trap
            closeBtn?.focus();
        }

        function closeLightbox() {
            lightbox.hidden = true;
            document.body.style.overflow = '';
        }

        function showPrev() {
            const visibleItems = items.filter(item => item.style.display !== 'none');
            const currentVisibleIndex = visibleItems.indexOf(items[currentIndex]);
            const newIndex = currentVisibleIndex > 0 ? currentVisibleIndex - 1 : visibleItems.length - 1;
            currentIndex = items.indexOf(visibleItems[newIndex]);
            openLightbox(currentIndex);
        }

        function showNext() {
            const visibleItems = items.filter(item => item.style.display !== 'none');
            const currentVisibleIndex = visibleItems.indexOf(items[currentIndex]);
            const newIndex = currentVisibleIndex < visibleItems.length - 1 ? currentVisibleIndex + 1 : 0;
            currentIndex = items.indexOf(visibleItems[newIndex]);
            openLightbox(currentIndex);
        }

        // Event listeners
        viewBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => openLightbox(index));
        });

        // Also open on item click
        items.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.gallery-item__view')) {
                    openLightbox(index);
                }
            });
        });

        closeBtn?.addEventListener('click', closeLightbox);
        backdrop?.addEventListener('click', closeLightbox);
        prevBtn?.addEventListener('click', showPrev);
        nextBtn?.addEventListener('click', showNext);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.hidden) return;
            
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });
    }

    // ============================================
    // Smooth Scroll
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // Scroll Animations
    // ============================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.feature-card, .service-preview-card, .dish-card, .testimonial-card, ' +
            '.philosophy-card, .timeline-item, .specialization-card, .personal-fact, ' +
            '.process-step, .faq-item, .gallery-item, .contact-card'
        );
        
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.5s ease-out ${index % 4 * 0.1}s, transform 0.5s ease-out ${index % 4 * 0.1}s`;
            observer.observe(el);
        });

        // Add CSS for visible state
        const style = document.createElement('style');
        style.textContent = `
            .is-visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // Header Scroll Effect
    // ============================================
    function initHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    // ============================================
    // Contact Form Validation
    // ============================================
    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const formFields = {
            name: {
                element: document.getElementById('name'),
                error: document.getElementById('name-error'),
                validate: (value) => {
                    if (!value.trim()) return 'Please enter your full name';
                    if (value.trim().length < 2) return 'Name must be at least 2 characters';
                    return null;
                }
            },
            email: {
                element: document.getElementById('email'),
                error: document.getElementById('email-error'),
                validate: (value) => {
                    if (!value.trim()) return 'Please enter your email address';
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) return 'Please enter a valid email address';
                    return null;
                }
            },
            service: {
                element: document.getElementById('service'),
                error: document.getElementById('service-error'),
                validate: (value) => {
                    if (!value) return 'Please select a service type';
                    return null;
                }
            },
            message: {
                element: document.getElementById('message'),
                error: document.getElementById('message-error'),
                validate: (value) => {
                    if (!value.trim()) return 'Please enter your message';
                    if (value.trim().length < 10) return 'Message must be at least 10 characters';
                    return null;
                }
            }
        };

        // Real-time validation
        Object.keys(formFields).forEach(fieldName => {
            const field = formFields[fieldName];
            if (!field.element) return;

            field.element.addEventListener('blur', () => validateField(fieldName));
            field.element.addEventListener('input', () => clearError(fieldName));
        });

        function validateField(fieldName) {
            const field = formFields[fieldName];
            if (!field || !field.element) return true;

            const error = field.validate(field.element.value);
            if (error) {
                showError(fieldName, error);
                return false;
            } else {
                showValid(fieldName);
                return true;
            }
        }

        function showError(fieldName, message) {
            const field = formFields[fieldName];
            if (!field) return;

            field.element.classList.add('is-invalid');
            field.element.classList.remove('is-valid');
            field.element.setAttribute('aria-invalid', 'true');
            
            if (field.error) {
                field.error.textContent = message;
                field.error.classList.add('is-visible');
            }
        }

        function showValid(fieldName) {
            const field = formFields[fieldName];
            if (!field) return;

            field.element.classList.remove('is-invalid');
            field.element.classList.add('is-valid');
            field.element.setAttribute('aria-invalid', 'false');
            
            if (field.error) {
                field.error.textContent = '';
                field.error.classList.remove('is-visible');
            }
        }

        function clearError(fieldName) {
            const field = formFields[fieldName];
            if (!field) return;

            field.element.classList.remove('is-invalid');
            if (field.error) {
                field.error.classList.remove('is-visible');
            }
        }

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate all fields
            let isValid = true;
            Object.keys(formFields).forEach(fieldName => {
                if (!validateField(fieldName)) isValid = false;
            });

            if (!isValid) {
                const firstInvalid = form.querySelector('.is-invalid');
                firstInvalid?.focus();
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="30" stroke-dashoffset="10"/>
                </svg>
                <span>Sending...</span>
            `;

            // Simulate submission
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success
            const success = document.getElementById('form-success');
            if (success) {
                success.hidden = false;
                form.reset();
                Object.keys(formFields).forEach(fieldName => {
                    const field = formFields[fieldName];
                    if (field.element) {
                        field.element.classList.remove('is-valid', 'is-invalid');
                    }
                });
            }

            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });

        // Add spin animation
        const style = document.createElement('style');
        style.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
    }

    // ============================================
    // Phone Number Formatting
    // ============================================
    function initPhoneFormatting() {
        const phoneInput = document.getElementById('phone');
        if (!phoneInput) return;

        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 10) {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            } else if (value.length >= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
            } else if (value.length >= 3) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            }
            
            e.target.value = value;
        });
    }

    // ============================================
    // Date Input Min Date
    // ============================================
    function initDateInput() {
        const dateInput = document.getElementById('date');
        if (!dateInput) return;

        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // ============================================
    // Dark Mode
    // ============================================
    function initDarkMode() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }

    // ============================================
    // Focus Management
    // ============================================
    function initFocusManagement() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-user');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-user');
        });
    }

    // ============================================
    // Initialize All
    // ============================================
    function init() {
        initMobileNav();
        initTestimonialsSlider();
        initGalleryFilter();
        initLightbox();
        initSmoothScroll();
        initScrollAnimations();
        initHeaderScroll();
        initContactForm();
        initPhoneFormatting();
        initDateInput();
        initDarkMode();
        initFocusManagement();

        console.log('Private Chef Website initialized');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
