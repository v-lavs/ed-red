/*
* to include js file write: `//= include ./path-to-file`
* */

// CUSTOM SCRIPTS


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

    let swiperRegistry = {}; // {id: swiperInstance}

    function activateSwiper(id, element) {
        swiperRegistry[id] = new Swiper(element, {
            slidesPerView: 1.2,
            spaceBetween: 16,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
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

            const shouldBeActive = window.innerWidth <= 991;

            if (shouldBeActive && !swiperRegistry[id]) {
                activateSwiper(id, `#${id}`);
            }

            if (!shouldBeActive && swiperRegistry[id]) {
                deactivateSwiper(id);
            }
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
        width:'100%',
        minimumResultsForSearch: -1,
    });

// FLOWERING CALENDAR
    const swiper = new Swiper('.plant-calendar', {
        slidesPerView: 'auto',
        freeMode: true
    });

    const track = document.querySelector('.scrollbar-track');
    const thumb = document.querySelector('.scrollbar-thumb');
    const monthTicks = document.querySelectorAll('.month-ticks span');
    const seasonLabels = document.querySelectorAll('.season-label');

    let dragging = false;
    let maxX;
    let totalTranslate;

    function updateSizes() {
        maxX = track.offsetWidth - thumb.offsetWidth;

        const slides = swiper.slides;
        const slideWidth = slides[0].offsetWidth + swiper.params.spaceBetween;
        totalTranslate = slideWidth * slides.length - swiper.width;
    }
    updateSizes();
    window.addEventListener("resize", updateSizes);

   function updateThumb() {
        const progress = swiper.progress;
        thumb.style.left = progress * maxX + "px";
    }
    swiper.on('setTranslate', updateThumb);
    swiper.on('slideChange', updateThumb);

    /* --- THUMB → SWIPER --- */
    thumb.addEventListener("mousedown", () => dragging = true);
    document.addEventListener("mouseup", () => dragging = false);

    document.addEventListener("mousemove", (e) => {
        if (!dragging) return;

        const rect = track.getBoundingClientRect();
        let x = e.clientX - rect.left;

        x = Math.max(0, Math.min(x, maxX));
        thumb.style.left = x + "px";

        const progress = x / maxX;
        const translate = -progress * totalTranslate;

        swiper.setTranslate(translate);
        swiper.updateProgress();
    });

    const clickCounters = Array(monthTicks.length).fill(0);

    monthTicks.forEach((tick, idx) => {
        tick.style.cursor = 'pointer';

        tick.addEventListener('click', () => {
            clickCounters[idx]++;
            const monthIndex = clickCounters[idx] % swiper.slides.length;
            swiper.slideTo(monthIndex, 300);
        });
    });

    seasonLabels.forEach(label => {
        label.style.cursor = 'pointer';

        label.addEventListener('click', () => {
            let targetSlide = 0;

            if (label.classList.contains('season-spring')) targetSlide = 1;
            if (label.classList.contains('season-summer')) targetSlide = 5;
            if (label.classList.contains('season-autumn')) targetSlide = 8;
            if (label.classList.contains('season-winter')) targetSlide = 11;

            swiper.slideTo(targetSlide, 300);
        });
    });


});

