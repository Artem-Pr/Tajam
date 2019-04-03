$(document).ready(function(){
	$(".owl-carousel").owlCarousel({
		items: 1,
		loop: true,
		autoplay: true,
		autoplayTimeout: 3000
	});

	$(".btn-nav").on("click", function () {
		let target = $(this).data("target");
		let headline = $(this).data("headline");
		$(headline).toggleClass("main-headline");
		$(target).toggleClass("header__menu--open")
	})
});