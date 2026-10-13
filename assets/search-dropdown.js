jQuery("#searchPopupBtn").on("click", function (e) {
    e.preventDefault();
    console.log('search clicked');
    if ($(this).hasClass('is-open')) {
        $(this).removeClass('is-open');
        searchPopupClose();
    }
    else {
        $(this).addClass('is-open');
        searchPopupOpen();
    }
});
jQuery("form.search-dropdown .close").on("click", function () {
    searchPopupClose();
});
function searchPopupOpen() {
    $("body").removeClass("drawer-open");
    $("#mobile-nav-drawer").removeClass("slide");
    //var headerActionsHeight = jQuery('header[role="banner"] .header-actions').innerHeight();
    //var headerNavHeight = jQuery('header[role="banner"] .desktop-navigation').innerHeight();
    //jQuery('body').addClass('disable-scroll').css('padding-top', headerActionsHeight);
    jQuery(".search-dropdown").slideDown();
    jQuery("form.search-popup div.close").fadeIn();
    $('html').addClass('safari-scroll-disable');
}
function searchPopupClose() {
    jQuery(".search-dropdown").slideUp();
    //var headerActionsHeight = jQuery('header[role="banner"] .header-actions').innerHeight();
    jQuery('body').removeClass('disable-scroll');
    jQuery("form.search-popup div.close").css('display', 'none');
    $('html').removeClass('safari-scroll-disable');
    $("#searchPopupBtn").removeClass('is-open');
}