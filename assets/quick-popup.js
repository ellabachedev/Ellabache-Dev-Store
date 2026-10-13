jQuery(document).ready(function($){
    $('a.btn-quick-view').magnificPopup({
        type: 'inline',
        midClick: true,
        mainClass: 'mfp-fade',
        fixedContentPos: true,
        callbacks: {
            open: function () {
                var magnificPopup = $.magnificPopup.instance,
                    clickedDOM = magnificPopup.st.el;
                $(document).trigger('quickviewopen', [clickedDOM]);
            },
            close: function () {
                $('#quickView .content form.add-to-cart .quantity').val(1);
                $('#quickView .content form.add-to-cart .qty-up').off('mouseup');
                $('#quickView .content form.add-to-cart .qty-down').off('mouseup');
            }
        }
    });
$(document).on('quickviewopen', function(e, clickedDOM){
var productId = clickedDOM.attr('data-product-id');
var productTitle = clickedDOM.attr('data-product-title');
var productHandle = clickedDOM.attr('data-product-handle');
var productQty = parseInt(clickedDOM.attr('data-product-quantity'));
var productImage = clickedDOM.attr('data-product-image');
var productImagesStr = clickedDOM.attr('data-product-images');
var productPrice = clickedDOM.attr('data-product-price');
var productCompareAtPrice = clickedDOM.attr('data-product-compareatprice');
var productHasCompareAtPrice = parseInt(clickedDOM.attr('data-product-hascompareatprice'));
var productWPrice = clickedDOM.attr('data-w-product-price');
var variantId = clickedDOM.attr('data-variant-id');
var variantSku = clickedDOM.attr('data-variant-sku');
var variantQty = parseInt(clickedDOM.attr('data-variant-quantity'));
var variantTitle = clickedDOM.attr('data-variant-title');
var productGlobalSize = clickedDOM.attr('data-product-globalsize');
var productDesc = clickedDOM.attr('data-product-desc');
var productCollectionHandles = clickedDOM.attr('data-collection-handles');
var isEligiable = parseInt(clickedDOM.attr('data-eligiable'));
var isFreesample = parseInt(clickedDOM.attr('data-freesample'));
var productAvailable = parseInt(clickedDOM.attr('data-product-available'));
var variantsCount = parseInt(clickedDOM.attr('data-variants-count'));
var defaultVariantId = clickedDOM.attr('data-defaultvariantid');
var variantsStr = clickedDOM.attr('data-variants');
var addToCartTextDefault = clickedDOM.attr('data-addtocart-text');
var uniqueCollection = clickedDOM.attr('data-unique-collection');

var variantsproductImagesHtml = '<div class="gallery-for">';
    var variantsproductImagesThumbHtml = '<div class="gallery-nav">';
        var productImagesStrArr = productImagesStr.split('|#|');
        $.each(productImagesStrArr, function(i, productImageStr){
    var productImageArr = productImageStr.split('|');
        var imageSrc = productImageArr[0];
        var imageUrl = productImageArr[1];
        var imageUrlThumb = productImageArr[2];

        variantsproductImagesHtml += '<div class="item">';
            variantsproductImagesHtml += '<img src="' + imageUrl + '" data-src="' + imageSrc + '" data-url="' + imageUrl + '" data-urlthumb="' + imageUrlThumb + '" loading="lazy" alt="">';
                variantsproductImagesHtml += '</div>';

        variantsproductImagesThumbHtml += '<div class="item">';
            variantsproductImagesThumbHtml += '<img src="' + imageUrlThumb + '" data-src="' + imageSrc + '" data-url="' + imageUrl + '" data-urlthumb="' + imageUrlThumb + '" loading="lazy" alt="">';
                variantsproductImagesThumbHtml += '</div>';
});
        variantsproductImagesHtml += '</div>';
    variantsproductImagesThumbHtml += '</div>';
$('#quickView .product-image-gallery-slider').html(variantsproductImagesHtml + variantsproductImagesThumbHtml);
$('.mfp-content .gallery-for').slick({
    slidesToShow: 1,
slidesToScroll: 1,
arrows: false,
fade: true,
lazyLoad: 'ondemand',
asNavFor: '.gallery-nav'
    });
$('.mfp-content .gallery-nav').slick({
    slidesToShow: 3,
slidesToScroll: 1,
asNavFor: '.gallery-for',
dots: false,
focusOnSelect: true,
centerMode: false,
centerPadding: '0',
variableWidth: true,
prevArrow: '<button type="button" class="slick-prev"></button>',
nextArrow: '<button type="button" class="slick-next"></button>'
    });

    var cartAddClaims = [{id:variantId, properties:{_collection_handles:productCollectionHandles, _eligiable:isEligiable, _freesample: isFreesample}, quantity: 1}];
    cartAddClaimsStr = JSON.stringify(cartAddClaims);
    $('button#quickview-addtocart').attr('data-cart-addclaims', cartAddClaimsStr);

var variantsHtml = '';
if( variantsCount > 1 ){
    var variantStrArr = variantsStr.split('|#|');
variantsHtml += '<select class="variant-dropdown">';
    $.each(variantStrArr, function(i, variantStr){
    var variantArr = variantStr.split('|');
    var varId = variantArr[0];
    var varTitle = variantArr[1];
    var varPrice = variantArr[2];
    var varImageSrc = variantArr[3];
    var varImageUrl = variantArr[4];
    var varImageUrlThumb = variantArr[5];
    var varAvailable = parseInt(variantArr[6]);
    var varSelected = parseInt(variantArr[7]);
    var addToCartText = variantArr[8];
    var varCompareAtPrice = variantArr[9];
    var varHasCompareAtPrice = parseInt(variantArr[10]);
    variantsHtml += '<option value="' + varId + '" data-variant-id="' + varId + '" data-variant-price="' + varPrice + '" data-variant-imgsrc="' + varImageSrc + '" data-variant-imgurl="' + varImageUrl + '" data-variant-imgurlthumb="' + varImageUrlThumb + '" data-variant-price="' + varPrice + '" data-variant-compareatprice="' + varCompareAtPrice + '" data-variant-hascompareatprice="' + varHasCompareAtPrice + '" data-addtocart-text="' + addToCartText + '" data-available="' + varAvailable + '" data-selected="' + varSelected + '" ';
    if(varSelected > 0){
        variantsHtml += 'selected="selected" ';
    }
    if(varAvailable < 1){
        //variantsHtml += 'disabled="disabled" ';
    }
    variantsHtml += '>';
    variantsHtml += varTitle;
    variantsHtml += '</option>';
    });
variantsHtml += '</select>';
}


$('#quickView .add_to_wishlist').attr('data-w-variant-quantity', variantQty);
$('#quickView .add_to_wishlist').attr('data-w-variant-sku', variantSku);
$('#quickView .add_to_wishlist').attr('data-w-variant-title', variantTitle);
$('#quickView .add_to_wishlist').attr('data-w-product-handle', productHandle);
$('#quickView .add_to_wishlist').attr('data-w-product-title', productTitle);
$('#quickView .add_to_wishlist').attr('data-w-quantity', productQty);
$('#quickView .add_to_wishlist').attr('data-w-product-image', productImage);
$('#quickView .add_to_wishlist').attr('data-w-product-price', productWPrice);
$('#quickView .add_to_wishlist').attr('data-w-variant-id', variantId);
$('#quickView .add_to_wishlist').attr('data-w-product-id', productId);

$('#quickView .content .title').text(productTitle);
$('#quickView .content .vairant').text(productGlobalSize);
$('#quickView .content .description p').text(productDesc);
if (productPrice == '$0.00') {
    $('div.quick-view-popup .review').hide();
    $('div.quick-view-popup .price').hide();
    $('div.quick-view-popup .add-to-cart').hide();
    $('div.quick-view-popup .add_to_wishlist').hide();
} else {
    $('div.quick-view-popup .review').show();
    $('div.quick-view-popup .price').show();
    $('div.quick-view-popup .add-to-cart').show();
    $('div.quick-view-popup .add_to_wishlist').show();
}
if (productAvailable == 0) {
    $('div.quick-view-popup .add_to_wishlist').hide();
}
$('#quickView .content .review').html(clickedDOM.parents('.img-wrapper').siblings('#productInfos-' + uniqueCollection + '-' + productId).find('#productReviewBadge-' + uniqueCollection + '-' + productId).html());
$('#quickView .content .afterpayWrap').html(clickedDOM.parents('.img-wrapper').siblings('#productInfos-' + uniqueCollection + '-' + productId).find('#afterpayBadge-' + uniqueCollection + '-' + productId).html());
if (productHasCompareAtPrice > 0) {
$('#quickView .content .price').html('<span>' + productPrice + '</span><div class="was-price"><s>' + productCompareAtPrice + '</s></div>');
} else {
$('#quickView .content .price').html('<span>' + productPrice + '</span>');
}
$('#quickView .content form.add-to-cart .collection-handles').val(productCollectionHandles);
$('#quickView .content form.add-to-cart .is-eligiable').val(isEligiable);
$('#quickView .content form.add-to-cart .is-freesample').val(isFreesample);
$('#quickView .content form.add-to-cart .add-id').val(defaultVariantId);
$('#quickView .content form.add-to-cart .select-variant').html(variantsHtml);
$('#quickView .content form.add-to-cart .quantity').val(1);
$('#quickView .content form.add-to-cart .btn-addtocart button').text(addToCartTextDefault);
if (productAvailable == 1) {
$('#quickView .content form.add-to-cart .btn-addtocart button').prop('disabled', false);
$('#quickView .content form.add-to-cart .quantity-control').css('display', 'block');
} else {
$('#quickView .content form.add-to-cart .btn-addtocart button').prop('disabled', true);
$('#quickView .content form.add-to-cart .quantity-control').css('display', 'none');
}

$('#quickView .content form.add-to-cart .qty-down').off().on('mouseup', function () {
var currQty = parseInt($('#quickView .content form.add-to-cart .quantity').val());
var qty = currQty;
if (currQty <= 1) {
    qty = 1;
} else {
    qty -= 1;
}
$('#quickView .content form.add-to-cart .quantity').val(qty);
// Quanity update in data-cart-addclaims attribute ------------------------------
var cartAddClaimsStr = $('button#quickview-addtocart').attr('data-cart-addclaims');
    var cartAddClaims = JSON.parse(cartAddClaimsStr);
    cartAddClaims[0].quantity = $('#quickView .content form.add-to-cart .quantity').val();
    cartAddClaimsStr = JSON.stringify(cartAddClaims);
    $('button#quickview-addtocart').attr('data-cart-addclaims', cartAddClaimsStr);
});
$('#quickView .content form.add-to-cart .qty-up').off().on('mouseup', function () {
var currQty = parseInt($('#quickView .content form.add-to-cart .quantity').val());
var qty = currQty;
qty += 1;
$('#quickView .content form.add-to-cart .quantity').val(qty);
// Quanity update in data-cart-addclaims attribute ------------------------------
var cartAddClaimsStr = $('button#quickview-addtocart').attr('data-cart-addclaims');
    var cartAddClaims = JSON.parse(cartAddClaimsStr);
    cartAddClaims[0].quantity = $('#quickView .content form.add-to-cart .quantity').val();
    cartAddClaimsStr = JSON.stringify(cartAddClaims);
    $('button#quickview-addtocart').attr('data-cart-addclaims', cartAddClaimsStr);
});
$('#quickView .content form.add-to-cart .quantity').off().on('keyup', function () {
var currQty = parseInt($('#quickView .content form.add-to-cart .quantity').val());
var qty = currQty;
if (currQty <= 1) {
    qty = 1;
}
$('#quickView .content form.add-to-cart .quantity').val(qty);
// Quanity update in data-cart-addclaims attribute ------------------------------
var cartAddClaimsStr = $('button#quickview-addtocart').attr('data-cart-addclaims');
    var cartAddClaims = JSON.parse(cartAddClaimsStr);
    cartAddClaims[0].quantity = $('#quickView .content form.add-to-cart .quantity').val();
    cartAddClaimsStr = JSON.stringify(cartAddClaims);
    $('button#quickview-addtocart').attr('data-cart-addclaims', cartAddClaimsStr);
});


if ($('#quickView .content form.add-to-cart .select-variant .variant-dropdown').length > 0) {
$(document).on('change', '#quickView form.add-to-cart .select-variant .variant-dropdown', function(){
    var selectedAvailable = parseInt($(this).children("option:selected").attr('data-available'));
    var selectedPrice = $(this).children("option:selected").attr('data-variant-price');
    var selectedCompareAtPrice = $(this).children("option:selected").attr('data-variant-compareatprice');
    var selectedHasCompareAtPrice = parseInt($(this).children("option:selected").attr('data-variant-hascompareatprice'));
    var selectedAddtocartText = $(this).children("option:selected").attr('data-addtocart-text');
    if (selectedHasCompareAtPrice > 0) {
        $('#quickView .content .price').html('<span>' + selectedPrice + '</span><div class="was-price"><s>' + selectedCompareAtPrice + '</s></div>');
    } else {
        $('#quickView .content .price').html('<span>' + selectedPrice + '</span>');
    }
    var selectedId = $(this).children("option:selected").val();
    var selectedImgSrc = $(this).children("option:selected").attr('data-variant-imgsrc');
    $('#quickView .content form.add-to-cart .add-id').val(selectedId);
    $('#quickView .content form.add-to-cart .btn-addtocart button').text(selectedAddtocartText);
    if (selectedAvailable == 1) {
        $('#quickView .content form.add-to-cart .btn-addtocart button').prop('disabled', false);
        $('#quickView .content form.add-to-cart .quantity-control').css('display', 'block');
    } else {
        $('#quickView .content form.add-to-cart .btn-addtocart button').prop('disabled', true);
        $('#quickView .content form.add-to-cart .quantity-control').css('display', 'none');
    }
    $('#quickView .product-image-gallery-slider .gallery-nav .item img').each(function () {
        var imgSrc = $(this).attr('data-src');
        var sliderIndex = parseInt($(this).parents('.item').attr('data-slick-index'));
        if (imgSrc == selectedImgSrc) {
            $('.mfp-content .gallery-for').slick('slickGoTo', sliderIndex);
        }
    });
    // Variant ID update in data-cart-addclaims attribute ------------------------------
    var cartAddClaimsStr = $('button#quickview-addtocart').attr('data-cart-addclaims');
        var cartAddClaims = JSON.parse(cartAddClaimsStr);
        var selectedVariantId = $(".variant-dropdown option:selected").attr("data-variant-id");
        cartAddClaims[0].id = selectedVariantId;
        cartAddClaimsStr = JSON.stringify(cartAddClaims);
        $('button#quickview-addtocart').attr('data-cart-addclaims', cartAddClaimsStr);
});

$('#quickView .product-image-gallery-slider .gallery-nav .item img').on('click', function () {
    var selectedImgSrc = $(this).attr('data-src');
    $('#quickView .content form.add-to-cart .select-variant .variant-dropdown option').each(function () {
        var imgSrc = $(this).attr('data-variant-imgsrc');
        if (imgSrc == selectedImgSrc) {
            var selectedAvailable = parseInt($(this).attr('data-available'));
            var selectedPrice = $(this).attr('data-variant-price');
            var selectedCompareAtPrice = $(this).attr('data-variant-compareatprice');
            var selectedHasCompareAtPrice = parseInt($(this).attr('data-variant-hascompareatprice'));
            var selectedAddtocartText = $(this).attr('data-addtocart-text');
            var selectVal = $(this).val();
            $('#quickView .content form.add-to-cart .select-variant .variant-dropdown').val(selectVal);
            if (selectedAvailable == 1) {
                $('#quickView .content form.add-to-cart .btn-addtocart button').prop('disabled', false);
                $('#quickView .content form.add-to-cart .quantity-control').css('display', 'block');
            } else {
                $('#quickView .content form.add-to-cart .btn-addtocart button').prop('disabled', true);
                $('#quickView .content form.add-to-cart .quantity-control').css('display', 'none');
            }
            if (selectedHasCompareAtPrice > 0) {
                $('#quickView .content .price').html('<span>' + selectedPrice + '</span><div class="was-price"><s>' + selectedCompareAtPrice + '</s></div>');
            } else {
                $('#quickView .content .price').html('<span>' + selectedPrice + '</span>');
            }
            $('#quickView .content form.add-to-cart .add-id').val(selectVal);
            $('#quickView .content form.add-to-cart .btn-addtocart button').text(selectedAddtocartText);
        }
    });
});
}
});
});