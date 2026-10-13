window.addEventListener('load', (event) => {
    if (getCookie('announcementBarFlag') == 'hide') {
        document.querySelector(".announcement-bar").style.marginTop = 0 ;
    }
}); 
$(".announcement-bar span.close").on('click', function () {
    setCookie("announcementBarFlag", "hide", 365);
    $(this).parents('.announcement-bar').slideUp();
    var winWidth = $(window).width();
    if (winWidth > 768) {
        var headerMainHeight = $('div.header-main').innerHeight(),
            navigationHeight = $('div.desktop-navigation').innerHeight();
        $('body').css('padding-top', headerMainHeight + navigationHeight);
    }
});