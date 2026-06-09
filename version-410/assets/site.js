(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    ready(function () {
        var header = document.querySelector("[data-header]");
        var toggle = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");

        function updateHeader() {
            if (!header) {
                return;
            }
            if (window.scrollY > 42) {
                header.classList.add("is-scrolled");
            } else {
                header.classList.remove("is-scrolled");
            }
        }

        updateHeader();
        window.addEventListener("scroll", updateHeader, { passive: true });

        if (toggle && panel) {
            toggle.addEventListener("click", function () {
                panel.classList.toggle("is-open");
            });
        }

        var sliders = document.querySelectorAll("[data-hero]");
        sliders.forEach(function (slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
            var prev = slider.querySelector("[data-hero-prev]");
            var next = slider.querySelector("[data-hero-next]");
            var current = 0;
            var timer;

            function show(index) {
                if (!slides.length) {
                    return;
                }
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === current);
                    dot.setAttribute("aria-pressed", dotIndex === current ? "true" : "false");
                });
            }

            function start() {
                stop();
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5600);
            }

            function stop() {
                if (timer) {
                    window.clearInterval(timer);
                }
            }

            if (prev) {
                prev.addEventListener("click", function () {
                    show(current - 1);
                    start();
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    show(current + 1);
                    start();
                });
            }

            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    show(index);
                    start();
                });
            });

            slider.addEventListener("mouseenter", stop);
            slider.addEventListener("mouseleave", start);
            show(0);
            start();
        });

        var params = new URLSearchParams(window.location.search);
        var query = (params.get("q") || params.get("search") || "").trim().toLowerCase();
        var forms = document.querySelectorAll(".search-form, .mobile-search");
        var items = Array.prototype.slice.call(document.querySelectorAll("[data-search]"));
        var hint = document.querySelector("[data-search-hint]");
        var inputs = document.querySelectorAll('input[name="q"]');

        inputs.forEach(function (input) {
            input.value = query;
        });

        function applyFilter(value) {
            var q = value.trim().toLowerCase();
            var visible = 0;
            items.forEach(function (item) {
                var text = (item.getAttribute("data-search") || "").toLowerCase();
                var matched = !q || text.indexOf(q) !== -1;
                item.style.display = matched ? "" : "none";
                if (matched) {
                    visible += 1;
                }
            });
            if (hint) {
                hint.classList.toggle("is-visible", !!q);
                hint.textContent = visible ? "已显示匹配结果" : "没有找到匹配内容";
            }
        }

        if (items.length) {
            applyFilter(query);
            forms.forEach(function (form) {
                form.addEventListener("submit", function (event) {
                    var input = form.querySelector('input[name="q"]');
                    var value = input ? input.value : "";
                    event.preventDefault();
                    applyFilter(value);
                    var nextUrl = window.location.pathname + (value.trim() ? "?q=" + encodeURIComponent(value.trim()) : "");
                    window.history.replaceState(null, "", nextUrl);
                    inputs.forEach(function (other) {
                        other.value = value;
                    });
                    if (panel) {
                        panel.classList.remove("is-open");
                    }
                });
            });
        }
    });
})();
