/*
* to include js file write: `//= include ./path-to-file`
* */

// CUSTOM SCRIPTS

function destroySwiper(sliderInstance) {
    if (sliderInstance instanceof Swiper && sliderInstance.initialized) {
        sliderInstance.destroy(true, true);
        console.log('destroy')
    }
}

function initAllergenCategory() {
    const isMobile = $(window).width() <= 767;

    $('.category').each(function () {
        const $category = $(this);
        const $list = $category.find('.allergen-list');
        const $btn = $category.find('.allergen-toggle-btn');

        if (!$list.length || !$btn.length) return;

        const $items = $list.children('.allergen-item');
        const itemsCount = $items.length;

        // === DESKTOP MODE ===
        if (!isMobile) {
            $items.show();
            $btn.hide();
            $list.removeAttr('data-collapsed');
            $category.removeClass('open');
            return;
        }

        // === MOBILE MODE ===
        if (itemsCount <= 6) {
            $btn.hide();
        } else {
            $btn.show();
        }

        $items.each(function (i) {
            if (i >= 6) $(this).hide();
        });

        $list.attr('data-collapsed', 'true');
        $category.removeClass('open');

        $btn.off('click').on('click', function () {
            const collapsed = $list.attr('data-collapsed') === "true";
            const $text = $btn.find('.btn-text');

            if (collapsed) {
                $list.attr('data-collapsed', 'false');
                $items.slideDown(200);
                $category.addClass('open');
                $text.text('Закрити');
            } else {
                $list.attr('data-collapsed', 'true');
                $items.slice(6).slideUp(200);
                $category.removeClass('open');
                $text.text('Дивитись більше');
            }
        });
    });
}

function initVisibleTabAllergens() {
    const $activeTab = $('.tab-pane.active:visible');
    if (!$activeTab.length) return;

    $activeTab.find('.category').each(function () {
        initAllergenCategory($(this));
    });
}

function lockScroll() {
    document.body.style.overflow = 'hidden';
}
function unlockScroll() {
    document.body.style.overflow = '';
}

