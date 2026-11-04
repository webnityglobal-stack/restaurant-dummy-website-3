document.addEventListener("DOMContentLoaded", () => {

    const WISHLIST_KEY = "foodora_wishlist";
    const CART_KEY = "foodora_cart";

    const wishlistProducts = document.getElementById("wishlistProducts");
    const emptyWishlist = document.getElementById("emptyWishlist");
    const wishlistCount = document.getElementById("wishlistCount");
    const cartCount = document.getElementById("cartCount");

    // FOODORA Product Data
    const products = [
        {
            id: 101,
            title: "Premium Chocolate Bites",
            category: "Chocolates",
            price: 299,
            oldPrice: 399,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=85"
        },
        {
            id: 102,
            title: "Garden Fresh Mix",
            category: "Healthy Snacks",
            price: 249,
            oldPrice: 299,
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=85"
        },
        {
            id: 103,
            title: "Royal Nut Selection",
            category: "Dry Fruits",
            price: 499,
            oldPrice: 599,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=700&q=85"
        },
        {
            id: 104,
            title: "Signature Food Mix",
            category: "Snacks",
            price: 349,
            oldPrice: 449,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1599599810694-b5ac4dd5c11d?auto=format&fit=crop&w=700&q=85"
        }
    ];

    // Safe LocalStorage
    function getWishlist() {
        try {
            return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
        } catch {
            return [];
        }
    }

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveWishlist(wishlist) {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    }

    // Convert wishlist entries into product objects.
    function getWishlistProducts() {
        const wishlist = getWishlist();

        return wishlist.map(item => {
            if (typeof item === "object" && item !== null) {
                const id = Number(item.productId ?? item.id);
                return products.find(product => product.id === id) || {
                    id,
                    title: item.title || item.name || "Foodora Product",
                    category: item.category || "Food Products",
                    price: Number(item.price) || 0,
                    oldPrice: Number(item.oldPrice) || 0,
                    rating: Number(item.rating) || 4.5,
                    image: item.image || ""
                };
            }

            return products.find(product => product.id === Number(item));
        }).filter(Boolean);
    }

    // Toast Message
    function showToast(message) {
        const toast = document.getElementById("toast");

        if (!toast) {
            alert(message);
            return;
        }

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(window.foodoraToastTimer);

        window.foodoraToastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }

    // Update Cart Count
    function updateCartCount() {
        const cart = getCart();

        if (cartCount) {
            const totalItems = cart.reduce(
                (total, item) => total + Number(item.quantity || 0),
                0
            );

            cartCount.textContent = totalItems;
        }
    }

    // Render Wishlist
    function renderWishlist() {
        const wishlist = getWishlistProducts();

        if (wishlistCount) {
            wishlistCount.textContent =
                `${wishlist.length} Products Saved`;
        }

        if (!wishlistProducts || !emptyWishlist) return;

        if (wishlist.length === 0) {
            wishlistProducts.style.display = "none";
            emptyWishlist.style.display = "block";
            return;
        }

        wishlistProducts.style.display = "grid";
        emptyWishlist.style.display = "none";

        wishlistProducts.innerHTML = wishlist.map(product => `
            <div class="wishlist-card" data-id="${product.id}">

                <div class="wishlist-card-image">

                    <img
                        src="${escapeHTML(product.image)}"
                        alt="${escapeHTML(product.title)}"
                        onerror="this.src='https://placehold.co/500x400?text=FOODORA'"
                    >

                    <button
                        class="wishlist-remove"
                        data-action="remove"
                        data-id="${product.id}"
                        aria-label="Remove from wishlist"
                        title="Remove from wishlist"
                    >
                        <i class="fa-solid fa-heart"></i>
                    </button>

                </div>

                <div class="wishlist-card-info">

                    <div class="wishlist-category">
                        ${escapeHTML(product.category)}
                    </div>

                    <h3>${escapeHTML(product.title)}</h3>

                    <div class="wishlist-rating">
                        <i class="fa-solid fa-star"></i>
                        ${product.rating}
                        <span>Customer Rating</span>
                    </div>

                    <div class="wishlist-card-bottom">

                        <div class="wishlist-price">
                            ₹${product.price}

                            ${product.oldPrice ? `
                                <span class="wishlist-old-price">
                                    ₹${product.oldPrice}
                                </span>
                            ` : ""}
                        </div>

                        <button
                            class="wishlist-add-cart"
                            data-action="add"
                            data-id="${product.id}"
                        >
                            <i class="fa-solid fa-bag-shopping"></i>
                            Add to Cart
                        </button>

                    </div>

                </div>

            </div>
        `).join("");
    }

    // Remove Product
    function removeFromWishlist(productId) {
        const wishlist = getWishlist();

        const updatedWishlist = wishlist.filter(item => {
            const id = typeof item === "object"
                ? Number(item.productId ?? item.id)
                : Number(item);

            return id !== productId;
        });

        saveWishlist(updatedWishlist);
        renderWishlist();

        showToast("Product removed from wishlist!");
    }

    // Add Product to Cart
    function addToCart(productId) {
        const product = products.find(item => item.id === productId);

        if (!product) {
            showToast("Product details not found!");
            return;
        }

        const cart = getCart();

        const existingItem = cart.find(
            item => Number(item.productId ?? item.id) === productId
        );

        if (existingItem) {
            existingItem.quantity = Number(existingItem.quantity || 0) + 1;
        } else {
            cart.push({
                productId: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        localStorage.setItem(CART_KEY, JSON.stringify(cart));

        updateCartCount();
        showToast("Product added to your cart!");
    }

    // Wishlist Button Actions
    if (wishlistProducts) {
        wishlistProducts.addEventListener("click", event => {

            const button = event.target.closest("button[data-action]");

            if (!button) return;

            const productId = Number(button.dataset.id);
            const action = button.dataset.action;

            if (action === "remove") {
                removeFromWishlist(productId);
            }

            if (action === "add") {
                addToCart(productId);
            }

        });
    }

    // Mobile Menu
    const menuToggle = document.getElementById("menuToggle");
    const navbar = document.getElementById("navbar");

    if (menuToggle && navbar) {
        menuToggle.addEventListener("click", () => {
            navbar.classList.toggle("active");
            menuToggle.classList.toggle("active");
        });
    }

    // Footer Year
    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // Initial Load
    updateCartCount();
    renderWishlist();

});