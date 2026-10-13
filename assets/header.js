$(document).ready(function(){
    bodyTopPadding();
    headerTopBarMinView();
    standaloneMenuWrap();
    setTimeout(function () {
        menuTextWidthAssign();
    }, 300);
    var winWidth = $(window).width();
    $('button.c-nav-header-toggle').on('click', function(){
        if($(this).hasClass('hamburger__active')){
        $(this).removeClass('hamburger__active').addClass('hamburger__active-removed');
         $('body').removeClass('mobile-menu-open'); 
        setTimeout(function(){
          $('.desktop-navigation').css('display', 'none');
        },180);
        }
        else{
        $('.desktop-navigation').css('display', 'block');
        $(this).addClass('hamburger__active').removeClass('hamburger__active-removed');
        setTimeout(function(){
            $('body').addClass('mobile-menu-open');
        },100);
        }
    });
    //Add Mobile Class to Navigation ---------------------------------------------------
    if(winWidth <= 768){
      $('.desktop-navigation').addClass('mobile-menu');
      // Mobile Sub Menu Accordion -------------------------------------------------------
      $('.mobile-menu ul.site-nav > li.site-nav--has-submenu > a').on('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          if($(this).hasClass('is-open')){
          $(this).removeClass('is-open').next('div.site-nav__submenu-wrapper').stop().slideUp();
          }
          else{
          $('.mobile-menu ul.site-nav > li.site-nav--has-submenu > a').removeClass('is-open').next('div.site-nav__submenu-wrapper').stop().slideUp();
          $(this).addClass('is-open').next('div.site-nav__submenu-wrapper').stop().slideDown();
          }
      });
      $('.mobile-menu ul.site-nav > li.site-nav--has-submenu li.site-nav--has-submenu > a').on('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          if($(this).hasClass('is-open')){
          $(this).removeClass('is-open').next('ul.site-nav__submenu_2').stop().slideUp();
          }
          else{
          $('.mobile-menu ul.site-nav > li.site-nav--has-submenu li.site-nav--has-submenu > a').removeClass('is-open').next('ul.site-nav__submenu_2').stop().slideUp();
          $(this).addClass('is-open').next('ul.site-nav__submenu_2').stop().slideDown();
          }
      });
    }
    else{
      $('.desktop-navigation').addClass('desktop-menu');
    }
    //$('.desktop-navigation').addClass('mobile-menu');
    
});

$(window).on('resize',function () {
  var winWidth = $(window).width();
    bodyTopPadding();
    headerTopBarMinView();
    if(winWidth <= 768){
      $('.desktop-navigation').addClass('mobile-menu');
      $('.desktop-navigation').removeClass('desktop-menu');
      // $('body').removeClass('mobile-menu-open');
      // $("button.c-nav-header-toggle").removeClass('hamburger__active');
      //$('.desktop-navigation').css('display', 'none');
      $('.mobile-menu ul.site-nav > li.site-nav--has-submenu > a').off('click');
      $('.mobile-menu ul.site-nav > li.site-nav--has-submenu li.site-nav--has-submenu > a').off('click');
      // Mobile Sub Menu Accordion -------------------------------------------------------
      $('.mobile-menu ul.site-nav > li.site-nav--has-submenu > a').on('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          if($(this).hasClass('is-open')){
          $(this).removeClass('is-open').next('div.site-nav__submenu-wrapper').stop().slideUp();
          }
          else{
          $('.mobile-menu ul.site-nav > li.site-nav--has-submenu > a').removeClass('is-open').next('div.site-nav__submenu-wrapper').stop().slideUp();
          $(this).addClass('is-open').next('div.site-nav__submenu-wrapper').stop().slideDown();
          }
      });
      $('.mobile-menu ul.site-nav > li.site-nav--has-submenu li.site-nav--has-submenu > a').on('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          if($(this).hasClass('is-open')){
          $(this).removeClass('is-open').next('ul.site-nav__submenu_2').stop().slideUp();
          }
          else{
          $('.mobile-menu ul.site-nav > li.site-nav--has-submenu li.site-nav--has-submenu > a').removeClass('is-open').next('ul.site-nav__submenu_2').stop().slideUp();
          $(this).addClass('is-open').next('ul.site-nav__submenu_2').stop().slideDown();
          }
      });
    }
    else{
      $('.desktop-navigation').removeClass('mobile-menu');
      $('.desktop-navigation').addClass('desktop-menu');
      $('.mobile-menu ul.site-nav > li.site-nav--has-submenu > a').off('click');
      $('.mobile-menu ul.site-nav > li.site-nav--has-submenu li.site-nav--has-submenu > a').off('click');
      $('.desktop-menu ul.site-nav > li.site-nav--has-submenu > a').off('click');
      $('.desktop-menu ul.site-nav > li.site-nav--has-submenu li.site-nav--has-submenu > a').off('click');
      $('.desktop-navigation .site-nav__submenu-wrapper').each(function(){
        $(this).removeAttr("style");
      });
      $('.desktop-navigation .site-nav__submenu-wrapper .site-nav__submenu_2').each(function(){
        $(this).removeAttr("style");
      });
      $('.desktop-navigation .site-nav--has-submenu .site-nav__link.is-open').each(function(){
        $(this).removeClass("is-open");
      });
    }
   
});
jQuery(window).on('scroll',function (e) {
    e.stopPropagation();
    headerTopBarMinView();
});
$(function(){
    $('div.desktop-navigation li.site-nav--has-submenu ul.site-nav__submenu').each(function(e){
    var submenuItemsCounter = $(this).find('li.site-nav--has-submenu').length;
    console.log(submenuItemsCounter);
    $(this).attr('data-colCount' , submenuItemsCounter);
    });
    var winWidth = $(window).width();
    if(winWidth <= 1024){
        $('.desktop-navigation ul.site-nav > .site-nav--has-submenu > a').on('click', 'touchstart', function(e){
            e.preventDefault();
        });
    }
});
// Sticky Header Actions on Page Scroll ----------------------------------
function headerTopBarMinView() {
    if ($(".widthCalculated").length > 0) {
        var scrollTop = jQuery(window).scrollTop();
        //headerShippingBannerHeight = jQuery("#shopify-section-shipping-banner").innerHeight();
        if (scrollTop >= 200) {
            jQuery('body').addClass('sticky-nav-min');
        }
        else {
            jQuery('body').removeClass('sticky-nav-min');
            $('.announcement-bar').css('margin-top', 0);
        }
    }
}
function bodyTopPadding() {
    var winWidth = $(window).width();
    var announcementbar = $('div.announcement-bar').length;
    if(announcementbar > 0){
        var announcementBarHeight = $('div.announcement-bar').innerHeight();
    }
    else{
        var announcementBarHeight = 0;
    }
    var headerMainHeight = $('div.header-main').innerHeight();
    var desktopNavigationHeight = $("div.desktop-navigation").innerHeight();
    var headerActionsHeight = announcementBarHeight + headerMainHeight + desktopNavigationHeight;
    var productFilterHeight = $(".filters").innerHeight();
    if (winWidth >= 769) {
      initBodyTopPadding = headerActionsHeight;
        //if ($(".filters").length > 0) {
           // initBodyTopPadding = headerActionsHeight + productFilterHeight;
        //}
       // else {
           // initBodyTopPadding = headerActionsHeight;
        //}
    }
    else {
        initBodyTopPadding = 0;
    }

    $('body').css('padding-top', initBodyTopPadding);
    //$('div.desktop-navigation').css('top',  noticeBoardHeight + headerMainHeight);
    //$(".filters").css('top', headerActionsHeight);
}
function standaloneMenuWrap() {
    jQuery("ul.site-nav .site-nav--has-submenu").each(function () {
        if (jQuery(this).find('.site-nav__submenu li').hasClass('site-nav--standalone')) {
            jQuery(this).find('.site-nav__submenu li.site-nav--standalone').wrapAll("<li class='site-nav--has-submenu'><ul class='site-nav__submenu_2 site-nav__submenu_2_standalone'></ul></li>");
        }
    });
}
function menuTextWidthAssign() {
    $(".header-action").each(function () {
        $(this).removeAttr('style');
        var menuLabelWidth = $(this).find('a.anchor-link span.label span').innerWidth();
        $(this).find('a.anchor-link span.label').css('width', menuLabelWidth);
    });
    $('.header-actions').addClass('widthCalculated');
}
// Hide header on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('.desktop-navigation').outerHeight();

