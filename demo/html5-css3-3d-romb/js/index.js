/*
Wont work in IE because of lack of transform-style: preserve3d support.
*/
$(".js-toggle-spin").on("click",function(){
  $(".js-romb").toggleClass("spin");
});