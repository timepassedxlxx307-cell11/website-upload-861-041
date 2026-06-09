(function () {
  function setup(playUrl) {
    var video = document.getElementById('movie-player');
    var button = document.getElementById('movie-play-cover');
    if (!video || !button || !playUrl) {
      return;
    }

    function hideButton() {
      button.classList.add('is-hidden');
    }

    function bindVideo() {
      if (video.getAttribute('data-ready') === 'true') {
        return Promise.resolve();
      }
      video.setAttribute('data-ready', 'true');
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = playUrl;
        return Promise.resolve();
      }
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(playUrl);
        hls.attachMedia(video);
        video.hlsInstance = hls;
        return Promise.resolve();
      }
      video.src = playUrl;
      return Promise.resolve();
    }

    function start() {
      hideButton();
      bindVideo().then(function () {
        var attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {});
        }
      });
    }

    button.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener('play', hideButton);
  }

  window.SitePlayer = {
    setup: setup
  };
})();
