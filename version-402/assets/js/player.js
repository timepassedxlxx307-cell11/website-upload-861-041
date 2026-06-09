import { H as Hls } from './hls.js';

export function initPlayer(mediaUrl) {
    const video = document.getElementById('moviePlayer');
    const overlay = document.querySelector('[data-play-overlay]');

    if (!video || !mediaUrl) {
        return;
    }

    let ready = false;
    let hls = null;
    let pendingPlay = false;

    const showOverlay = () => {
        if (overlay && video.currentTime === 0) {
            overlay.classList.remove('is-hidden');
        }
    };

    const hideOverlay = () => {
        if (overlay) {
            overlay.classList.add('is-hidden');
        }
    };

    const safePlay = () => {
        const result = video.play();
        if (result && typeof result.catch === 'function') {
            result.catch(showOverlay);
        }
    };

    const attach = () => {
        if (ready) {
            return;
        }

        ready = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = mediaUrl;
            return;
        }

        if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(mediaUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (pendingPlay) {
                    safePlay();
                }
            });
            hls.on(Hls.Events.ERROR, (_event, data) => {
                if (!data || !data.fatal || !hls) {
                    return;
                }
                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                    hls.startLoad();
                }
                if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                    hls.recoverMediaError();
                }
            });
        }
    };

    const play = () => {
        pendingPlay = true;
        hideOverlay();
        attach();
        safePlay();
    };

    if (overlay) {
        overlay.addEventListener('click', play);
    }

    video.addEventListener('click', () => {
        if (video.paused) {
            play();
        }
    });

    video.addEventListener('play', hideOverlay);
    video.addEventListener('pause', showOverlay);

    window.addEventListener('pagehide', () => {
        if (hls) {
            hls.destroy();
            hls = null;
        }
    });
}
