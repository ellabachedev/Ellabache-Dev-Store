var bs_slick_config = {
  slidesToShow: 4,
  slidesToScroll: 4,
  arrows: true,
  adaptiveHeight: true,
  dots: false,
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
}
$(document).ready(function(){
  $('.best-sellers-carousel .carousel-item.active').slick({
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: true,
    adaptiveHeight: true,
    dots: false,
    responsive: [
      {
      breakpoint: 1400,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4
      }
    },
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
window.addEventListener('load', function () {
// add tabs functionality
  $(".best-sellers-control a").on('click', function (e) {
    e.preventDefault();
    var me = $(this);
    me.siblings().removeClass('active');
    me.addClass('active');
    var tabTarget = me.data('tab-target');
    var $tagTargetContent = $('[data-tab-content="' + tabTarget + '"]');
    $tagTargetContent.siblings().hide();
    $tagTargetContent.fadeIn(500);
    // unslick any existing 
    try {
      $("[data-tab-content]").slick('unslick');
    } catch (e) {
      // no slick exists yet
    }
    // add slider for current active slide
    $tagTargetContent.slick(bs_slick_config);
  });
});