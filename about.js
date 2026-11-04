
document.addEventListener("DOMContentLoaded", function () {

  // 1. FOOTER YEAR
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // 2. SEARCH ELEMENTS
  const searchToggle = document.getElementById("searchToggle");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchInput = document.getElementById("searchInput");
  const searchClose = document.getElementById("searchClose");
  const searchSubmit = document.getElementById("searchSubmit");

  // 3. OPEN SEARCH POPUP
  if (searchToggle && searchOverlay && searchInput) {

    searchToggle.addEventListener("click", function () {

      searchOverlay.classList.add("active");
      searchOverlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("search-open");

      setTimeout(function () {
        searchInput.focus();
      }, 100);

    });

    // 4. CLOSE SEARCH
    function closeSearch() {

      searchOverlay.classList.remove("active");
      searchOverlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("search-open");

    }

    if (searchClose) {
      searchClose.addEventListener("click", closeSearch);
    }

    // OUTSIDE CLICK
    searchOverlay.addEventListener("click", function (event) {

      if (event.target === searchOverlay) {
        closeSearch();
      }

    });

    // 5. SEARCH PRODUCTS
    function performSearch() {

      const query = searchInput.value.trim();

      if (!query) {
        searchInput.focus();
        return;
      }

      window.location.href =
        "shop.html?search=" + encodeURIComponent(query);

    }

    if (searchSubmit) {
      searchSubmit.addEventListener("click", performSearch);
    }

    // ENTER KEY
    searchInput.addEventListener("keydown", function (event) {

      if (event.key === "Enter") {
        event.preventDefault();
        performSearch();
      }

      if (event.key === "Escape") {
        closeSearch();
      }

    });

    // ESCAPE KEY
    document.addEventListener("keydown", function (event) {

      if (event.key === "Escape") {
        closeSearch();
      }

    });

  }

});
