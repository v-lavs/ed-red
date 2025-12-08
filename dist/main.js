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

    //MODAL

//SLIDER
    let sliderCounter;
    let sliderProduct;
    const counterSelector = $('.swiper.counter').get(0);
    const productSelector = $('.slider-products').get(0);

    function handleResponsive() {

// DESTROY SLIDER INSTANCES RESPONSIVE

        if ($(window).outerWidth() <= 767) {
            if (!sliderCounter && counterSelector) {
                sliderCounter = new Swiper('.swiper.counter', {
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                });
            }
        } else {
            destroySwiper(sliderCounter);
            sliderCounter = null;
        }

        if ($(window).outerWidth() <= 767) {
            if (!sliderProduct && productSelector) {
                sliderProduct = new Swiper('.slider-products', {
                    spaceBetween: 25,
                    slidesPerView: 1,
                    breakpoints: {
                        580: {
                            slidesPerView: 2,
                        }
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                });
            }
        } else {
            destroySwiper(sliderProduct);
            sliderProduct = null;
        }
    }

    let resizeId;

    handleResponsive();

    window.addEventListener('resize', function () {
        clearTimeout(resizeId);
        resizeId = setTimeout(handleResponsive, 500);
    });

//CORE-SLIDER
    if ($('.slider-info').get(0)) {
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
    }

    if ($('.blog-slider').get(0)) {
        const sliderBlog = new Swiper('.blog-slider', {
            spaceBetween: 20,
            pagination: {
                el: '.swiper-pagination',
            },
            navigation: {
                nextEl: '.wrap-blog-slider .swiper-button-next',
                prevEl: '.wrap-blog-slider .swiper-button-prev',
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


    let resizeTimer;
    $(window).on("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(checkSwipers, 200);
    });

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

            // checkSwipers();
            if (tabsSlider) {
                if ($.isArray(tabsSlider)) {
                    tabsSlider.forEach(function (slider) {
                        slider.update();
                    });
                } else {
                    tabsSlider.update();
                }
            }
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

// FLOWERING CALENDAR


});


//# sourceMappingURL=main.js.map
