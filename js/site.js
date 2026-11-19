(function () {
  "use strict";

  var root = document.documentElement;
  var toggle = document.querySelector("[data-theme-toggle]");
  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  function currentTheme() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (toggle) {
      var next = theme === "dark" ? "light" : "dark";
      toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      toggle.setAttribute("aria-label", "Switch to " + next + " mode");
    }
  }

  applyTheme(currentTheme());

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch (err) {
        /* storage can be blocked; the toggle still works for this view */
      }
    });
  }

  function setNav(open) {
    document.body.classList.toggle("nav-open", open);
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      setNav(!document.body.classList.contains("nav-open"));
    });
  }

  if (nav) {
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNav(false);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setNav(false);
  });

  function onScroll() {
    document.body.classList.toggle("scrolled", window.scrollY > 8);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var sections = document.querySelectorAll("main section[id]");
  var links = document.querySelectorAll("[data-nav] a[href*='#']");

  if (sections.length && links.length && "IntersectionObserver" in window) {
    var visible = new Map();
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        var active = "";
        var best = 0;
        visible.forEach(function (ratio, id) {
          if (ratio > best) {
            best = ratio;
            active = id;
          }
        });
        links.forEach(function (link) {
          var href = link.getAttribute("href") || "";
          var hash = href.slice(href.indexOf("#") + 1);
          if (hash && hash === active) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5] }
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  function openFromHash() {
    var id = (location.hash || "").slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    var details = target.tagName === "DETAILS" ? target : target.querySelector("details");
    if (details) details.open = true;
  }

  openFromHash();
  window.addEventListener("hashchange", openFromHash);

  var printBtn = document.querySelector("[data-print]");
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }
})();
