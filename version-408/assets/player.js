(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    Array.prototype.slice.call(document.querySelectorAll(".player-shell")).forEach(function (shell) {
      var video = shell.querySelector("video");
      var cover = shell.querySelector(".play-cover");
      var stream = shell.getAttribute("data-stream");
      var hls = null;
      var loaded = false;

      function attach() {
        if (!video || !stream || loaded) {
          return;
        }
        loaded = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }
      }

      function start() {
        attach();
        if (cover) {
          cover.classList.add("is-hidden");
        }
        if (video) {
          video.controls = true;
          var playResult = video.play();
          if (playResult && typeof playResult.catch === "function") {
            playResult.catch(function () {});
          }
        }
      }

      if (cover) {
        cover.addEventListener("click", start);
      }
      if (video) {
        video.addEventListener("click", function () {
          if (!loaded) {
            start();
          }
        });
      }
      window.addEventListener("pagehide", function () {
        if (hls && typeof hls.destroy === "function") {
          hls.destroy();
        }
      });
    });
  });
})();
