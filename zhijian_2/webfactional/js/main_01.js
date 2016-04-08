$(document).ready(function(){
	$('.fixed-nav-wrapper, #about, #team').localScroll({duration:1500});

	$('.cn-logo-oneline').addClass('slideleft');
	$('.fixed-nav-wrapper').addClass('hidden');

	$(window).bind('scroll',function(){

		var vPos = $(window).scrollTop();
		var topHeight = $(window).height();
		var firstHeight = $('.fixed-nav-wrapper').outerHeight();
		var aboutHeight = $('#about').outerHeight();
		var teamHeight = $('#team-slide').outerHeight();
		var totalHeight = aboutHeight + teamHeight + topHeight -60;
		console.log("totalHeight = " + totalHeight + " vPos = "+vPos);


		if ((vPos > totalHeight-teamHeight) && (vPos <= totalHeight)) {
			$('.fixed-background-image').removeClass('sofa-half-chair');
			$('.fixed-background-image').removeClass('chair');
			$('.fixed-background-image').removeClass('chair-half-cushion');
			$('.fixed-background-image').removeClass('cushion');
			$('.logo-overlay').addClass('hideslide');
			$('.fixed-background-image').addClass('chair');
			console.log("chair");
		} else if ((vPos > totalHeight) && (vPos <= totalHeight+(topHeight*.45))) {
			console.log("chair-half-cushion");
			$('.fixed-background-image').removeClass('sofa-half-chair');
			$('.fixed-background-image').removeClass('chair');
			$('.fixed-background-image').removeClass('chair-half-cushion');
			$('.fixed-background-image').removeClass('cushion');
			$('.logo-overlay').addClass('hideslide');
			$('.fixed-background-image').addClass('chair-half-cushion');
		} else if (vPos > totalHeight+(topHeight*.45)) {
			console.log("cushion");
			$('.fixed-background-image').removeClass('sofa-half-chair');
			$('.fixed-background-image').removeClass('chair');
			$('.fixed-background-image').removeClass('chair-half-cushion');
			$('.fixed-background-image').removeClass('cushion');
			$('.logo-overlay').addClass('hideslide');
			$('.fixed-background-image').addClass('cushion');
		} else {
			$('.logo-overlay').removeClass('hideslide');
			$('.fixed-background-image').removeClass('sofa-half-chair');
			$('.fixed-background-image').removeClass('chair');
			$('.fixed-background-image').removeClass('chair-half-cushion');
			$('.fixed-background-image').removeClass('cushion');
		}

		$('input').click(function(){
			$(this).val('');
			$(this).css('color','black');
		});

		$('.contact-form-description textarea').click(function(){
			$(this).html('');
			$(this).css('color','black');
		});

		if ((vPos >= (topHeight/2-30))&&(vPos < (topHeight-60))) {
			$('.fixed-nav-wrapper').addClass('hidden');
			$('.cn-logo-oneline').removeClass('slideleft');
			$('.centered-content-wrapper').addClass('disablescroll');
		} else if (vPos >= (topHeight-60)) {
			$('.fixed-nav-wrapper').removeClass('hidden');

		} else {
			$('.fixed-nav-wrapper').addClass('hidden');
			$('.cn-logo-oneline').addClass('slideleft');
			$('.centered-content-wrapper').removeClass('disablescroll');
		}
	});
});