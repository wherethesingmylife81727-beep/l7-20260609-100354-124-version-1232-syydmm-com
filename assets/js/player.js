(function () {
    function startPlayer(frame) {
        if (!frame || frame.classList.contains('is-playing')) {
            return;
        }

        var video = frame.querySelector('video');
        if (!video) {
            return;
        }

        var source = video.getAttribute('data-src');
        if (!source) {
            return;
        }

        frame.classList.add('is-playing');

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            video.play().catch(function () {});
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls();
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                video.play().catch(function () {});
            });
            return;
        }

        video.src = source;
        video.play().catch(function () {});
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (frame) {
        var button = frame.querySelector('[data-player-start]');
        if (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                startPlayer(frame);
            });
        }
        frame.addEventListener('click', function () {
            startPlayer(frame);
        });
    });
})();
