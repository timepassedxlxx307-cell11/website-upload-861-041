(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return (value || "").toString().toLowerCase().trim();
    }

    function escapeText(value) {
        return (value || "").toString().replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&quot;",
                "'": "&#039;"
            }[char];
        });
    }

    function initMenu() {
        var button = document.querySelector(".menu-toggle");
        var menu = document.querySelector(".mobile-menu");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            menu.classList.toggle("open");
        });
    }

    function initHero() {
        var hero = document.querySelector(".hero-carousel");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
        var feature = hero.querySelector(".hero-feature-card");
        var current = 0;
        if (!slides.length) {
            return;
        }
        function apply(index) {
            current = index;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === index);
            });
            var image = slides[index].getAttribute("data-image");
            var poster = slides[index].getAttribute("data-poster");
            hero.style.setProperty("--hero-image", "url('" + image + "')");
            if (feature && poster) {
                feature.style.setProperty("--poster", "url('" + poster + "')");
                var title = feature.querySelector("strong");
                var meta = feature.querySelector("em");
                var link = feature.closest("a") || feature;
                if (title) {
                    title.textContent = slides[index].getAttribute("data-title") || "";
                }
                if (meta) {
                    meta.textContent = slides[index].getAttribute("data-meta") || "";
                }
                if (link.tagName && link.tagName.toLowerCase() === "a") {
                    link.setAttribute("href", slides[index].getAttribute("data-url") || "#");
                }
            }
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                apply(index);
            });
        });
        apply(0);
        window.setInterval(function () {
            apply((current + 1) % slides.length);
        }, 5200);
    }

    function initCardFilters() {
        var sections = Array.prototype.slice.call(document.querySelectorAll("[data-filter-section]"));
        sections.forEach(function (section) {
            var search = section.querySelector("[data-card-search]");
            var buttons = Array.prototype.slice.call(section.querySelectorAll("[data-filter-button]"));
            var cards = Array.prototype.slice.call(section.querySelectorAll(".movie-card"));
            var empty = section.querySelector(".empty-state");
            var activeType = "all";
            function apply() {
                var query = normalize(search ? search.value : "");
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-type"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-tags")
                    ].join(" "));
                    var type = normalize(card.getAttribute("data-type"));
                    var typeMatched = activeType === "all" || type.indexOf(activeType) !== -1;
                    var textMatched = !query || haystack.indexOf(query) !== -1;
                    var show = typeMatched && textMatched;
                    card.style.display = show ? "" : "none";
                    if (show) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("show", visible === 0);
                }
            }
            if (search) {
                search.addEventListener("input", apply);
            }
            buttons.forEach(function (button) {
                button.addEventListener("click", function () {
                    activeType = normalize(button.getAttribute("data-filter-button"));
                    buttons.forEach(function (item) {
                        item.classList.toggle("active", item === button);
                    });
                    apply();
                });
            });
            apply();
        });
    }

    function cardTemplate(movie) {
        return [
            '<article class="movie-card">',
            '<a class="poster-link" href="./' + escapeText(movie.file) + '" aria-label="' + escapeText(movie.title) + '">',
            '<span class="poster-bg" style="background-image: url(\'' + escapeText(movie.cover) + '\');"></span>',
            '<span class="play-mark">▶</span>',
            '</a>',
            '<div class="movie-card-body">',
            '<div class="movie-card-meta"><span>' + escapeText(movie.year) + '</span><span>' + escapeText(movie.region) + '</span><span>' + escapeText(movie.type) + '</span></div>',
            '<h3><a href="./' + escapeText(movie.file) + '">' + escapeText(movie.title) + '</a></h3>',
            '<p>' + escapeText(movie.one_line) + '</p>',
            '<div class="tag-row"><span class="tag-pill">' + escapeText(movie.genre) + '</span><span class="tag-pill">' + escapeText(movie.category_title) + '</span></div>',
            '</div>',
            '</article>'
        ].join("");
    }

    function initSearchPage() {
        var root = document.querySelector("[data-search-results]");
        if (!root || !window.SEARCH_MOVIES) {
            return;
        }
        var input = document.querySelector("[data-search-input]");
        var summary = document.querySelector("[data-search-summary]");
        var params = new URLSearchParams(window.location.search);
        var initial = params.get("q") || "";
        if (input) {
            input.value = initial;
        }
        function render() {
            var query = normalize(input ? input.value : initial);
            var words = query.split(/\s+/).filter(Boolean);
            var results = window.SEARCH_MOVIES.filter(function (movie) {
                if (!words.length) {
                    return false;
                }
                var haystack = normalize([
                    movie.title,
                    movie.one_line,
                    movie.genre,
                    movie.type,
                    movie.region,
                    movie.year,
                    movie.tags,
                    movie.category_title
                ].join(" "));
                return words.every(function (word) {
                    return haystack.indexOf(word) !== -1;
                });
            }).slice(0, 120);
            root.innerHTML = results.map(cardTemplate).join("");
            if (summary) {
                summary.textContent = words.length ? "搜索结果" : "输入关键词查找影片、剧集、题材或地区";
            }
        }
        if (input) {
            input.addEventListener("input", render);
        }
        render();
    }

    ready(function () {
        initMenu();
        initHero();
        initCardFilters();
        initSearchPage();
    });
}());
