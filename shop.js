
document.addEventListener("DOMContentLoaded", () => {

  // 1. ELEMENTS
  const productGrid = document.getElementById("shopProducts");
  const searchInput = document.getElementById("productSearch");
  const searchButton = document.getElementById("shopSearchToggle");
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

  // 2. HEADER SEARCH ICON
  if (searchButton && searchInput) {
    searchButton.addEventListener("click", () => {
      searchInput.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      setTimeout(() => {
        searchInput.focus();
      }, 400);
    });
  }

  // 3. URL PARAMETERS
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

  // 4. CATEGORY FILTER
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

  // 5. SEARCH
  if (searchInput) {
    searchInput.value = urlSearch;

    searchInput.addEventListener("input", () => {
      filterProducts();
      updateSearchURL();
    });
  }

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

  // 6. SORT
  if (sortSelect) {
    sortSelect.addEventListener("change", filterProducts);
  }

  // 7. FILTER + SEARCH + SORT
  function filterProducts() {
    const searchTerm = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";

    const sortValue = sortSelect
      ? sortSelect.value
      : "featured";

    let visibleProducts = products.filter(product => {
      const name = (product.dataset.name || "").toLowerCase();
      const category = (product.dataset.category || "").toLowerCase();

      const productText = (
        name + " " + category + " " + product.textContent
      ).toLowerCase();

      const categoryMatch =
        selectedCategory === "all" ||
        category === selectedCategory;

      const searchMatch = productText.includes(searchTerm);

      return categoryMatch && searchMatch;
    });

    // Sorting
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
        (a.dataset.name || "").localeCompare(b.dataset.name || "")
      );
    }

    // Hide all products
    products.forEach(product => {
      product.style.display = "none";
    });

    // Show matching products
    visibleProducts.forEach(product => {
      product.style.display = "";
      productGrid.appendChild(product);
    });

    // Product count
    if (productCount) {
      productCount.textContent = visibleProducts.length;
    }

    // No products found
    if (noProducts) {
      noProducts.style.display =
        visibleProducts.length === 0 ? "block" : "none";
    }
  }

  // 8. RESET FILTERS
  function resetFilters() {
    selectedCategory = "all";

    if (searchInput) searchInput.value = "";
    if (sortSelect) sortSelect.value = "featured";

    setActiveCategory("all");

    window.history.replaceState(
      {},
      "",
      window.location.pathname
    );
  }

  if (clearFilters) {
    clearFilters.addEventListener("click", resetFilters);
  }

  if (resetShop) {
    resetShop.addEventListener("click", resetFilters);
  }

  // 9. INITIALIZE
  if (validCategories.includes(urlCategory)) {
    setActiveCategory(urlCategory);
  } else {
    setActiveCategory("all");
  }

  filterProducts();

});
