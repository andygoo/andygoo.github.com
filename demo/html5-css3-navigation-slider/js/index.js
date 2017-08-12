$(function(){
		
		var sliderInterval = setInterval(function() {
     		nextImg();
		}, 7000);
		
		$('.nav-arrow').click(function(){
			if($(this).attr('id') == 'arrow-left'){
				prevImg();
			}else{
				nextImg();
			}
			
			clearInterval(sliderInterval);
			
		});
		
		$('#dots li').click(function(){
			var thisIndex = $(this).index()
			
			if(thisIndex < $('#dots li.active').index()){
				prevDot(thisIndex);
			}else if(thisIndex > $('#dots li.active').index()){
				nextDot(thisIndex);
			}
			
			$('#dots li.active').removeClass('active');
			$(this).addClass('active');
			
			clearInterval(sliderInterval);
			
		});
	})
	
	function prevImg(){
		var curIndex = $('#image-slider li.active-img').index();
		
		if(curIndex == 0){
			$('#image-slider li:last-child').addClass('next-img').animate({
				left: 0
			}, function(){
				$('#image-slider li.active-img').removeClass('active-img').css('left', '-923px');
				$('#image-slider li.next-img').attr('class', 'active-img');
				
				var nextIndex = $('#image-slider li.active-img').index();
				
				$('#dots li.active').removeClass('active');
				$('#dots li').eq(nextIndex).addClass('active');
			});
		}else{
			$('#image-slider li.active-img').prev().addClass('next-img').animate({
				left: 0
			}, function(){
				$('#image-slider li.active-img').removeClass('active-img').css('left', '-923px');
				$('#image-slider li.next-img').attr('class', 'active-img');
				
				var nextIndex = $('#image-slider li.active-img').index();
				
				$('#dots li.active').removeClass('active');
				$('#dots li').eq(nextIndex).addClass('active');
			});
		}
	}
	
	function nextImg(){
		var curIndex = $('#image-slider li.active-img').index();
		
		if(curIndex == $('#image-slider li').length - 1){
			$('#image-slider li:first-child').addClass('next-img').css('left', 923).animate({
				left: 0
			}, function(){
				$('#image-slider li.active-img').removeClass('active-img').css('left', '-923px');
				$('#image-slider li.next-img').attr('class', 'active-img');
				
				var nextIndex = $('#image-slider li.active-img').index();
				
				$('#dots li.active').removeClass('active');
				$('#dots li').eq(nextIndex).addClass('active');
			});
		}else{
			$('#image-slider li.active-img').next().addClass('next-img').css('left', 923).animate({
				left: 0
			}, function(){
				$('#image-slider li.active-img').removeClass('active-img').css('left', '-923px');
				$('#image-slider li.next-img').attr('class', 'active-img');
				
				var nextIndex = $('#image-slider li.active-img').index();
				
				$('#dots li.active').removeClass('active');
				$('#dots li').eq(nextIndex).addClass('active');
			});
		}
	}
	
	function prevDot(newIndex){
		$('#image-slider li').eq(newIndex).addClass('next-img').animate({
			left: 0
		}, function(){
			$('#image-slider li.active-img').removeClass('active-img').css('left', '-923px');
			$('#image-slider li.next-img').attr('class', 'active-img');
		});
	}
	
	function nextDot(newIndex){
		$('#image-slider li').eq(newIndex).addClass('next-img').css('left', 923).animate({
			left: 0
		}, function(){
			$('#image-slider li.active-img').removeClass('active-img').css('left', '-923px');
			$('#image-slider li.next-img').attr('class', 'active-img');
		});
	}