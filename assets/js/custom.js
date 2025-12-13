(function ($) {
    "use strict";

    // ==================== ФУНКЦИЯ ДЛЯ ДОБАВЛЕНИЯ СТИЛЕЙ ====================
    function addAccordionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Стили для ответов в аккордеоне */
            .accordion-content {
                padding: 0;
                color: #555;
                line-height: 1.6;
                font-size: 14px !important;
                animation: contentAppear 0.4s ease-out 0.1s both;
            }
            
            .accordion-content p {
                margin-bottom: 15px;
                padding: 0 40px;
                padding-top: 20px;
                animation: fadeInUp 0.5s ease-out;
                font-size: 14px !important;
            }
            
            .accordion-content ul {
                padding: 0 40px 20px 50px;
                margin-bottom: 15px;
                animation: fadeInUp 0.6s ease-out 0.1s both;
            }
            
            .accordion-content li {
                margin-bottom: 10px;
                position: relative;
                padding-left: 5px;
                animation: slideInLeft 0.4s ease-out;
                animation-fill-mode: both;
                font-size: 14px !important;
            }
            
            .accordion-content strong {
                color: #333;
                font-weight: 700;
                font-size: 14px !important;
            }
            
            /* Анимации */
            @keyframes contentAppear {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            /* Адаптивность */
            @media (max-width: 992px) {
                .accordion-content p {
                    font-size: 13px !important;
                }
                .accordion-content li {
                    font-size: 13px !important;
                }
            }
            
            @media (max-width: 767px) {
                .accordion-content p {
                    font-size: 12px !important;
                }
                .accordion-content li {
                    font-size: 12px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ==================== ОСНОВНЫЕ ФУНКЦИИ ====================
    
    // Page loading animation
    $(window).on('load', function() {
        $('#js-preloader').addClass('loaded');
        
        // Parallax для .cover
        if($('.cover').length){
            $('.cover').parallax({
                imageSrc: $('.cover').data('image'),
                zIndex: '1'
            });
        }

        $("#preloader").animate({
            'opacity': '0'
        }, 600, function(){
            setTimeout(function(){
                $("#preloader").css("visibility", "hidden").fadeOut();
            }, 300);
        });
    });

    // WOW JS с проверкой на существование библиотеки
    $(window).on('load', function (){
        if (typeof WOW !== 'undefined' && $(".wow").length) { 
            var wow = new WOW ({
                boxClass:     'wow',
                animateClass: 'animated',
                offset:       20,
                mobile:       true,
                live:         true,
            });
            wow.init();
        }
    });

    // Header background on scroll
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        var box = $('.header-text').height();
        var header = $('header').height();

        if (scroll >= box - header) {
            $("header").addClass("background-header");
        } else {
            $("header").removeClass("background-header");
        }
    });

    // ==================== УЛУЧШЕННЫЙ АККОРДЕОН ====================
    const Accordion = {
        settings: {
            first_expanded: false,
            toggle: false,
            duration: 300,
            easing: 'ease-in-out'
        },

        // Найти иконку стрелочки
        getArrowIcon: function(toggle) {
            return toggle.querySelector('.icon i, .accordion-head i, .arrow, [class*="icon-"]');
        },

        // Анимация вращения стрелочки
        animateArrow: function(icon, isOpening) {
            if (!icon) return;
            
            icon.style.transition = `transform ${this.settings.duration}ms ${this.settings.easing}`;
            
            if (isOpening) {
                icon.style.transform = 'rotate(45deg)';
                icon.style.color = '#3a6cf4';
            } else {
                icon.style.transform = 'rotate(0deg)';
                icon.style.color = '';
            }
        },

        // Плавное открытие аккордеона
        openAccordion: function(toggle, content) {
            const _this = this;
            
            if (!content.children.length) return;
            
            toggle.classList.add("is-open");
            
            const arrowIcon = _this.getArrowIcon(toggle);
            _this.animateArrow(arrowIcon, true);
            
            const innerContent = content.querySelector('.content') || content.children[0];
            const contentHeight = innerContent.scrollHeight;
            
            content.style.overflow = 'hidden';
            content.style.willChange = 'height, opacity';
            content.style.transition = `height ${_this.settings.duration}ms ${_this.settings.easing}, 
                                        opacity ${_this.settings.duration}ms ${_this.settings.easing}`;
            
            content.style.height = '0px';
            content.style.opacity = '0';
            
            requestAnimationFrame(() => {
                content.style.height = contentHeight + 'px';
                content.style.opacity = '1';
                content.classList.add('is-open');
                
                // Добавляем анимацию для контента
                const contentElements = content.querySelectorAll('.accordion-content p, .accordion-content li');
                contentElements.forEach((el, index) => {
                    el.style.animationDelay = `${index * 0.05}s`;
                });
                
                setTimeout(() => {
                    content.style.height = 'auto';
                    content.style.overflow = 'visible';
                    content.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                    content.style.marginTop = '10px';
                    content.style.marginBottom = '10px';
                    content.style.borderRadius = '0 0 8px 8px';
                }, _this.settings.duration);
            });
        },

        // Плавное закрытие аккордеона
        closeAccordion: function(toggle, content) {
            const _this = this;
            
            const currentHeight = content.scrollHeight;
            content.style.height = currentHeight + 'px';
            content.style.overflow = 'hidden';
            
            const arrowIcon = _this.getArrowIcon(toggle);
            _this.animateArrow(arrowIcon, false);
            
            toggle.classList.remove("is-open");
            
            requestAnimationFrame(() => {
                content.style.height = '0px';
                content.style.opacity = '0';
                content.style.boxShadow = 'none';
                content.style.marginTop = '0';
                content.style.marginBottom = '0';
                
                setTimeout(() => {
                    content.classList.remove('is-open');
                    content.style.height = '';
                    content.style.opacity = '';
                }, _this.settings.duration);
            });
        },

        init: function(el) {
            const _this = this;
            let is_toggle = el.classList.contains("is-toggle") ? true : _this.settings.toggle;

            const all_toggles = el.getElementsByClassName("accordion-head");
            const all_contents = el.getElementsByClassName("accordion-body");
            
            // Подготовка всех аккордеонов
            for (let i = 0; i < all_contents.length; i++) {
                const content = all_contents[i];
                const toggle = all_toggles[i];
                
                // Устанавливаем начальное закрытое состояние
                content.style.height = '0px';
                content.style.opacity = '0';
                content.style.overflow = 'hidden';
                content.style.transition = `height ${_this.settings.duration}ms ${_this.settings.easing}, 
                                           opacity ${_this.settings.duration}ms ${_this.settings.easing}`;
                
                // Инициализация стрелочек в закрытом состоянии
                const arrowIcon = _this.getArrowIcon(toggle);
                if (arrowIcon) {
                    arrowIcon.style.transition = `transform ${_this.settings.duration}ms ${_this.settings.easing}`;
                    arrowIcon.style.display = 'inline-block';
                    arrowIcon.style.transform = 'rotate(0deg)';
                }
                
                // Добавляем обработчик клика
                toggle.addEventListener("click", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const isCurrentlyOpen = this.classList.contains("is-open");
                    
                    if (!is_toggle) {
                        // Режим аккордеона: закрыть все, открыть текущий
                        if (!isCurrentlyOpen) {
                            // Закрыть все остальные
                            for (let j = 0; j < all_toggles.length; j++) {
                                if (all_toggles[j] !== this && all_toggles[j].classList.contains("is-open")) {
                                    _this.closeAccordion(all_toggles[j], all_contents[j]);
                                }
                            }
                            // Открыть текущий
                            _this.openAccordion(this, all_contents[i]);
                        } else {
                            // Закрыть текущий
                            _this.closeAccordion(this, all_contents[i]);
                        }
                    } else {
                        // Режим toggle: независимое переключение
                        if (isCurrentlyOpen) {
                            _this.closeAccordion(this, all_contents[i]);
                        } else {
                            _this.openAccordion(this, all_contents[i]);
                        }
                    }
                });
                
                // Добавляем эффект при наведении
                toggle.addEventListener('mouseenter', function() {
                    if (!this.classList.contains('is-open')) {
                        this.style.backgroundColor = '#f8f9fa';
                        this.style.transition = 'background-color 0.2s ease';
                    }
                });
                
                toggle.addEventListener('mouseleave', function() {
                    if (!this.classList.contains('is-open')) {
                        this.style.backgroundColor = '';
                    }
                });
            }
            
            el.classList.remove('is-first-expanded');
        }
    };

    // ==================== ИНИЦИАЛИЗАЦИЯ ВСЕГО КОДА ====================
    $(document).ready(function() {
        // Добавляем стили для аккордеона
        addAccordionStyles();
        
        // Инициализация аккордеонов
        const accordions = document.getElementsByClassName("accordions");
        for (let i = 0; i < accordions.length; i++) {
            Accordion.init(accordions[i]);
        }
        
        // Переинициализация при ресайзе
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const openAccordions = document.querySelectorAll('.accordion-head.is-open');
                openAccordions.forEach(toggle => {
                    const content = toggle.nextElementSibling;
                    if (content && content.classList.contains('accordion-body')) {
                        const innerContent = content.querySelector('.content') || content.children[0];
                        if (innerContent) {
                            content.style.height = 'auto';
                            const newHeight = innerContent.scrollHeight;
                            content.style.height = newHeight + 'px';
                        }
                    }
                });
            }, 250);
        });

        // Tabs functionality (.naccs)
        $(document).on("click", ".naccs .menu div", function() {
            var numberIndex = $(this).index();

            if (!$(this).is("active")) {
                $(".naccs .menu div").removeClass("active");
                $(".naccs ul li").removeClass("active");

                $(this).addClass("active");
                $(".naccs ul").find("li:eq(" + numberIndex + ")").addClass("active");

                var listItemHeight = $(".naccs ul")
                    .find("li:eq(" + numberIndex + ")")
                    .innerHeight();
                $(".naccs ul").height(listItemHeight + "px");
            }
        });

        // Owl Carousel
        if (typeof $.fn.owlCarousel !== 'undefined' && $('.owl-features').length) {
            $('.owl-features').owlCarousel({
                center: true,
                items: 2,
                loop: true,
                nav: true,
                margin: 30,
                responsive: {
                    992: {
                        items: 3
                    },
                    1200: {
                        items: 4
                    }
                }
            });
        }

        // Menu Dropdown Toggle
        if($('.menu-trigger').length){
            $(".menu-trigger").on('click', function() {    
                $(this).toggleClass('active');
                $('.header-area .nav').slideToggle(200);
            });
        }

        // Smooth scroll для якорных ссылок
        $('.scroll-to-section a[href*=\\#]:not([href=\\#])').on('click', function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                if (target.length) {
                    var width = $(window).width();
                    if(width < 991) {
                        $('.menu-trigger').removeClass('active');
                        $('.header-area .nav').slideUp(200);    
                    }                
                    $('html,body').animate({
                        scrollTop: (target.offset().top) - 80
                    }, 700);
                    return false;
                }
            }
        });

        // Smooth scroll с активным состоянием
        $(document).on("scroll", onScroll);
        
        $('.scroll-to-section a[href^="#"]').on('click', function (e) {
            e.preventDefault();
            $(document).off("scroll");
            
            $('.scroll-to-section a').each(function () {
                $(this).removeClass('active');
            })
            $(this).addClass('active');
          
            var target = this.hash;
            var targetElement = $(this.hash);
            $('html, body').stop().animate({
                scrollTop: (targetElement.offset().top) - 79
            }, 500, 'swing', function () {
                window.location.hash = target;
                $(document).on("scroll", onScroll);
            });
        });

        // Обработка формы
        const contactForm = document.getElementById('free-quote');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('name')?.value;
                const email = document.getElementById('email')?.value;
                const message = document.getElementById('message')?.value;
                
                if (!name || !email || !message) {
                    alert('Пожалуйста, заполните все обязательные поля.');
                    return;
                }
                
                alert('Спасибо! Ваш вопрос отправлен. Мы свяжемся с вами в ближайшее время.');
                contactForm.reset();
            });
        }

        // Dropdown меню
        const dropdownOpener = $('.main-nav ul.nav .has-sub > a');
        if (dropdownOpener.length) {
            dropdownOpener.each(function () {
                var _this = $(this);
                _this.on('tap click', function (e) {
                    var thisItemParent = _this.parent('li'),
                        thisItemParentSiblingsWithDrop = thisItemParent.siblings('.has-sub');

                    if (thisItemParent.hasClass('has-sub')) {
                        var submenu = thisItemParent.find('> ul.sub-menu');

                        if (submenu.is(':visible')) {
                            submenu.slideUp(450, 'easeInOutQuad');
                            thisItemParent.removeClass('is-open-sub');
                        } else {
                            thisItemParent.addClass('is-open-sub');

                            if (thisItemParentSiblingsWithDrop.length === 0) {
                                thisItemParent.find('.sub-menu').slideUp(400, 'easeInOutQuad', function () {
                                    submenu.slideDown(250, 'easeInOutQuad');
                                });
                            } else {
                                thisItemParent.siblings().removeClass('is-open-sub').find('.sub-menu').slideUp(250, 'easeInOutQuad', function () {
                                    submenu.slideDown(250, 'easeInOutQuad');
                                });
                            }
                        }
                    }
                    e.preventDefault();
                });
            });
        }
    });

    // Update active nav link on scroll
    function onScroll(event){
        var scrollPos = $(document).scrollTop();
        $('.nav a').each(function () {
            var currLink = $(this);
            var refElement = $(currLink.attr("href"));
            if (refElement.length && refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                $('.nav ul li a').removeClass("active");
                currLink.addClass("active");
            }
            else{
                currLink.removeClass("active");
            }
        });
    }

})(window.jQuery);