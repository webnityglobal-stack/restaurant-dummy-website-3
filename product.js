
document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // 1. PRODUCT DATA
  // ==========================================

  const product = {
    id: 101,
    title: "Premium Chocolate Bites",
    price: 299,
    image: "https://images.unsplash.com/photo-1548907040-4d42c7f8e2b7?w=900&q=90"
  };

  const cartKey = "foodora_cart";
  const wishlistKey = "foodora_wishlist";

  let quantity = 1;
  let selectedWeight = "100g";


  // ==========================================
  // 2. LOCAL STORAGE HELPERS
  // ==========================================

  function getStorageData(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
      return [];
    }
  }

  function saveStorageData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }


  // ==========================================
  // 3. TOAST MESSAGE
  // ==========================================

  function showToast(message) {
    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.foodoraDetailToastTimer);

    window.foodoraDetailToastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }


  // ==========================================
  // 4. PRODUCT IMAGE GALLERY
  // ==========================================

  const mainImage = document.getElementById("mainProductImage");
  const thumbnails = document.querySelectorAll(".thumbnail");

  thumbnails.forEach(thumbnail => {

    thumbnail.addEventListener("click", () => {

      const newImage = thumbnail.dataset.image;

      if (!newImage || !mainImage) return;

      mainImage.src = newImage;

      thumbnails.forEach(item => {
        item.classList.remove("active");
      });

      thumbnail.classList.add("active");

    });

  });


  // ==========================================
  // 5. IMAGE ZOOM
  // ==========================================

  const zoomButton = document.querySelector(".gallery-zoom");

  if (zoomButton && mainImage) {

    zoomButton.addEventListener("click", () => {

      const imageWindow = window.open("", "_blank");

      if (imageWindow) {
        imageWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>FOODORA Product Image</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body {
                margin: 0;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #171717;
              }
              img {
                max-width: 100%;
                max-height: 100vh;
                object-fit: contain;
              }
            </style>
          </head>
          <body>
            <img src="${mainImage.src}" alt="Product Image">
          </body>
          </html>
        `);

        imageWindow.document.close();
      }

    });

  }


  // ==========================================
  // 6. QUANTITY SELECTOR
  // ==========================================

  const quantityDisplay = document.getElementById("productQuantity");
  const decreaseButton = document.getElementById("decreaseQty");
  const increaseButton = document.getElementById("increaseQty");

  function updateQuantity() {
    if (quantityDisplay) {
      quantityDisplay.textContent = quantity;
    }
  }

  if (increaseButton) {
    increaseButton.addEventListener("click", () => {
      quantity++;

      updateQuantity();
    });
  }

  if (decreaseButton) {
    decreaseButton.addEventListener("click", () => {

      if (quantity > 1) {
        quantity--;
        updateQuantity();
      } else {
        showToast("Minimum quantity is 1");
      }

    });
  }


  // ==========================================
  // 7. WEIGHT / PACK SIZE SELECTION
  // ==========================================

  const weightOptions = document.querySelectorAll(".weight-option");

  weightOptions.forEach(option => {

    option.addEventListener("click", () => {

      weightOptions.forEach(item => {
        item.classList.remove("active");
      });

      option.classList.add("active");

      selectedWeight = option.dataset.weight;

      showToast(`${selectedWeight} pack selected`);

    });

  });


  // ==========================================
  // 8. PRODUCT TABS
  // ==========================================

  const tabButtons = document.querySelectorAll(".info-tab");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach(button => {

    button.addEventListener("click", () => {

      const targetTab = button.dataset.tab;

      tabButtons.forEach(item => {
        item.classList.remove("active");
      });

      tabPanels.forEach(panel => {
        panel.classList.remove("active");
      });

      button.classList.add("active");

      const targetPanel = document.getElementById(targetTab);

      if (targetPanel) {
        targetPanel.classList.add("active");
      }

    });

  });


  // ==========================================
  // 9. UPDATE HEADER CART COUNT
  // ==========================================

  function updateCartCount() {

    const cart = getStorageData(cartKey);

    const totalItems = cart.reduce((total, item) => {
      return total + Number(item.quantity || 0);
    }, 0);

    const cartCount = document.getElementById("cartCount");

    if (cartCount) {
      cartCount.textContent = totalItems;
    }

  }


  // ==========================================
  // 10. ADD TO CART
  // ==========================================

  const addToCartButton = document.getElementById("detailAddToCart");

  if (addToCartButton) {

    addToCartButton.addEventListener("click", () => {

      let cart = getStorageData(cartKey);

      const existingProduct = cart.find(
        item => item.productId === product.id
      );

      if (existingProduct) {

        existingProduct.quantity += quantity;

      } else {

        cart.push({
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: quantity,
          weight: selectedWeight
        });

      }

      saveStorageData(cartKey, cart);

      updateCartCount();

      showToast(`${product.title} added to cart!`);

    });

  }


  // ==========================================
  // 11. PRODUCT WISHLIST
  // ==========================================

  const wishlistButton = document.getElementById("detailWishlist");

  function updateWishlistButton() {

    const wishlist = getStorageData(wishlistKey);

    const isWishlisted = wishlist.some(
      item => item.productId === product.id
    );

    if (wishlistButton) {

      const icon = wishlistButton.querySelector("i");

      wishlistButton.classList.toggle("active", isWishlisted);

      if (icon) {
        icon.classList.toggle("fa-solid", isWishlisted);
        icon.classList.toggle("fa-regular", !isWishlisted);
      }

    }

  }

  if (wishlistButton) {

    wishlistButton.addEventListener("click", () => {

      let wishlist = getStorageData(wishlistKey);

      const existingIndex = wishlist.findIndex(
        item => item.productId === product.id
      );

      if (existingIndex >= 0) {

        wishlist.splice(existingIndex, 1);

        showToast("Removed from wishlist");

      } else {

        wishlist.push({
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.image
        });

        showToast("Added to wishlist!");

      }

      saveStorageData(wishlistKey, wishlist);

      updateWishlistButton();

    });

  }


  // ==========================================
  // 12. INITIAL PAGE SETUP
  // ==========================================

  updateQuantity();
  updateCartCount();
  updateWishlistButton();

});
