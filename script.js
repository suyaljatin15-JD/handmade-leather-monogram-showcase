/* =====================================
   SREE LEATHER - MAIN JAVASCRIPT
   Student Project: Shubhransh,Nisha,JD
===================================== */

// PRODUCT DATABASE

const products = [
    {
        id: 1,
        name: "Classic Leather Bag",
        category: "bags",
        price: 4999,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600",
        description: "An elegant everyday leather bag with a timeless silhouette."
    },
    {
        id: 2,
        name: "Premium Tote Bag",
        category: "bags",
        price: 5499,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600",
        description: "A spacious tote designed for everyday essentials."
    },
    {
        id: 3,
        name: "Leather Backpack",
        category: "travel",
        price: 3999,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=600",
        description: "A stylish backpack for work, college and travel."
    },
    {
        id: 4,
        name: "Classic Wallet",
        category: "wallets",
        price: 1499,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600",
        description: "A compact wallet for your everyday essentials."
    },
    {
        id: 5,
        name: "Travel Duffel Bag",
        category: "travel",
        price: 6999,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
        description: "A spacious travel companion with a classic look."
    },
    {
        id: 6,
        name: "Leather Crossbody",
        category: "bags",
        price: 3299,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600",
        description: "A versatile crossbody bag for effortless styling."
    },
    {
        id: 7,
        name: "Leather Card Holder",
        category: "accessories",
        price: 999,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600",
        description: "A minimal accessory for carrying essential cards."
    },
    {
        id: 8,
        name: "Mini Leather Purse",
        category: "wallets",
        price: 2199,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600",
        description: "A compact design with a refined finish."
    }
];

// LOCAL STORAGE DATA

function getSaved(key, fallback = []) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return value ?? fallback;
    } catch {
        return fallback;
    }
}

let cart = getSaved("hh_cart");
let wishlist = getSaved("hh_wishlist");
let orders = getSaved("hh_orders");
let reviews = getSaved("hh_reviews");

let currentCategory = "all";

const money = amount =>
    "₹" + Number(amount).toLocaleString("en-IN");

function saveData() {
    localStorage.setItem("hh_cart", JSON.stringify(cart));
    localStorage.setItem("hh_wishlist", JSON.stringify(wishlist));
    localStorage.setItem("hh_orders", JSON.stringify(orders));
    localStorage.setItem("hh_reviews", JSON.stringify(reviews));
}

// TOAST MESSAGE

function toast(message) {
    const box = document.getElementById("toast");

    box.textContent = message;
    box.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        box.classList.remove("show");
    }, 2500);
}

// PRODUCT DISPLAY

function renderProducts() {
    const grid = document.getElementById("productGrid");
    const search = document.getElementById("searchInput")
        .value.toLowerCase();

    const sort = document.getElementById("sortSelect").value;

    let filtered = products.filter(product => {
        const matchesCategory =
            currentCategory === "all" ||
            product.category === currentCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.description.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;
    });

    if (sort === "low") {
        filtered.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
        filtered.sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
        filtered.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    grid.innerHTML = "";

    if (filtered.length === 0) {
        grid.innerHTML =
            "<p>No products found. Try another search.</p>";
    }

    filtered.forEach(product => {
        const isLiked = wishlist.includes(product.id);

        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}"
                     alt="${product.name}"
                     loading="lazy">

                <button class="wish-icon ${isLiked ? "selected" : ""}"
                        data-wish="${product.id}">
                    ${isLiked ? "♥" : "♡"}
                </button>
            </div>

            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${money(product.price)}</p>

                <small>★ ${product.rating} / 5</small>

                <div class="product-actions">
                    <button data-add="${product.id}">
                        Add to Bag
                    </button>

                    <button data-view="${product.id}">
                        Details
                    </button>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });

    document.getElementById("resultsMessage").textContent =
        `${filtered.length} products found`;
}

// CATEGORY FILTERS

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {

        document.querySelectorAll(".filter").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentCategory = button.dataset.category;

        renderProducts();
    });
});

document.getElementById("searchInput")
    .addEventListener("input", renderProducts);

document.getElementById("sortSelect")
    .addEventListener("change", renderProducts);

// ADD TO CART

function addToCart(id) {
    const product = products.find(p => p.id === id);

    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveData();
    updateCart();

    toast(product.name + " added to bag!");
}

// REMOVE FROM CART

function changeQuantity(id, amount) {
    const item = cart.find(p => p.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
    }

    saveData();
    updateCart();
}

// CART DISPLAY

