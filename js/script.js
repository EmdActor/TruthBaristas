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

(function () {

  "use strict";

  var game = document.getElementById("ip-game");

  if (!game) return;


  var MAP = [
    "###########",
    "#G...r#R..#",
    "#.#######.#",
    "#....2..#.#",
    "#######.#4#",
    "#...#.#.gE#",
    "#.#.#p#..E#",
    "#B..1.3..E#",
    "###########"
  ];

  var ROWS = MAP.length;
  var COLS = MAP[0].length;

  var IDS = ["green", "red", "blue"];

  var NAMES = { green: "Green", red: "Red", blue: "Blue" };

  var START_KEY = { G: "green", R: "red", B: "blue" };

  var GATES = {
    "1": { tint: "blue", needs: "relay" },
    "2": { tint: "green", needs: "plate" },
    "3": { tint: "blue", needs: "node" },
    "4": { tint: "red", needs: "plate" }
  };

  var DIRS = {
    up: [-1, 0],
    down: [1, 0],
    left: [0, -1],
    right: [0, 1]
  };

  var KEYS = {
    ArrowUp: "up", w: "up", W: "up",
    ArrowDown: "down", s: "down", S: "down",
    ArrowLeft: "left", a: "left", A: "left",
    ArrowRight: "right", d: "right", D: "right"
  };


  var board = game.querySelector(".ip-board");
  var layer = game.querySelector(".ip-pieces");
  var finale = game.querySelector(".ip-finale");
  var statusEl = game.querySelector(".ip-status");

  var cells = [];
  var gates = [];
  var starts = {};
  var relayCell = null;
  var nodeCell = null;
  var plateCell = null;

  var pieces = {};
  var chips = {};

  var state = null;
  var finaleTimer = null;


  /* ------------------------------------------------------------------------
     BUILD THE BOARD
     ------------------------------------------------------------------------ */

  for (var r = 0; r < ROWS; r++) {

    cells[r] = [];

    for (var c = 0; c < COLS; c++) {

      var ch = MAP[r].charAt(c);

      var el = document.createElement("div");

      el.className = "ip-cell";

      if (ch === "#") {

        el.className += " ip-wall";

      } else {

        el.className += " ip-floor";

        if (START_KEY[ch]) {

          starts[START_KEY[ch]] = { r: r, c: c };

        } else if (ch === "E") {

          el.className += " ip-exit";

        } else if (ch === "r") {

          el.className += " ip-relay";
          relayCell = { r: r, c: c };

        } else if (ch === "g") {

          el.className += " ip-node";
          nodeCell = { r: r, c: c };

        } else if (ch === "p") {

          el.className += " ip-plate";
          plateCell = { r: r, c: c };

        } else if (GATES[ch]) {

          el.className += " ip-gate ip-gate-" + GATES[ch].tint;
          gates.push({ el: el, r: r, c: c, tile: ch });

        }
      }

      board.insertBefore(el, layer);

      cells[r][c] = el;

    }
  }


  IDS.forEach(function (id) {

    pieces[id] = layer.querySelector('[data-id="' + id + '"]');

    chips[id] = game.querySelector('.ip-chip[data-id="' + id + '"]');

  });


  /* Missing photographs: keep the glowing circle, hide the broken image. */

  game.querySelectorAll("img").forEach(function (img) {

    function hide() {
      img.style.display = "none";
    }

    img.addEventListener("error", hide);

    if (img.complete && img.naturalWidth === 0) hide();

  });


  /* ------------------------------------------------------------------------
     RULES
     ------------------------------------------------------------------------ */

  function pieceAt(r, c) {

    for (var i = 0; i < IDS.length; i++) {

      var p = state.pos[IDS[i]];

      if (p.r === r && p.c === c) return IDS[i];

    }

    return null;

  }


  function plateHeld() {

    var b = state.pos.blue;

    return b.r === plateCell.r && b.c === plateCell.c;

  }


  function gateOpen(tile) {

    var needs = GATES[tile].needs;

    if (needs === "relay") return state.relay;

    if (needs === "node") return state.node;

    return plateHeld();

  }


  function canEnter(r, c) {

    if (r < 0 || c < 0 || r >= ROWS || c >= COLS) return false;

    var tile = MAP[r].charAt(c);

    if (tile === "#") return false;

    if (pieceAt(r, c)) return false;

    if (GATES[tile]) return gateOpen(tile);

    return true;

  }


  function say(text) {

    statusEl.textContent = text;

  }


  /* ------------------------------------------------------------------------
     DRAWING
     ------------------------------------------------------------------------ */

  function refresh() {

    gates.forEach(function (g) {

      /* A gate never closes on a circle standing inside it. */

      g.el.classList.toggle(
        "is-open",
        gateOpen(g.tile) || !!pieceAt(g.r, g.c)
      );

    });

    cells[relayCell.r][relayCell.c].classList.toggle("is-on", state.relay);
    cells[nodeCell.r][nodeCell.c].classList.toggle("is-on", state.node);
    cells[plateCell.r][plateCell.c].classList.toggle("is-on", plateHeld());

    IDS.forEach(function (id) {

      var p = state.pos[id];
      var el = pieces[id];
      var selected = state.selected === id;

      el.style.setProperty("--r", p.r);
      el.style.setProperty("--c", p.c);

      el.classList.toggle("is-selected", selected);
      el.classList.toggle("is-home", MAP[p.r].charAt(p.c) === "E");

      el.setAttribute("aria-pressed", String(selected));

      chips[id].setAttribute("aria-pressed", String(selected));

    });

  }


  function allHome() {

    return IDS.every(function (id) {

      var p = state.pos[id];

      return MAP[p.r].charAt(p.c) === "E";

    });

  }


  /* ------------------------------------------------------------------------
     ACTIONS
     ------------------------------------------------------------------------ */

  function select(id) {

    if (state.won) return;

    state.selected = id;

    refresh();

  }


  function bump(el) {

    el.classList.remove("is-bump");

    void el.offsetWidth;

    el.classList.add("is-bump");

  }


  function move(dir) {

    if (state.won) return;

    var id = state.selected;
    var p = state.pos[id];
    var d = DIRS[dir];

    var nr = p.r + d[0];
    var nc = p.c + d[1];

    if (!canEnter(nr, nc)) {

      bump(pieces[id]);

      return;

    }

    var wasHeld = plateHeld();

    p.r = nr;
    p.c = nc;

    var tile = MAP[nr].charAt(nc);

    if (id === "green" && tile === "r" && !state.relay) {

      state.relay = true;

      say("Green touched the red relay. Somewhere, a gate opens for Blue.");

    }

    if (id === "red" && tile === "g" && !state.node) {

      state.node = true;

      say("Red lit the green node. Blue's way home is now open.");

    }

    var held = plateHeld();

    if (held && !wasHeld) {

      say("Blue holds the plate. The green and red gates open — while Blue stays.");

    } else if (!held && wasHeld) {

      say("Blue stepped away. The plate gates close again.");

    }

    refresh();

    if (allHome()) complete();

  }


  function complete() {

    state.won = true;

    game.classList.add("is-complete");

    say("All three have arrived.");

    finaleTimer = setTimeout(function () {

      finale.classList.add("is-shown");

      finale.setAttribute("aria-hidden", "false");

    }, 1500);

  }


  function reset() {

    clearTimeout(finaleTimer);

    state = {
      pos: {
        green: { r: starts.green.r, c: starts.green.c },
        red: { r: starts.red.r, c: starts.red.c },
        blue: { r: starts.blue.r, c: starts.blue.c }
      },
      relay: false,
      node: false,
      selected: "green",
      won: false
    };

    game.classList.remove("is-complete");

    finale.classList.remove("is-shown");

    finale.setAttribute("aria-hidden", "true");

    say("Choose a circle, then move it. None of the three can reach the exit alone.");

    refresh();

  }


  /* ------------------------------------------------------------------------
     INPUT
     ------------------------------------------------------------------------ */

  game.addEventListener("keydown", function (event) {

    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (KEYS[event.key]) {

      event.preventDefault();

      move(KEYS[event.key]);

      return;

    }

    if (event.key === "1") select("green");
    if (event.key === "2") select("red");
    if (event.key === "3") select("blue");

  });


  IDS.forEach(function (id) {

    pieces[id].addEventListener("click", function () {
      select(id);
    });

    chips[id].addEventListener("click", function () {
      select(id);
    });

  });


  game.querySelectorAll("[data-dir]").forEach(function (btn) {

    btn.addEventListener("click", function () {
      move(btn.getAttribute("data-dir"));
    });

  });


  game.querySelectorAll(".ip-restart").forEach(function (btn) {

    btn.addEventListener("click", reset);

  });


  reset();

})();