$(document).ready(function () {
    //MOBILE MENU
    const nav = $('.header__nav');

    $('.btn_burger').click(function (e) {
        e.preventDefault();
        nav.addClass('open');
        jQuery('.backdrop').fadeIn();
    });

    $('.btn_close, .backdrop').click(function (e) {
        e.preventDefault();
        nav.removeClass('open');
        jQuery('.backdrop').fadeOut();
    });

// SMOOTH SCROLL TO ANCHOR
    function smoothScrollToAnchor(selector) {
        $(selector).on('click', function (event) {
            let anchor = $.attr(this, 'href');
            let offsetSize = $('header').innerHeight();

            if (anchor.match(/^#/) && anchor !== '#') {
                event.preventDefault()
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset().top - offsetSize
                }, 2000);
                nav.removeClass('open');
                jQuery('.backdrop').fadeOut();
                $('body').removeClass('modal_open');
            }
        })
        let myHash = location.hash;
        location.hash = '';
        let offsetSize = $('header').innerHeight();
        if (myHash[1] != undefined) {
            $('html, body').animate({scrollTop: $(myHash).offset().top - offsetSize}, 1500);
        }

    }

    smoothScrollToAnchor('.article__nav .nav-list__item a');
    smoothScrollToAnchor('.menu__link');
    smoothScrollToAnchor('.single-product .scroll-to');

    // VIDEO PLAY

    const promotionVideo = $('#promotion-video').get(0);

    if (promotionVideo) {
        const playBtn = $('#playButton');

        playBtn.click(function () {
            promotionVideo.play();
        });

        promotionVideo.addEventListener('play', function () {
            playBtn.hide();
            promotionVideo.controls = true
        });

        promotionVideo.addEventListener('pause', function () {
            playBtn.show();
            promotionVideo.controls = false
        });
    }

//SLIDER
    let sliderCounter;
    const counterSelector = $('.swiper.counter').get(0);

    function handleResponsive() {

// DESTROY SLIDER INSTANCES RESPONSIVE

        if ($(window).outerWidth() <= 767) {
            if (!sliderCounter && counterSelector) {
                sliderCounter = new Swiper('.swiper.counter', {
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                });
            }
        } else {
            destroySwiper(sliderCounter);
            sliderCounter = null;
        }
    }


    let resizeId;

    handleResponsive();

    window.addEventListener('resize', function () {
        clearTimeout(resizeId);
        resizeId = setTimeout(handleResponsive, 500);
    });

//CORE-SLIDER
    if ($('.products').get(0)) {
        const sliderProduct = new Swiper('.slider-products', {
            spaceBetween: 24,
            slidesPerView: 1,
            breakpoints: {
                650: {
                    slidesPerView: 2,
                },
                1025: {
                    slidesPerView: 3,
                }
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.wrap-slider-products  .swiper-button-next',
                prevEl: '.wrap-slider-products  .swiper-button-prev',
            },
            watchOverflow: true,
        });
        sliderProduct.on('init resize', () => {
            toggleNav(sliderProduct);
        });

        function toggleNav(sliderProduct) {
            const next = document.querySelector('.swiper-button-next');
            const prev = document.querySelector('.swiper-button-prev');

            const show = !sliderProduct.isLocked;

            next.style.display = show ? '' : 'none';
            prev.style.display = show ? '' : 'none';
        }
    }
    if ($('.slider-info').get(0)) {
        const sliderInfo = new Swiper('.slider-info', {
            loop: true,
            spaceBetween: 24,
            pagination: {
                el: '.swiper-pagination',
            },
            navigation: {
                nextEl: '.swiper-nav  .swiper-button-next',
                prevEl: '.swiper-nav  .swiper-button-prev',
            },
        });
    }

    if ($('.blog-slider').get(0)) {
        const sliderBlog = new Swiper('.blog-slider', {
            spaceBetween: 24,
            pagination: {
                el: '.swiper-pagination',
            },
            navigation: {
                nextEl: '.wrap-slider-posts .swiper-button-next',
                prevEl: '.wrap-slider-posts .swiper-button-prev',
            },
            breakpoints: {
                650: {
                    slidesPerView: 2,
                },
                1025: {
                    slidesPerView: 3,
                }
            }
        });
    }
//SLIDER-IN-TABS
    let tabsSlider;

    function slidersInit() {
        if ($('.slider-posts').length > 0) {

            if (!tabsSlider) {
                tabsSlider = new Swiper('.slider-posts', {
                    spaceBetween: 20,
                    pagination: {
                        el: '.swiper-pagination',
                    },
                    navigation: {
                        nextEl: '.wrap-slider-posts  .swiper-button-next',
                        prevEl: '.wrap-slider-posts  .swiper-button-prev',
                    },
                    breakpoints: {
                        650: {
                            slidesPerView: 2,
                        },
                        1025: {
                            slidesPerView: 3,
                        }
                    }
                });
            }
        } else {
            if (tabsSlider) {
                if ($.isArray(tabsSlider)) {
                    tabsSlider.forEach(function (slider) {
                        slider.destroy(true, true)
                    });
                } else {
                    tabsSlider.destroy(true, true);
                }
                tabsSlider = null;
            }
        }
    }

    slidersInit();


    // TABS

    $(".tabs").each(function () {
        const tabs = $(this);
        const links = tabs.find('.tabs__nav-link');
        const wrapper = tabs.find('.tabs__content-wrapper');
        const panes = tabs.find('.tab-pane');

        function animateHeight(newPanel) {
            const start = wrapper.height();
            newPanel.show();
            const target = newPanel.outerHeight();
            newPanel.hide();

            wrapper.height(start);
            setTimeout(() => wrapper.height(target), 10);
            setTimeout(() => wrapper.css('height', 'auto'), 310);
        }

        links.on('click', function (e) {
            e.preventDefault();

            if ($(this).hasClass('active')) return;

            const id = $(this).attr('href');
            const pane = tabs.find(id);
            const current = panes.filter('.active');

            links.removeClass('active');
            $(this).addClass('active');

            animateHeight(pane);

            current.removeClass('active').hide();
            pane.addClass('active').show();

            slidersInit();

            if (tabsSlider) {
                if ($.isArray(tabsSlider)) {
                    tabsSlider.forEach(function (slider) {
                        slider.update();
                    });
                } else {
                    tabsSlider.update();
                }
            }
            setTimeout(() => initVisibleTabAllergens(), 20);
        });

        const first = panes.filter('.active');
        wrapper.css('height', first.outerHeight());
        setTimeout(() => wrapper.css('height', 'auto'), 300);
    });

    //ACCORDION
    $('#accordion .panel__heading').on('click', function () {
        if ($(this).hasClass('open')) {
            $(this).removeClass('open');
            $(this)
                .siblings('.panel-collapse')
                .slideUp(500);
            $('#accordion .panel__heading .open-panel')
                .removeClass('open-panel:before')
                .addClass('open-panel')
        } else {
            $('#accordion .panel__heading .open-panel')
                .removeClass('open-panel:before')
                .addClass('open-panel');
            $(this)
                .find('open-panel')
                .removeClass('open-panel')
                .addClass('open-panel:before');
            $('#accordion .panel__heading').removeClass('open');
            $(this).addClass('open');
            $('.panel-collapse').slideUp(500);
            $(this)
                .siblings('.panel-collapse')
                .slideDown(500)
        }
    });

//    CUSTOM SELECT
    $('.filter__select').select2({
        width: '100%',
        minimumResultsForSearch: -1,
    });

//    SEARCH BAR
    const searchBar = $('.header__search');

    $('#openSearch').click(function (e) {
        e.preventDefault();
        searchBar.addClass('active');
    });

    $('#closeSearch').click(function (e) {
        e.preventDefault();
        searchBar.removeClass('active');
        $('.search-form .form-control').val('');
        $('.search-form').removeClass('active');
    });
    $('.search-form').on('submit', function () {
        console.log('Form submitted:', $(this).serialize());
    });

// CATEGORY HIDE CONTENT
    initVisibleTabAllergens();

// COUNT-UP
    const numbers = document.querySelectorAll('.counter__number');

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const animateNumber = (el, duration = 2000) => {
        const target = +el.getAttribute('data-target');
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        let start = 0;
        const startTime = performance.now();

        const step = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const value = Math.floor(progress * target);
            el.textContent = prefix + value + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target, 2000);
                obs.unobserve(entry.target);
            }
        });
    }, options);

    numbers.forEach(num => observer.observe(num));

