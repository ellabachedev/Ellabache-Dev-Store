var winWidth = $(window).width();
    if(winWidth <= 768){
      $('.collection-blocks-x3 .mobile-slider').slick({
        dots: false,
        arrows:false,
        infinite: false,
        speed: 300,
        autoplay:false,
        pauseOnFocus: false,
        centerMode: true,
        centerPadding: '70px',
      });
      var slideItemNo = $(".collection-blocks-x3 .mobile-slider .slide-item").length - 1,
        slideProgressInterval = 100/slideItemNo;
        var x = 0;
      $(".collection-blocks-x3 .mobile-slider .slide-item").each(function(){
        var progressintervalWidth =  (slideProgressInterval * x).toFixed(2);
        $(this).attr('data-progress-bar', progressintervalWidth);
        x++;
      });
      $('.collection-blocks-x3 .mobile-slider').on('afterChange', function(event, slick, currentSlide, nextSlide){
        var activeSliderProgressWidth = $('.collection-blocks-x3 .slick-current').attr('data-progress-bar');
        $(".collection-blocks-x3 .mobile-slider + .indicator-line .progress").css('width', activeSliderProgressWidth + '%');
      }); 
    }