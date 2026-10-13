$(document).ready(function () {
  let quizData = {};
  function getRadioValue(name) {
    let radios = document.getElementsByName(name);
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
         let value = radios[i].getAttribute('dd_value');
        return value;
      }
    }
    //return null;
  }
  //name, email, and DOB
  document.getElementById('next-1').addEventListener('click', function() {
    quizData.name = document.getElementById('answer_name').value;
    quizData.email = document.getElementById('answer_email').value;
    quizData.dob = getAge(document.getElementById('answer_3_0').value).dob;
  });

  // Answer of question 1
  document.getElementById('next-2').addEventListener('click', function() {
    let answer1 = getRadioValue('answer_1');
    if (answer1) {
      quizData.skin_concern = answer1;
    }
  });

  // Answer of question 2
  document.getElementById('next-3').addEventListener('click', function() {
    let answer2 = getRadioValue('answer_2');
    if (answer2) {
      quizData.skin_type = answer2;
    }
  });

  // Answer of question 3
  document.getElementById('next-4').addEventListener('click', function() {
    let answer4 = getRadioValue('answer_4');
    if (answer4) {
      quizData.skin_exposure = answer4;
    }
  });

  // Answer of question 4
  document.getElementById('next-5').addEventListener('click', function() {
    let answerPregnant = getRadioValue('answer_pregnant');
    if (answerPregnant) {
      quizData.pregnant = answerPregnant;
      console.log('t' + quizData);
    }
  });
  $("#submitAnswers").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(".slide_6 input[type='radio']").each(function () {
      var name = $(this).attr("name");
      if ($(".slide_6 input[type='radio']").is(':checked') > 0) {
        // Show the overlay immediately
       // $("#halterOverlay").addClass('show');
        const spinnerHTML = `
        <span class="spinner">
          <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z"></path>
          </svg>
        </span>
      `;
      setTimeout(function(){

      }, 1000);
      $(".slide_6").append(spinnerHTML);
        // Initialize product handles arrays
        quizData.productHandlesMorning = [];
        quizData.productHandlesEvening = [];
        quizData.productHandlesWeekly = [];
        allToCart = [];
        $("#submitAnswers").attr('aria-busy', 'true');
        $(".quiz-slider").slick("slickNext");
        var skin_goal_answer = "";
        var spend_answer = "";
        var spend_product = "";
        var skin_type_text = "";
        var weeklyArray = [];
        var mainArray = {};
        let subArray = [];
        var finalArray = {};
        var productHandles = [];
        var productHandlesEvening = [];
        let msg = "";
        let pregnant = "no";
        let allergy = "no";
        $("#morning").empty();
        $("#evening").empty();
        $("#para").empty();
        $("#weekly").empty();
        let age_group = "";
        const eveningArray = [];
        const morningArray = [];
        let ans_name = $("#answer_name").val();
        let ans_email = $("#answer_email").val();
        mainArray['name'] = ans_name;
        mainArray['email'] = ans_email;
        //alert("hellow");
        var dob = $("#answer_3_0").val();
        if (dob == "") {
          msg = "Please Enter your date of birth";
        }
        ageobj = getAge(dob);
        age = ageobj.age;
        dobymd = ageobj.dob;
        if (age < 40) {
          age_group = "under";
        } else if (age >= 40) {
          age_group = "over";
        }
        if ($("#answer_allergy_yes").prop("checked") || $("#answer_pregnant_yes").prop("checked")) {
          msg = "Visit your local salon for personalized solution";
          if ($("#answer_allergy_yes").prop("checked")) {
            allergy = "yes";
          }
          if ($("#answer_pregnant_yes").prop("checked")) {
            pregnant = "yes";
          }
        }
        mainArray["pregnant"] = pregnant;
        mainArray["allergy"] = allergy;
        $(".answers").each(function (index) {
          if ($(this).prop("checked")) {
            if ($(this).attr('name') == "answer_1") {
              skin_goal_answer = $(this).attr('dd_value');
            } else if ($(this).attr('name') == "answer_2") {
              var type_answer = $(this).attr('dd_value');
              if (type_answer == "Normal") {
                skin_type_text = "<p>The cleanser, exfoliant and mask will assist in maintaining your balanced skin while providing that healthy glow.</p>";
              } else {
                skin_type_text = "<p>The cleanser, exfoliant and mask will assist in balancing, restoring and supporting the strength of your skin.</p>";
              }
            } else if ($(this).attr('name') == "answer_4") {
              spend_answer = $(this).attr('dd_value');
            }
            let classA = $(this).attr('id');
            let subArray1 = {};
            subArray1["key"] = $(this).attr('dd_key');
            subArray1["value"] = $(this).attr('dd_value');
            subArray.push(subArray1);
            //finalArray["data"] = mainArray;
            console.log(JSON.stringify(finalArray));
            $("." + classA).each(function (index) {
              itemPush = {};
              let id_product_div = $(this).attr('id');
              let split_id_product = id_product_div.split("_");
              if (split_id_product[2] == age_group) {
                if (split_id_product[0] == "Care") {
                  //alert("Hello")
                  spend_product = $(this).html();
                }
                if (split_id_product[1] == "Weekly1" || split_id_product[1] == "Weekly2") {
                  weeklyArray.push($(this).html());
                }
                if (split_id_product[1] == "AM") {
                  itemPush[split_id_product[0]] = [$(this).html()];
                  productHandles.push($(this).html());
                  morningArray.push(itemPush);
                } else if (split_id_product[1] == "PM") {
                  if (split_id_product[0] == "Cleanser") {
                    itemPush[split_id_product[0]] = [$(this).html() + " (2 times)"];
                  } else {
                    itemPush[split_id_product[0]] = [$(this).html()];
                  }
                  productHandlesEvening.push($(this).html());
                  eveningArray.push(itemPush);
                }
              }
            });
          }
        });
        mainArray['qa'] = subArray;
        console.log("Evening Routine " + eveningArray);
        try {
          $("#morning").append("<div class='title'><p>your morning</p><h3>Skin Routine</h3></div>");
          $("#morning").append("<div class='flex-container'></div>");
          var arrayLength = morningArray.length;
          for (var i = 0; i < arrayLength; i++) {
            let arr = morningArray[i];
            const keys = Object.keys(arr);
            keys.forEach((key, index) => {
              $("#morning div.flex-container").append("<div class='item item" + i + "'></div>");
              $("#morning div.flex-container div.item" + i).append("<span class='count'>" + (i + 1) + "</span>");
              $("#morning div.flex-container div.item" + i).append("<div class='p_svg'></div>");
              //$("#morning div.flex-container div.item" + i).append("<h4>" + key + "</h4>");
              let sublength = arr[key].length;
              for (var j = 0; j < sublength; j++) {
                var myArray = arr[key][j].split(" ");
                var link = myArray[0];
                console.log("link" + link);
                var t = $('[data-handle="' + link + '"]').attr("data-quantity");
                var ajaxProduct = null;
                // Make the first AJAX request
                const response1 = $.ajax({
                  url: 'https://www.ellabache.com.au/products/' + link + '.js',
                  dataType: 'json',
                  async: false,
                  success: function (product) {
                    var productTitle = product.title;
                    $("#morning div.flex-container div.item" + i).append("<h4>" + productTitle + "</h4>");
                    // Check if image URL exists
                    if (product && product.featured_image) {
                      // Convert featured_image to CDN format and apply size
                      var imageUrl = product.featured_image;
                     console.log('id' + product.id);
                     console.log('product' , product);
                      
                      // Shopify images typically start with //cdn.shopify.com
                      if (imageUrl.startsWith("//")) {
                        imageUrl = "https:" + imageUrl;
                      }
                
                      // Inject the size modifier before the extension, e.g., _200x
                      var smallImageUrl = imageUrl.replace(/(\.(jpg|jpeg|png|webp|gif))(\?.*)?$/, '_200x$1');
                
                      var featuredImg = "<img src='" + smallImageUrl + "' alt=''>";
                      $("#morning div.flex-container div.item" + i + " div.p_svg").append(featuredImg);
                      if( t > 0){
                        allToCart.push({
                          id: product.variants[0].id.toString(),
                          quantity: '1'
                        })
                      }
                      
                      quizData.productHandlesMorning.push({
                          title: product.title,
                          handle: product.handle,
                          image_url: smallImageUrl,
                          url: product.url,
                          price: product.price,
                          price_money: moneyFilter(product.price),
                          price_money_raw: moneyFilterRaw(product.price)
                      });
                    }
                    ajaxProduct = product;
                  }
                
                });

                var productAddClaims = [{id: ajaxProduct.variants[0].id.toString(), quantity: '1' }];
                if(t > 0){
                  $("#morning div.flex-container div.item" + i).append("<a class='cart' data-cart-addclaims='"+ JSON.stringify(productAddClaims) +"' target='_blank' href='javascript:void(0)'>Add </a>");
                }
                else{
                  $("#morning div.flex-container div.item" + i).append("<a class='cart' target='_blank' href='#'>Sold Out </a>");
                }
                
              }
            });
          }
          $("#para").append("<h3><span>Your personalised</span> <span>skin solution</span></h3>");
          $("#para").append("<p>We’ve carefully curated a homecare Skin Solution to help you target your concerns. The Active Serum and Moisture Protective combination will help address your concerns around <span>" + skin_goal_answer + "<span>. </p>");
          $("#para").append(skin_type_text);
          function formatProductName(str) {
            return str
              .split("-")
              .map(word =>
                /^[a-z]+[0-9]+$/i.test(word)
                  ? word.toUpperCase()          // spf50 → SPF50
                  : word.charAt(0).toUpperCase() + word.slice(1)
              )
              .join(" ");
          }
          const spend_product = "active-face-great-spf50-lotion";
          const result = formatProductName(spend_product);
          $("#para").append("<p>The final step to your morning routine is an SPF, you spend time <span>" + spend_answer + "</span> <br>so we have selected the <span>" + result + "</span>, a cult favourite.</p>");
          $("#para").append("<div class='down-arrow hide-desktop'></div>");
          $("#para .down-arrow").on("click", function(){
            var productRecTop = $(".product-recomendation").offset().top;
            $(".recommendation-content").animate({scrollTop: productRecTop }, 500);
          });
          var arrayLengthWeekly = weeklyArray.length;
          // alert(weeklyArray.length);
          $("#weekly").append("<div class='title'><p>your weekly</p><h3>Boosters</h3</div>");
          $("#weekly").append("<div class='flex-container'></div>");
          for (var i = 0; i < arrayLengthWeekly; i++) {
            $("#weekly div.flex-container").append("<div class='item item" + i + "'></div>");
            $("#weekly div.flex-container div.item" + i).append("<span class='count'>" + (i + 1) + "</span>");
            $("#weekly div.flex-container div.item" + i).append("<div class='p_svg'></div>");
            // if (i == 0) {
            //   $("#weekly div.flex-container div.item" + i).append("<h4>Exfoliant</h4>");
            // } else {
            //   $("#weekly div.flex-container div.item" + i).append("<h4>Mask</h4>");
            // }
            var myArray = weeklyArray[i].split(" ");
            var link = myArray[0];
            var t = $('[data-handle="' + link + '"]').attr("data-quantity");
            var ajaxProduct = null;
            // Make the second AJAX request
            const response2 = $.ajax({
              url: 'https://www.ellabache.com.au/products/' + link + '.js',
              dataType: 'json',
              async: false,
              success: function (product) {
                
                var productTitle = product.title;
                $("#weekly div.flex-container div.item" + i).append("<h4>" + productTitle + "</h4>");
                // Check if image URL exists
                if (product && product.featured_image) {
                  // Convert featured_image to CDN format and apply size
                  var imageUrl = product.featured_image;
                  
                  // Shopify images typically start with //cdn.shopify.com
                  if (imageUrl.startsWith("//")) {
                    imageUrl = "https:" + imageUrl;
                  }
            
                  // Inject the size modifier before the extension, e.g., _200x
                  var smallImageUrl = imageUrl.replace(/(\.(jpg|jpeg|png|webp|gif))(\?.*)?$/, '_200x$1');
            
                  var featuredImg = "<img src='" + smallImageUrl + "' alt=''>";
                  $("#weekly div.flex-container div.item" + i + " div.p_svg").append(featuredImg);
                  if( t > 0){
                    allToCart.push({
                      id: product.variants[0].id.toString(),
                      quantity: '1'
                    })
                  }
                  quizData.productHandlesWeekly.push({
                      title: product.title,
                      handle: product.handle,
                      image_url: smallImageUrl,
                      url: product.url,
                      price: product.price,
                      price_money: moneyFilter(product.price),
                      price_money_raw: moneyFilterRaw(product.price)
                  });
                }
                ajaxProduct = product;
              }
            });
            $("#weekly div.flex-container div.item" + i).append("<p class='hidden'>" + weeklyArray[i] + "</p>");
            //$("#weekly div.flex-container div.item" + i).append("<a class='cart' target='_blank' href='https://ellabache.com.au/products/" + link + "'>Add</a>");
            var productAddClaims = [{id: ajaxProduct.variants[0].id.toString(), quantity: '1' }];
              if(t > 0){
                $("#weekly div.flex-container div.item" + i).append("<a class='cart' data-cart-addclaims='"+ JSON.stringify(productAddClaims) +"' target='_blank' href='javascript:void(0)'>Add </a>");
              }
              else{
                $("#weekly div.flex-container div.item" + i).append("<a class='cart' target='_blank' href='#'>Sold Out </a>");
              }
          }
          $("#evening").append("<div class='title'><p>your evening</p><h3>Skin Routine</h3></div>");
          $("#evening").append("<div class='flex-container'></div>");
          var arrayLength = eveningArray.length;
          for (var i = 0; i < arrayLength; i++) {
            let arr = eveningArray[i];
            const keys = Object.keys(arr);
            keys.forEach((key, index) => {
              $("#evening div.flex-container").append("<div class='item item" + i + "'></div>");
              $("#evening div.flex-container div.item" + i).append("<span class='count'>" + (i + 1) + "</span>");
              $("#evening div.flex-container div.item" + i).append("<div class='p_svg'></div>");
              //$("#evening div.flex-container div.item" + i).append("<h4>" + key + "</h4>");
              let sublength = arr[key].length;
              for (var j = 0; j < sublength; j++) {
                var myArray = arr[key][j].split(" ");
                var link = myArray[0];
                var t = $('[data-handle="' + link + '"]').attr("data-quantity");
                var ajaxProduct = null;
                // Make the third AJAX request
                const response3 = $.ajax({
                  url: 'https://www.ellabache.com.au/products/' + link + '.js',
                  dataType: 'json',
                  async: false,
                  success: function (product) {
                    var productTitle = product.title;
                    $("#evening div.flex-container div.item" + i).append("<h4>" + productTitle + "</h4>");
                    // Check if image URL exists
                    if (product && product.featured_image) {
                      // Convert featured_image to CDN format and apply size
                      var imageUrl = product.featured_image;
                      
                      // Shopify images typically start with //cdn.shopify.com
                      if (imageUrl.startsWith("//")) {
                        imageUrl = "https:" + imageUrl;
                      }
                
                      // Inject the size modifier before the extension, e.g., _200x
                      var smallImageUrl = imageUrl.replace(/(\.(jpg|jpeg|png|webp|gif))(\?.*)?$/, '_200x$1');
                
                      var featuredImg = "<img src='" + smallImageUrl + "' alt=''>";
                      $("#evening div.flex-container div.item" + i + " div.p_svg").append(featuredImg);

                     if( t > 0){
                        allToCart.push({
                          id: product.variants[0].id.toString(),
                          quantity: '1'
                        })
                      }

                      quizData.productHandlesEvening.push({
                          title: product.title,
                          handle: product.handle,
                          image_url: smallImageUrl,
                          url: product.url,
                          price: product.price,
                          price_money: moneyFilter(product.price),
                          price_money_raw: moneyFilterRaw(product.price)
                      });
                    }
                     ajaxProduct = product;
                    
                  }
                });
                 var productAddClaims = [{id: ajaxProduct.variants[0].id.toString(), quantity: '1' }];
                if(t > 0){
                  $("#evening div.flex-container div.item" + i).append("<a class='cart' data-cart-addclaims='"+ JSON.stringify(productAddClaims) +"' target='_blank' href='javascript:void(0)'>Add </a>");
                }
                else{
                  $("#evening div.flex-container div.item" + i).append("<a class='cart' target='_blank' href='#'>Sold Out </a>");
                }
              }
            });
          }
          $("#halterOverlay").removeClass('show');
          var checkAllAddToCart = $("#addEverthingToCart2").length;
          if(checkAllAddToCart < 1){
            console.log("teee" + JSON.stringify(allToCart));
            $(".product-recomendation").append("<div><button id='addEverthingToCart2' data-cart-addclaims='"+ JSON.stringify(allToCart) +"' class='btn btn-primary' style='margin: 20px auto 0 auto; display:block; max-width:250px;font-size:12px; padding:10px 20px;' href='#'>Add All to Cart</button></div>");
          }
          
        } catch (error) {
          // Handle any errors that occurred during AJAX requests
          console.error("AJAX error: " + error);

          // Hide the overlay in case of an error
          $("#halterOverlay").removeClass('show');
        }
        console.log(productHandles);
        console.log(productHandlesEvening);
        // Answer of question 5
        let answerAllergy = getRadioValue('answer_allergy');
        if (answerAllergy) {
          quizData.allergy = answerAllergy;
        }
        // Save product handles to quizData
        //quizData.productHandlesMorning = productHandles;
        //quizData.productHandlesEvening = productHandlesEvening;
        console.log('Quiz Data:', quizData);
        mainArray['morning_handles'] = productHandles;
        mainArray['evening_handles'] = productHandlesEvening;
        window.scrollTo(0, 0);
        if (msg == "") {
          $("#para").show();
          $("#morning").show();
          $("#evening").show();
          $("#weekly").show();
        } else {
          $(".recommendation-content").hide();
          $("#morning").hide();
          $("#evening").hide();
          $("#para").hide();
          $("#weekly").hide();
          //alert(msg);
          $(".thankyou").show();
        }
      } else {
        $(".slide_6 label.inputs-radio").addClass('error');
        $(".slide_6 label.inputs-radio").addClass('shake');
        return false;
      }
      
    });
    quizData.productHandlesMorning = Object.assign({}, quizData.productHandlesMorning);
    quizData.productHandlesEvening = Object.assign({}, quizData.productHandlesEvening);
    quizData.productHandlesWeekly = Object.assign({}, quizData.productHandlesWeekly);
    sendRequest("https://hook.us1.make.com/2i6aw5ccsg8gflixq1vpxv7ujdkivgca", quizData);
    //sendRequest("https://1pht9q5z62.execute-api.ap-southeast-2.amazonaws.com/skin-profiler", mainArray);
    setTimeout(function(){
      $(".slide_6 label.inputs-radio").removeClass('shake');
    }, 600);
    
  });
});
var currentTab = 0; // Current tab is set to be the first tab (0)
function nextPrev(n) {
  if (n == '1') {
    // Exit the function if any field in the current tab is invalid:
    //if (!validateForm()) //return false;
    $(".quiz-slider").slick("slickNext");
  }
  if (n == '-1') {
    $(".quiz-slider").slick("slickPrev");
  }
  currentTab = currentTab + n;
}
// Validate Email
const email = document.getElementById("answer_email");
email.addEventListener("blur", () => {
  let regex = /^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/;
  let s = email.value;
  if (regex.test(s)) {
    email.classList.remove("error");
    emailError = true;
  } else {
    email.classList.add("error");
    email.classList.add('shake');
    emailError = false;
  }
});
$("#next-1").on('click', function () {
  const nameField = $("#answer_name").val(),
    emailField = $("#answer_email").val(),
    dobField = $("#answer_3_0").val();
  let regex = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
  let s = email.value;
  if (nameField != '' && emailField != '' && regex.test(s) && dobField != '') {
    nextPrev(1);
    document.querySelectorAll(".product-meta").forEach(function (el) {
    const handle = el.dataset.handle;
    if (!handle) return;

    fetch("https://www.ellabache.com.au/api/2023-10/graphql.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": "963694489c287fb5faade72e4aa3d119"
      },
      body: JSON.stringify({
        query: `
          query {
            product(handle: "${handle}") {
              variants(first: 1) {
                edges {
                  node {
                    quantityAvailable
                  }
                }
              }
            }
          }
        `
      })
    })
    .then(res => res.json())
    .then(data => {
      const qty = data?.data?.product?.variants?.edges?.[0]?.node?.quantityAvailable;
      if (typeof qty === "number") {
        el.setAttribute("data-quantity", qty);
        //console.log(`Set quantity for ${handle}: ${qty}`);
      } else {
        //console.warn(`Quantity not found for ${handle}`);
        el.setAttribute("data-quantity", "unknown");
      }
    })
    .catch(err => {
      //console.error(`Error fetching quantity for ${handle}:`, err);
      el.setAttribute("data-quantity", "error");
    });
  });
  } else {
    if (nameField == '') {
      $("#answer_name").addClass('error');
      $("#answer_name").addClass('shake');
    }
    if (emailField == '') {
      $("#answer_email").addClass('error');
      $("#answer_email").addClass('shake');
    }
    if (dobField == '') {
      $("#answer_3_0").addClass('error');
      $("#answer_3_0").addClass('shake');
    }
  }
  setTimeout(function(){
    $("#answer_name").removeClass('shake');
    $("#answer_email").removeClass('shake');
    $("#answer_3_0").removeClass('shake');
  }, 600);
});
$("#prev").on('click', function(){
  nextPrev(-1);
});
$(".quiz-slider").on('afterChange', function(event, slick, currentSlide){
    if (currentSlide === 0) {
      $("#prev").hide();
    }
      else if (currentSlide === 6){
       $("#prev").hide();
        $(".modal-close").on('click', function(){
          window.location.reload();
        });
    } else {
      $("#prev").show();
    }
  });