// FLOWERING CALENDAR
    const wrapScroll = $('.month-wrap'),
        currentDate = new Date();
    if (wrapScroll.length) {
        if (window.outerWidth > 991) {
            wrapScroll.mCustomScrollbar({
                axis: "x",
                theme: "my-theme"
            });
            console.log('month ' + currentDate.getMonth());
            const ms = $('.month-block');
            const cM = currentDate.getMonth();
            const cI = ms.index($('#month-' + cM));
            const offset = 100 / 12 * (cI + 1) + '%';
            setTimeout(() => {
                wrapScroll.mCustomScrollbar("scrollTo", offset);
            }, 1000);
        } else {
            wrapScroll.mCustomScrollbar('destroy');
        }
    }

//MODAL DIALOG
    const dialog = document.getElementById('modal-calendar');
    const content = document.getElementById('dialog-content');
    const  closeBtn = document.getElementById('closeDialog');

    document.addEventListener('click', (event) => {
        const btn = event.target.closest('.more-plants');
        if (!btn) return;

        const block = btn.closest('.month-block');
        if (!block) return;

        const id = block.id;
        openDialogForMonth(id);
    });

    function openDialogForMonth(monthId) {
        dialog.showModal();
        lockScroll();
    }


    closeBtn.addEventListener('click', () => {
        dialog.close();
        unlockScroll();
    });



    dialog.addEventListener('click', (e) => {
        const rect = dialog.getBoundingClientRect();
        const inside =
            e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom;

        if (!inside) dialog.close();
        unlockScroll();
    });
});


$(window).on('resize', function () {
    initVisibleTabAllergens();
});
//# sourceMappingURL=main.js.map
