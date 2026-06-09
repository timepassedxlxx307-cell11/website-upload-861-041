(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    var menu = document.querySelector(".mobile-menu");
    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        var opened = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!opened));
        menu.hidden = opened;
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var index = 0;
    function showSlide(next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        showSlide(i);
      });
    });
    if (slides.length > 1) {
      setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    var query = new URLSearchParams(window.location.search).get("q") || "";
    var inputs = Array.prototype.slice.call(document.querySelectorAll(".search-page-input, .local-filter-input"));
    inputs.forEach(function (input) {
      if (query && input.classList.contains("search-page-input")) {
        input.value = query;
      }
      input.addEventListener("input", function () {
        filterCards(input.value);
      });
    });
    if (query) {
      filterCards(query);
    }

    Array.prototype.slice.call(document.querySelectorAll(".chip-filter")).forEach(function (button) {
      button.addEventListener("click", function () {
        var value = button.getAttribute("data-filter") || "";
        var active = button.classList.contains("active");
        Array.prototype.slice.call(document.querySelectorAll(".chip-filter")).forEach(function (item) {
          item.classList.remove("active");
        });
        if (active) {
          filterCards("");
        } else {
          button.classList.add("active");
          filterCards(value);
        }
      });
    });
  });

  function filterCards(value) {
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search]"));
    var text = String(value || "").trim().toLowerCase();
    var visible = 0;
    cards.forEach(function (card) {
      var hay = card.getAttribute("data-search") || "";
      var matched = !text || hay.indexOf(text) !== -1;
      card.style.display = matched ? "" : "none";
      if (matched) {
        visible += 1;
      }
    });
    Array.prototype.slice.call(document.querySelectorAll(".no-result")).forEach(function (box) {
      box.style.display = visible ? "none" : "block";
    });
  }
})();
