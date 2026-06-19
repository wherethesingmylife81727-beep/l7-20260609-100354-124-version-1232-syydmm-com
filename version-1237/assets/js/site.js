(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');

    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            panel.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero-slider]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                clearInterval(timer);
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        showSlide(0);
        start();
    }

    var filterScopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));

    filterScopes.forEach(function (scope) {
        var input = scope.querySelector('[data-filter-input]');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
        var buttons = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-button]'));
        var noResult = scope.querySelector('[data-no-result]');
        var queryParams = new URLSearchParams(window.location.search);
        var initialQuery = queryParams.get('q') || '';
        var activeFilter = '';

        if (input && initialQuery) {
            input.value = initialQuery;
        }

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function applyFilter() {
            var keyword = normalize(input ? input.value : '');
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize(card.getAttribute('data-search'));
                var genre = normalize(card.getAttribute('data-genre'));
                var type = normalize(card.getAttribute('data-type'));
                var region = normalize(card.getAttribute('data-region'));
                var year = normalize(card.getAttribute('data-year'));
                var keywordMatch = !keyword || haystack.indexOf(keyword) !== -1;
                var filterMatch = !activeFilter || haystack.indexOf(activeFilter) !== -1 || genre.indexOf(activeFilter) !== -1 || type.indexOf(activeFilter) !== -1 || region.indexOf(activeFilter) !== -1 || year.indexOf(activeFilter) !== -1;
                var shouldShow = keywordMatch && filterMatch;

                card.style.display = shouldShow ? '' : 'none';

                if (shouldShow) {
                    visible += 1;
                }
            });

            if (noResult) {
                noResult.style.display = visible ? 'none' : 'block';
            }
        }

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                var value = normalize(button.getAttribute('data-filter-button'));

                if (activeFilter === value) {
                    activeFilter = '';
                } else {
                    activeFilter = value;
                }

                buttons.forEach(function (item) {
                    item.classList.toggle('active', normalize(item.getAttribute('data-filter-button')) === activeFilter && activeFilter !== '');
                });

                applyFilter();
            });
        });

        if (input) {
            input.addEventListener('input', applyFilter);
        }

        applyFilter();
    });
})();
