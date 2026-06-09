(() => {
    const menuButton = document.querySelector('[data-menu-toggle]');
    const mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', () => {
            mobilePanel.classList.toggle('is-open');
        });
    }

    const hero = document.querySelector('[data-hero]');

    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        const prev = hero.querySelector('[data-hero-prev]');
        const next = hero.querySelector('[data-hero-next]');
        let active = 0;
        let timer = null;

        const showSlide = (index) => {
            active = (index + slides.length) % slides.length;
            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle('is-active', slideIndex === active);
            });
            dots.forEach((dot, dotIndex) => {
                dot.classList.toggle('is-active', dotIndex === active);
            });
        };

        const start = () => {
            timer = window.setInterval(() => showSlide(active + 1), 5000);
        };

        const restart = () => {
            if (timer) {
                window.clearInterval(timer);
            }
            start();
        };

        if (slides.length) {
            showSlide(0);
            start();
        }

        if (prev) {
            prev.addEventListener('click', () => {
                showSlide(active - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', () => {
                showSlide(active + 1);
                restart();
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                restart();
            });
        });
    }

    const filterList = document.querySelector('[data-filter-list]');
    const filterInput = document.querySelector('[data-filter-input]');
    const yearFilter = document.querySelector('[data-year-filter]');
    const emptyState = document.querySelector('[data-empty-state]');

    if (filterList && (filterInput || yearFilter)) {
        const items = Array.from(filterList.querySelectorAll('[data-movie-card], .rank-item'));

        const applyFilter = () => {
            const query = filterInput ? filterInput.value.trim().toLowerCase() : '';
            const year = yearFilter ? yearFilter.value : '';
            let visible = 0;

            items.forEach((item) => {
                const text = item.getAttribute('data-filter-text') || '';
                const itemYear = item.getAttribute('data-year') || '';
                const matchQuery = !query || text.includes(query);
                const matchYear = !year || itemYear === year || text.includes(year);
                const shouldShow = matchQuery && matchYear;

                item.style.display = shouldShow ? '' : 'none';
                if (shouldShow) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle('is-visible', visible === 0);
            }
        };

        if (filterInput) {
            filterInput.addEventListener('input', applyFilter);
            const params = new URLSearchParams(window.location.search);
            const queryValue = params.get('q');
            if (queryValue) {
                filterInput.value = queryValue;
            }
        }

        if (yearFilter) {
            yearFilter.addEventListener('change', applyFilter);
        }

        applyFilter();
    }
})();