$(window).on('scroll',function (event) {
    didScroll = true;
});

setInterval(function () {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
        $(0)
    }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();
    var headerActionsHeight = $('header.site-header .header-main').innerHeight(),
        desktopNavHeight = $(".desktop-navigation").innerHeight(),
        announcementBarHeight = $('div.announcement-bar').innerHeight(),
        desktopNavHeight = $("div.desktop-navigation").innerHeight();

    if ($('div.product-bottom-info').length > 0) {
        var productbottomOffsetTop = $('div.product-bottom-info').offset().top,
            winScrollTop = $(window).scrollTop();
    }
    // Make scroll more than delta
    if (Math.abs(lastScrollTop - st) <= delta)
        return;
    // If scrolled down and past the navbar, add class .nav-up.
    if (st > lastScrollTop && st > navbarHeight) {
        // Scroll Down
        if ($(".filters").length > 0) {
            $('.header-main').stop().removeClass('show-header-line');
            $('.desktop-navigation').stop().css('margin-top', - desktopNavHeight);
        }
        else {
            $('.desktop-navigation').css('margin-top', - desktopNavHeight);
            $('.header-main').stop().removeClass('show-header-line');
            $('.announcement-bar').stop().css('margin-top', - announcementBarHeight);
        }
        if ($('div.product-bottom-info').length > 0) {
            if (winScrollTop >= productbottomOffsetTop) {
                $('body').addClass('show-sticky-addtocart');
                if ($(window).width() > 768) {
                    $('div.product-info-min-view').css('top', headerActionsHeight);
                }
            }
        }

        //$('.filters').css("top", headerActionsHeight);
    } else {
        // Scroll Up
        $('.header-main').stop().addClass('show-header-line');
        if (st + $(window).height() < $(document).height()) {
            $('.desktop-navigation').stop().css('margin-top', 0);
            //$('.filters').css("top", headerActionsHeight + desktopNavHeight);
            if ($('div.product-bottom-info').length > 0) {
                if (winScrollTop >= productbottomOffsetTop) {
                    $('body').addClass('show-sticky-addtocart');
                    if ($(window).width() > 768) {
                        $('div.product-info-min-view').css('top', headerActionsHeight + desktopNavHeight);
                    }
                }
                else {
                    $('body').removeClass('show-sticky-addtocart');
                    if ($(window).width() > 768) {
                        $('div.product-info-min-view').css('top', '-100px');
                    }
                }
            }
        }
    }

    lastScrollTop = st;
}