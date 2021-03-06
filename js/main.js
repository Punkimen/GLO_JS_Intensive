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
const more = document.querySelector('.more')
const navigationLink = document.querySelectorAll('.navigation-link')
const longGoodsList = document.querySelector('.long-goods-list')
const viewBtn = document.querySelectorAll('.view-btn')
const cartTableGoods = document.querySelector('.cart-table__goods');
const cartTableTotal = document.querySelector('.card-table__total');
const cartCountText = document.querySelector('.cart-count');
const clearCart = document.querySelector('.clear-cart');



/*

const checkGoods = () => {

	const data = [];

	return async () => {

		if (data.length) return data;
		const result = await fetch('db/db.json');
		if (!result.ok) {
			throw 'Error' + result.status
		}
		data.push(...(await result.json()))
		return data
	}
}

const getGoods = checkGoods()

*/


const getGoods = async () => {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw 'Error' + result.status
	}
	return await result.json();
}

const cart = {
	cartGoods: [],
	renderCart() {
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({ id, name, price, count }) => {
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;
			trGood.innerHTML = `
				<td>${name}</td>
				<td>${price}$</td>
				<td><button class="cart-btn-minus" data-id="${id}">-</button></td>
				<td>${count}</td>
				<td><button class="cart-btn-plus" data-id="${id}">+</button></td>
				<td>${price * count}$</td>
				<td><button class="cart-btn-delete" data-id="${id}">x</button></td>
			`
			cartTableGoods.append(trGood);
		});

		const totalPrice = this.cartGoods.reduce((summ, item) => {
			return summ + (item.price * item.count);
		}, 0)
		cartTableTotal.textContent = totalPrice + '$';
		const totalCount = this.cartGoods.reduce((countSumm, item) => {
			return countSumm + item.count
		}, 0)
		cartCountText.textContent = totalCount;
	},
	deleteGood(id) {
		this.cartGoods = this.cartGoods.filter(item => id !== item.id)
		this.renderCart();
	},
	minusGood(id) {
		for (const item of this.cartGoods) {
			if (item.id === id) {
				if (item.count <= 1) {
					this.deleteGood(id)
				} else {
					item.count--;
				}
				break
			}
		}
		this.renderCart()
	},
	plusGood(id) {
		for (const item of this.cartGoods) {
			if (item.id === id) {
				item.count++;
				break
			}
		}
		this.renderCart()
	},
	addCartGoods(id) {
		const goodItem = this.cartGoods.find(item => item.id === id);
		if (goodItem) {
			this.plusGood(id);
		} else {
			getGoods()
				.then(data => data.find(item => item.id === id))
				.then(({ id, name, price }) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1,
					})
					this.renderCart()
				})
		}
	},
	clearCart(id) {
		this.cartGoods = this.cartGoods.filter(item => id === item.id)
		this.renderCart();
	}
}

clearCart.addEventListener('click', (event) => {
	event.preventDefault();
	cart.clearCart()
})

document.body.addEventListener('click', (e) => {
	const addToCart = e.target.closest('.add-to-cart')
	if (addToCart) {
		cart.addCartGoods(addToCart.dataset.id)
	}
})

cartTableGoods.addEventListener('click', (event) => {
	const target = event.target;

	if (target.classList.contains('cart-btn-delete')) {
		// cart.deleteGood(target.dataset.id)
		const id = target.closest('.cart-item').dataset.id
		cart.deleteGood(id)
	}
	if (target.classList.contains('cart-btn-minus')) {
		const id = target.closest('.cart-item').dataset.id
		cart.minusGood(id)
	}
	if (target.classList.contains('cart-btn-plus')) {
		const id = target.closest('.cart-item').dataset.id
		cart.plusGood(id)
	}
})

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
		.then((data) => data.filter((good) => good[field] === value))
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


// Server

const modalForm = document.querySelector('.modal-form');




const postData = dataUser => fetch('server.php', {
	method: 'POST',
	body: dataUser,
})

modalForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const formData = new FormData(modalForm)
	const modalInput = document.querySelectorAll('.modal-input');
	formData.append('cart', JSON.stringify(cart.cartGoods))

	let error = 0

	modalInput.forEach((el) => {
		if (el.value == '' || el.value == ' ') {
			el.classList.add('error')
		} else {
			el.classList.remove('error')
			console.log('work');

		}
		if (el.classList.contains('error')) {
			error++
		} else {
			error = 0
		}
		return error
	})

	let cartError = 0;

	if (cart.cartGoods.length === 0) {
		cartError++;
	} else { cartError = 0 }

	console.log(error);
	console.log(cartError);


	if (error === 0 && cartError === 0) {
		postData(formData)
			.then((response) => {
				if (!response.ok) {
					throw new Error(response.status)
				} else {
					alert('?????????? ??????????????????')
					console.log(response.statusText);

				}
			})
			.catch(err => {
				alert('???????????? ???? ???????????? ???? ??????????????????, ?????????????????? ??????????')
				console.error(err)
			})
			.finally(() => {
				closeModal();
				modalForm.reset();
				// cart.cartGoods.length = 0;
				cart.clearCart()
			})
	} else {
		console.log('error');

	}
})
