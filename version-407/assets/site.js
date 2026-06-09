const menuButton = document.querySelector("[data-menu-button]");
const mobilePanel = document.querySelector("[data-mobile-panel]");

if (menuButton && mobilePanel) {
  menuButton.addEventListener("click", () => {
    mobilePanel.classList.toggle("open");
  });
}

const heroSlides = Array.from(document.querySelectorAll("[data-hero-slide]"));
let heroIndex = 0;

function showHeroSlide(index) {
  if (!heroSlides.length) {
    return;
  }

  heroSlides.forEach((slide, currentIndex) => {
    slide.classList.toggle("active", currentIndex === index);
  });
}

if (heroSlides.length > 1) {
  setInterval(() => {
    heroIndex = (heroIndex + 1) % heroSlides.length;
    showHeroSlide(heroIndex);
  }, 5200);
}

const searchInput = document.querySelector("[data-search-input]");
const regionFilter = document.querySelector("[data-region-filter]");
const typeFilter = document.querySelector("[data-type-filter]");
const yearFilter = document.querySelector("[data-year-filter]");
const resultItems = Array.from(document.querySelectorAll("[data-search-item]"));
const resultCount = document.querySelector("[data-result-count]");

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function applySearchFilters() {
  if (!resultItems.length) {
    return;
  }

  const query = normalizeText(searchInput ? searchInput.value : "");
  const region = normalizeText(regionFilter ? regionFilter.value : "");
  const type = normalizeText(typeFilter ? typeFilter.value : "");
  const year = normalizeText(yearFilter ? yearFilter.value : "");
  let visibleCount = 0;

  resultItems.forEach((item) => {
    const text = normalizeText(item.dataset.text);
    const matchesQuery = !query || text.includes(query);
    const matchesRegion =
      !region || normalizeText(item.dataset.region) === region;
    const matchesType =
      !type || normalizeText(item.dataset.type).includes(type);
    const matchesYear = !year || normalizeText(item.dataset.year) === year;
    const visible = matchesQuery && matchesRegion && matchesType && matchesYear;

    item.hidden = !visible;
    if (visible) {
      visibleCount += 1;
    }
  });

  if (resultCount) {
    resultCount.textContent = `${visibleCount}`;
  }
}

[searchInput, regionFilter, typeFilter, yearFilter].forEach((control) => {
  if (control) {
    control.addEventListener("input", applySearchFilters);
    control.addEventListener("change", applySearchFilters);
  }
});

if (searchInput) {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");

  if (query) {
    searchInput.value = query;
  }
}

applySearchFilters();

const homeSearchForm = document.querySelector("[data-home-search]");

if (homeSearchForm) {
  homeSearchForm.addEventListener("submit", (event) => {
    const input = homeSearchForm.querySelector("input");

    if (!input || !input.value.trim()) {
      event.preventDefault();
      window.location.href = "./search.html";
    }
  });
}
