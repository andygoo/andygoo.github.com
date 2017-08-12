$('.face-img').each(function(i){
  $(this).bind({
    mouseenter : function(){
      $('.desc-face').eq(i).addClass('desc-face-hover');
      $('.more-desc').eq(i).addClass('more-desc-hover');
    },
    mouseleave : function(){
      $('.desc-face').eq(i).removeClass('desc-face-hover');
      $('.more-desc').eq(i).removeClass('more-desc-hover');
    }
  });
});