(function () {
    function toArray(value) {
        return Array.prototype.slice.call(value || []);
    }

    var menuToggle = document.querySelector('[data-menu-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuToggle && mobilePanel) {
        menuToggle.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    var slides = toArray(document.querySelectorAll('[data-hero-slide]'));
    var dots = toArray(document.querySelectorAll('[data-hero-dot]'));
    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');
    var activeIndex = 0;

    function setHero(index) {
        if (!slides.length) {
            return;
        }
        activeIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === activeIndex);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === activeIndex);
        });
    }

    dots.forEach(function (dot, dotIndex) {
        dot.addEventListener('click', function () {
            setHero(dotIndex);
        });
    });

    if (prev) {
        prev.addEventListener('click', function () {
            setHero(activeIndex - 1);
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            setHero(activeIndex + 1);
        });
    }

    if (slides.length > 1) {
        window.setInterval(function () {
            setHero(activeIndex + 1);
        }, 5600);
    }

    var forms = toArray(document.querySelectorAll('[data-search-form]'));
    forms.forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('[data-filter-input]');
            if (input) {
                var target = document.querySelector('#latest');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    });

    function bindFilter(input) {
        input.addEventListener('input', function () {
            var query = input.value.trim().toLowerCase();
            var scope = input.closest('section') || document;
            var cards = toArray(scope.querySelectorAll('[data-card]'));
            if (!cards.length) {
                cards = toArray(document.querySelectorAll('[data-card]'));
            }
            cards.forEach(function (card) {
                var haystack = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
                card.classList.toggle('is-hidden', query.length > 0 && haystack.indexOf(query) === -1);
            });
        });
    }

    toArray(document.querySelectorAll('[data-filter-input]')).forEach(bindFilter);

    function bindSort(select) {
        select.addEventListener('change', function () {
            var scope = select.closest('section') || document;
            var list = scope.querySelector('[data-card-list]');
            if (!list) {
                return;
            }
            var cards = toArray(list.querySelectorAll('[data-card]'));
            var value = select.value;
            cards.sort(function (a, b) {
                if (value === 'year-desc') {
                    return Number(b.getAttribute('data-year') || 0) - Number(a.getAttribute('data-year') || 0);
                }
                if (value === 'heat-desc') {
                    return Number(b.getAttribute('data-heat') || 0) - Number(a.getAttribute('data-heat') || 0);
                }
                return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-CN');
            });
            cards.forEach(function (card) {
                list.appendChild(card);
            });
        });
    }

    toArray(document.querySelectorAll('[data-sort-select]')).forEach(bindSort);
})();
