
// ===================================================================
// SCROLL REVEAL
// ===================================================================

const revealElements =
  document.querySelectorAll(".reveal");

const revealObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add("is-visible");

          // Reveal once, then stop watching it
          revealObserver.unobserve(entry.target);

        }

      });

    },
    {
      threshold: 0.15
    }
  );


revealElements.forEach((el) => {

  revealObserver.observe(el);

});


// ===================================================================
// BACKGROUND CROSSFADE
// Every section that carries data-bg / data-overlay swaps the photo
// (and, on About Us, the overlay darkness) as it scrolls into view.
// Two stacked .bg-layer divs fade into each other so the change is a
// smooth dissolve instead of a hard cut.
// ===================================================================

const bgLayers =
  document.querySelectorAll(".bg-layer");

const siteOverlay =
  document.querySelector(".site-overlay");

let activeLayerIndex = 0;
let currentBgImage =
  bgLayers[0]
    ? bgLayers[0].style.backgroundImage
    : "";

function setBackground(imagePath, overlayMode) {

  const targetUrl = `url('${imagePath}')`;

  if (targetUrl !== currentBgImage) {

    const nextIndex = (activeLayerIndex + 1) % bgLayers.length;
    const nextLayer = bgLayers[nextIndex];
    const currentLayer = bgLayers[activeLayerIndex];

    nextLayer.style.backgroundImage = targetUrl;
    nextLayer.classList.add("is-active");
    currentLayer.classList.remove("is-active");

    activeLayerIndex = nextIndex;
    currentBgImage = targetUrl;

  }

  if (siteOverlay) {

    siteOverlay.classList.toggle(
      "is-duller",
      overlayMode === "duller"
    );

  }

}

const bgSections =
  document.querySelectorAll("[data-bg]");

const bgObserver =
  new IntersectionObserver(
    (entries) => {

      // Of the sections currently on screen, use the one closest
      // to the top of the viewport as the "active" background.
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (a, b) =>
            a.boundingClientRect.top -
            b.boundingClientRect.top
        );

      if (visible.length > 0) {

        const target = visible[0].target;

        setBackground(
          target.dataset.bg,
          target.dataset.overlay
        );

      }

    },
    {
      threshold: 0.35
    }
  );

bgSections.forEach((section) => {

  bgObserver.observe(section);

});


// ===================================================================
// ARTICLE ACCORDION
// Panels stay in the DOM at all times; opening/closing toggles the
// "is-open" class, which CSS animates with a max-height + opacity
// transition for a smooth slide instead of an instant show/hide.
// ===================================================================

document
  .querySelectorAll(".article-entry")
  .forEach((entry) => {

    const toggleBtn =
      entry.querySelector(".article-toggle");

    const panel =
      entry.querySelector(".article-panel");

    const collapseBtns =
      entry.querySelectorAll(".article-collapse");


    const openPanel = () => {

      panel.classList.add("is-open");

      toggleBtn.setAttribute(
        "aria-expanded",
        "true"
      );

    };


    const closePanel = () => {

      panel.classList.remove("is-open");

      toggleBtn.setAttribute(
        "aria-expanded",
        "false"
      );

    };


    toggleBtn.addEventListener(
      "click",
      () => {

        const isOpen =
          toggleBtn.getAttribute(
            "aria-expanded"
          ) === "true";

        if (isOpen) {

          closePanel();

        } else {

          openPanel();

        }

      }
    );


    collapseBtns.forEach((btn) => {

      btn.addEventListener(
        "click",
        () => {

          closePanel();

          toggleBtn.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
          });

        }
      );

    });


    // Allow header search to open this article
    entry.openArticle = openPanel;

  });


// ===================================================================
// HEADER SEARCH
// ===================================================================

const searchForm =
  document.querySelector(".site-search");


if (searchForm) {

  searchForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const topic =
        searchForm.elements.topic.value;

      const author =
        searchForm.elements.author.value;


      // Nothing selected
      if (!topic) {
        return;
      }


      // Build target ID, e.g. "truth-centina" or just "truth"
      const targetId =
        author
          ? `${topic}-${author}`
          : topic;


      const targetEl =
        document.getElementById(targetId);


      // No matching element
      if (!targetEl) {
        return;
      }


      // If an author was selected,
      // open the article automatically.
      if (author) {

        const entry =
          targetEl.closest(".article-entry");


        if (entry && entry.openArticle) {

          entry.openArticle();

        }


        entry.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });


      } else {

        // Otherwise scroll to the topic
        targetEl.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    }
  );

}
