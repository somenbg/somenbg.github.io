(function () {
  "use strict";

  const nav = document.getElementById("sideNav");
  const toggler = nav.querySelector(".navbar-toggler");
  const collapse = nav.querySelector(".navbar-collapse");
  const navLinks = nav.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".resume-section");

  // Mobile menu toggle
  toggler.addEventListener("click", function () {
    collapse.classList.toggle("show");
  });

  // Close mobile menu on link click
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      collapse.classList.remove("show");
    });
  });

  // Scrollspy: highlight active nav link based on scroll position
  function onScroll() {
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var bottom = top + section.offsetHeight;
      var id = section.getAttribute("id");
      var link = nav.querySelector('.nav-link[href="#' + id + '"]');
      if (link) {
        if (scrollPos >= top && scrollPos < bottom) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
