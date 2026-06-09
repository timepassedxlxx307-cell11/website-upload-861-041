(function () {
    function connectPlayer(box) {
        var video = box.querySelector('video');
        var cover = box.querySelector('[data-player-cover]');
        var src = box.getAttribute('data-stream');
        var ready = false;
        var hls = null;

        function attachSource() {
            if (ready || !video || !src) {
                return;
            }
            ready = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(src);
                hls.attachMedia(video);
                box._hls = hls;
                return;
            }

            video.src = src;
        }

        function startPlayback() {
            attachSource();
            if (cover) {
                cover.classList.add('is-hidden');
            }
            if (video) {
                var playPromise = video.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(function () {});
                }
            }
        }

        if (cover) {
            cover.addEventListener('click', startPlayback);
        }

        if (video) {
            video.addEventListener('play', function () {
                if (cover) {
                    cover.classList.add('is-hidden');
                }
            });
            video.addEventListener('loadedmetadata', function () {
                if (!video.paused && cover) {
                    cover.classList.add('is-hidden');
                }
            });
        }
    }

    document.querySelectorAll('[data-player]').forEach(connectPlayer);
})();
