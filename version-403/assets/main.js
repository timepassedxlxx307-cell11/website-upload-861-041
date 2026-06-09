(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    if (menuButton && mobilePanel) {
      menuButton.addEventListener("click", function () {
        mobilePanel.classList.toggle("is-open");
      });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var current = 0;
      var timer = null;

      function showSlide(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      function startHero() {
        timer = window.setInterval(function () {
          showSlide(current + 1);
        }, 5200);
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          window.clearInterval(timer);
          showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
          startHero();
        });
      });

      if (slides.length > 1) {
        startHero();
      }
    }

    var filterForms = Array.prototype.slice.call(document.querySelectorAll("[data-filter-form]"));

    filterForms.forEach(function (form) {
      var input = form.querySelector("[data-card-filter]");
      var list = document.querySelector("[data-card-list]");

      if (!input || !list) {
        return;
      }

      function applyFilter() {
        var query = input.value.trim().toLowerCase();
        var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));

        cards.forEach(function (card) {
          var text = [
            card.getAttribute("data-title") || "",
            card.getAttribute("data-genre") || "",
            card.getAttribute("data-region") || ""
          ].join(" ").toLowerCase();
          card.hidden = query.length > 0 && text.indexOf(query) === -1;
        });
      }

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        applyFilter();
      });

      input.addEventListener("input", applyFilter);
    });
  });
})();
