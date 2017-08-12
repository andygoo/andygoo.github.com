$(document).on('mousemove', function(e){
    $('.repulse').css({
       left:  e.pageX,
       top:   e.pageY
    });
});