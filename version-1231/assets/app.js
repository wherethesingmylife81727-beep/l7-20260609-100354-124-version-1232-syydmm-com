(function () {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function setupMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
            document.body.classList.toggle("menu-open", panel.classList.contains("is-open"));
        });
    }

    function setupHero() {
        var root = document.querySelector("[data-hero-slider]");
        if (!root) {
            return;
        }
        var slides = selectAll("[data-hero-slide]", root);
        var dots = selectAll("[data-hero-dot]", root);
        var prev = root.querySelector("[data-hero-prev]");
        var next = root.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                start();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }

        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupSiteSearch() {
        selectAll("[data-site-search]").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                var input = form.querySelector("input[name='q']");
                if (!input || !input.value.trim()) {
                    event.preventDefault();
                    window.location.href = "./search.html";
                }
            });
        });
    }

    function filterCards(input) {
        var targetSelector = input.getAttribute("data-filter-target");
        var target = targetSelector ? document.querySelector(targetSelector) : null;
        if (!target) {
            return;
        }
        var keyword = normalize(input.value);
        selectAll("[data-search-card]", target).forEach(function (card) {
            var text = normalize(card.getAttribute("data-text") || card.textContent);
            card.hidden = keyword && text.indexOf(keyword) === -1;
        });
    }

    function setupFilters() {
        selectAll("[data-filter-input]").forEach(function (input) {
            input.addEventListener("input", function () {
                filterCards(input);
            });
        });

        var params = new URLSearchParams(window.location.search);
        var query = params.get("q");
        var globalInput = document.querySelector("[data-global-search]");
        if (globalInput && query) {
            globalInput.value = query;
            filterCards(globalInput);
        }
    }

    function setupSorters() {
        selectAll("[data-sort-select]").forEach(function (select) {
            select.addEventListener("change", function () {
                var target = document.querySelector(select.getAttribute("data-sort-target"));
                if (!target) {
                    return;
                }
                var cards = selectAll("[data-search-card]", target);
                var mode = select.value;
                cards.sort(function (a, b) {
                    if (mode === "title-asc") {
                        return (a.getAttribute("data-title") || "").localeCompare(b.getAttribute("data-title") || "", "zh-CN");
                    }
                    if (mode === "rating-desc") {
                        return Number(b.getAttribute("data-rating") || 0) - Number(a.getAttribute("data-rating") || 0);
                    }
                    return Number(b.getAttribute("data-year") || 0) - Number(a.getAttribute("data-year") || 0);
                });
                cards.forEach(function (card) {
                    target.appendChild(card);
                });
            });
        });
    }

    window.bindMoviePlayer = function (videoId, overlayId, streamUrl) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);
        if (!video || !streamUrl) {
            return;
        }

        var ready = false;
        var hlsInstance = null;

        function attach() {
            if (ready) {
                return;
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
            ready = true;
        }

        function start() {
            attach();
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {
                    if (overlay) {
                        overlay.classList.remove("is-hidden");
                    }
                });
            }
        }

        if (overlay) {
            overlay.addEventListener("click", start);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            } else {
                video.pause();
            }
        });

        video.addEventListener("play", function () {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        });

        video.addEventListener("pause", function () {
            if (overlay && video.currentTime === 0) {
                overlay.classList.remove("is-hidden");
            }
        });

        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };

    document.addEventListener("DOMContentLoaded", function () {
        setupMenu();
        setupHero();
        setupSiteSearch();
        setupFilters();
        setupSorters();
    });
})();
