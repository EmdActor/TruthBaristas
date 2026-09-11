// ==========================================================================
// THE TRUTH BARISTA — site script
// Sections: 1) background crossfade  2) scroll reveal  3) accordions
//           4) mobile nav  5) audio toggle  6) search-to-article
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------------------------------------------------
     1) BACKGROUND CROSSFADE
     Every section with data-bg gets watched; when it becomes the main
     thing on screen, the currently-inactive layer is loaded with that
     section's image and faded in, then the layers swap roles.
  ------------------------------------------------------------------ */
  var bgLayers = document.querySelectorAll('.bg-layer');
  var overlay = document.querySelector('.site-overlay');
  var bgSections = document.querySelectorAll('[data-bg]');
  var currentBg = '';

  function setOverlay(kind) {
    if (kind === 'duller') {
      overlay.classList.add('is-duller');
    } else {
      overlay.classList.remove('is-duller');
    }
  }

  if (bgLayers.length === 2 && bgSections.length) {
    var bgObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var img = entry.target.getAttribute('data-bg');
        var overlayKind = entry.target.getAttribute('data-overlay');
        if (img && img !== currentBg) {
          currentBg = img;
          var active = document.querySelector('.bg-layer.is-active');
          var inactive = active === bgLayers[0] ? bgLayers[1] : bgLayers[0];
          inactive.style.backgroundImage = 'url(' + img + ')';
          // Force a reflow so the transition actually plays before swapping classes
          void inactive.offsetWidth;
          inactive.classList.add('is-active');
          active.classList.remove('is-active');
        }
        setOverlay(overlayKind);
      });
    }, { threshold: 0.45 });

    bgSections.forEach(function (section) { bgObserver.observe(section); });
  }

  /* ------------------------------------------------------------------
     2) SCROLL REVEAL
  ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------------------------------
     3) ACCORDIONS (article toggle / collapse buttons)
  ------------------------------------------------------------------ */
  document.querySelectorAll('.article-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
    });
  });

  document.querySelectorAll('.article-collapse').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.closest('.article-panel');
      if (!panel) return;
      var toggle = document.querySelector('[aria-controls="' + panel.id + '"]');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ------------------------------------------------------------------
     4) MOBILE NAV
  ------------------------------------------------------------------ */
  var navToggle = document.getElementById('nav-toggle');
  var navPanel = document.getElementById('site-nav-panel');

  if (navToggle && navPanel) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      navPanel.classList.toggle('is-open', !open);
    });

    navPanel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        navPanel.classList.remove('is-open');
      });
    });
  }

  /* ------------------------------------------------------------------
     5) AUDIO TOGGLE
     Placeholder <audio> — point its <source> at your own file in the
     HTML. This just handles the play/pause button and its label.
  ------------------------------------------------------------------ */
  var audio = document.getElementById('site-audio');
  var audioBtn = document.getElementById('audio-toggle');
  var audioLabel = audioBtn ? audioBtn.querySelector('.audio-label') : null;

  if (audio && audioBtn) {
    audioBtn.addEventListener('click', function () {
      if (audio.paused) {
        audio.play().catch(function () {
          // No audio file has been added yet, or the browser blocked it.
          if (audioLabel) audioLabel.textContent = 'Add an audio file';
        });
      } else {
        audio.pause();
      }
    });

    audio.addEventListener('play', function () {
      audioBtn.setAttribute('aria-pressed', 'true');
      if (audioLabel) audioLabel.textContent = 'Pause music';
    });

    audio.addEventListener('pause', function () {
      audioBtn.setAttribute('aria-pressed', 'false');
      if (audioLabel) audioLabel.textContent = 'Play music';
    });
  }

  /* ------------------------------------------------------------------
     6) SEARCH FORM — jump to (and open) the chosen topic/author
  ------------------------------------------------------------------ */
  var searchForm = document.getElementById('site-search');
  var topicSelect = document.getElementById('search-topic');
  var authorSelect = document.getElementById('search-author');

  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var topic = topicSelect ? topicSelect.value : '';
      var author = authorSelect ? authorSelect.value : '';
      if (!topic) return;

      var targetId = author ? (topic + '-' + author) : topic;
      var target = document.getElementById(targetId) || document.getElementById(topic);
      if (!target) return;

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // If we landed on a specific article panel, open its accordion.
      if (author) {
        var toggle = document.querySelector('[aria-controls="' + targetId + '"]');
        if (toggle) toggle.setAttribute('aria-expanded', 'true');
      }
    });
  }

});
