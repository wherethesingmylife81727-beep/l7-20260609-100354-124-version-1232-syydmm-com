(function () {
    function initMoviePlayer(playbackSource, videoId, buttonId) {
        const video = document.getElementById(videoId);
        const button = document.getElementById(buttonId);
        if (!video || !button || !playbackSource) {
            return;
        }

        let started = false;
        let hlsInstance = null;

        function startPlayback() {
            if (started) {
                video.play();
                return;
            }

            started = true;
            button.classList.add('is-hidden');

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = playbackSource;
                video.play();
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(playbackSource);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play();
                });
                return;
            }

            video.src = playbackSource;
            video.play();
        }

        button.addEventListener('click', startPlayback);
        video.addEventListener('click', function () {
            if (!started) {
                startPlayback();
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    window.initMoviePlayer = initMoviePlayer;
})();
