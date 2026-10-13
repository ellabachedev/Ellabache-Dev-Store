// var bs_slick_config = {
//   slidesToShow: 5,
//   slidesToScroll: 5,
//   arrows: true,
//   dots: false,
//   responsive: [
//   {
//     breakpoint: 1100,
//     settings: {
//       slidesToShow: 4,
//       slidesToScroll: 4
//     }
//   },
//   {
//     breakpoint: 991,
//     settings: {
//       slidesToShow: 3,
//       slidesToScroll: 3
//     }
//   },
//   {
//     breakpoint: 767,
//     settings: {
//       slidesToShow: 2,
//       slidesToScroll: 2
//     }
//   }
//   ]
// }

$(".best-sellers-carousel .carousel-item").each(function(){
  $(this).slick({
    slidesToShow: 5,
    slidesToScroll: 5,
    arrows: true,
    dots: false,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
    ]
  });
});
// add tabs functionality
// $(".best-sellers-control a").on('click', function(e){
//   e.preventDefault();
//   var me = $(this);
//   me.siblings().removeClass('active');
//   me.addClass('active');
//   var tabTarget = me.data('tab-target');
//   var $tagTargetContent = $('[data-tab-content="'+ tabTarget + '"]');
//   $tagTargetContent.siblings().hide();
//   $tagTargetContent.fadeIn(500);
//   // unslick any existing 
//   try {
//     $("[data-tab-content]").slick('unslick'); 
//   } catch (e){
//     // no slick exists yet
//   }
//   // add slider for current active slide
//   $tagTargetContent.slick(bs_slick_config);
// });
// // Defer Bestseller Carousel  -------------------------------
// function offscrnTarget_bestseller_carousel(){
//   if($('.bestseller_slider_loaded').length<1){
//     var targetPosition_top = $('#bestSellers div.product-listing').offset().top;
//     var winScrollposition = $(window).scrollTop();
//     var winHt = $(window).height();
//     if(targetPosition_top - winHt < winScrollposition){
//       $('#bestSellers').addClass('bestseller_slider_loaded');
//       $("[data-tab-content]").slick(bs_slick_config);
//     }
//   }
// }
// offscrnTarget_bestseller_carousel();