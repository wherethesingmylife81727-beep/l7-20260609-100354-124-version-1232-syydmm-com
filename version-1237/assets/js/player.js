(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (box) {
        var video = box.querySelector('video');
        var mask = box.querySelector('.player-mask');
        var button = box.querySelector('.player-button');
        var stream = box.getAttribute('data-stream');
        var ready = false;
        var hls = null;

        function attach() {
            if (ready || !video || !stream) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
            } else {
                video.src = stream;
            }

            ready = true;
        }

        function start() {
            attach();

            if (mask) {
                mask.classList.add('is-hidden');
            }

            video.setAttribute('controls', 'controls');
            var playTask = video.play();

            if (playTask && typeof playTask.catch === 'function') {
                playTask.catch(function () {
                    if (mask) {
                        mask.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                start();
            });
        }

        if (mask) {
            mask.addEventListener('click', start);
        }

        if (video) {
            video.addEventListener('play', function () {
                if (mask) {
                    mask.classList.add('is-hidden');
                }
            });
        }
    });
})();
