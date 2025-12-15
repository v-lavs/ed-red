/*
 * to include js file write: `//= include ./path-to-file`
 */

// ================== CONSTANTS ==================

const BREAKPOINTS = {
    mobile: 767,
    tablet: 991,
};

const isMobile = () => window.innerWidth <= BREAKPOINTS.mobile;
const isTablet = () => window.innerWidth <= BREAKPOINTS.tablete;

// ================== HELPERS ==================

function destroySwiper(instance) {
    if (instance && instance instanceof Swiper && instance.initialized) {
        instance.destroy(true, true);
    }
}

function lockScroll() {
    document.body.style.overflow = 'hidden';
}

function unlockScroll() {
    document.body.style.overflow = '';
}

function debounce(fn, delay) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(null, args), delay);
    };
}

// ================== ALLERGENS ==================

function initAllergenCategory($root = $(document)) {
    $root.find('.category').each(function () {
        const $category = $(this);
        const $list = $category.find('.allergen-list');
        const $btn = $category.find('.allergen-toggle-btn');

        if (!$list.length || !$btn.length) return;

        const $items = $list.children('.allergen-item');
        const maxVisible = 6;

        if (!isMobile()) {
            $items.show();
            $btn.hide();
            $list.removeClass('is-collapsed');
            $category.removeClass('open');
            return;
        }

        if ($items.length <= maxVisible) {
            $btn.hide();
            return;
        }

        $btn.show();
        $list.addClass('is-collapsed');
        $category.removeClass('open');

        $items.each((i, el) => {
            if (i >= maxVisible) $(el).hide();
        });
    });
}

$(document).on('click', '.allergen-toggle-btn', function () {
    const $btn = $(this);
    const $category = $btn.closest('.category');
    const $list = $category.find('.allergen-list');
    const $items = $list.children('.allergen-item');
    const $text = $btn.find('.btn-text');

    const collapsed = $list.hasClass('is-collapsed');

    if (collapsed) {
        $list.removeClass('is-collapsed');
        $items.slideDown(200);
        $category.addClass('open');
        $text.text('Закрити');
    } else {
        $list.addClass('is-collapsed');
        $items.slice(6).slideUp(200);
        $category.removeClass('open');
        $text.text('Дивитись більше');
    }
});

function initVisibleTabAllergens() {
    const $activeTab = $('.tab-pane.active:visible');
    if ($activeTab.length) {
        initAllergenCategory($activeTab);
    }
}

// ================== MENU ==================

function initMobileMenu() {
    const $nav = $('.header__nav');
    const $backdrop = $('.backdrop');

    $('.btn_burger').on('click', e => {
        e.preventDefault();
        $nav.addClass('open');
        $backdrop.fadeIn();
    });

    $('.btn_close, .backdrop').on('click', e => {
        e.preventDefault();
        $nav.removeClass('open');
        $backdrop.fadeOut();
    });

    $('.menu').on('click', '.menu__toggler', function(e) {
        e.preventDefault();

        const $parent = $(this).parent();

        $parent.toggleClass('is-open');
    });


}



// ================== HEADER SEARCH (RESTORED) ==================

function initHeaderSearch() {
    const $searchBar = $('.header__search');
    const $form = $('.search-form');

    $('#openSearch').on('click', e => {
        e.preventDefault();
        $searchBar.addClass('active');
    });

    $('#closeSearch').on('click', e => {
        e.preventDefault();
        $searchBar.removeClass('active');
        $form.removeClass('active');
        $form.find('.form-control').val('');
    });

    $form.on('submit', function (e) {
        e.preventDefault();
        console.log('Form submitted:', $(this).serialize());
    });
}

// ================== SMOOTH SCROLL ==================

function initSmoothScroll(selectors) {
    const $header = $('header');

    $(document).on('click', selectors, function (e) {
        const href = $(this).attr('href');
        if (!href || !href.startsWith('#')) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        $('html, body').animate(
            { scrollTop: $(target).offset().top - $header.innerHeight() },
            800
        );

        $('.header__nav').removeClass('open');
        $('.backdrop').fadeOut();
    });

    if (location.hash) {
        const target = document.querySelector(location.hash);
        if (target) {
            $('html, body').animate(
                { scrollTop: $(target).offset().top - $header.innerHeight() },
                800
            );
        }
    }
}

