if (getCookie('welcome-popup1-disable') != 'true') {
    var delayTime = parseInt($('[data-welcome-popup]').attr('data-popup-open-delay')) * 1000;
    setTimeout(function(){
    $("[data-welcome-popup]").modal({
        fadeDuration: 100,
        showClose: false
    });
    $("#popupClose").on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        $('.jquery-modal').hide();
        setCookie("welcome-popup1-disable", "true", 365);
        $('body').css('overflow', 'scroll');
    });
    }, delayTime); 
}