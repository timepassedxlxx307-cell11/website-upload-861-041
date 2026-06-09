(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function attachStream(player) {
    var video = player.querySelector("video");
    var stream = player.getAttribute("data-stream");

    if (!video || !stream || player.getAttribute("data-ready") === "1") {
      return;
    }

    player.setAttribute("data-ready", "1");

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = stream;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      player._hls = hls;
      return;
    }

    video.src = stream;
  }

  function startPlayer(player) {
    var video = player.querySelector("video");
    var overlay = player.querySelector("[data-play-overlay]");

    attachStream(player);

    if (overlay) {
      overlay.hidden = true;
    }

    player.classList.add("is-playing");

    if (video) {
      var playResult = video.play();

      if (playResult && typeof playResult.catch === "function") {
        playResult.catch(function () {
          if (overlay) {
            overlay.hidden = false;
          }
          player.classList.remove("is-playing");
        });
      }
    }
  }

  ready(function () {
    Array.prototype.slice.call(document.querySelectorAll("[data-player]")).forEach(function (player) {
      var video = player.querySelector("video");
      var overlay = player.querySelector("[data-play-overlay]");

      if (overlay) {
        overlay.addEventListener("click", function () {
          startPlayer(player);
        });
      }

      if (video) {
        video.addEventListener("click", function () {
          if (video.paused) {
            startPlayer(player);
          }
        });

        video.addEventListener("play", function () {
          if (overlay) {
            overlay.hidden = true;
          }
          player.classList.add("is-playing");
        });

        video.addEventListener("pause", function () {
          player.classList.remove("is-playing");
        });
      }
    });
  });
})();
