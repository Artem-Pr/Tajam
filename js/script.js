window.onload = function () {
	let modalForVideo = document.querySelector('.modalForVideo'),
		player;

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


	class Modal {
		constructor() {
			this.modal = document.querySelector('.modal');
			this.modalBody = this.modal.querySelector('.modal__body');
			this.modalImg = this.modalBody.querySelector('img');
			this.modal.addEventListener('click', this.onClick.bind(this));
			this.heightIndent = 100;
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

		onClick(evt) {
			evt.preventDefault();
			let target = evt.target;
			let dataAction = target.dataset.action;
			if (dataAction) this[dataAction]();
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


	let gallery = new Gallery();
	let modal = new Modal();
	new WindowElem();
	new UpArrow();
	new HeaderTop();


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
				closeModal();
				break;
			default:
				return; // Quit when this doesn't handle the key event.
		}

		// Cancel the default action to avoid it being handled twice
		event.preventDefault();
	}, true);


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


	document.querySelector('.video__picture').addEventListener('click', (evt) => {
		evt.preventDefault(); 
		let target = evt.target;
		while (!target.classList.contains('play-video') ){
			const id = target.getAttribute('data-url');
			if (id) {
				loadVideo(id);
				openModal();
			}
			target = target.parentElement;
		}
	});


	// open modal window
	function openModal() {
		modalForVideo.style.display = 'block';
	}


	// close modal window and stop video
	function closeModal() {
		modalForVideo.style.display = 'none';
		player.stopVideo();
	}


	// close the modal window if you click outside
	modalForVideo.addEventListener('click', (evt) => {
		if (!evt.target.classList.contains('modalForVideo__body')) {
			closeModal();
		}
	});

	// copy point 2 from YouTube Player API
	function createVideo() {
		var tag = document.createElement('script');

		tag.src = "https://www.youtube.com/iframe_api"; // direct link into crs tag
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		setTimeout(() => {
			player = new YT.Player('frame', {
				height: '100%',
				width: '100%',
				videoId: 'VTy1hhZ5uWo',
			});
		}, 300);
	}

	createVideo();

	/* method for downloading videos from YouTube. This method is from YouTube Player API
	(use not to create a new pleer every time, but simply download new video into it) */
	function loadVideo(id) {
		player.loadVideoById({ 'videoId': `${id}` });
	}



	let miniSlider1 = multiItemSlider('.miniSlider1', {
		isCycling: true,
		dots: true,
		interval: 2000,
		pause: false,
		dotsPause: true
	});

};