
document.addEventListener("DOMContentLoaded", function () {

  // FOOTER YEAR
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // SEARCH POPUP
  const searchToggle = document.getElementById("searchToggle");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchInput = document.getElementById("searchInput");
  const searchClose = document.getElementById("searchClose");
  const searchSubmit = document.getElementById("searchSubmit");

  if (searchToggle && searchOverlay && searchInput) {

    searchToggle.addEventListener("click", function () {
      searchOverlay.classList.add("active");
      searchOverlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("search-open");
      searchInput.focus();
    });

    function closeSearch() {
      searchOverlay.classList.remove("active");
      searchOverlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("search-open");
    }

    if (searchClose) {
      searchClose.addEventListener("click", closeSearch);
    }

    searchOverlay.addEventListener("click", function (event) {
      if (event.target === searchOverlay) {
        closeSearch();
      }
    });

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

    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") performSearch();
      if (event.key === "Escape") closeSearch();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeSearch();
    });
  }

  // FAQ ACCORDION
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(function (item) {

    const question = item.querySelector(".faq-question");

    question.addEventListener("click", function () {

      const isActive = item.classList.contains("active");

      faqItems.forEach(function (faq) {
        faq.classList.remove("active");
      });

      if (!isActive) {
        item.classList.add("active");
      }

    });

  });

  // CONTACT FORM
  const contactForm = document.getElementById("contactForm");
  const contactStatus = document.getElementById("contactStatus");

  if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      contactStatus.style.color = "#234b37";
      contactStatus.textContent =
        "Form design is ready. Connect an email service or backend API to submit your message.";

    });

  }

});
// CONTACT PAGE SEARCH POPUP
const searchToggle = document.getElementById("searchToggle");
const searchOverlay = document.getElementById("searchOverlay");
const searchInput = document.getElementById("searchInput");
const searchClose = document.getElementById("searchClose");
const searchSubmit = document.getElementById("searchSubmit");

function openSearch() {
  if (!searchOverlay) return;

  searchOverlay.classList.add("active");
  searchOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("search-open");

  setTimeout(() => searchInput?.focus(), 100);
}

function closeSearch() {
  if (!searchOverlay) return;

  searchOverlay.classList.remove("active");
  searchOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("search-open");
}

searchToggle?.addEventListener("click", openSearch);
searchClose?.addEventListener("click", closeSearch);

searchOverlay?.addEventListener("click", (e) => {
  if (e.target === searchOverlay) closeSearch();
});

searchSubmit?.addEventListener("click", () => {
  const query = searchInput?.value.trim();

  if (query) {
    window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
  }
});

searchInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchSubmit?.click();
  if (e.key === "Escape") closeSearch();
});