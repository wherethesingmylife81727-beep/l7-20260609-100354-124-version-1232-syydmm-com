(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var navLinks = document.querySelector('[data-nav-links]');

    if (menuButton && navLinks) {
        menuButton.addEventListener('click', function () {
            var open = navLinks.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', String(open));
        });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5600);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    });

    document.querySelectorAll('[data-search-scope]').forEach(function (scope) {
        var input = scope.querySelector('[data-search-input]');
        var form = scope.querySelector('[data-search-form]');
        var filterButtons = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-value]'));
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
        var emptyState = scope.querySelector('[data-empty-state]');
        var activeFilter = '全部';

        function matchesFilter(card) {
            if (activeFilter === '全部') {
                return true;
            }
            var text = (card.getAttribute('data-search-text') || '').toLowerCase();
            return text.indexOf(activeFilter.toLowerCase()) !== -1;
        }

        function matchesQuery(card, query) {
            if (!query) {
                return true;
            }
            var text = (card.getAttribute('data-search-text') || '').toLowerCase();
            return text.indexOf(query) !== -1;
        }

        function applyFilters() {
            var query = input ? input.value.trim().toLowerCase() : '';
            var visible = 0;
            cards.forEach(function (card) {
                var show = matchesFilter(card) && matchesQuery(card, query);
                card.classList.toggle('is-hidden', !show);
                if (show) {
                    visible += 1;
                }
            });
            if (emptyState) {
                emptyState.classList.toggle('is-visible', visible === 0);
            }
        }

        if (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                applyFilters();
            });
        }

        if (input) {
            input.addEventListener('input', applyFilters);
        }

        filterButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                activeFilter = button.getAttribute('data-filter-value') || '全部';
                filterButtons.forEach(function (item) {
                    item.classList.toggle('is-active', item === button);
                });
                applyFilters();
            });
        });
    });
}());

function initMoviePlayer(playerId, videoUrl) {
    var video = document.getElementById(playerId);
    if (!video || !videoUrl) {
        return;
    }

    var button = document.querySelector('[data-player-button="' + playerId + '"]');
    var hls = null;

    function setReady() {
        if (button) {
            button.classList.remove('is-hidden');
        }
    }

    if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
        });
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, setReady);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal && hls) {
                if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                    hls.startLoad();
                } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                    hls.recoverMediaError();
                }
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl;
        video.addEventListener('loadedmetadata', setReady, { once: true });
    } else {
        video.src = videoUrl;
        video.addEventListener('loadedmetadata', setReady, { once: true });
    }

    function playVideo() {
        if (button) {
            button.classList.add('is-hidden');
        }
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {
                if (button) {
                    button.classList.remove('is-hidden');
                }
            });
        }
    }

    if (button) {
        button.addEventListener('click', playVideo);
    }

    video.addEventListener('play', function () {
        if (button) {
            button.classList.add('is-hidden');
        }
    });

    video.addEventListener('pause', function () {
        if (button && video.currentTime === 0) {
            button.classList.remove('is-hidden');
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hls) {
            hls.destroy();
        }
    });
}
