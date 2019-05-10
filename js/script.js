$(document).ready(function(){
	$(".owl-carousel").owlCarousel({
		items: 1,
		loop: true,
		autoplay: true,
		autoplayTimeout: 3000
	});
//
// 	$(".btn-nav").on("click", function () {
// 		let target = $(this).data("target");
// 		let headline = $(this).data("headline");
// 		$(headline).toggleClass("main-headline");
// 		$(target).toggleClass("header__menu--open")
// 	})
});

window.onload = function () {

	// Class Intro to get Intro params
	class Intro {
		static getObject() {
			return document.querySelector('.back1');
		}

		static getHeight() {
			return Intro.getObject().clientHeight;
		}
	}


	// Class WindowElem to create scroll listener
	class WindowElem {
		constructor() {
			window.addEventListener('scroll', this.windowOffset.bind(this));
		}

		windowOffset() {
			return window.pageYOffset;
		}
	}


	// Class Header adds a toggle to switch the class "fixed"
	class UpArrow extends WindowElem {
		getObject() {
			return document.querySelector('.up-arrow');
		}

		addClassHide() {
			this.getObject().classList.add('hide');
		}

		removeClassHide() {
			this.getObject().classList.remove('hide');
		}

		windowOffset() {
			this.fixHeader(super.windowOffset());
		}

		fixHeader(windowOffset) {
			let offset = Intro.getHeight()/2;
			if (windowOffset >= offset) this.removeClassHide();
			else this.addClassHide();
		}
	}



	class HeaderTop {
		constructor() {
			this.headerElem = document.querySelector('.header__top');
			this.headerElem.addEventListener('click', this.onClick.bind(this));
		}

		getHeaderMenu() {
			return  this.headerElem.querySelector('.header__menu');
		}

		navButton() {
			let headerMenu = this.getHeaderMenu();
			headerMenu.classList.toggle('header__menu--open');
		}

		scrollToTarget(dataScroll) {
			window.scrollTo({
				top: document.querySelector(dataScroll).offsetTop,
				behavior: "smooth"
			})
		}

		onClick(evt) {
			evt.preventDefault();
			let target = evt.target;
			while (target !== this.headerElem) {
				let dataAction = target.dataset.action,
					dataScroll = target.dataset.scroll;
				if (dataAction) this[dataAction]();
				if (dataScroll) this.scrollToTarget(dataScroll);

				target = target.parentElement;
			}
		}

	}

	new WindowElem();
	new UpArrow();
	new HeaderTop();


	function upArrow() {
		let arrowObject = document.querySelector('.up-arrow');

		arrowObject.addEventListener('click', evt => {
			evt.preventDefault();
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
			arrowObject.classList.toggle('hide');
		})
	}

	upArrow();


	let miniSlider1 = multiItemSlider('.miniSlider1', {
		isCycling: true,
		dots: true,
		interval: 2000,
		pause: false,
		dotsPause: true
	});

};