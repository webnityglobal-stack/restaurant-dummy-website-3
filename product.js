
document.addEventListener("DOMContentLoaded", () => {

  // =====================================
  // FOODORA - ALL PRODUCT DATA
  // =====================================

  const products = {
    101: {
      id: 101,
      title: "Premium Chocolate Bites",
      price: 299,
      oldPrice: 399,
      category: "HEALTHY SNACKS",
      rating: "4.8",
      reviews: 48,
      image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=900&q=90",
      description: "Enjoy delicious premium chocolate bites, perfect for your everyday snacking and special moments.",
      badge: "BEST SELLER"
    },

    102: {
      id: 102,
      title: "Garden Fresh Mix",
      price: 249,
      oldPrice: 329,
      category: "ORGANIC FOODS",
      rating: "4.8",
      reviews: 36,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=90",
      description: "Discover a colourful garden fresh mix, perfect for adding variety to your everyday meals.",
      badge: "POPULAR"
    },

    103: {
      id: 103,
      title: "Royal Nut Selection",
      price: 499,
      oldPrice: 599,
      category: "DRY FRUITS",
      rating: "4.9",
      reviews: 52,
      image: "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=900&q=90",
      description: "Explore our premium nut selection, a delicious choice for everyday snacking.",
      badge: "PREMIUM"
    },

    104: {
      id: 104,
      title: "Signature Food Mix",
      price: 349,
      oldPrice: 449,
      category: "BEVERAGES",
      rating: "4.7",
      reviews: 29,
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=900&q=90",
      description: "Discover our signature foodora selection for a delightful food experience.",
      badge: "NEW"
    },

    105: {
      id: 105,
      title: "Crunchy Makhana",
      price: 199,
      oldPrice: 249,
      category: "HEALTHY SNACKS",
      rating: "4.8",
      reviews: 41,
      image: "https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=900",
      description: "Enjoy crunchy makhana, a convenient snack for your everyday cravings.",
      badge: "POPULAR"
    },

    106: {
      id: 106,
      title: "Premium Almonds",
      price: 399,
      oldPrice: 499,
      category: "DRY FRUITS",
      rating: "4.9",
      reviews: 63,
      image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=900&q=90",
      description: "Discover premium almonds, ideal for adding to your everyday food routine.",
      badge: "PREMIUM"
    },

    107: {
      id: 107,
      title: "Organic Green Bowl",
      price: 279,
      oldPrice: 349,
      category: "ORGANIC FOODS",
      rating: "4.7",
      reviews: 32,
      image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=900&q=90",
      description: "Enjoy a fresh-looking green bowl, inspired by colourful everyday food choices.",
      badge: "ORGANIC"
    },

    108: {
      id: 108,
      title: "Fresh Fruit Drink",
      price: 179,
      oldPrice: 229,
      category: "BEVERAGES",
      rating: "4.8",
      reviews: 27,
      image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=900&q=90",
      description: "Enjoy a refreshing fruit drink for a delightful everyday beverage experience.",
      badge: "POPULAR"
    }
  };

  // =====================================
  // GET SELECTED PRODUCT
  // =====================================

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id") || "101";
  const product = products[productId];

  if (!product) {
    window.location.href = "../shop.html";
    return;
  }

  const cartKey = "foodora_cart";
  const wishlistKey = "foodora_wishlist";

  let quantity = 1;
  let selectedWeight = "100g";

  // =====================================
  // UPDATE PRODUCT DETAILS
  // =====================================

  const mainImage = document.getElementById("mainProductImage");
  const productName = document.getElementById("detailProductName");
  const productPrice = document.getElementById("detailProductPrice");

  if (mainImage) {
    mainImage.src = product.image;
    mainImage.alt = product.title;
  }

  if (productName) {
    productName.textContent = product.title;
  }

  if (productPrice) {
    productPrice.textContent = "₹" + product.price;
  }

  const category = document.querySelector(".detail-category");
  if (category) category.textContent = product.category;

  const badge = document.querySelector(".detail-badge");
  if (badge) {
    badge.textContent = product.badge;
  }

  const shortDescription = document.querySelector(".detail-short-description");
  if (shortDescription) {
    shortDescription.textContent = product.description;
  }

  const oldPrice = document.querySelector(".detail-price del");
  if (oldPrice) {
    oldPrice.textContent = "₹" + product.oldPrice;
  }

  const rating = document.querySelector(".detail-rating");
  if (rating) {
    rating.querySelector(".rating-stars").textContent = "★★★★★";
    rating.querySelector("span").textContent = product.rating;
    rating.querySelector("a").textContent =
      `(${product.reviews} Customer Reviews)`;
  }

  const sku = document.querySelector(".product-meta p");
  if (sku) {
    sku.innerHTML = `<strong>SKU:</strong> FD-${product.id}`;
  }

  const metaCategory = document.querySelectorAll(".product-meta p")[1];
  if (metaCategory) {
    metaCategory.innerHTML =
      `<strong>Category:</strong> ${product.category}`;
  }

  // Update page title
  document.title = product.title + " | FOODORA";

  // =====================================
  // PRODUCT GALLERY
  // =====================================

  const thumbnails = document.querySelectorAll(".thumbnail");

  const galleryImages = [
    product.image,
    product.image,
    product.image,
    product.image
  ];

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.dataset.image = galleryImages[index];

    const img = thumbnail.querySelector("img");
    if (img) img.src = galleryImages[index];

    thumbnail.addEventListener("click", () => {
      if (mainImage) mainImage.src = thumbnail.dataset.image;

      thumbnails.forEach(item => item.classList.remove("active"));
      thumbnail.classList.add("active");
    });
  });

  // =====================================
  // STORAGE HELPERS
  // =====================================

  function getData(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // =====================================
  // TOAST
  // =====================================

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

  // =====================================
  // IMAGE ZOOM
  // =====================================

  const zoomButton = document.querySelector(".gallery-zoom");

  if (zoomButton && mainImage) {
    zoomButton.addEventListener("click", () => {
      window.open(mainImage.src, "_blank");
    });
  }

  // =====================================
  // QUANTITY
  // =====================================

  const quantityDisplay = document.getElementById("productQuantity");

  function updateQuantity() {
    if (quantityDisplay) {
      quantityDisplay.textContent = quantity;
    }
  }

  document.getElementById("increaseQty")?.addEventListener("click", () => {
    quantity++;
    updateQuantity();
  });

  document.getElementById("decreaseQty")?.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      updateQuantity();
    }
  });

  // =====================================
  // PACK SIZE
  // =====================================

  document.querySelectorAll(".weight-option").forEach(option => {
    option.addEventListener("click", () => {
      document.querySelectorAll(".weight-option").forEach(item => {
        item.classList.remove("active");
      });

      option.classList.add("active");
      selectedWeight = option.dataset.weight;

      showToast(selectedWeight + " pack selected");
    });
  });

  // =====================================
  // PRODUCT TABS
  // =====================================

  document.querySelectorAll(".info-tab").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".info-tab").forEach(item =>
        item.classList.remove("active")
      );

      document.querySelectorAll(".tab-panel").forEach(panel =>
        panel.classList.remove("active")
      );

      button.classList.add("active");

      document.getElementById(button.dataset.tab)?.classList.add("active");
    });
  });

  // =====================================
  // CART COUNT
  // =====================================

  function updateCartCount() {
    const cart = getData(cartKey);

    const total = cart.reduce(
      (sum, item) => sum + Number(item.quantity || 0), 0
    );

    const count = document.getElementById("cartCount");
    if (count) count.textContent = total;
  }

  // =====================================
  // ADD TO CART
  // =====================================

  document.getElementById("detailAddToCart")?.addEventListener("click", () => {
    const cart = getData(cartKey);

    const existing = cart.find(item =>
      Number(item.productId) === product.id &&
      item.weight === selectedWeight
    );

    if (existing) {
      existing.quantity = Number(existing.quantity || 0) + quantity;
    } else {
      cart.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity,
        weight: selectedWeight
      });
    }

    saveData(cartKey, cart);
    updateCartCount();
    showToast(product.title + " added to cart!");
  });

  // =====================================
  // WISHLIST
  // =====================================

  const wishlistButton = document.getElementById("detailWishlist");

  function updateWishlistButton() {
    const wishlist = getData(wishlistKey);

    const exists = wishlist.some(item =>
      Number(item.productId) === product.id
    );

    if (wishlistButton) {
      wishlistButton.classList.toggle("active", exists);

      const icon = wishlistButton.querySelector("i");

      if (icon) {
        icon.classList.toggle("fa-solid", exists);
        icon.classList.toggle("fa-regular", !exists);
      }
    }
  }

  wishlistButton?.addEventListener("click", () => {
    const wishlist = getData(wishlistKey);

    const index = wishlist.findIndex(item =>
      Number(item.productId) === product.id
    );

    if (index >= 0) {
      wishlist.splice(index, 1);
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

    saveData(wishlistKey, wishlist);
    updateWishlistButton();
  });

  // =====================================
  // RELATED PRODUCT LINKS
  // =====================================

  document.querySelectorAll(".related-products-grid .product-card").forEach(card => {
    const button = card.querySelector(".quick-add");
    if (!button) return;

    const id = button.dataset.productId;

    card.style.cursor = "pointer";

    card.addEventListener("click", event => {
      if (event.target.closest("button")) return;
      window.location.href = `product.html?id=${id}`;
    });
  });

  // =====================================
  // INITIALIZE
  // =====================================

  updateQuantity();
  updateCartCount();
  updateWishlistButton();

});
// Weight Based Price Selection

const weightOptions = document.querySelectorAll(".weight-option");
const productPrice = document.getElementById("detailProductPrice");

const weightPrices = {
  "100g": 299,
  "250g": 599,
  "500g": 999
};

weightOptions.forEach(option => {

  option.addEventListener("click", function () {

    // Remove active class
    weightOptions.forEach(btn => {
      btn.classList.remove("active");
    });

    // Add active class
    this.classList.add("active");

    // Get selected weight
    const selectedWeight = this.dataset.weight;

    // Update price
    productPrice.textContent =
      "₹" + weightPrices[selectedWeight];

  });

});