// ================== VIDEO ==================

function initVideo() {
    const video = document.getElementById('promotion-video');
    const $btn = $('#playButton');

    if (!video || !$btn.length) return;

    $btn.on('click', () => video.play());

    video.addEventListener('play', () => {
        $btn.hide();
        video.controls = true;
    });

    video.addEventListener('pause', () => {
        $btn.show();
        video.controls = false;
    });
}

// ================== SLIDERS ==================

function initResponsiveCounterSlider() {
    let slider = null;

    function update() {
        if (isMobile()) {
            if (!slider && $('.swiper.counter').length) {
                slider = new Swiper('.swiper.counter', {
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                });
            }
        } else {
            destroySwiper(slider);
            slider = null;
        }
    }

    update();
    window.addEventListener('resize', debounce(update, 300));
}

function initStaticSliders() {
    if ($('.slider-products').length) {
        const slider = new Swiper('.slider-products', {
            spaceBetween: 24,
            slidesPerView: 1,
            breakpoints: {
                650: { slidesPerView: 2 },
                1025: { slidesPerView: 3 },
            },
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: {
                nextEl: '.wrap-slider-products .swiper-button-next',
                prevEl: '.wrap-slider-products .swiper-button-prev',
            },
            watchOverflow: true,
        });

        slider.on('init resize', () => {
            const show = !slider.isLocked;
            slider.el
                .querySelectorAll('.swiper-button-next, .swiper-button-prev')
                .forEach(btn => (btn.style.display = show ? '' : 'none'));
        });
    }

    if ($('.slider-info').length) {
        new Swiper('.slider-info', {
            loop: true,
            spaceBetween: 24,
            pagination: { el: '.swiper-pagination' },
            navigation: {
                nextEl: '.swiper-nav .swiper-button-next',
                prevEl: '.swiper-nav .swiper-button-prev',
            },
        });
    }

    if ($('.blog-slider').length) {
        new Swiper('.blog-slider', {
            spaceBetween: 24,
            breakpoints: {
                650: { slidesPerView: 2 },
                1025: { slidesPerView: 3 },
            },
            pagination: { el: '.swiper-pagination' },
            navigation: {
                nextEl: '.wrap-slider-posts .swiper-button-next',
                prevEl: '.wrap-slider-posts .swiper-button-prev',
            },
        });
    }
}

// ================== SLIDER IN TABS ==================

let tabsSlider = null;

function initTabsSlider() {
    const exists = $('.slider-posts').length > 0;

    if (exists) {
        if (!tabsSlider) {
            tabsSlider = new Swiper('.slider-posts', {
                spaceBetween: 20,
                pagination: { el: '.swiper-pagination' },
                navigation: {
                    nextEl: '.wrap-slider-posts .swiper-button-next',
                    prevEl: '.wrap-slider-posts .swiper-button-prev',
                },
                breakpoints: {
                    650: { slidesPerView: 2 },
                    1025: { slidesPerView: 3 },
                },
            });
        }
    } else {
        if (Array.isArray(tabsSlider)) {
            tabsSlider.forEach(slider => destroySwiper(slider));
        } else {
            destroySwiper(tabsSlider);
        }
        tabsSlider = null;
    }
}

// ================== TABS ==================

function initTabs() {
    $('.tabs').each(function () {
        const $tabs = $(this);
        const $links = $tabs.find('.tabs__nav-link');
        const $wrapper = $tabs.find('.tabs__content-wrapper');
        const $panes = $tabs.find('.tab-pane');

        function animateHeight($pane) {
            const start = $wrapper.height();
            $pane.show();
            const target = $pane.outerHeight();
            $pane.hide();

            $wrapper.height(start);
            requestAnimationFrame(() => {
                $wrapper.height(target);
                setTimeout(() => $wrapper.css('height', 'auto'), 300);
            });
        }

        $links.on('click', function (e) {
            e.preventDefault();
            const $link = $(this);
            if ($link.hasClass('active')) return;

            const id = $link.attr('href');
            const $pane = $tabs.find(id);

            $links.removeClass('active');
            $link.addClass('active');

            animateHeight($pane);
            $panes.removeClass('active').hide();
            $pane.addClass('active').show();

            initTabsSlider();

            if (tabsSlider) {
                if (Array.isArray(tabsSlider)) {
                    tabsSlider.forEach(slider => slider.update());
                } else {
                    tabsSlider.update();
                }
            }

            setTimeout(initVisibleTabAllergens, 20);
        });

        const $first = $panes.filter('.active');
        $wrapper.height($first.outerHeight());
        setTimeout(() => $wrapper.css('height', 'auto'), 300);
    });
}

