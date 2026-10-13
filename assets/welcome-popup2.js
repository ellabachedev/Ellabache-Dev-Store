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
var lambdaMiddlewareModeStr = $('.welcome_popup_dotdigital').attr('data-lambda-mode'); // METAFIELD Lambda/Middleware Test/Live Mode
var lambdaBaseURL = 'https://jml6ygobnj.execute-api.ap-southeast-2.amazonaws.com';
if(lambdaMiddlewareModeStr == "Test"){
    lambdaBaseURL = 'https://jml6ygobnj.execute-api.ap-southeast-2.amazonaws.com';
}else if(lambdaMiddlewareModeStr == "Live"){
    lambdaBaseURL = 'https://axitw7b5ed.execute-api.ap-southeast-2.amazonaws.com';
}else{
    lambdaBaseURL = 'https://jml6ygobnj.execute-api.ap-southeast-2.amazonaws.com';
}

function isValidEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
// Check if a cookie exists to determine if it's the second visit
const visitCount = parseInt(getCookie('visitCount')) || 0;
if (visitCount < 1) {
    // This is the user's second visit
    // Show the popup
    if (getCookie('welcome-popup-dotdigital-disable') != 'true') {
        var delayTime = parseInt($('.welcome_popup_dotdigital').attr('data-popup-open-delay')) * 1000;
        // $(window).one('scroll', function(){
            
        // });
        setTimeout(function () {
            $(".welcome_popup_dotdigital").modal({
                fadeDuration: 100,
                showClose: false
            });
            $("#popupDotdigitalClose").on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                $('.jquery-modal').hide();
                setCookie("welcome-popup-dotdigital-disable", "true", 7);
                $('body').css('overflow', 'scroll');
            });
        }, delayTime);
    }
  }
// Increment the visit count and set a cookie to track the visit
setCookie('visitCount', visitCount + 1, 7);

// if (!window.util.getCookie("welcome-popup-dotdigital-disable")) {
    
// }

$('.welcome_popup_dotdigital #popUpSubscribe').on('click', function(e){
    e.preventDefault();

    $('.welcome_popup_dotdigital').append('<div class="inline-loader"></div>');
    $('.welcome_popup_dotdigital #popUpSubscribe').prop('disabled', true);
    $('.form-field-error').remove();
    $('.welcome_popup_dotdigital .newsletter__form-message').remove();

    var cusName = $('.welcome_popup_dotdigital #fName').val();
    var cusEmail = $('.welcome_popup_dotdigital #Email').val();

    var hasFormError = false;

    // Validate Name
    if( cusName.trim() == '' ){
    $('.welcome_popup_dotdigital #fName').parent().append('<p class="form-field-error">This is a required field.</p>');
    hasFormError = true;
    }

    // Validate Email
    var emailEmpty = false;
    var emailInvalid = false;
    if( cusEmail.trim() == '' ){
    $('.welcome_popup_dotdigital #Email').parent().append('<p class="form-field-error">This is a required field.</p>');
    emailEmpty = true;
    }
    if( emailEmpty == false && !isValidEmail(cusEmail.trim()) ){
    $('.welcome_popup_dotdigital #Email').parent().append('<p class="form-field-error">Please enter a valid email.</p>');
    emailInvalid = true;
    }
    if(emailEmpty == true || emailInvalid == true){
    hasFormError = true;
    }

    if(hasFormError == false){
        var subscribeData = {};
        subscribeData.name = $('.welcome_popup_dotdigital #fName').val();
        subscribeData.email = $('.welcome_popup_dotdigital #Email').val();

        $.ajax({
            method: "POST",
            url: lambdaBaseURL + '/ddcontactcheck',
            dataType: 'json',
            data: subscribeData,
            async: true,
            success: function (res){
                if( res.status == "success" ){
                    console.log('Success Res Success');
                    console.log(res);
                    //$('.welcome_popup_dotdigital .subscription-form div.header').append('<div class="newsletter__form-message"><h4>'+res.message+'</h4></div>');
                    $('.welcome_popup_dotdigital .subscription-form div.header').append('<div class="newsletter__form-message"><h4 class="form-success">You are now subscribed to our newsletter. Please check your inbox for your $20 Voucher*</h4></div>');
                    window.util.setCookie("welcome-popup-dotdigital-disable", true, 7);
                }else{
                    console.log('Success Res Error');
                    console.log(res);
                    //$('.welcome_popup_dotdigital .subscription-form div.header').append('<div class="newsletter__form-message"><h4 class="form-error">'+res.message+'</h4></div>');
                    $('.welcome_popup_dotdigital .subscription-form div.header').append('<div class="newsletter__form-message"><h4 class="form-error">You are already subscribed to our Ella Baché newsletter</h4></div>');
                }
            },
            error: function (err){
                console.log('Error Res Error');
                console.log(err);
                //$('.welcome_popup_dotdigital .subscription-form div.header').append('<div class="newsletter__form-message"><h4 class="form-error">Something went wrong trying to subscribe to our newsletter. Please try again later.</h4></div>');
                $('.welcome_popup_dotdigital .subscription-form div.header').append('<div class="newsletter__form-message"><h4 class="form-error">Something went wrong trying to subscribe. Please try again.</h4></div>');
            },
            complete: function (resData){
                $('.inline-loader').remove();
                $('.welcome_popup_dotdigital #popUpSubscribe').prop('disabled', false);
                subscribeData = {};
            }
        });
    }else{
        $('.inline-loader').remove();
        $('.welcome_popup_dotdigital #popUpSubscribe').prop('disabled', false);
    }
});
var winWidth = $(window).width();
if(winWidth <= 480){
  $(".welcome_popup_dotdigital #fName").attr('placeholder', '');
  $(".welcome_popup_dotdigital #Email").attr('placeholder', '');
}