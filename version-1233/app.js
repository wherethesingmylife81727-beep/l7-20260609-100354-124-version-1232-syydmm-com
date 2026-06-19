(function () {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var nav = document.querySelector('[data-site-nav]');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    showSlide(0);
    start();
  }

  var filterInput = document.querySelector('.filter-input');
  var typeSelect = document.querySelector('[data-filter-type]');
  var regionSelect = document.querySelector('[data-filter-region]');
  var sortSelect = document.querySelector('[data-sort-select]');
  var resultCount = document.querySelector('[data-result-count]');
  var sortContainer = document.querySelector('[data-sort-container]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));

  if (filterInput && cards.length) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');

    if (query) {
      filterInput.value = query;
    }

    function matches(card, value, attr) {
      if (!value) {
        return true;
      }

      return String(card.getAttribute(attr) || '').indexOf(value) !== -1;
    }

    function filterCards() {
      var keyword = filterInput.value.trim().toLowerCase();
      var type = typeSelect ? typeSelect.value : '';
      var region = regionSelect ? regionSelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-year') || '',
          card.getAttribute('data-type') || '',
          card.getAttribute('data-region') || '',
          card.getAttribute('data-category') || ''
        ].join(' ').toLowerCase();

        var ok = (!keyword || haystack.indexOf(keyword) !== -1) &&
          matches(card, type, 'data-type') &&
          matches(card, region, 'data-region');

        card.classList.toggle('hidden', !ok);

        if (ok) {
          visible += 1;
        }
      });

      if (resultCount) {
        resultCount.textContent = visible;
      }
    }

    function sortCards() {
      if (!sortSelect || !sortContainer) {
        filterCards();
        return;
      }

      var mode = sortSelect.value;
      var sorted = cards.slice();

      if (mode === 'score') {
        sorted.sort(function (a, b) {
          return Number(b.getAttribute('data-score') || 0) - Number(a.getAttribute('data-score') || 0);
        });
      }

      if (mode === 'year') {
        sorted.sort(function (a, b) {
          return Number(b.getAttribute('data-year') || 0) - Number(a.getAttribute('data-year') || 0);
        });
      }

      if (mode === 'title') {
        sorted.sort(function (a, b) {
          return String(a.getAttribute('data-title') || '').localeCompare(String(b.getAttribute('data-title') || ''), 'zh-CN');
        });
      }

      sorted.forEach(function (card) {
        sortContainer.appendChild(card);
      });

      filterCards();
    }

    filterInput.addEventListener('input', filterCards);

    if (typeSelect) {
      typeSelect.addEventListener('change', filterCards);
    }

    if (regionSelect) {
      regionSelect.addEventListener('change', filterCards);
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', sortCards);
    }

    sortCards();
  }

  function attachStream(video, stream) {
    if (!video || !stream || video.getAttribute('data-ready') === 'yes') {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      video.hlsInstance = hls;
    } else {
      video.src = stream;
    }

    video.setAttribute('data-ready', 'yes');
  }

  Array.prototype.slice.call(document.querySelectorAll('.player-box')).forEach(function (box) {
    var video = box.querySelector('video');
    var button = box.querySelector('.play-cover');
    var stream = video ? video.getAttribute('data-stream') : '';

    function playVideo() {
      attachStream(video, stream);
      box.classList.add('is-playing');
      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    if (button && video) {
      button.addEventListener('click', playVideo);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          playVideo();
        } else {
          video.pause();
        }
      });

      video.addEventListener('play', function () {
        box.classList.add('is-playing');
      });

      video.addEventListener('pause', function () {
        box.classList.remove('is-playing');
      });
    }
  });
})();
