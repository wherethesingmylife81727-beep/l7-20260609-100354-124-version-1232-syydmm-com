(function () {
    const menuButton = document.querySelector('[data-menu-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('is-open');
        });
    }

    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.hero-dot'));
    let activeSlide = 0;
    let slideTimer = null;

    function setSlide(index) {
        if (!slides.length) {
            return;
        }
        activeSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === activeSlide);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === activeSlide);
        });
    }

    function startSlides() {
        if (slides.length < 2) {
            return;
        }
        slideTimer = window.setInterval(function () {
            setSlide(activeSlide + 1);
        }, 5200);
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            if (slideTimer) {
                window.clearInterval(slideTimer);
            }
            setSlide(index);
            startSlides();
        });
    });

    setSlide(0);
    startSlides();

    const filterForms = Array.from(document.querySelectorAll('.js-filter-form'));

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function applyFilter(form) {
        const scope = form.closest('[data-filter-scope]') || document;
        const cards = Array.from(scope.querySelectorAll('.movie-card'));
        const emptyState = scope.querySelector('[data-empty-state]');
        const formData = new FormData(form);
        const query = normalize(formData.get('q'));
        const year = normalize(formData.get('year'));
        const type = normalize(formData.get('type'));
        const region = normalize(formData.get('region'));
        let visibleCount = 0;

        cards.forEach(function (card) {
            const title = normalize(card.getAttribute('data-title'));
            const tags = normalize(card.getAttribute('data-tags'));
            const cardYear = normalize(card.getAttribute('data-year'));
            const cardType = normalize(card.getAttribute('data-type'));
            const cardRegion = normalize(card.getAttribute('data-region'));
            const textMatch = !query || title.indexOf(query) > -1 || tags.indexOf(query) > -1;
            const yearMatch = !year || cardYear === year;
            const typeMatch = !type || cardType === type;
            const regionMatch = !region || cardRegion === region;
            const visible = textMatch && yearMatch && typeMatch && regionMatch;
            card.style.display = visible ? '' : 'none';
            if (visible) {
                visibleCount += 1;
            }
        });

        if (emptyState) {
            emptyState.style.display = visibleCount ? 'none' : 'block';
        }
    }

    filterForms.forEach(function (form) {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q');
        const queryInput = form.querySelector('input[name="q"]');
        if (query && queryInput) {
            queryInput.value = query;
        }
        form.addEventListener('input', function () {
            applyFilter(form);
        });
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            applyFilter(form);
        });
        applyFilter(form);
    });
})();
