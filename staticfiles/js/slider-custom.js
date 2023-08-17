// planogram thumnail slider


jQuery(function ($) {

  $('.modal').on('shown.bs.modal', function (e) {
     $('.slider-for').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: '.slider-nav',
      draggable: false,
    });
    $('.slider-nav').slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      asNavFor: '.slider-for',
      arrows: true,
      dots: false,
      centerMode: false,
      focusOnSelect: true
    });
  
  })
  
});
