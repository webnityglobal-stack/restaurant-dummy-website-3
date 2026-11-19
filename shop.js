
document.addEventListener("DOMContentLoaded", () => {

  // 1. ELEMENTS
  const productGrid = document.getElementById("shopProducts");
  const searchInput = document.getElementById("productSearch");
const searchButton =
  document.getElementById("shopSearchToggle") ||
  document.getElementById("searchToggle");
  const sortSelect = document.getElementById("sortProducts");
  const productCount = document.getElementById("productCount");
  const activeCategory = document.getElementById("activeCategory");
  const noProducts = document.getElementById("noProducts");
  const clearFilters = document.getElementById("clearFilters");
  const resetShop = document.getElementById("resetShop");

  // POPUP ELEMENTS
  const searchOverlay = document.getElementById("searchOverlay");
  const popupSearchInput = document.getElementById("searchInput");
  const searchClose = document.getElementById("searchClose");
  const searchSubmit = document.getElementById("searchSubmit");

  // 2. URL PARAMETERS
  const urlParams = new URLSearchParams(window.location.search);

  const urlCategory = urlParams.get("category") || "all";
  const urlSearch = urlParams.get("search") || "";

  const validCategories = [
    "all",
    "snacks",
    "organic",
    "dry-fruits",
    "beverages"
  ];

  let selectedCategory = "all";

  // 3. SEARCH POPUP OPEN
  function openSearch() {
    if (!searchOverlay || !popupSearchInput) return;

    searchOverlay.classList.add("active");
    searchOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("search-open");

    popupSearchInput.value = searchInput ? searchInput.value : "";

    setTimeout(() => {
      popupSearchInput.focus();
    }, 100);
  }

  // 4. SEARCH POPUP CLOSE
  function closeSearch() {
    if (!searchOverlay) return;

    searchOverlay.classList.remove("active");
    searchOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("search-open");
  }

  // HEADER SEARCH ICON
  if (searchButton) {
    searchButton.addEventListener("click", (event) => {
      event.preventDefault();
      openSearch();
    });
  }

  // CLOSE BUTTON
  if (searchClose) {
    searchClose.addEventListener("click", closeSearch);
  }

  // OUTSIDE CLICK
  if (searchOverlay) {
    searchOverlay.addEventListener("click", (event) => {
      if (event.target === searchOverlay) {
        closeSearch();
      }
    });
  }

  // 5. POPUP SEARCH SUBMIT
  function performSearch() {
    if (!popupSearchInput) return;

    const query = popupSearchInput.value.trim();

    if (!query) {
      popupSearchInput.focus();
      return;
    }

    // Apply search to shop input
    if (searchInput) {
      searchInput.value = query;
      filterProducts();
      updateSearchURL();
    } else {
      window.location.href =
        "shop.html?search=" + encodeURIComponent(query);
      return;
    }

    closeSearch();

    // Scroll to products
    if (productGrid) {
      productGrid.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  if (searchSubmit) {
    searchSubmit.addEventListener("click", performSearch);
  }

  if (popupSearchInput) {
    popupSearchInput.addEventListener("keydown", (event) => {

      if (event.key === "Enter") {
        event.preventDefault();
        performSearch();
      }

      if (event.key === "Escape") {
        closeSearch();
      }

    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSearch();
    }
  });

  // 6. PRODUCT GRID
  if (!productGrid) {
    console.error("Product grid #shopProducts not found!");
    return;
  }

  const products = Array.from(
    productGrid.querySelectorAll(".product-card")
  );

  const filterButtons = document.querySelectorAll(".filter-btn");

  // 7. CATEGORY FILTER
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

  // 8. SEARCH INPUT
  if (searchInput) {

    searchInput.value = urlSearch;

    searchInput.addEventListener("input", () => {
      filterProducts();
      updateSearchURL();
    });

    searchInput.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        filterProducts();
      }
    });
  }

  // 9. UPDATE URL
  function updateSearchURL() {

    const params = new URLSearchParams(window.location.search);

    const keyword = searchInput?.value.trim() || "";

    if (keyword) {
      params.set("search", keyword);
    } else {
      params.delete("search");
    }

    const newURL = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.replaceState({}, "", newURL);
  }

  // 10. SORT
  if (sortSelect) {
    sortSelect.addEventListener("change", filterProducts);
  }

  // 11. FILTER PRODUCTS
  function filterProducts() {

    const searchTerm = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";

    const sortValue = sortSelect
      ? sortSelect.value
      : "featured";

    let visibleProducts = products.filter(product => {

      const name = (product.dataset.name || "").toLowerCase();

      const category = (
        product.dataset.category || ""
      ).toLowerCase();

      const productText = (
        name + " " + category + " " + product.textContent
      ).toLowerCase();

      const categoryMatch =
        selectedCategory === "all" ||
        category === selectedCategory;

      const searchMatch = productText.includes(searchTerm);

      return categoryMatch && searchMatch;
    });

    // SORTING
    if (sortValue === "low-high") {

      visibleProducts.sort((a, b) =>
        Number(a.dataset.price || 0) -
        Number(b.dataset.price || 0)
      );

    } else if (sortValue === "high-low") {

      visibleProducts.sort((a, b) =>
        Number(b.dataset.price || 0) -
        Number(a.dataset.price || 0)
      );

    } else if (sortValue === "name") {

      visibleProducts.sort((a, b) =>
        (a.dataset.name || "").localeCompare(
          b.dataset.name || ""
        )
      );
    }

    // HIDE ALL PRODUCTS
    products.forEach(product => {
      product.style.display = "none";
    });

    // SHOW MATCHING PRODUCTS
    visibleProducts.forEach(product => {
      product.style.display = "";
      productGrid.appendChild(product);
    });

    // PRODUCT COUNT
    if (productCount) {
      productCount.textContent = visibleProducts.length;
    }

    // NO PRODUCTS FOUND
    if (noProducts) {
      noProducts.style.display =
        visibleProducts.length === 0 ? "block" : "none";
    }
  }

  // 12. RESET FILTERS
  function resetFilters() {

    selectedCategory = "all";

    if (searchInput) {
      searchInput.value = "";
    }

    if (popupSearchInput) {
      popupSearchInput.value = "";
    }

    if (sortSelect) {
      sortSelect.value = "featured";
    }

    window.history.replaceState(
      {},
      "",
      window.location.pathname
    );

    setActiveCategory("all");
  }

  if (clearFilters) {
    clearFilters.addEventListener("click", resetFilters);
  }

  if (resetShop) {
    resetShop.addEventListener("click", resetFilters);
  }

  // 13. INITIALIZE
  if (validCategories.includes(urlCategory)) {
    selectedCategory = urlCategory;
  }

  setActiveCategory(selectedCategory);

  filterProducts();
  
/* PRODUCT DETAILS REDIRECT FIX */

products.forEach(card => {

  card.style.cursor = "pointer";

  card.addEventListener("click", function(event) {

    if (event.target.closest("button")) return;

    const productButton = card.querySelector(".quick-add");

    if (!productButton) return;

    const productId = productButton.dataset.productId;

    if (!productId) return;

    window.location.href = "product.html?id=" + productId;

  });

});

});
