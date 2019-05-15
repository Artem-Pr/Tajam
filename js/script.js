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
			let offset = Intro.getHeight() / 2;
			if (windowOffset >= offset) this.removeClassHide();
			else this.addClassHide();
		}
	}


	// Class HeaderTop shows, hides nav menu and implements smooth scrolling
	class HeaderTop {
		constructor() {
			this.headerElem = document.querySelector('.header__top');
			this.headerElem.addEventListener('click', this.onClick.bind(this));
		}

		getHeaderMenu() {
			return this.headerElem.querySelector('.header__menu');
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


	class Gallery {
		constructor() {
			this.gallery = document.querySelector('.our-works__gallery');
			this.gallery.addEventListener('click', this.onClick.bind(this));
		}

		onClick(evt) {
			evt.preventDefault();
			this.target = evt.target;
			if (this.target.classList.contains('our-works__overlay')) {
				modal.showPicture(this.target);
			}
		}

		nextTarget() {
			let parent = this.target.parentElement;
			if (parent.nextElementSibling)
				this.target = parent.nextElementSibling.querySelector('.our-works__overlay');
			else this.target = parent.parentElement.firstElementChild.querySelector('.our-works__overlay');
			modal.imgLoad(this.target);
		}

		previousTarget() {
			let parent = this.target.parentElement;
			if (parent.previousElementSibling)
				this.target = parent.previousElementSibling.querySelector('.our-works__overlay');
			else this.target = parent.parentElement.lastElementChild.querySelector('.our-works__overlay');
			modal.imgLoad(this.target);
		}
	}


	// modal window for the gallery
	class Modal {
		constructor() {
			this.modal = document.querySelector('.modal');
			this.modalBody = this.modal.querySelector('.modal__body');
			this.modalImg = this.modalBody.querySelector('img');
			this.modal.addEventListener('click', this.onClick.bind(this));
			this.heightIndent = 100;
		}

		// Start one of the class methods: nextImage, previousImage, modalClose
		onClick(evt) {
			evt.preventDefault();
			let target = evt.target;
			let dataAction = target.dataset.action;
			if (dataAction) this[dataAction]();
		}

		nextImage() {
			gallery.nextTarget();
		}

		previousImage() {
			gallery.previousTarget();
		}

		modalClose() {
			this.modal.style.display = "none";
			this.modalImg.src = '#';
			this.modal.style.opacity = "0";
		}

		maxHeight() {
			return this.modal.clientHeight - this.heightIndent;
		}

		modalBodyHeight() {
			return this.modalBody.clientWidth / 1.5;
		}

		showPicture(galleryTarget) {
			this.modal.style.display = "block";

			if (this.modalBodyHeight() > this.maxHeight()) {
				this.modalBody.style.height = `${this.maxHeight()}px`;
				this.modalBody.style.width = `${this.maxHeight() * 1.5}px`;
			} else this.modalBody.style.height = `${this.modalBodyHeight()}px`;

			this.imgLoad(galleryTarget);
		}

		imgLoad(galleryTarget) {
			this.modalImg.style.opacity = '0';
			this.modalImg.src = galleryTarget.getAttribute('data-url');
			setTimeout(() => {
				let imgProportion = this.modalImg.naturalWidth / this.modalImg.naturalHeight,
					modalProportion = this.modalBody.clientWidth / this.modalBody.clientHeight;

				if (imgProportion > modalProportion) {
					this.modalImg.style.width = `${this.modalBody.clientWidth}px`;
					this.modalImg.style.height = `auto`;
				} else {
					this.modalImg.style.height = `${this.modalBody.clientHeight}px`;
					this.modalImg.style.width = `auto`;
				}

				this.modal.style.opacity = "1";
				this.modalImg.style.opacity = '1';
			}, 0);
		}
	}


	// modal window for video
	class VideoFrame {
		constructor() {
			this.buttonOpen = document.querySelector('.video__picture');
			this.modalForVideo = document.querySelector('.modalForVideo');
			this.buttonOpen.addEventListener('click', this.openVideo.bind(this));
			this.modalForVideo.addEventListener('click', this.closeVideo.bind(this));
		}

		openVideo(evt) {
			evt.preventDefault();
			let target = evt.target;
			while (!target.classList.contains('play-video')) {
				const id = target.getAttribute('data-url');
				if (id) {
					videoConstructor.loadVideo(id);
					this.openModal();
				}
				target = target.parentElement;
			}
		}

		// open modal window
		openModal() {
			this.modalForVideo.style.display = 'block';
			let modalForVideoBody = this.modalForVideo.querySelector('.modalForVideo__body');
			modalForVideoBody.style.height = `${0.5625 * modalForVideoBody.clientWidth}px`;
			this.modalForVideo.style.opacity = '1';
		}

		// close the modal window if you click outside
		closeVideo(evt) {
			if (!evt.target.classList.contains('modalForVideo__body')) {
				this.closeModal();
			}
		}

		// close modal window and stop video
		closeModal() {
			this.modalForVideo.style.opacity = '0';
			this.modalForVideo.style.display = 'none';
			videoConstructor.player.stopVideo();
		}

	}

	// class to work with YouTube API
	class WorkWithAPI {
		constructor() {
			this.player = 0;
		}

		// copied point 2 from YouTube Player API
		createVideo() {
			let tag = document.createElement('script');

			tag.src = "https://www.youtube.com/iframe_api"; // direct link into crs tag
			let firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

			setTimeout(() => {
				this.player = new YT.Player('frame', {
					height: '100%',
					width: '100%',
					videoId: 'VTy1hhZ5uWo',
				});
			}, 300);
		}

		/* method for downloading videos from YouTube. This method is from YouTube Player API */
		loadVideo(id) {
			this.player.loadVideoById({'videoId': `${id}`});
		}
	}


	let gallery = new Gallery();
	let modal = new Modal();
	new WindowElem();
	new UpArrow();
	new HeaderTop();
	let videoFrame = new VideoFrame();
	let videoConstructor = new WorkWithAPI();
	videoConstructor.createVideo();


	window.addEventListener("keydown", function (event) {
		if (event.defaultPrevented) {
			return; // Do nothing if the event was already processed
		}

		switch (event.key) {
			case "Left": // IE/Edge specific value
			case "ArrowLeft":
				modal.previousImage();
				break;
			case "Right": // IE/Edge specific value
			case "ArrowRight":
				modal.nextImage();
				break;
			case "Esc": // IE/Edge specific value
			case "Escape":
				modal.modalClose();
				videoFrame.closeModal();
				break;
			default:
				return; // Quit when this doesn't handle the key event.
		}

		// Cancel the default action to avoid it being handled twice
		event.preventDefault();
	}, true);


	// links for the expertise block are disabled
	document.querySelector('.expertise__items').addEventListener('click', evt => {
		evt.preventDefault();
	});


	// Arrow for smooth scrolling up
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


	// slider for Intro
	let miniSlider1 = multiItemSlider('.miniSlider1', {
		isCycling: true,
		dots: true,
		interval: 2000,
		pause: false,
		dotsPause: true
	});

	// slider for review icons
	let miniSlider2 = multiItemSlider('.miniSlider2', {
		isCycling: true,
		interval: 3000,
		pause: false,
		dots: true
	});

	// slider for review text (it uses arrows from miniSlider2)
	let miniSlider3 = multiItemSlider('.miniSlider3', {
		isCycling: true,
		pause: false,
		interval: 3000
	}, '.miniSlider2');

};