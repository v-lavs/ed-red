/*
* to include js file write: `//= include ./path-to-file`
* */

//= include ../../node_modules/jquery/dist/jquery.js ;

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

});

