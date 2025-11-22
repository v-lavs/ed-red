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

    //TABS
    $('.tabs').each(function () {
        const $tabs = $(this);
        const $wrapper = $tabs.find('.tabs__content-wrapper');
        const $tabLinks = $tabs.find('.tabs__nav-link');

        function switchTab($pane) {
            const newHeight = $pane.outerHeight();
            $wrapper.animate({ height: newHeight }, 300);

            $pane.find('.swiper-container').each(function () {
                if (!this.swiper) {
                    new Swiper(this, {
                        slidesPerView:3,
                        spaceBetween: 24,
                        loop: true,
                    });
                } else {
                    this.swiper.update();
                }
            });
        }

        const $activePane = $tabs.find('.tab-pane.active');
        $wrapper.height($activePane.outerHeight());

        $tabLinks.on('click', function (e) {
            e.preventDefault();

            const target = $(this).attr('href');
            const $targetPane = $(target);

            $tabLinks.removeClass('active');
            $(this).addClass('active');

            $tabs.find('.tab-pane').removeClass('active').hide();
            $targetPane.addClass('active').show();

            switchTab($targetPane);
        });
    });

    //MODAL
    $('.open-modal').on('click', function (e) {
        e.preventDefault();
        $('.backdrop, .popup').fadeIn(500);
    });

    $('.close-popup, .backdrop').on('click', function () {
        $('.backdrop, .popup').fadeOut(500);
    });

});