// ================== FLOWERING CALENDAR ==================

function initFloweringCalendar() {
    const $wrap = $('.month-wrap');
    if (!$wrap.length) return;

    const currentMonth = new Date().getMonth();

    function update() {
        console.log(11)
        if (window.innerWidth > BREAKPOINTS.tablet) {
            if (!$wrap.hasClass('mCustomScrollbar')) {
                $wrap.mCustomScrollbar({
                    axis: 'x',
                    theme: 'my-theme',
                });

                const $months = $wrap.find('.month-block');
                const $current = $('#month-' + currentMonth);
                console.log(111)
                if ($current.length) {
                    const index = $months.index($current);
                    const offset = (100 / 12) * (index + 1) + '%';

                    setTimeout(() => {
                        $wrap.mCustomScrollbar('scrollTo', offset);
                    }, 1000);
                }
            }
        } else {
            if ($wrap.hasClass('mCustomScrollbar')) {
                $wrap.mCustomScrollbar('destroy');
            }
        }
    }

    update();
    window.addEventListener('resize', debounce(update, 300));
}

// ================== ACCORDION ==================

function initAccordion() {
    $('#accordion').on('click', '.panel__heading', function () {
        const $heading = $(this);
        const $panel = $heading.siblings('.panel-collapse');

        if ($heading.hasClass('open')) {
            $heading.removeClass('open');
            $panel.slideUp(300);
        } else {
            $('#accordion .panel__heading').removeClass('open');
            $('.panel-collapse').slideUp(300);
            $heading.addClass('open');
            $panel.slideDown(300);
        }
    });
}

// ================== COUNTERS ==================

function initCounters() {
    const numbers = document.querySelectorAll('.counter__number');
    if (!numbers.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            const target = +el.dataset.target;
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';
            const startTime = performance.now();

            function step(time) {
                const progress = Math.min((time - startTime) / 2000, 1);
                el.textContent = prefix + Math.floor(progress * target) + suffix;
                if (progress < 1) requestAnimationFrame(step);
            }

            requestAnimationFrame(step);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    numbers.forEach(n => observer.observe(n));
}

// ================== MODAL ==================

function initModal() {
    const dialog = document.getElementById('modal-calendar');
    const closeBtn = document.getElementById('closeDialog');

    $('.more-plants').on('click', function (e) {
        e.preventDefault();
        const block = $(this).closest('.month-block');
        const id = block.attr('id'); // ✅ use jQuery attr
        openDialogForMonth(id);
    });

    function openDialogForMonth(monthId) {
        // You can use monthId here if needed
        dialog.showModal();
        lockScroll();
    }

    if (dialog && closeBtn) {
        closeBtn.addEventListener('click', () => {
            dialog.close();
            unlockScroll();
        });

        $(dialog).on('click', function (e) {
            const rect = dialog.getBoundingClientRect();
            const inside =
                e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom;

            if (!inside) {
                dialog.close();
                unlockScroll();
            }
        });
    }
}

// ================== INIT ==================

$(document).ready(function () {
    initMobileMenu();
    initHeaderSearch();
    initSmoothScroll('.article__nav a, .menu__link, .scroll-to');
    initVideo();
    initResponsiveCounterSlider();
    initStaticSliders();
    initTabsSlider();
    initTabs();
    initAccordion();
    initCounters();
    initFloweringCalendar();
    initModal();
    initVisibleTabAllergens();

    $('.filter__select').select2({
        width: '100%',
        minimumResultsForSearch: -1,
    });
});

$(window).on('resize', debounce(initVisibleTabAllergens, 200));

//# sourceMappingURL=main.js.map
