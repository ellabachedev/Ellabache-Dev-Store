function addEventListenerStamped(el, eventName, handler) {
  if (el.addEventListener) {
    el.addEventListener(eventName, handler);
  } else {
    el.attachEvent("on" + eventName, function () {
      handler.call(el);
    });
  }
}
// Listening for reviews widget loaded event
addEventListenerStamped(document, "stamped:reviews:loaded", function (e) {
  console.log(e);
  var reviewsLength = $("#stamped-reviews-tab .stamped-review").length;
  if (reviewsLength < 1) {
    var reviewButton = $(".stamped-header .stamped-summary-actions").html();
    $(".stamped-content .stamped-messages").append(reviewButton);
    $(".stamped-header .stamped-summary-actions").remove();
  }
  setTimeout(function () {
    var appendedTitle = $("div.stamped-widget h2.main-title").length;
    if (appendedTitle < 1) {
      $("div.stamped-widget").prepend("<h2 class='main-title'>Reviews</h2>");
    }
    $("div.stamped-reviews .stamped-review").each(function () {
      $(this)
        .find("div.stamped-review-body h3.stamped-review-header-title .created")
        .remove();
      var startRatings = $(this)
        .find(".stamped-review-header span.stamped-starratings")
        .html();
      var ratingDate = $(this)
        .find(".stamped-review-header div.created")
        .html();
      var t = $(this).find(
        "div.stamped-review-body .stamped-starratings"
      ).length;
      if (t < 1) {
        $(this)
          .find("div.stamped-review-body")
          .prepend(
            "<span class='stamped-starratings stamped-review-header-starratings'>" +
              startRatings +
              "</span>"
          );
      }
      var t1 = $(this).find("div.stamped-review-body .created").length;
      if (t1 < 1) {
        $(this)
          .find("div.stamped-review-body h3.stamped-review-header-title")
          .after("<div class='created'>" + ratingDate + "</div>");
      }

      var stampedHeaderInfo = $('<div class="info"></div>');
      $(this)
        .find(".stamped-review-header .created")
        .appendTo(stampedHeaderInfo);
      $(this)
        .find(".stamped-review-header .author")
        .appendTo(stampedHeaderInfo);
      $(this)
        .find(".stamped-review-header .stamped-verified-badge")
        .appendTo(stampedHeaderInfo);
      $(this)
        .find(".stamped-review-header .review-location")
        .appendTo(stampedHeaderInfo);
      $(this)
        .find(".stamped-review-header .stamped-starratings")
        .appendTo(stampedHeaderInfo);
      $(this)
        .find(".stamped-review-header .stamped-review-avatar")
        .after(stampedHeaderInfo);
    });
    // Create a new div
    var stampedSummarFlexContainer = $(
      ".stamped-summary .flex-container"
    ).length;
    if (stampedSummarFlexContainer < 1) {
      var newDiv = $('<div class="flex-container"></div>');
      $(".stamped-summary-ratings").appendTo(newDiv);
      $(".summary-overview").appendTo(newDiv);
      $(".stamped-summary-actions").appendTo(newDiv);
      $(".stamped-summary").prepend(newDiv);
    }
    //
    var stampedSummarAddReview = $(".stamped-summary .add-review").length;
    if (stampedSummarAddReview < 1) {
      var newDiv2 = $(
        "<div class='add-review'><h3>Review This Product</h3><img width='195' height='34' src='https://cdn.shopify.com/s/files/1/0119/6028/7313/files/Frame_1000002262.png?v=1704382943' alt='star'><p>Adding a review will require a valid email for verification</p></div>"
      );
      newDiv.append(newDiv2);
      var t = $(".stamped-summary-actions-newreview").attr("onclick");
      $("div.add-review").attr("onclick", t);
    }
    $(".stamped-filter-selects .stamped-filter-select").each(function () {
      var filterDurationTxt = $(this).find("option:first-child").text();
      if (filterDurationTxt == "How long have you been using this product?") {
        $(this).find("option:first-child").text("Duration of use");
      }
    });
  }, 100);

  //
  //   var productTitle = $("div.stamped-widget").attr("data-product-title");
  //   var aggregateRatingValue = $("div.stamped-widget").attr(
  //     "data-aggregateRatingValue"
  //   );
  //   var aggregateReviewCount = $("div.stamped-widget").attr(
  //     "data-aggregateReviewCount"
  //   );
  //   var productData = {
  //     "@context": "https://schema.org",
  //     "@type": "Product",
  //     name: productTitle,
  //     aggregateRating: {
  //       "@type": "AggregateRating",
  //       ratingValue: aggregateRatingValue,
  //       reviewCount: aggregateReviewCount,
  //     },
  //     review: [], // Initialize an array to store reviews
  //   };

  //   $("div.stamped-reviews div.stamped-review").each(function () {
  //     var reviewer = $(this).find("strong.author").text();
  //     var reviewRating = $(this).attr("data-rating");
  //     var reviewDate = $(this).find("div.created").text();
  //     var reviewDesc = $(this).find("p.stamped-review-content-body").text();

  //     // Construct each review object and push it into the reviews array
  //     var review = {
  //       "@type": "Review",
  //       author: {
  //         "@type": "Person",
  //         name: reviewer,
  //       },
  //       reviewRating: {
  //         "@type": "Rating",
  //         ratingValue: reviewRating,
  //       },
  //       datePublished: reviewDate,
  //       reviewBody: reviewDesc,
  //     };
  //     productData.review.push(review); // Push the constructed review object into the array
  //   });

  //   // Convert the productData object to JSON
  //   var jsonLD = JSON.stringify(productData);
  //   console.log(jsonLD);

  //   // Create a <script> tag to contain the JSON-LD data
  //   let scriptTag = document.createElement("script");
  //   debugger;
  //   scriptTag.type = "application/ld+json";
  //   scriptTag.text = jsonLD;

  //   let widgetDiv = document.querySelector("div.widget");
  //   widgetDiv.parentNode.insertBefore(scriptTag, widgetDiv.nextSibling);

  //
});
jQuery(document).ready(function ($) {
  var stampedReviewFormMod = function () {
    if ($(".productReviewsBlock")) {
      var eachReview = $(".productReviewsBlock").find(".stamped-review");
      for (var x = 0; x < eachReview.length; x++) {
        var verifiedBadge = $(eachReview[x]).find(".verified-badge");
        if (verifiedBadge.length > 0) {
          $(eachReview[x]).find(".created").addClass("created-on-top");
        }
      }

      var eachRecommendation = $(".productReviewsBlock").find(
        'li[data-value="would-you-recommend-this-product"]'
      );
      for (var y = 0; y < eachRecommendation.length; y++) {
        var ifRecommended = $(eachRecommendation[y]).find(
          'span[data-value="yes"]'
        );
        if (ifRecommended.length > 0) {
          $(eachRecommendation[y])
            .parent()
            .append(
              '<li class="recommendLabel"><strong>Yes,</strong> <span>I recommend this product.</span></li>'
            );
        }
      }

      // Converting radio questions to dropdowns
      var radioQuestions = $(".stamped-form-custom-questions").find(
        '.stamped-form-custom-question[data-type="radio"]'
      );
      for (var x = 0; x < radioQuestions.length; x++) {
        var questionName = $(radioQuestions[x])
          .find("label:first-child")
          .attr("class");
        if (
          $(radioQuestions[x]).find("label:first-child").text() ==
          "How likely are you to recommend Ella Baché to a friend?"
        ) {
          $(radioQuestions[x]).addClass("rateSelector");
          $(radioQuestions[x]).find(".customRatingSelectorContainer").remove();
          $(radioQuestions[x]).append(
            '<div class="customRatingSelectorContainer"><ul class="customRatingSelector"></ul><div class="rateBottomText"><span class="leftText">Not Likely</span><span class="rightText">Most Likely</span></div></div>'
          );
          var questionSelection = $(radioQuestions[x]).find(
            "label:not(:first-child)"
          );
          for (var y = 0; y < questionSelection.length; y++) {
            var optionText = $(questionSelection[y]).find("span");
            var optionValue = $(questionSelection[y]).find(
              'input[type="radio"]'
            );
            $(radioQuestions[x])
              .find(".customRatingSelector")
              .append(
                '<li><a href=# data-custom-dropdown-name="' +
                  questionName +
                  '">' +
                  $(optionValue).val() +
                  "</a></li>"
              );
          }
        } else {
          $(radioQuestions[x]).find(".customDropdownContainer").remove();
          $(radioQuestions[x]).append(
            '<div class="customDropdownContainer"><select class="customDropdown" data-custom-dropdown-name="' +
              questionName +
              '"></select></div>'
          );
          $(radioQuestions[x])
            .find(".customDropdown")
            .append("<option selected disabled>Select</option>");
          var questionSelection = $(radioQuestions[x]).find(
            "label:not(:first-child)"
          );
          for (var y = 0; y < questionSelection.length; y++) {
            var optionText = $(questionSelection[y]).find("span");
            var optionValue = $(questionSelection[y]).find(
              'input[type="radio"]'
            );
            $(radioQuestions[x])
              .find(".customDropdown")
              .append(
                '<option value="' +
                  $(optionValue).val() +
                  '">' +
                  $(optionText[0]).text() +
                  "</option>"
              );
          }
        }
      }

      // Convert 'Do you recommend this product' question into a select
      if ($(".stamped-form-review-recommend")) {
        var recommendQuestion = $(".stamped-form-review-recommend");
        recommendQuestion.addClass("stamped-form-custom-questions");
        recommendQuestion.attr("data-type", "radio");
        $(recommendQuestion).find(".customDropdownContainer").remove();
        $(recommendQuestion).append(
          '<div class="customDropdownContainer"><select class="customDropdown"></select></div>'
        );
        $(recommendQuestion)
          .find(".customDropdown")
          .append("<option selected disabled>Select</option>");
        $(recommendQuestion)
          .find(".customDropdown")
          .append('<option value="true">Yes</option>');
        $(recommendQuestion)
          .find(".customDropdown")
          .append('<option value="false">No</option>');
        $(".stamped-form-review-recommend .customDropdown").change(function () {
          $(".stamped-form-review-recommend")
            .find('input[type="radio"]')
            .filter('[value="' + $(this).val() + '"]')
            .prop("checked", true);
        });
      }

      // Adding Cancel Button
      var submitReviewButton = $(".productReviewsBlock").find(
        "#stamped-button-submit"
      );
      var closeFormButton =
        '<a href="#" class="stamped-summary-cancel-form" onclick="StampedFn.toggleForm(&quot;review&quot;,&quot;1381023842353&quot;);return false">Cancel</a>';
      $(".productReviewsBlock").find(".stamped-summary-cancel-form").remove();
      $(submitReviewButton).after(closeFormButton);

      $(".customDropdown").change(function () {
        $(
          'input[type="radio"][name="' +
            $(this).attr("data-custom-dropdown-name") +
            '"]'
        )
          .filter('input[value="' + $(this).val() + '"]')
          .prop("checked", true);
      });

      $(".customRatingSelector").on("click", "a", function () {
        $(".customRatingSelector")
          .find("a.selectedRate")
          .removeClass("selectedRate");
        $(this).addClass("selectedRate");
        $(
          'input[type="radio"][name="' +
            $(this).attr("data-custom-dropdown-name") +
            '"]'
        )
          .filter('input[value="' + $(this).text() + '"]')
          .prop("checked", true);
        return false;
      });
    }
  };

  $(document).on("stamped:reviews:loaded", function () {
    stampedReviewFormMod();
  });

  if ($(".stamped-container").length) {
    stampedReviewFormMod();
  }
});