function updateCart() {
    const count = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    document.getElementById("cartCount").textContent = count;

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    document.getElementById("cartTotal").textContent =
        money(total);

    const container = document.getElementById("cartItems");

    container.innerHTML = "";

    if (cart.length === 0) {
        container.textContent = "Your shopping bag is empty.";
    }

    cart.forEach(item => {
        const row = document.createElement("div");

        row.className = "cart-row";

        const info = document.createElement("div");
        const title = document.createElement("b");
        const price = document.createElement("p");

        title.textContent = item.name;
        price.textContent = money(item.price);

        info.append(title, price);

        const quantity = document.createElement("div");

        const minus = document.createElement("button");
        minus.textContent = "−";
        minus.addEventListener("click", () =>
            changeQuantity(item.id, -1)
        );

        const number = document.createElement("span");
        number.textContent = " " + item.quantity + " ";

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.addEventListener("click", () =>
            changeQuantity(item.id, 1)
        );

        quantity.append(minus, number, plus);

        const remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.addEventListener("click", () => {
            cart = cart.filter(p => p.id !== item.id);
            saveData();
            updateCart();
        });

        row.append(info, quantity, remove);
        container.appendChild(row);
    });
}

// MODAL MANAGEMENT

function openModal(id) {
    document.getElementById(id).classList.add("show");
}

function closeModal(id) {
    document.getElementById(id).classList.remove("show");
}

document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => {
        closeModal(button.dataset.close);
    });
});

document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            modal.classList.remove("show");
        }
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        document.querySelectorAll(".modal").forEach(modal => {
            modal.classList.remove("show");
        });
    }
});

// CART BUTTON

document.getElementById("cartBtn").addEventListener("click", () => {
    updateCart();
    openModal("cartModal");
});

// PRODUCT DETAILS

function showProduct(id) {
    const product = products.find(p => p.id === id);

    if (!product) return;

    const details = document.getElementById("productDetails");

    details.innerHTML = "";

    const layout = document.createElement("div");
    layout.className = "detail-layout";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;

    const info = document.createElement("div");

    const heading = document.createElement("h2");
    heading.textContent = product.name;

    const rating = document.createElement("p");
    rating.textContent = "★ " + product.rating + " / 5";

    const price = document.createElement("h3");
    price.textContent = money(product.price);

    const description = document.createElement("p");
    description.textContent = product.description;

    const add = document.createElement("button");
    add.className = "primary-btn";
    add.textContent = "ADD TO BAG";

    add.addEventListener("click", () => {
        addToCart(product.id);
        closeModal("productModal");
    });

    info.append(heading, rating, price, description, add);
    layout.append(image, info);
    details.appendChild(layout);

    openModal("productModal");
}

// WISHLIST

function toggleWishlist(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(item => item !== id);
        toast("Removed from wishlist");
    } else {
        wishlist.push(id);
        toast("Added to wishlist");
    }

    saveData();
    renderProducts();
    updateWishlist();
}

function updateWishlist() {
    document.getElementById("wishCount").textContent =
        wishlist.length;

    const container = document.getElementById("wishlistItems");

    container.innerHTML = "";

    if (wishlist.length === 0) {
        container.textContent = "Your wishlist is empty.";
    }

    wishlist.forEach(id => {
        const product = products.find(p => p.id === id);

        if (!product) return;

        const row = document.createElement("div");
        row.className = "cart-row";

        const name = document.createElement("b");
        name.textContent = product.name;

        const price = document.createElement("span");
        price.textContent = money(product.price);

        const add = document.createElement("button");
        add.textContent = "Add to bag";

        add.addEventListener("click", () => {
            addToCart(id);
        });

        row.append(name, price, add);
        container.appendChild(row);
    });
}

document.getElementById("wishlistBtn")
    .addEventListener("click", () => {
        updateWishlist();
        openModal("wishlistModal");
    });

// CUSTOM MONOGRAM DESIGN

const initials = document.getElementById("initials");
const preview = document.getElementById("monogramPreview");
const monoColor = document.getElementById("monoColor");

initials.addEventListener("input", () => {
    initials.value = initials.value
        .toUpperCase()
        .replace(/[^A-Z]/g, "");

    preview.textContent = initials.value || "JS";
});

monoColor.addEventListener("change", () => {
    preview.style.color = monoColor.value;
});

document.getElementById("addCustom")
    .addEventListener("click", () => {

        const letters = initials.value.trim().toUpperCase();

        if (!letters) {
            toast("Please enter your initials first");
            return;
        }

        const customName = "Custom Monogram Bag (" + letters + ")";

        const existing = cart.find(
            item => item.name === customName
        );

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({
                id: 1000 + cart.length,
                name: customName,
                price: 5499,
                quantity: 1
            });
        }

        saveData();
        updateCart();

        toast("Custom design added to bag!");
    });

// CHECKOUT

document.getElementById("checkoutBtn")
    .addEventListener("click", () => {

        if (cart.length === 0) {
            toast("Your shopping bag is empty");
            return;
        }

        const summary = document.getElementById("checkoutSummary");

        const total = cart.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        summary.textContent =
            "Order items: " +
            cart.map(item =>
                `${item.name} x ${item.quantity}`
            ).join(", ") +
            " | Total: " + money(total);

        closeModal("cartModal");
        openModal("checkoutModal");
    });

// CONFIRM ORDER

