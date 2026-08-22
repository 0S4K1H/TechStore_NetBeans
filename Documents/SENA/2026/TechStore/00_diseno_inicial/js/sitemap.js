(function () {
  function init() {
    const tree = document.getElementById("siteTree");
    const expandAllBtn = document.getElementById("expandAllBtn");
    const collapseAllBtn = document.getElementById("collapseAllBtn");
    if (!tree || !expandAllBtn || !collapseAllBtn) {
      return;
    }

    const toggles = Array.from(tree.querySelectorAll(".node-toggle"));
    toggles.forEach(function (toggle) {
      toggle.addEventListener("click", function () {
        const node = toggle.closest("li");
        const children = node ? node.querySelector(":scope > .tree-children") : null;
        if (!children) {
          return;
        }
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        toggle.classList.toggle("is-open", !expanded);
        children.hidden = expanded;
      });
    });

    function setAll(expand) {
      toggles.forEach(function (toggle) {
        const node = toggle.closest("li");
        const children = node ? node.querySelector(":scope > .tree-children") : null;
        if (!children) {
          return;
        }
        toggle.setAttribute("aria-expanded", String(expand));
        toggle.classList.toggle("is-open", expand);
        children.hidden = !expand;
      });
    }

    expandAllBtn.addEventListener("click", function () {
      setAll(true);
    });

    collapseAllBtn.addEventListener("click", function () {
      setAll(false);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
