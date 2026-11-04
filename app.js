
document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // 1. MOBILE NAVIGATION
  // ==========================================

  const menuToggle = document.getElementById("menuToggle");
  const navbar = document.getElementById("navbar");

  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      navbar.classList.toggle("active");

      const isOpen = navbar.classList.contains("active");
      menuToggle.setAttribute("aria-expanded", isOpen);
    });

    // Close menu after clicking a navigation link
    navbar.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navbar.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (
        !navbar.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        navbar.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }


  // ==========================================
  // 2. FOOTER YEAR
  // ==========================================

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  // ==========================================
  // 3. TOAST NOTIFICATION
  // ==========================================

  function showToast(message) {
    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.foodoraToastTimer);

    window.foodoraToastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }


  // ==========================================
  // 4. LOCAL STORAGE HELPERS
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
  // 5. CART FUNCTIONALITY
  // ==========================================

  const cartKey = "foodora_cart";

  function getCart() {
    return getStorageData(cartKey);
  }

  function updateCartCount() {
    const cart = getCart();

    const totalItems = cart.reduce((total, item) => {
      return total + Number(item.quantity || 0);
    }, 0);

    const cartCount = document.getElementById("cartCount");

    if (cartCount) {
      cartCount.textContent = totalItems;
    }
  }

  function getProductDetails(button) {
    const productCard = button.closest(".product-card");

    if (!productCard) return null;

    const title =
      productCard.querySelector(".product-info h3")?.textContent.trim() ||
      "Food Product";

    const priceText =
      productCard.querySelector(".product-price strong")?.textContent || "0";

    const price = Number(priceText.replace(/[^0-9.]/g, ""));

    const image =
      productCard.querySelector(".product-image img")?.src || "";

    const productId = Number(button.dataset.productId);

    return {
      productId,
      title,
      price,
      image,
      quantity: 1
    };
  }

  document.querySelectorAll(".quick-add").forEach(button => {
    button.addEventListener("click", () => {
      const product = getProductDetails(button);

      if (!product) return;

      let cart = getCart();

      const existingProduct = cart.find(
        item => item.productId === product.productId
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.push(product);
      }

      saveStorageData(cartKey, cart);
      updateCartCount();

      showToast(`${product.title} added to cart!`);
    });
  });


  // ==========================================
  // 6. WISHLIST FUNCTIONALITY
  // ==========================================

  const wishlistKey = "foodora_wishlist";

  function updateWishlistButtons() {
    const wishlist = getStorageData(wishlistKey);

    document.querySelectorAll(".wishlist-btn").forEach(button => {
      const productCard = button.closest(".product-card");

      if (!productCard) return;

      const addButton = productCard.querySelector(".quick-add");

      if (!addButton) return;

      const productId = Number(addButton.dataset.productId);
      const isWishlisted = wishlist.some(
        item => item.productId === productId
      );

      const icon = button.querySelector("i");

      if (icon) {
        icon.classList.toggle("fa-solid", isWishlisted);
        icon.classList.toggle("fa-regular", !isWishlisted);
      }

      button.classList.toggle("active", isWishlisted);
    });
  }

  document.querySelectorAll(".wishlist-btn").forEach(button => {
    button.addEventListener("click", () => {
      const product = getProductDetails(
        button.closest(".product-card")?.querySelector(".quick-add")
      );

      if (!product) return;

      let wishlist = getStorageData(wishlistKey);

      const existingIndex = wishlist.findIndex(
        item => item.productId === product.productId
      );

      if (existingIndex >= 0) {
        wishlist.splice(existingIndex, 1);
        showToast("Removed from wishlist");
      } else {
        wishlist.push({
          productId: product.productId,
          title: product.title,
          price: product.price,
          image: product.image
        });

        showToast("Added to wishlist!");
      }

      saveStorageData(wishlistKey, wishlist);
      updateWishlistButtons();
    });
  });


  // ==========================================
  // 7. NEWSLETTER SUBSCRIPTION
  // ==========================================

  const newsletterForm = document.getElementById("newsletterForm");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", event => {
      event.preventDefault();

      const emailInput = newsletterForm.querySelector("input[type='email']");

      if (!emailInput || !emailInput.value.trim()) {
        showToast("Please enter your email address");
        return;
      }

      showToast("Thank you for subscribing!");

      newsletterForm.reset();
    });
  }


  // ==========================================
  // 8. INITIAL PAGE SETUP
  // ==========================================

  updateCartCount();
  updateWishlistButtons();

});

