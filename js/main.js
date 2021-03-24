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
};
const closeModal = (e) => {
	modalCart.classList.remove('show')
};
const target = (e) => {
	if (e.target == document.querySelector('.overlay')) {
		modalCart.classList.remove('show')
	}
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

// goods
const more = document.querySelector('.more')
const navigationLink = document.querySelectorAll('.navigation-link')
const longGoodsList = document.querySelector('.long-goods-list')
const viewBtn = document.querySelectorAll('.view-btn')

const getGoods = async () => {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw 'Error' + result.status
	} return await result.json();
}

const createCard = (objCard) => {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';

	card.innerHTML = `
	<div class="goods-card">
	${objCard.label ? `<span class="label">${objCard.label}</span>` : ''}
		
		<img src="./db/${objCard.img}" alt="${objCard.name}" class="goods-image">
		<h3 class="goods-title">${objCard.name}</h3>
		<p class="goods-description">${objCard.description}</p>
		<button class="button goods-card-btn add-to-cart" data-id="${objCard.id}">
			<span class="button-price">$${objCard.price}</span>
		</button>
	</div>
	`;
	return card;
}

const renderCards = (data) => {
	longGoodsList.textContent = '';
	const cards = data.map(createCard)
	longGoodsList.append(...cards)
	// cards.forEach((card) => {
	// 	longGoodsList.append(card)
	// })
	document.body.classList.add('show-goods')
}

more.addEventListener('click', (event) => {
	event.preventDefault()
	getGoods().then(renderCards)
	const id = event.currentTarget.getAttribute('href');
	document.querySelector(id).scrollIntoView({
		behavior: 'smooth',
		block: 'start'
	})
})

const filterCards = (field, value) => {
	getGoods()
		.then((data) => {
			const filteredGoods = data.filter((good) => {
				return good[field] === value
			})
			return filteredGoods;
		})
		.then(renderCards);
};

navigationLink.forEach((link) => {
	link.addEventListener('click', (event) => {
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		if (value !== "All") {
			filterCards(field, value);
		} else {
			getGoods().then(renderCards)
		}
	})
})

viewBtn.forEach((btn) => {
	btn.addEventListener("click", (event) => {
		event.preventDefault();
		const field = btn.dataset.field;
		const value = btn.dataset.value;
		filterCards(field, value);
		const id = event.currentTarget.getAttribute('href');
		document.querySelector(id).scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		})
	})
})