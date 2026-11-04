document.addEventListener("DOMContentLoaded", () => {
    const CART_KEY = "foodora_cart";
    const COUPON_KEY = "foodora_coupon";
    const ORDERS_KEY = "foodora_orders";

    const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    let appliedCoupon = localStorage.getItem(COUPON_KEY) || "";

    const checkoutProducts = document.getElementById("checkoutProducts");
    const checkoutItemCount = document.getElementById("checkoutItemCount");
    const checkoutSubtotal = document.getElementById("checkoutSubtotal");
    const checkoutShipping = document.getElementById("checkoutShipping");
    const checkoutDiscount = document.getElementById("checkoutDiscount");
    const checkoutTotal = document.getElementById("checkoutTotal");
    const checkoutForm = document.getElementById("checkoutForm");
    const placeOrderButton = document.getElementById("placeOrderButton");

    const formatPrice = (amount) =>
        "₹" + Number(amount).toFixed(2);

    function showMessage(message) {
        const toast = document.getElementById("toast");

        if (toast) {
            toast.textContent = message;
            toast.classList.add("show");

            setTimeout(() => {
                toast.classList.remove("show");
            }, 3000);
        } else {
            alert(message);
        }
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, (char) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    }

    function updateCartCount() {
        const cartCount = document.getElementById("cartCount");

        if (cartCount) {
            cartCount.textContent = cart.reduce(
                (total, item) => total + Number(item.quantity || 0),
                0
            );
        }
    }

    function calculateTotals() {
        const subtotal = cart.reduce(
            (total, item) =>
                total + Number(item.price) * Number(item.quantity),
            0
        );

        const shipping = subtotal === 0 || subtotal >= 499 ? 0 : 49;

        let discount = 0;

        if (
            appliedCoupon.toUpperCase() === "FOODORA10" &&
            subtotal >= 499
        ) {
            discount = Math.min(subtotal * 0.10, 100);
        }

        const total = subtotal + shipping - discount;

        return {
            subtotal,
            shipping,
            discount,
            total
        };
    }

    function renderCheckout() {
        updateCartCount();

        if (!checkoutProducts) return;

        if (cart.length === 0) {
            checkoutProducts.innerHTML = `
                <div class="checkout-empty">
                    <i class="fa-solid fa-basket-shopping"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some delicious products before checkout.</p>
                    <a href="shop.html" class="btn btn-primary">
                        Explore Products
                    </a>
                </div>
            `;

            if (placeOrderButton) {
                placeOrderButton.disabled = true;
                placeOrderButton.textContent = "Cart is Empty";
            }

            return;
        }

        checkoutProducts.innerHTML = cart.map((item) => `
            <div class="checkout-product">
                <div class="checkout-product-image">
                    <img
                        src="${escapeHTML(item.image)}"
                        alt="${escapeHTML(item.title)}"
                        onerror="this.src='https://placehold.co/100x100?text=Foodora'"
                    >
                    <span>${Number(item.quantity)}</span>
                </div>

                <div class="checkout-product-info">
                    <h4>${escapeHTML(item.title)}</h4>
                    <p>${escapeHTML(item.weight || "Standard Pack")}</p>
                </div>

                <div class="checkout-product-price">
                    ${formatPrice(Number(item.price) * Number(item.quantity))}
                </div>
            </div>
        `).join("");

        const totals = calculateTotals();

        if (checkoutItemCount) {
            checkoutItemCount.textContent = `${cart.reduce(
                (sum, item) => sum + Number(item.quantity),
                0
            )} Items`;
        }

        if (checkoutSubtotal) {
            checkoutSubtotal.textContent = formatPrice(totals.subtotal);
        }

        if (checkoutShipping) {
            checkoutShipping.textContent =
                totals.shipping === 0 ? "FREE" : formatPrice(totals.shipping);
        }

        if (checkoutDiscount) {
            checkoutDiscount.textContent =
                totals.discount > 0
                    ? "- " + formatPrice(totals.discount)
                    : formatPrice(0);
        }

        if (checkoutTotal) {
            checkoutTotal.textContent = formatPrice(totals.total);
        }
    }

    // Coupon information
    if (appliedCoupon && appliedCoupon.toUpperCase() !== "FOODORA10") {
        appliedCoupon = "";
        localStorage.removeItem(COUPON_KEY);
    }

    renderCheckout();

    // Mobile number validation
    const phoneInput = document.getElementById("phone");

    if (phoneInput) {
        phoneInput.addEventListener("input", () => {
            phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
        });
    }

    // Pincode validation
    const pincodeInput = document.getElementById("pincode");

    if (pincodeInput) {
        pincodeInput.addEventListener("input", () => {
            pincodeInput.value = pincodeInput.value
                .replace(/\D/g, "")
                .slice(0, 6);
        });
    }

    // Place Order
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (cart.length === 0) {
                showMessage("Your cart is empty!");
                return;
            }

            if (!checkoutForm.checkValidity()) {
                checkoutForm.reportValidity();
                return;
            }

            const phone = phoneInput?.value.trim() || "";
            const pincode = pincodeInput?.value.trim() || "";

            if (!/^[6-9]\d{9}$/.test(phone)) {
                showMessage("Please enter a valid 10-digit mobile number.");
                phoneInput?.focus();
                return;
            }

            if (!/^\d{6}$/.test(pincode)) {
                showMessage("Please enter a valid 6-digit pincode.");
                pincodeInput?.focus();
                return;
            }

            const paymentMethod = document.querySelector(
                'input[name="paymentMethod"]:checked'
            )?.value;

            if (paymentMethod === "online") {
                showMessage("Online payment gateway will be connected soon.");
                return;
            }

            const totals = calculateTotals();

            const order = {
                orderId: "FD" + Date.now(),
                customer: {
                    name: document.getElementById("fullName").value.trim(),
                    email: document.getElementById("email").value.trim(),
                    phone,
                    address: document.getElementById("address").value.trim(),
                    landmark: document.getElementById("landmark").value.trim(),
                    city: document.getElementById("city").value.trim(),
                    state: document.getElementById("state").value.trim(),
                    pincode,
                    country: document.getElementById("country").value.trim(),
                    deliveryNote: document.getElementById("deliveryNote").value.trim()
                },
                products: cart,
                subtotal: totals.subtotal,
                shipping: totals.shipping,
                discount: totals.discount,
                total: totals.total,
                paymentMethod: "COD",
                paymentStatus: "PENDING",
                orderStatus: "PLACED",
                createdAt: new Date().toISOString()
            };

            // Save demo order locally
            const existingOrders = JSON.parse(
                localStorage.getItem(ORDERS_KEY)
            ) || [];

            existingOrders.push(order);

            localStorage.setItem(
                ORDERS_KEY,
                JSON.stringify(existingOrders)
            );

            // Clear cart after demo COD order
            localStorage.removeItem(CART_KEY);
            localStorage.removeItem(COUPON_KEY);

           window.location.href = "order-success.html";

            // Clear cart after successful COD order
localStorage.removeItem(CART_KEY);
localStorage.removeItem(COUPON_KEY);

// Redirect to Order Success Page
window.location.href = "order-success.html";
        });
    }
});