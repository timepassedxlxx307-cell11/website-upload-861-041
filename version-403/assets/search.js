(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function card(movie) {
    return [
      '<article class="movie-card">',
      '  <a class="movie-poster" href="' + movie.url + '" aria-label="观看' + escapeHtml(movie.title) + '">',
      '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="movie-poster-shade"></span>',
      '    <span class="movie-play-dot">▶</span>',
      '  </a>',
      '  <div class="movie-card-body">',
      '    <div class="movie-card-meta">',
      '      <span>' + escapeHtml(movie.year) + '</span>',
      '      <span>' + escapeHtml(movie.region) + '</span>',
      '      <span>' + escapeHtml(movie.type) + '</span>',
      '    </div>',
      '    <h2><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h2>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="movie-tags"><span>' + escapeHtml(movie.category) + '</span><span>' + escapeHtml(movie.genre) + '</span></div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (match) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;"
      }[match];
    });
  }

  ready(function () {
    var input = document.querySelector("[data-search-input]");
    var title = document.querySelector("[data-search-title]");
    var results = document.querySelector("[data-search-results]");
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";

    if (!results || !Array.isArray(window.SEARCH_MOVIES)) {
      return;
    }

    if (input) {
      input.value = query;
    }

    function render(value) {
      var normalized = value.trim().toLowerCase();
      var matches = [];

      if (normalized.length > 0) {
        matches = window.SEARCH_MOVIES.filter(function (movie) {
          return [movie.title, movie.year, movie.region, movie.type, movie.genre, movie.tags, movie.oneLine, movie.category]
            .join(" ")
            .toLowerCase()
            .indexOf(normalized) !== -1;
        }).slice(0, 120);
      } else {
        matches = window.SEARCH_MOVIES.slice(0, 60);
      }

      if (title) {
        title.textContent = normalized.length > 0 ? "与“" + value + "”相关的影片" : "热门影视推荐";
      }

      results.innerHTML = matches.map(card).join("");
    }

    render(query);

    if (input) {
      input.addEventListener("input", function () {
        render(input.value);
      });
    }
  });
})();
