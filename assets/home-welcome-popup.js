function setCookie(name, value, hours) {
    var expires = "";
    if (hours) {
        var date = new Date();
        //date.setTime(date.getTime() + (days*24*60*60*1000));
        date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
if (getCookie('welcome-popup1-disable') != 'true') {
    var delayTime = parseInt($('.homepage_welcome_popup').attr('data-popup-open-delay')) * 1000;
    setTimeout(function(){
    $(".homepage_welcome_popup").modal({
        fadeDuration: 100,
        showClose: false
    });
    $("#popupClose").on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        $('.jquery-modal').hide();
        setCookie("home-welcome-popup-disable", "true", 365);
        $('body').css('overflow', 'scroll');
    });
    }, delayTime); 
}