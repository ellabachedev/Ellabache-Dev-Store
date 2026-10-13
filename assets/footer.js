// Footer Nav Accordion in Mobile viewport -------------------------------
var winWidth = $(window).width();
if (winWidth <= 600) {
  $("footer .menu-row .col-item h3.title").on("click", function () {
    if ($(this).hasClass("is-open")) {
      $(this).removeClass("is-open");
      $(this).next("ul.footer-nav__items").stop().slideUp();
    } else {
      $("footer .menu-row .col-item h3.title").removeClass("is-open");
      $("footer .menu-row .col-item h3.title")
        .next("ul.footer-nav__items")
        .stop()
        .slideUp();
      $(this).addClass("is-open");
      $(this).next("ul.footer-nav__items").stop().slideDown();
    }
  });
}
// if (winWidth < 769) {
//     // Select the target node
// var targetNode = document;
// var config4 = { childList: true, subtree: true };
// var callback4 = function (mutationsList, observer) {
//   for (var mutation of mutationsList) {
//     console.log("Mutation detected:", mutation);
//     if (mutation.type === "childList") {
//       var targetElement = document.getElementById(
//         "ddg-launcher-frame-container"
//       );
//       if (targetElement) {
//         console.log(
//           "The element #ddg-launcher-frame-container has been added to the DOM."
//         );
//         debugger;
//         var footerBannerHeight = $(".footer-banner").height();
//         $("#ddg-launcher-frame-container").css(
//           "margin-bottom",
//           footerBannerHeight - 10
//         );
//         // Perform any actions you want here
//         //observer.disconnect();
//       }
//     }
//   }
// };
// var observer4 = new MutationObserver(callback4);
// observer4.observe(targetNode, config4);

// }
