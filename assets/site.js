(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal");

  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        revealIO.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    reveals.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        el.classList.add("is-in");
      } else {
        revealIO.observe(el);
      }
    });
  }

  var chapters = document.querySelectorAll("[data-chapter]");
  var links = document.querySelectorAll("[data-chapter-link]");
  if (!chapters.length || !links.length || !("IntersectionObserver" in window)) return;

  var chapterIO = new IntersectionObserver(function (entries) {
    var best = null;
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
    });
    if (!best) return;
    var id = best.target.getAttribute("data-chapter");
    links.forEach(function (link) {
      if (link.getAttribute("data-chapter-link") === id) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }, { rootMargin: "-35% 0px -45% 0px", threshold: [0.15, 0.4, 0.7] });

  chapters.forEach(function (chapter) { chapterIO.observe(chapter); });
})();
