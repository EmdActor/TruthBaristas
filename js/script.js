// ==========================================================================
// THE TRUTH BARISTA — site script
//
// Sections:
// 1) Background crossfade
// 2) Scroll reveal
// 3) Automatic article previews
// 4) Expandable article cards
// 5) Mobile navigation
// 6) Audio toggle
// 7) Search-to-article
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {


  /* ========================================================================
     1) BACKGROUND CROSSFADE
     ======================================================================== */

  var bgLayers = document.querySelectorAll(".bg-layer");
  var overlay = document.querySelector(".site-overlay");
  var bgSections = document.querySelectorAll("[data-bg]");

  var currentBg = "";


  function setOverlay(kind) {

    if (!overlay) return;

    if (kind === "duller") {

      overlay.classList.add("is-duller");

    } else {

      overlay.classList.remove("is-duller");

    }
  }


  if (bgLayers.length === 2 && bgSections.length) {

    var bgObserver = new IntersectionObserver(
      function (entries) {

        entries.forEach(function (entry) {

          if (!entry.isIntersecting) return;


          var img =
            entry.target.getAttribute("data-bg");

          var overlayKind =
            entry.target.getAttribute("data-overlay");


          if (img && img !== currentBg) {

            currentBg = img;


            var active =
              document.querySelector(".bg-layer.is-active");


            var inactive =
              active === bgLayers[0]
                ? bgLayers[1]
                : bgLayers[0];


            inactive.style.backgroundImage =
              "url('" + img + "')";


            void inactive.offsetWidth;


            inactive.classList.add("is-active");

            active.classList.remove("is-active");

          }


          setOverlay(overlayKind);

        });

      },
      {
        threshold: 0.45
      }
    );


    bgSections.forEach(function (section) {

      bgObserver.observe(section);

    });

  }



  /* ========================================================================
     2) SCROLL REVEAL
     ======================================================================== */

  var revealEls =
    document.querySelectorAll(".reveal");


  if (revealEls.length) {

    var revealObserver =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(function (entry) {

            if (entry.isIntersecting) {

              entry.target.classList.add("is-visible");

              revealObserver.unobserve(entry.target);

            }

          });

        },
        {
          threshold: 0.15
        }
      );


    revealEls.forEach(function (el) {

      revealObserver.observe(el);

    });

  }



  /* ========================================================================
     3) AUTOMATIC ARTICLE PREVIEWS

     The preview is generated from the actual article.

     This means you no longer need to write:

       Preview text...

     separately from:

       Actual article...

     The first few paragraphs of the real article become the preview.

     CSS controls the visible height and fades the bottom.
     ======================================================================== */

  var articleEntries =
    document.querySelectorAll(".article-entry");


  articleEntries.forEach(function (card) {

    var previewText =
      card.querySelector(".article-preview-text");


    var articleBody =
      card.querySelector(".article-body");


    if (!previewText || !articleBody) {
      return;
    }


    var paragraphs =
      Array.from(
        articleBody.querySelectorAll("p")
      );


    var preview =
      paragraphs
        .slice(0, 3)
        .map(function (paragraph) {

          return paragraph.textContent.trim();

        })
        .filter(Boolean)
        .join(" ");


    previewText.textContent = preview;

  });



  /* ========================================================================
     4) EXPANDABLE ARTICLE CARDS

     Closed:

       [ Centina ][ Cabides ][ Cabantoc ]

     Open:

       [        Expanded Article        ][Card][Card]

     Only one article per blog can be expanded.
     ======================================================================== */

  var articleLists =
    document.querySelectorAll(".article-list");


  articleLists.forEach(function (list) {


    var cards =
      Array.from(
        list.querySelectorAll(".article-entry")
      );


    function collapseAll() {

      cards.forEach(function (card) {

        card.classList.remove("is-expanded");


        var preview =
          card.querySelector(".article-card-preview");


        if (preview) {

          preview.setAttribute(
            "aria-expanded",
            "false"
          );

        }

      });


      list.classList.remove("has-expanded");

    }



    function expandCard(card) {


      /*
         If the selected article is already open,
         close everything.
      */

      if (card.classList.contains("is-expanded")) {

        collapseAll();

        return;

      }


      /*
         Close all other articles.
      */

      cards.forEach(function (otherCard) {

        otherCard.classList.remove(
          "is-expanded"
        );


        var otherPreview =
          otherCard.querySelector(
            ".article-card-preview"
          );


        if (otherPreview) {

          otherPreview.setAttribute(
            "aria-expanded",
            "false"
          );

        }

      });


      /*
         Move selected article to the beginning.

         Desktop:

         [ EXPANDED ][ small ][ small ]
      */

      list.prepend(card);


      /*
         Open selected article.
      */

      card.classList.add("is-expanded");


      var preview =
        card.querySelector(
          ".article-card-preview"
        );


      if (preview) {

        preview.setAttribute(
          "aria-expanded",
          "true"
        );

      }


      list.classList.add(
        "has-expanded"
      );


      /*
         Mobile positioning.
      */

      if (window.innerWidth <= 700) {

        setTimeout(function () {

          var rect =
            card.getBoundingClientRect();


          if (
            rect.top < 90 ||
            rect.top > window.innerHeight - 100
          ) {

            card.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }

        }, 50);

      }

    }



    /*
       Preview buttons.
    */

    cards.forEach(function (card) {

      var preview =
        card.querySelector(
          ".article-card-preview"
        );


      if (!preview) return;


      preview.addEventListener(
        "click",
        function () {

          expandCard(card);

        }
      );

    });



    /*
       Collapse buttons.
    */

    cards.forEach(function (card) {

      var closeButton =
        card.querySelector(
          ".article-close"
        );


      if (!closeButton) return;


      closeButton.addEventListener(
        "click",
        function (event) {

          event.stopPropagation();

          collapseAll();

        }
      );

    });

  });



  /* ========================================================================
     5) MOBILE NAVIGATION
     ======================================================================== */

  var navToggle =
    document.getElementById(
      "nav-toggle"
    );


  var navPanel =
    document.getElementById(
      "site-nav-panel"
    );


  if (navToggle && navPanel) {


    navToggle.addEventListener(
      "click",
      function () {

        var open =
          navToggle.getAttribute(
            "aria-expanded"
          ) === "true";


        navToggle.setAttribute(
          "aria-expanded",
          String(!open)
        );


        navPanel.classList.toggle(
          "is-open",
          !open
        );

      }
    );



    navPanel
      .querySelectorAll("a")
      .forEach(function (link) {

        link.addEventListener(
          "click",
          function () {

            navToggle.setAttribute(
              "aria-expanded",
              "false"
            );


            navPanel.classList.remove(
              "is-open"
            );

          }
        );

      });

  }



  /* ========================================================================
     6) AUDIO TOGGLE
     ======================================================================== */

  var audio =
    document.getElementById(
      "site-audio"
    );


  var audioBtn =
    document.getElementById(
      "audio-toggle"
    );


  var audioLabel =
    audioBtn
      ? audioBtn.querySelector(
          ".audio-label"
        )
      : null;


  if (audio && audioBtn) {


    audioBtn.addEventListener(
      "click",
      function () {


        if (audio.paused) {


          audio.play().catch(
            function () {

              if (audioLabel) {

                audioLabel.textContent =
                  "Add an audio file";

              }

            }
          );


        } else {

          audio.pause();

        }

      }
    );



    audio.addEventListener(
      "play",
      function () {

        audioBtn.setAttribute(
          "aria-pressed",
          "true"
        );


        if (audioLabel) {

          audioLabel.textContent =
            "Pause music";

        }

      }
    );



    audio.addEventListener(
      "pause",
      function () {

        audioBtn.setAttribute(
          "aria-pressed",
          "false"
        );


        if (audioLabel) {

          audioLabel.textContent =
            "Play music";

        }

      }
    );

  }



  /* ========================================================================
     7) SEARCH FORM
     ======================================================================== */

  var searchForm =
    document.getElementById(
      "site-search"
    );


  var topicSelect =
    document.getElementById(
      "search-topic"
    );


  var authorSelect =
    document.getElementById(
      "search-author"
    );


  if (searchForm) {


    searchForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();


        var topic =
          topicSelect
            ? topicSelect.value
            : "";


        var author =
          authorSelect
            ? authorSelect.value
            : "";


        if (!topic) return;


        /*
           Find requested blog section.
        */

        var section =
          document.getElementById(
            topic
          );


        if (!section) return;


        /*
           If no author is selected,
           simply go to the blog.
        */

        var targetCard = null;


        if (author) {

          targetCard =
            section.querySelector(
              '.article-entry[data-author="' +
              author +
              '"]'
            );

        }


        /*
           Scroll to blog.
        */

        section.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });


        /*
           Open author after scrolling.
        */

        if (targetCard) {

          setTimeout(
            function () {

              var list =
                targetCard.closest(
                  ".article-list"
                );


              if (!list) return;


              var cards =
                Array.from(
                  list.querySelectorAll(
                    ".article-entry"
                  )
                );


              /*
                 Close all cards.
              */

              cards.forEach(
                function (card) {

                  card.classList.remove(
                    "is-expanded"
                  );


                  var preview =
                    card.querySelector(
                      ".article-card-preview"
                    );


                  if (preview) {

                    preview.setAttribute(
                      "aria-expanded",
                      "false"
                    );

                  }

                }
              );


              /*
                 Move requested author
                 to the first position.
              */

              list.prepend(
                targetCard
              );


              targetCard.classList.add(
                "is-expanded"
              );


              var targetPreview =
                targetCard.querySelector(
                  ".article-card-preview"
                );


              if (targetPreview) {

                targetPreview.setAttribute(
                  "aria-expanded",
                  "true"
                );

              }


              list.classList.add(
                "has-expanded"
              );

            },
            350
          );

        }

      }
    );

  }

});
