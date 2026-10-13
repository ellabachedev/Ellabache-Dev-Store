$('div.accordion-block div.item div.header').on('click', function () {
if ($(this).hasClass('is-open')) {
    $(this).removeClass('is-open').next('div.content').stop().slideUp();
} else {
    $(this).parents('div.accordion-block').find('div.item div.header').removeClass('is-open').next('div.content').stop().slideUp();
    $(this).addClass('is-open').next('div.content').stop().slideDown();
}
});