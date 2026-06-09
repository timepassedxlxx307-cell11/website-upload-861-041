(function () {
    var menuToggle = document.querySelector('[data-menu-toggle]');
    var siteNav = document.querySelector('[data-site-nav]');

    if (menuToggle && siteNav) {
        menuToggle.addEventListener('click', function () {
            siteNav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-search-form]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            var input = form.querySelector('input[name="q"]');
            if (input && input.value.trim() === '') {
                event.preventDefault();
                window.location.href = './search.html';
            }
        });
    });

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        function startTimer() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5600);
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                showSlide(i);
                startTimer();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(index - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(index + 1);
                startTimer();
            });
        }

        showSlide(0);
        startTimer();
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function filterCards(value) {
        var query = normalize(value);
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card-list] .movie-card'));
        var shown = 0;

        cards.forEach(function (card) {
            var haystack = normalize(card.getAttribute('data-search'));
            var matched = query === '' || haystack.indexOf(query) !== -1;
            card.hidden = !matched;
            if (matched) {
                shown += 1;
            }
        });

        document.querySelectorAll('[data-empty-state]').forEach(function (empty) {
            empty.hidden = shown !== 0;
        });
    }

    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    var searchPageInput = document.querySelector('[data-search-page-input]');
    var filters = Array.prototype.slice.call(document.querySelectorAll('[data-card-filter]'));

    if (searchPageInput) {
        searchPageInput.value = q;
    }

    filters.forEach(function (input) {
        if (q && input.value === '') {
            input.value = q;
        }
        input.addEventListener('input', function () {
            filterCards(input.value);
        });
    });

    if (filters.length || q) {
        filterCards(q || (filters[0] && filters[0].value) || '');
    }
})();
