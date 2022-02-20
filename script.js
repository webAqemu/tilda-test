document.addEventListener("DOMContentLoaded", function(e) {
    
    imageTabs()

    const showBtn = document.querySelector(".preview__btn")
    const addBtn = document.querySelector(".card__add")
    const preview = document.querySelector(".preview")
    const cart = document.querySelector(".cart")

    // удаляем элемент из корзины
    cart.addEventListener("click", function(e) {
        if(e.target.classList.contains("cart__close")) {
            const item = e.target.closest(".cart__item") 
            const id = item.getAttribute("id")
            let quantity = document.querySelector(`.card[id='${id}'] .card__quantity span`)
            quantity.innerHTML = +quantity.innerHTML + 1
            item.remove()
        }

        cartCount()
        checkQuantity()
    })

    // загружаем данные
    showBtn.addEventListener("click", async function(e) {
        await getData()
        preview.classList.add("hiden")
    })

    // добавляем элемент в корзину
    addBtn.addEventListener("click", function(e) {
        const card = e.target.closest(".card")
        const cardId = card.getAttribute("id")
        const image = card.querySelector(".card__photo img").getAttribute("src")
        const name = card.querySelector(".card__title").innerHTML
        let count = card.querySelector(".card__quantity span")
        count.innerHTML = +count.innerHTML - 1

        addItemToCart(image, name, cardId)
        cartCount()
        checkQuantity()
    })


})

async function getData() {
    // получаем данные 
    const url = "https://store.tildacdn.com/api/tgetproduct/";
    const response = await fetch(url)
    const data = await response.json()
    // передаем данные для отображения на странице
    insertData(data)
}

function insertData(data) {
    // деструктурируем данные и находим нужные эелементы
    const {descr: desc, images, price, priceold, quantity, title} = data
    const imagesAr = JSON.parse(images)
    const mainPhotoEl = document.querySelector(".card__photo img")
    const photoTabsEl = document.querySelector(".card__tabs")
    const titleEl = document.querySelector(".card__title")
    const descEl = document.querySelector(".card__desc")
    const newPriceEl = document.querySelector(".card__price .new")
    const oldPriceEl = document.querySelector(".card__price .old")
    const quantityEl = document.querySelector(".card__quantity span")
    const addBtn = document.querySelector(".card__add")


    titleEl.innerHTML = title;
    descEl.innerHTML = desc;
    quantityEl.innerHTML = quantity;
    newPriceEl.innerHTML = `$ ${price}.00 USD`;
    oldPriceEl.innerHTML = `$ ${priceold}.00 USD`;
    mainPhotoEl.setAttribute("src", imagesAr[0].img)

    // проверяем сколько осталось
    if(quantity === 0) {
        addBtn.classList.add("hiden")
    }


    // всатвляем картинки для табов
    imagesAr.forEach((img, i) => {
        const {img: src} = img; 
        const imgEl = document.createElement("img")
        const btn = document.createElement("button")
        const tab = document.createElement("li")
        btn.insertAdjacentElement("beforeend", imgEl)
        if(i === 0) {
            btn.classList.add("active")
        }
        btn.classList.add("card__tab")
        tab.insertAdjacentElement("beforeend", btn)
        imgEl.setAttribute("src", src)
        imgEl.setAttribute("alt", "card photo")
        photoTabsEl.insertAdjacentElement("beforeend", tab)
    })
}

// переключаемся между картинками
function imageTabs() {
    const tabs = document.querySelector(".card__tabs"); 
    const mainPhoto = document.querySelector(".card__photo img"); 
    tabs.addEventListener("click", function(e) {
        if(e.target.classList.contains("card__tab")) {
            const data = e.target.querySelector("img").getAttribute("src")
            mainPhoto.setAttribute("src", data)
            document.querySelector(".card__tab.active").classList.remove("active")
            e.target.classList.add("active")
        }
    })
}

// добавление элемента в корзину
function addItemToCart(imageUrl, name, id) {
    const cart = document.querySelector(".cart__list")
    const markup = 
    `
        <li class="cart__item" id="${id}">
            <img class="cart__img" src="${imageUrl}" alt="item image"/>
            <div class="cart__name">${name}</div>
            <button class="cart__close">x</button>
        </li>
    `
    cart.insertAdjacentHTML("beforeend", markup)
}

// считаем скол-во элементов в корзине
function cartCount () {
    const cart = document.querySelector(".cart")
    const cartItems = document.querySelectorAll(".cart__item").length
    const cartAmountEl = document.querySelector(".cart__num")
    cartAmountEl.innerHTML = cartItems

    if(cartItems === 0) {
        cart.classList.add('empty')
    } else {
        cart.classList.remove('empty')
    }
}

// проверяем кол-во оставшихся товаров
function checkQuantity() {
    const btns = document.querySelectorAll(".card__add")
    btns.forEach(btn => {
        if(+btn.querySelector(".card__quantity span").innerHTML === 0) {
            btn.classList.add("hiden")
        } else {
            btn.classList.remove("hiden")
        }
    })
}