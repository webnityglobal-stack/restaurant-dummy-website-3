document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // 1. SETTINGS & ELEMENTS
  // ==========================================

  const CART_KEY = "foodora_cart";
  const COUPON_KEY = "foodora_coupon";

  const cartItems = document.getElementById("cartItems");
  const emptyCart = document.getElementById("emptyCart");
  const cartTable = document.querySelector(".cart-table-wrapper");

  const cartSubtotal = document.getElementById("cartSubtotal");
  const cartShipping = document.getElementById("cartShipping");
  const cartDiscount = document.getElementById("cartDiscount");
  const cartTotal = document.getElementById("cartTotal");

  const cartItemCount = document.getElementById("cartItemCount");
  const cartCount = document.getElementById("cartCount");

  const shippingMessage = document.getElementById("shippingMessage");

  const couponInput = document.getElementById("couponCode");
  const applyCoupon = document.getElementById("applyCoupon");
  const couponMessage = document.getElementById("couponMessage");

  const clearCartButton = document.getElementById("clearCart");
  const checkoutButton = document.getElementById("checkoutButton");

  let appliedCoupon = localStorage.getItem(COUPON_KEY) || "";


  // ==========================================
  // 2. SEARCH POPUP FUNCTIONALITY
  // ==========================================

  const searchToggle = document.getElementById("searchToggle");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchInput = document.getElementById("searchInput");
  const searchClose = document.getElementById("searchClose");
  const searchSubmit = document.getElementById("searchSubmit");

  function openSearchPopup(event) {
    if (event) event.preventDefault();

    if (!searchOverlay) {
      console.error("Search popup HTML not found!");
      return;
    }

    searchOverlay.classList.add("active");
    searchOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("search-open");

    setTimeout(() => {
      searchInput?.focus();
    }, 100);
  }

  function closeSearchPopup() {
    if (!searchOverlay) return;

    searchOverlay.classList.remove("active");
    searchOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("search-open");
  }

  if (searchToggle) {
    searchToggle.addEventListener("click", openSearchPopup);
  } else {
    console.warn("Search button #searchToggle not found!");
  }

  if (searchClose) {
    searchClose.addEventListener("click", closeSearchPopup);
  }

  if (searchOverlay) {
    searchOverlay.addEventListener("click", (event) => {
      if (event.target === searchOverlay) {
        closeSearchPopup();
      }
    });
  }

  function searchProduct() {
    const query = searchInput?.value.trim();

    if (!query) {
      searchInput?.focus();
      return;
    }

    window.location.href =
      `../shop.html?search=${encodeURIComponent(query)}`;
  }

  if (searchSubmit) {
    searchSubmit.addEventListener("click", searchProduct);
  }

  if (searchInput) {
    searchInput.addEventListener("keydown", (event) => {

      if (event.key === "Enter") {
        event.preventDefault();
        searchProduct();
      }

      if (event.key === "Escape") {
        closeSearchPopup();
      }

    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSearchPopup();
    }
  });


  // ==========================================
  // 3. HELPER FUNCTIONS
  // ==========================================

  function getCart() {
    try {
      const data = JSON.parse(localStorage.getItem(CART_KEY));
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function formatPrice(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN");
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

  function showToast(message) {
    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.foodoraCartToastTimer);

    window.foodoraCartToastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }


  // ==========================================
  // 4. UPDATE HEADER CART COUNT
  // ==========================================

  function updateHeaderCount(cart) {

    const totalItems = cart.reduce((total, item) => {
      return total + Math.max(0, Number(item.quantity) || 0);
    }, 0);

    if (cartCount) {
      cartCount.textContent = totalItems;
    }

  }


  // ==========================================
  // 5. CALCULATE ORDER TOTALS
  // ==========================================

  function calculateTotals(cart) {

    const subtotal = cart.reduce((total, item) => {
      return total + (
        Number(item.price || 0) *
        Number(item.quantity || 0)
      );
    }, 0);

    const shipping = subtotal === 0 || subtotal >= 499 ? 0 : 49;

    let discount = 0;

    if (appliedCoupon === "FOODORA10" && subtotal >= 499) {
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


  // ==========================================
  // 6. RENDER CART PRODUCTS
  // ==========================================

  function renderCart() {

    const cart = getCart();

    if (!cartItems) return;

    updateHeaderCount(cart);

    const totalItems = cart.reduce((total, item) => {
      return total + Number(item.quantity || 0);
    }, 0);

    if (cartItemCount) {
      cartItemCount.textContent = totalItems;
    }


    // Empty cart
    if (cart.length === 0) {

      cartItems.innerHTML = "";

      if (emptyCart) {
        emptyCart.style.display = "block";
      }

      if (cartTable) {
        cartTable.style.display = "none";
      }

      if (checkoutButton) {
        checkoutButton.classList.add("disabled");
        checkoutButton.setAttribute("aria-disabled", "true");
      }

      appliedCoupon = "";
      localStorage.removeItem(COUPON_KEY);

      if (couponInput) couponInput.value = "";

      if (couponMessage) couponMessage.textContent = "";

      updateSummary(cart);

      return;
    }


    // Show products
    if (emptyCart) {
      emptyCart.style.display = "none";
    }

    if (cartTable) {
      cartTable.style.display = "block";
    }

    if (checkoutButton) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.removeAttribute("aria-disabled");
    }


    cartItems.innerHTML = cart.map((item, index) => {

      const title = escapeHTML(item.title || "Foodora Product");
      const image = escapeHTML(item.image || "");
      const price = Number(item.price) || 0;
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const weight = escapeHTML(item.weight || "Standard Pack");

      return `
        <tr>
          <td>
            <div class="cart-product">
              <img src="${image}" alt="${title}"
                onerror="this.src='https://placehold.co/150x150/f0eee5/234b37?text=FOODORA'">

              <div class="cart-product-info">
                <h4>${title}</h4>
                <p>${weight}</p>
              </div>
            </div>
          </td>

          <td>
            <span class="cart-price">${formatPrice(price)}</span>
          </td>

          <td>
            <div class="cart-quantity">
              <button class="quantity-minus"
                data-index="${index}"
                aria-label="Decrease quantity">
                <i class="fa-solid fa-minus"></i>
              </button>

              <span>${quantity}</span>

              <button class="quantity-plus"
                data-index="${index}"
                aria-label="Increase quantity">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </td>

          <td>
            <span class="cart-total">
              ${formatPrice(price * quantity)}
            </span>
          </td>

          <td>
            <button class="remove-cart-item"
              data-index="${index}"
              aria-label="Remove product">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
        </tr>
      `;

    }).join("");


    updateSummary(cart);

  }


  // ==========================================
  // 7. UPDATE ORDER SUMMARY
  // ==========================================

  function updateSummary(cart) {

    const totals = calculateTotals(cart);

    if (cartSubtotal) {
      cartSubtotal.textContent = formatPrice(totals.subtotal);
    }

    if (cartShipping) {
      cartShipping.textContent = totals.shipping === 0 && totals.subtotal > 0
        ? "FREE"
        : formatPrice(totals.shipping);
    }

    if (cartDiscount) {
      cartDiscount.textContent = "-" + formatPrice(totals.discount);
    }

    if (cartTotal) {
      cartTotal.textContent = formatPrice(totals.total);
    }


    if (shippingMessage) {

      if (totals.subtotal >= 499) {
        shippingMessage.innerHTML = `
          <i class="fa-solid fa-circle-check"></i>
          Congratulations! You've unlocked free shipping.
        `;
      } else if (totals.subtotal > 0) {
        shippingMessage.innerHTML = `
          <i class="fa-solid fa-truck-fast"></i>
          Add ${formatPrice(499 - totals.subtotal)} more to unlock free shipping.
        `;
      } else {
        shippingMessage.innerHTML = `
          <i class="fa-solid fa-truck-fast"></i>
          Add products to your cart to unlock free shipping.
        `;
      }

    }

  }


  // ==========================================
  // 8. QUANTITY & REMOVE EVENTS
  // ==========================================

  if (cartItems) {

    cartItems.addEventListener("click", event => {

      const minusButton = event.target.closest(".quantity-minus");
      const plusButton = event.target.closest(".quantity-plus");
      const removeButton = event.target.closest(".remove-cart-item");

      let cart = getCart();


      // Decrease quantity
      if (minusButton) {

        const index = Number(minusButton.dataset.index);

        if (!cart[index]) return;

        if (cart[index].quantity > 1) {
          cart[index].quantity--;
          saveCart(cart);
          renderCart();
        } else {
          showToast("Minimum quantity is 1");
        }

      }


      // Increase quantity
      if (plusButton) {

        const index = Number(plusButton.dataset.index);

        if (!cart[index]) return;

        cart[index].quantity++;

        saveCart(cart);
        renderCart();

      }


      // Remove product
      if (removeButton) {

        const index = Number(removeButton.dataset.index);

        if (!cart[index]) return;

        const removedProduct = cart[index].title;

        cart.splice(index, 1);

        saveCart(cart);
        renderCart();

        showToast(`${removedProduct} removed from cart`);

      }

    });

  }


  // ==========================================
  // 9. CLEAR ENTIRE CART
  // ==========================================

  if (clearCartButton) {

    clearCartButton.addEventListener("click", () => {

      const cart = getCart();

      if (cart.length === 0) {
        showToast("Your cart is already empty");
        return;
      }

      if (confirm("Are you sure you want to clear your cart?")) {

        saveCart([]);

        appliedCoupon = "";
        localStorage.removeItem(COUPON_KEY);

        if (couponInput) couponInput.value = "";
        if (couponMessage) couponMessage.textContent = "";

        renderCart();

        showToast("Your cart has been cleared");

      }

    });

  }


  // ==========================================
  // 10. APPLY COUPON
  // ==========================================

  if (applyCoupon) {

    applyCoupon.addEventListener("click", () => {

      const code = couponInput
        ? couponInput.value.trim().toUpperCase()
        : "";

      const cart = getCart();

      const totals = calculateTotals(cart);

      if (!code) {
        if (couponMessage) {
          couponMessage.textContent = "Please enter a coupon code.";
        }
        return;
      }

      if (code === "FOODORA10") {

        if (totals.subtotal < 499) {
          if (couponMessage) {
            couponMessage.textContent =
              "Minimum order value of ₹499 is required.";
          }
          return;
        }

        appliedCoupon = code;

        localStorage.setItem(COUPON_KEY, code);

        if (couponMessage) {
          couponMessage.textContent =
            "Coupon applied successfully! You saved 10%.";

          couponMessage.style.color = "#3d995e";
        }

        updateSummary(cart);

        showToast("Coupon applied successfully!");

      } else {

        appliedCoupon = "";

        localStorage.removeItem(COUPON_KEY);

        if (couponMessage) {
          couponMessage.textContent = "Invalid coupon code.";
          couponMessage.style.color = "#d94a4a";
        }

        updateSummary(cart);

      }

    });

  }


  // ==========================================
  // 11. RESTORE SAVED COUPON
  // ==========================================

  if (appliedCoupon && couponInput) {

    couponInput.value = appliedCoupon;

    if (couponMessage) {
      couponMessage.textContent = "FOODORA10 coupon applied.";
      couponMessage.style.color = "#3d995e";
    }

  }


  // ==========================================
  // 12. CHECKOUT BUTTON
  // ==========================================

  if (checkoutButton) {

    checkoutButton.addEventListener("click", event => {

      if (getCart().length === 0) {
        event.preventDefault();
        showToast("Your cart is empty!");
      }

    });

  }


  // ==========================================
  // 13. INITIALIZE CART
  // ==========================================

  renderCart();

});