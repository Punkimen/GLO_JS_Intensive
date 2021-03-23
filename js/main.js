const mySwiper = new Swiper('.swiper-container', {
	loop: true,
	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

const buttonCart = document.querySelector(".button-cart");
const modalCart = document.querySelector("#modal-cart");
const modalClose = document.querySelector(".modal-close");
const scrollLink = document.querySelectorAll('a.scroll-link');

const openModal = (e) => {
	modalCart.classList.add('show')
	console.log(e.target);
};
const closeModal = (e) => {
	modalCart.classList.remove('show')
	console.log(e.target);
};
const target = (e) => {
	if (e.target == document.querySelector('.overlay')) {
		modalCart.classList.remove('show')
	}
	console.log(e.target);
};

const smoothScrol = (elememt) => {
	elememt.forEach(el => {
		el.addEventListener('click', (e) => {
			e.preventDefault()
			const id = e.currentTarget.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			})
		})
	})
};

smoothScrol(scrollLink);
buttonCart.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
modalCart.addEventListener('click', target);
