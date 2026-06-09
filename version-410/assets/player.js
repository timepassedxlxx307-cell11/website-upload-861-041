import { H as Hls } from "./hls-vendor-dru42stk.js";

document.addEventListener("DOMContentLoaded", function () {
    var players = document.querySelectorAll("[data-player]");

    players.forEach(function (shell) {
        var video = shell.querySelector("video");
        var playButton = shell.querySelector("[data-play]");
        var toggleButton = shell.querySelector("[data-toggle]");
        var fullscreenButton = shell.querySelector("[data-fullscreen]");
        var progress = shell.querySelector("[data-progress]");
        var volume = shell.querySelector("[data-volume]");
        var status = shell.querySelector("[data-status]");
        var source = shell.getAttribute("data-source");
        var hls;

        if (!video || !source) {
            return;
        }

        function setStatus(text) {
            if (status) {
                status.textContent = text;
            }
        }

        function setupSource() {
            if (Hls && Hls.isSupported()) {
                hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    setStatus("准备播放");
                });
                hls.on(Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        setStatus("视频加载失败");
                    }
                });
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                video.addEventListener("loadedmetadata", function () {
                    setStatus("准备播放");
                });
            } else {
                setStatus("当前浏览器不支持播放");
            }
        }

        function playVideo() {
            var playPromise = video.play();
            if (playPromise && typeof playPromise.then === "function") {
                playPromise.then(function () {
                    shell.classList.add("is-playing");
                    if (toggleButton) {
                        toggleButton.textContent = "暂停";
                    }
                    setStatus("播放中");
                }).catch(function () {
                    setStatus("点击播放");
                });
            }
        }

        function toggleVideo() {
            if (video.paused) {
                playVideo();
            } else {
                video.pause();
            }
        }

        setupSource();

        if (playButton) {
            playButton.addEventListener("click", playVideo);
        }

        if (toggleButton) {
            toggleButton.addEventListener("click", toggleVideo);
        }

        video.addEventListener("click", toggleVideo);

        video.addEventListener("play", function () {
            shell.classList.add("is-playing");
            if (toggleButton) {
                toggleButton.textContent = "暂停";
            }
            setStatus("播放中");
        });

        video.addEventListener("pause", function () {
            shell.classList.remove("is-playing");
            if (toggleButton) {
                toggleButton.textContent = "播放";
            }
            setStatus("已暂停");
        });

        video.addEventListener("timeupdate", function () {
            if (progress && video.duration) {
                progress.value = String((video.currentTime / video.duration) * 100);
            }
        });

        if (progress) {
            progress.addEventListener("input", function () {
                if (video.duration) {
                    video.currentTime = (Number(progress.value) / 100) * video.duration;
                }
            });
        }

        if (volume) {
            volume.addEventListener("input", function () {
                video.volume = Number(volume.value);
            });
        }

        if (fullscreenButton) {
            fullscreenButton.addEventListener("click", function () {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else if (shell.requestFullscreen) {
                    shell.requestFullscreen();
                }
            });
        }

        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
});