document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // 1. ELEMENTS
  // ==========================================

  const productGrid = document.getElementById("shopProducts");
  const searchInput = document.getElementById("productSearch");
  const sortSelect = document.getElementById("sortProducts");
  const productCount = document.getElementById("productCount");
  const activeCategory = document.getElementById("activeCategory");
  const noProducts = document.getElementById("noProducts");
  const clearFilters = document.getElementById("clearFilters");
  const resetShop = document.getElementById("resetShop");

  if (!productGrid) return;

  const products = Array.from(
    productGrid.querySelectorAll(".product-card")
  );

  const filterButtons = document.querySelectorAll(".filter-btn");

  let selectedCategory = "all";


  // ==========================================
  // 2. CATEGORY FILTER
  // ==========================================

  function setActiveCategory(category) {
    selectedCategory = category;

    filterButtons.forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.category === category
      );
    });

    const selectedButton = Array.from(filterButtons).find(
      button => button.dataset.category === category
    );

    if (activeCategory) {
      activeCategory.textContent = selectedButton
        ? selectedButton.querySelector("span")?.textContent.trim() ||
          selectedButton.textContent.trim()
        : "All Products";
    }

    filterProducts();
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      setActiveCategory(button.dataset.category);
    });
  });


  // ==========================================
  // 3. SEARCH FUNCTIONALITY
  // ==========================================

  if (searchInput) {
    searchInput.addEventListener("input", filterProducts);
  }


  // ==========================================
  // 4. SORT PRODUCTS
  // ==========================================

  if (sortSelect) {
    sortSelect.addEventListener("change", filterProducts);
  }


  // ==========================================
  // 5. FILTER + SEARCH + SORT
  // ==========================================

  function filterProducts() {

    const searchTerm = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";

    const sortValue = sortSelect
      ? sortSelect.value
      : "featured";

    let visibleProducts = products.filter(product => {

      const category = product.dataset.category;
      const name = (product.dataset.name || "").toLowerCase();

      const categoryMatch =
        selectedCategory === "all" ||
        category === selectedCategory;

      const searchMatch = name.includes(searchTerm);

      return categoryMatch && searchMatch;
    });


    // Sorting
    if (sortValue === "low-high") {
      visibleProducts.sort((a, b) => {
        return Number(a.dataset.price) - Number(b.dataset.price);
      });
    }

    else if (sortValue === "high-low") {
      visibleProducts.sort((a, b) => {
        return Number(b.dataset.price) - Number(a.dataset.price);
      });
    }

    else if (sortValue === "name") {
      visibleProducts.sort((a, b) => {
        return (a.dataset.name || "").localeCompare(
          b.dataset.name || ""
        );
      });
    }


    // Hide all products first
    products.forEach(product => {
      product.style.display = "none";
    });

    // Display matching products in sorted order
    visibleProducts.forEach(product => {
      product.style.display = "";
      productGrid.appendChild(product);
    });


    // Update product count
    if (productCount) {
      productCount.textContent = visibleProducts.length;
    }

    // No products message
    if (noProducts) {
      noProducts.style.display =
        visibleProducts.length === 0 ? "block" : "none";
    }

  }


  // ==========================================
  // 6. CLEAR FILTERS
  // ==========================================

  function resetFilters() {

    selectedCategory = "all";

    if (searchInput) {
      searchInput.value = "";
    }

    if (sortSelect) {
      sortSelect.value = "featured";
    }

    setActiveCategory("all");

  }

  if (clearFilters) {
    clearFilters.addEventListener("click", resetFilters);
  }

  if (resetShop) {
    resetShop.addEventListener("click", resetFilters);
  }


  // ==========================================
  // 7. URL CATEGORY SUPPORT
  // ==========================================

  const urlParams = new URLSearchParams(window.location.search);
  const urlCategory = urlParams.get("category");

  const validCategories = [
    "all",
    "snacks",
    "organic",
    "dry-fruits",
    "beverages"
  ];

  if (urlCategory && validCategories.includes(urlCategory)) {
    setActiveCategory(urlCategory);
  } else {
    setActiveCategory("all");
  }


  // ==========================================
  // 8. INITIAL PRODUCT COUNT
  // ==========================================

  filterProducts();

});