document.getElementById("checkoutForm")
    .addEventListener("submit", event => {

        event.preventDefault();

        if (cart.length === 0) return;

        const customer = {
            name: document.getElementById("buyerName").value.trim(),
            email: document.getElementById("buyerEmail").value.trim(),
            phone: document.getElementById("buyerPhone").value.trim(),
            address: document.getElementById("buyerAddress").value.trim()
        };

        const total = cart.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        const order = {
            orderId: "HH" + Date.now().toString().slice(-8),
            date: new Date().toLocaleString(),
            customer: customer,
            items: cart.map(item => ({ ...item })),
            total: total,
            status: "Demo order placed"
        };

        orders.unshift(order);

        cart = [];

        saveData();
        updateCart();

        document.getElementById("checkoutForm").reset();

        closeModal("checkoutModal");

        toast("Your demo order has been placed!");

        setTimeout(() => {
            showOrders();
        }, 700);
    });

// ORDER HISTORY

function showOrders() {
    const container = document.getElementById("orderHistory");

    container.innerHTML = "";

    if (orders.length === 0) {
        container.textContent = "No orders have been placed yet.";
    }

    orders.forEach(order => {
        const card = document.createElement("div");
        card.className = "review-card";

        const heading = document.createElement("h3");
        heading.textContent = "Order #" + order.orderId;

        const customer = document.createElement("p");
        customer.textContent = "Customer: " + order.customer.name;

        const date = document.createElement("p");
        date.textContent = "Date: " + order.date;

        const total = document.createElement("b");
        total.textContent = "Total: " + money(order.total);

        const status = document.createElement("p");
        status.textContent = order.status;

        card.append(heading, customer, date, total, status);

        order.items.forEach(item => {
            const line = document.createElement("p");
            line.textContent =
                item.name + " × " + item.quantity;
            card.appendChild(line);
        });

        container.appendChild(card);
    });

    openModal("ordersModal");
}

document.getElementById("ordersBtn")
    .addEventListener("click", showOrders);

// CUSTOMER REVIEWS

function renderReviews() {
    const grid = document.getElementById("reviewGrid");

    reviews.forEach(review => {
        const card = document.createElement("div");
        card.className = "review-card";

        const stars = document.createElement("div");
        stars.className = "stars";
        stars.textContent = "★".repeat(review.rating) +
                            "☆".repeat(5 - review.rating);

        const message = document.createElement("p");
        message.textContent = '"' + review.message + '"';

        const name = document.createElement("b");
        name.textContent = "— " + review.name;

        card.append(stars, message, name);
        grid.appendChild(card);
    });
}

document.getElementById("submitReview")
    .addEventListener("click", () => {

        const name = document.getElementById("reviewName")
            .value.trim();

        const rating = Number(
            document.getElementById("reviewRating").value
        );

        const message = document.getElementById("reviewText")
            .value.trim();

        if (!name || !message) {
            toast("Please fill in your review");
            return;
        }

        reviews.push({ name, rating, message });

        saveData();

        const grid = document.getElementById("reviewGrid");
        grid.innerHTML = "";

        renderDefaultReviews();
        renderReviews();

        document.getElementById("reviewName").value = "";
        document.getElementById("reviewText").value = "";

        toast("Thank you for your feedback!");
    });

function renderDefaultReviews() {
    // Keep the three sample reviews in index.html.
    // Only user reviews are generated from localStorage.
}

// CONTACT FORM

document.getElementById("contactForm")
    .addEventListener("submit", event => {

        event.preventDefault();

        const name = document.getElementById("contactName").value;
        const email = document.getElementById("contactEmail").value;
        const message = document.getElementById("contactMessage").value;

        const subject = encodeURIComponent("HIDE & HUE Enquiry");

        const body = encodeURIComponent(
            "Name: " + name +
            "\nEmail: " + email +
            "\nMessage: " + message
        );

        window.location.href =
            "mailto:hello@hideandhue.example?subject=" +
            subject + "&body=" + body;
    });

// DARK / LIGHT MODE

document.getElementById("themeBtn")
    .addEventListener("click", () => {

        document.body.classList.toggle("dark");

        const dark = document.body.classList.contains("dark");

        localStorage.setItem("hh_theme", dark ? "dark" : "light");
    });

if (localStorage.getItem("hh_theme") === "dark") {
    document.body.classList.add("dark");
}

// MOBILE NAVIGATION

document.getElementById("menuBtn")
    .addEventListener("click", () => {

        document.getElementById("navigation")
            .classList.toggle("open");
    });

document.querySelectorAll("#navigation a").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("navigation")
            .classList.remove("open");
    });
});

// GENERAL BUTTON EVENTS

document.addEventListener("click", event => {

    const addButton = event.target.closest("[data-add]");
    const viewButton = event.target.closest("[data-view]");
    const wishButton = event.target.closest("[data-wish]");

    if (addButton) {
        addToCart(Number(addButton.dataset.add));
    }

    if (viewButton) {
        showProduct(Number(viewButton.dataset.view));
    }

    if (wishButton) {
        toggleWishlist(Number(wishButton.dataset.wish));
    }
});

// INITIALISE WEBSITE

function initialiseWebsite() {
    renderProducts();
    updateCart();
    updateWishlist();
    renderReviews();
}

initialiseWebsite();