$("#answer_name").keyup(function () {
  $(this).removeClass('error');
});

$("#answer_3_0").change(function () {
  $(this).removeClass('error');
});
$("#next-2").on('click', function () {
  $(".slide_2 input[type='radio']").each(function () {
    var name = $(this).attr("name");
    if ($(".slide_2 input[type='radio']").is(':checked') > 0) {
      nextPrev(1);
    } else {
      $(".slide_2 label.inputs-radio").addClass('error');
      $(".slide_2 label.inputs-radio").addClass('shake');
    }
  });
  setTimeout(function(){
    $(".slide_2 label.inputs-radio").removeClass('shake');
  }, 600);
});
$(".slide_2 label.inputs-radio").on('click', function () {
  if ($(this).find("input[type='radio']").is(':checked')) {
    $(".slide_2 label.inputs-radio").removeClass('error');
  }
});
$("#next-3").on('click', function () {
  $(".slide_3 input[type='radio']").each(function () {
    var name = $(this).attr("name");
    if ($(".slide_3 input[type='radio']").is(':checked') > 0) {
      nextPrev(1);
    } else {
      $(".slide_3 label.inputs-radio").addClass('error');
      $(".slide_3 label.inputs-radio").addClass('shake');
    }
  });
  setTimeout(function(){
    $(".slide_3 label.inputs-radio").removeClass('shake');
  }, 600);
});
$(".slide_3 label.inputs-radio").on('click', function () {
  if ($(this).find("input[type='radio']").is(':checked')) {
    $(".slide_3 label.inputs-radio").removeClass('error');
  }
});
$("#next-4").on('click', function () {
  $(".slide_4 input[type='radio']").each(function () {
    var name = $(this).attr("name");
    if ($(".slide_4 input[type='radio']").is(':checked') > 0) {
      nextPrev(1);
    } else {
      $(".slide_4 label.inputs-radio").addClass('error');
      $(".slide_4 label.inputs-radio").addClass('shake');
    }
  });
  setTimeout(function(){
    $(".slide_4 label.inputs-radio").removeClass('shake');
  }, 600);
});
$(".slide_4 label.inputs-radio").on('click', function () {
  if ($(this).find("input[type='radio']").is(':checked')) {
    $(".slide_4 label.inputs-radio").removeClass('error');
  }
});
$("#next-5").on('click', function () {
  $(".slide_5 input[type='radio']").each(function () {
    var name = $(this).attr("name");
    if ($(".slide_5 input[type='radio']").is(':checked') > 0) {
      nextPrev(1);
    } else {
      $(".slide_5 label.inputs-radio").addClass('error');
      $(".slide_5 label.inputs-radio").addClass('shake');
    }
  });
  setTimeout(function(){
    $(".slide_5 label.inputs-radio").removeClass('shake');
  }, 600);
});
$(".slide_5 label.inputs-radio").on('click', function () {
  if ($(this).find("input[type='radio']").is(':checked')) {
    $(".slide_5 label.inputs-radio").removeClass('error');
  }
});
function getAge(date) {
  var dtArr = null;
  if(date.includes('/')){
    dtArr = date.split('/');
  }else if(date.includes('-')){
    dtArr = date.split('-');
  }
  if(dtArr == null){
    return false;
  }else{
    var dd = dtArr[0];
    var mm = dtArr[1];
    var yy = dtArr[2];
    var dateYMD = yy + '-' + mm + '-' + dd;
    var startDate = new Date(dateYMD);
    var diffDate = new Date(new Date() - startDate);
    return {"dob": dateYMD, "age": diffDate.toISOString().slice(0, 4) - 1970};
  }
}
function sendRequest(url, requestData) {
  console.log("DATA for request is");
  console.log(JSON.stringify(requestData));
  $.ajax({
    url: url,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      alert("Thank You!");
    },
    data: JSON.stringify(requestData)
  });
}
const openButton = document.getElementById("block-button_quiz");
const modal = document.getElementById("go-to-modal");
const closeButton = modal.querySelector(".modal-close");

// Open modal
openButton.addEventListener("click", function (e) {
  e.preventDefault();
  $("body, html").scrollTop(0);
  $("body").css("overflow", "hidden");
  modal.style.display = "flex";
  $(".quiz-slider").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    infinite: false,
    swipe: false,
    fade: true,
    adaptiveHeight: true,
    autoplay: false,
    vertical: false
  });
  var currentYear = new Date().getFullYear();
  $("#answer_3_0").datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: "dd-mm-yy",
    maxDate: "-1d",
    yearRange: '1930:+ currentYear +'
  });
});

// Close on close button
closeButton.addEventListener("click", function () {
  modal.style.display = "none";
  $("body").css("overflow", "inherit");
});

// Close on clicking outside the modal content
modal.addEventListener("click", function (e) {
  if (e.target === modal) {
    modal.style.display = "none";
    $("body").css("overflow", "inherit");
  }
});