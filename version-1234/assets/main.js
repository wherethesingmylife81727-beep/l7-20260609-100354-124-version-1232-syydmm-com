(function () {
  function initMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!button || !menu) {
      return;
    }
    button.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function initHero() {
    var root = document.querySelector('[data-hero]');
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
    if (!slides.length) {
      return;
    }
    var current = 0;
    function show(index) {
      current = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });
    window.setInterval(function () {
      show((current + 1) % slides.length);
    }, 5200);
  }

  function initFilters() {
    var input = document.querySelector('[data-search-input]');
    var yearFilter = document.querySelector('[data-year-filter]');
    var typeFilter = document.querySelector('[data-type-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var empty = document.querySelector('[data-empty-state]');
    if (!cards.length || (!input && !yearFilter && !typeFilter)) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    if (query && input) {
      input.value = query;
    }
    function apply() {
      var text = input ? input.value.trim().toLowerCase() : '';
      var year = yearFilter ? yearFilter.value : '';
      var type = typeFilter ? typeFilter.value : '';
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = (card.getAttribute('data-search') || '').toLowerCase();
        var cardYear = card.getAttribute('data-year') || '';
        var cardType = card.getAttribute('data-type') || '';
        var matched = true;
        if (text && haystack.indexOf(text) === -1) {
          matched = false;
        }
        if (year && cardYear !== year) {
          matched = false;
        }
        if (type && cardType !== type) {
          matched = false;
        }
        card.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }
    [input, yearFilter, typeFilter].forEach(function (element) {
      if (element) {
        element.addEventListener('input', apply);
        element.addEventListener('change', apply);
      }
    });
    apply();
  }

  function initPlayer() {
    var video = document.getElementById('movie-player');
    var cover = document.querySelector('[data-play-cover]');
    if (!video || !cover) {
      return;
    }
    var stream = video.getAttribute('data-stream');
    var started = false;
    function start() {
      if (!stream) {
        return;
      }
      cover.classList.add('is-hidden');
      if (!started) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls();
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }
        started = true;
      }
      var playResult = video.play();
      if (playResult && playResult.catch) {
        playResult.catch(function () {
          cover.classList.remove('is-hidden');
        });
      }
    }
    cover.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (!started || video.paused) {
        start();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHero();
    initFilters();
    initPlayer();
  });
})();
