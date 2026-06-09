(function () {
  var basePath = document.body.getAttribute("data-base-path") || "./";

  function withBase(path) {
    return basePath + path;
  }

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    initHeader();
    initHero();
    initSearch();
    initFilters();
    initPlayers();
    initStartButtons();
  });

  function initHeader() {
    var header = document.querySelector("[data-header]");
    var button = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    function syncHeader() {
      if (!header) {
        return;
      }
      header.classList.toggle("is-scrolled", window.scrollY > 16);
    }

    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });

    if (button && mobileNav) {
      button.addEventListener("click", function () {
        mobileNav.hidden = !mobileNav.hidden;
      });
    }
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function initSearch() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll(".global-search-input"));
    var index = window.SEARCH_INDEX || [];

    inputs.forEach(function (input) {
      var box = input.parentElement.querySelector(".search-results");
      if (!box) {
        box = input.parentElement.parentElement.querySelector(".search-results");
      }
      if (!box) {
        return;
      }

      input.addEventListener("input", function () {
        var query = input.value.trim().toLowerCase();
        if (!query) {
          box.hidden = true;
          box.innerHTML = "";
          return;
        }

        var results = index.filter(function (item) {
          return [item.title, item.year, item.type, item.region, item.category, item.oneLine]
            .join(" ")
            .toLowerCase()
            .indexOf(query) !== -1;
        }).slice(0, 10);

        if (!results.length) {
          box.innerHTML = "<div class=\"search-result-item\"><div></div><span>暂无匹配影片</span></div>";
          box.hidden = false;
          return;
        }

        box.innerHTML = results.map(function (item) {
          return "<a class=\"search-result-item\" href=\"" + withBase(item.url) + "\">" +
            "<img src=\"" + withBase(item.image) + "\" alt=\"" + escapeHtml(item.title) + "\">" +
            "<span><strong>" + escapeHtml(item.title) + "</strong>" +
            escapeHtml(item.year + " · " + item.type + " · " + item.rating) +
            "</span></a>";
        }).join("");
        box.hidden = false;
      });

      document.addEventListener("click", function (event) {
        if (!input.parentElement.contains(event.target)) {
          box.hidden = true;
        }
      });
    });
  }

  function initFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));

    panels.forEach(function (panel) {
      var list = panel.parentElement.querySelector("[data-card-list]");
      if (!list) {
        return;
      }
      var cards = Array.prototype.slice.call(list.children);
      var input = panel.querySelector("[data-filter-input]");
      var type = panel.querySelector("[data-filter-type]");
      var year = panel.querySelector("[data-filter-year]");

      function apply() {
        var text = input ? input.value.trim().toLowerCase() : "";
        var typeValue = type ? type.value : "";
        var yearValue = year ? year.value : "";

        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-type"),
            card.getAttribute("data-year")
          ].join(" ").toLowerCase();
          var matchText = !text || haystack.indexOf(text) !== -1;
          var cardType = card.getAttribute("data-type") || "";
          var cardYear = card.getAttribute("data-year") || "";
          var matchType = !typeValue || cardType.indexOf(typeValue) !== -1;
          var matchYear = !yearValue || cardYear === yearValue;
          card.classList.toggle("is-filtered-out", !(matchText && matchType && matchYear));
        });
      }

      [input, type, year].forEach(function (element) {
        if (element) {
          element.addEventListener("input", apply);
          element.addEventListener("change", apply);
        }
      });
    });
  }

  function initPlayers() {
    var videos = Array.prototype.slice.call(document.querySelectorAll("video[data-m3u8]"));

    videos.forEach(function (video) {
      var url = video.getAttribute("data-m3u8");
      var shell = video.closest(".player-shell");
      var cover = shell ? shell.querySelector(".player-cover") : null;
      var attached = false;
      var hls = null;

      function attach() {
        if (attached || !url) {
          return;
        }
        attached = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url;
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (!data || !data.fatal) {
              return;
            }
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            } else {
              hls.destroy();
            }
          });
          return;
        }

        video.src = url;
      }

      function start() {
        attach();
        if (cover) {
          cover.classList.add("is-hidden");
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {
            if (cover) {
              cover.classList.remove("is-hidden");
            }
          });
        }
      }

      attach();

      if (cover) {
        cover.addEventListener("click", start);
      }

      video.addEventListener("play", function () {
        if (cover) {
          cover.classList.add("is-hidden");
        }
      });

      video.addEventListener("ended", function () {
        if (cover) {
          cover.classList.remove("is-hidden");
        }
      });

      window.addEventListener("pagehide", function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  }


  function initStartButtons() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-start-player]"));

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var cover = document.querySelector(".player-cover");
        if (cover) {
          cover.click();
        }
      });
    });
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
