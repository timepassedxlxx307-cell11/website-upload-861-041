(function () {
  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMenu() {
    var button = document.querySelector('[data-menu-button]');
    var nav = document.querySelector('[data-site-nav]');
    var search = document.querySelector('.site-search');
    if (!button || !nav || !search) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
      search.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = all('.hero-slide', hero);
    var dots = all('[data-hero-dot]', hero);
    var active = 0;
    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle('is-active', itemIndex === active);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle('is-active', itemIndex === active);
      });
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });
    if (slides.length > 1) {
      window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }
    show(0);
  }

  function setupFilters() {
    all('[data-filter-panel]').forEach(function (panel) {
      var input = panel.querySelector('[data-filter-input]');
      var year = panel.querySelector('[data-filter-year]');
      var type = panel.querySelector('[data-filter-type]');
      var grid = panel.parentElement.querySelector('.movie-grid');
      if (!grid) {
        return;
      }
      var cards = all('.movie-card', grid);
      function apply() {
        var text = input ? input.value.trim().toLowerCase() : '';
        var yearValue = year ? year.value : '';
        var typeValue = type ? type.value : '';
        cards.forEach(function (card) {
          var keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
          var cardYear = card.getAttribute('data-year') || '';
          var cardType = card.getAttribute('data-type') || '';
          var visible = true;
          if (text && keywords.indexOf(text) === -1) {
            visible = false;
          }
          if (yearValue && cardYear !== yearValue) {
            visible = false;
          }
          if (typeValue && cardType !== typeValue) {
            visible = false;
          }
          card.classList.toggle('is-hidden', !visible);
        });
      }
      [input, year, type].forEach(function (node) {
        if (node) {
          node.addEventListener('input', apply);
          node.addEventListener('change', apply);
        }
      });
    });
  }

  function buildCard(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return '' +
      '<article class="movie-card">' +
      '<a class="movie-card__poster" href="' + movie.link + '">' +
      '<img src="' + movie.image + '" alt="《' + escapeHtml(movie.title) + '》剧照" loading="lazy">' +
      '<span class="movie-card__year">' + escapeHtml(movie.year) + '</span>' +
      '</a>' +
      '<div class="movie-card__body">' +
      '<div class="movie-card__meta"><a href="' + movie.categoryLink + '">' + escapeHtml(movie.category) + '</a><span>' + escapeHtml(movie.region) + '</span></div>' +
      '<h2><a href="' + movie.link + '">' + escapeHtml(movie.title) + '</a></h2>' +
      '<p>' + escapeHtml(movie.oneLine) + '</p>' +
      '<div class="movie-card__tags">' + tags + '</div>' +
      '</div>' +
      '</article>';
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function setupSearchPage(movies) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    var input = document.querySelector('[data-search-page-input]');
    var note = document.querySelector('[data-search-note]');
    var results = document.querySelector('[data-search-results]');
    if (!input || !note || !results) {
      return;
    }
    input.value = query;
    function render() {
      var text = input.value.trim().toLowerCase();
      var list = movies.filter(function (movie) {
        if (!text) {
          return true;
        }
        return movie.keywords.toLowerCase().indexOf(text) !== -1;
      });
      note.textContent = text ? '搜索关键词：' + input.value + '，相关内容：' + list.length + ' 部' : '输入片名、地区、类型或标签即可筛选片库内容';
      results.innerHTML = list.slice(0, 240).map(buildCard).join('');
    }
    input.addEventListener('input', render);
    render();
  }

  function setup() {
    setupMenu();
    setupHero();
    setupFilters();
  }

  window.SiteApp = {
    setup: setup,
    setupSearchPage: setupSearchPage
  };

  setup();
})();
