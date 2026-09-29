(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal");

  if (!reduce && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("in");
    });
  }

  var bar = document.querySelector(".progress");
  function onScroll() {
    var height = document.documentElement.scrollHeight - window.innerHeight;
    var progress = height > 0 ? window.scrollY / height : 0;
    if (bar) bar.style.transform = "scaleX(" + progress + ")";
    markActive();
  }

  var links = document.querySelectorAll(".topbar nav a");
  var sections = Array.prototype.map.call(links, function (link) {
    return document.querySelector(link.getAttribute("href"));
  });

  function markActive() {
    var pos = window.scrollY + 140;
    var current = 0;
    sections.forEach(function (section, index) {
      if (section && section.offsetTop <= pos) current = index;
    });
    links.forEach(function (link, index) {
      link.classList.toggle("active", index === current);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var glow = document.querySelector(".pointer-light");
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  if (glow && !reduce && finePointer) {
    var x = window.innerWidth * 0.65;
    var y = window.innerHeight * 0.35;
    var tx = x;
    var ty = y;
    window.addEventListener("pointermove", function (event) {
      tx = event.clientX;
      ty = event.clientY;
    });
    function tick() {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      glow.style.transform = "translate(" + x + "px, " + y + "px)";
      requestAnimationFrame(tick);
    }
    tick();
  } else if (glow) {
    glow.remove();
  }
})();
