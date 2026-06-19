(function () {
    window.initMoviePlayer = function (videoId, buttonId, source, shouldPlay) {
        var video = document.getElementById(videoId);
        var button = document.getElementById(buttonId);
        var attached = false;
        var hls = null;

        if (!video || !button || !source) {
            return;
        }

        function attach() {
            if (attached) {
                return;
            }

            attached = true;

            if (video.canPlayType('application/vnd.apple.mpegURL')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function begin() {
            attach();
            button.classList.add('is-hidden');
            video.controls = true;

            if (shouldPlay) {
                var play = video.play();

                if (play && typeof play.catch === 'function') {
                    play.catch(function () {
                        button.classList.remove('is-hidden');
                    });
                }
            }
        }

        button.addEventListener('click', begin);

        video.addEventListener('click', function () {
            if (video.paused) {
                begin();
            }
        });

        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    };
})();
