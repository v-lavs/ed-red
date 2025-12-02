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

$(document).ready(function () {
    //MOBILE MENU
    const nav = $('.header__nav');

    $('.btn-burger').click(function (e) {
        e.preventDefault();
        nav.addClass('open');
        jQuery('.backdrop').fadeIn();
    });

    $('.btn-close, .backdrop').click(function (e) {
        e.preventDefault();
        nav.removeClass('open');
        jQuery('.backdrop').fadeOut();
    });

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

    //MODAL
    $('.open-modal').on('click', function (e) {
        e.preventDefault();
        $('.backdrop, .popup').fadeIn(500);
    });

    $('.close-popup, .backdrop').on('click', function () {
        $('.backdrop, .popup').fadeOut(500);
    });

//    SLIDER
    const sliderInfo = new Swiper('.slider-info', {
        loop: true,
        spaceBetween: 24,
        pagination: {
            el: '.swiper-pagination',
        },
        navigation: {
            nextEl: '.swiper-nav .swiper-button-next',
            prevEl: '.swiper-nav .swiper-button-prev',
        },
    });
    const sliderBlog = new Swiper('.blog-slider', {
        spaceBetween: 20,
        pagination: {
            el: '.swiper-pagination',
        },
        navigation: {
            nextEl: '.swiper-nav .swiper-button-next',
            prevEl: '.swiper-nav .swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            }
        }
    });

    let swiperRegistry = {}; // {id: swiperInstance}

    function activateSwiper(id, element) {
        swiperRegistry[id] = new Swiper(element, {
            spaceBetween: 20,
            pagination: {
                el: '.swiper-pagination',
            },
            navigation: {
                nextEl: '.swiper-nav .swiper-button-next',
                prevEl: '.swiper-nav .swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }

    function deactivateSwiper(id) {
        if (swiperRegistry[id]) {
            swiperRegistry[id].destroy(true, true);
            delete swiperRegistry[id];
        }
    }

    function checkSwipers() {
        $(".swiper").each(function () {
            const id = $(this).attr('id');
            if (!id) return;

            // const shouldBeActive = window.innerWidth <= 991;

            // if (shouldBeActive && !swiperRegistry[id]) {
            if ( !swiperRegistry[id]) {
                activateSwiper(id, `#${id}`);
            } else{
                deactivateSwiper(id);
            }

            // if (!shouldBeActive && swiperRegistry[id]) {
            //     deactivateSwiper(id);
            // }
        });
    }

    checkSwipers();

    let resizeTimer;
    $(window).on("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(checkSwipers, 200);
    });

    // TABS

    $(".tabs").each(function () {
        const tabs = $(this);
        const links = tabs.find(".tabs__nav-link");
        const wrapper = tabs.find(".tabs__content-wrapper");
        const panes = tabs.find(".tab-pane");

        function animateHeight(newPanel) {
            const start = wrapper.height();
            newPanel.show();
            const target = newPanel.outerHeight();
            newPanel.hide();

            wrapper.height(start);
            setTimeout(() => wrapper.height(target), 10);
            setTimeout(() => wrapper.css("height", "auto"), 310);
        }

        links.on("click", function (e) {
            e.preventDefault();

            if ($(this).hasClass("active")) return;

            const id = $(this).attr("href");
            const pane = tabs.find(id);
            const current = panes.filter(".active");

            links.removeClass("active");
            $(this).addClass("active");

            animateHeight(pane);

            current.removeClass("active").hide();
            pane.addClass("active").show();

            checkSwipers();
        });

        const first = panes.filter(".active");
        wrapper.css("height", first.outerHeight());
        setTimeout(() => wrapper.css("height", "auto"), 300);
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

// FLOWERING CALENDAR
    let calendarSlider;
    const calendarSelector = $('.plant-calendar').get(0);

    function handleResponsive() {

        // DESTROY SLIDER INSTANCES
        if ($(window).outerWidth() > 768) {
            if (!calendarSlider && calendarSelector) {
                calendarSlider = new Swiper(".plant-calendar", {
                    freeMode: true,
                    slidesPerView: 'auto',
                    observer: true,
                    observeParents: true,
                    scrollbar: {
                        el: ".swiper-scrollbar",
                        draggable: true,
                        hide: false,
                        snapOnRelease: true,
                    },
                });
            }
        } else {
            destroySwiper(calendarSlider);
            calendarSlider = null;
        }
    }

    let resizeId;

    handleResponsive();

    window.addEventListener('resize', function () {
        clearTimeout(resizeId);
        resizeId = setTimeout(handleResponsive, 500);
    });
    // const calendarWrapper = document.querySelector('.calendar-wrapper');
    // const wrapper = document.querySelector('.swiper-scrollbar');
    // (function syncDragWithSpan() {
    //     const month = document.querySelector('.month-block');
    //     const drag = document.querySelector('.swiper-scrollbar-drag');
    //     const track = drag ? drag.parentElement : null;
    //     const sliderEl = document.querySelector('.plant-calendar').swiper || window.calendarSlider || null; // try common refs
    //
    //     if (!month || !drag || !track) {
    //         console.warn('syncDragWithSpan: missing elements', {month, drag, track});
    //         return;
    //     }
    //
    //     function update() {
    //         const span = month.offsetWidth;
    //         // set drag width visually — fallback; keep small padding for design if needed
    //         drag.style.width = span + 'px';
    //         // ensure track has expected layout
    //         track.style.overflow = 'visible';
    //         // update left to match active slide if swiper present
    //         const trackMax = (track.offsetWidth - drag.offsetWidth) || 1;
    //         if (sliderEl && sliderEl.activeIndex != null) {
    //             const idx = sliderEl.activeIndex;
    //             const left = Math.max(0, Math.min(trackMax, Math.round((idx / (sliderEl.slides.length - 1 || 1)) * trackMax)));
    //             drag.style.transform = 'translate3d(' + left + 'px, 0, 0)';
    //         }
    //     }
    //
    //     window.addEventListener('load', update);
    //     window.addEventListener('resize', () => setTimeout(update, 60));
    //     // run now
    //     update();
    //
    //     // ensure drag moves slides when user drags native drag (Swiper scroll)
    //     // listen to Swiper scroll event if exists
    //     if (sliderEl && sliderEl.on) {
    //         sliderEl.on('scroll', () => {
    //             const left = drag.offsetLeft;
    //             const prog = left / (track.offsetWidth - drag.offsetWidth);
    //             const index = Math.round(prog * (sliderEl.slides.length - 1));
    //             if (sliderEl.activeIndex !== index) {
    //                 sliderEl.slideTo(index, 0);
    //             }
    //         });
    //     }
    // })();


});


//# sourceMappingURL=main.js.map
