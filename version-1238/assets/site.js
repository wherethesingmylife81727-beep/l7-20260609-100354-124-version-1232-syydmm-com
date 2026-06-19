(function() {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function() {
    var menuButton = document.querySelector('.menu-toggle');
    if (menuButton) {
      menuButton.addEventListener('click', function() {
        document.body.classList.toggle('menu-open');
      });
    }

    var carousel = document.querySelector('[data-carousel]');
    if (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dots button'));
      var index = 0;
      var timer = null;
      var show = function(next) {
        index = (next + slides.length) % slides.length;
        slides.forEach(function(slide, i) {
          slide.classList.toggle('active', i === index);
        });
        dots.forEach(function(dot, i) {
          dot.classList.toggle('active', i === index);
        });
      };
      dots.forEach(function(dot, i) {
        dot.addEventListener('click', function() {
          show(i);
          if (timer) {
            clearInterval(timer);
          }
          timer = setInterval(function() {
            show(index + 1);
          }, 5200);
        });
      });
      timer = setInterval(function() {
        show(index + 1);
      }, 5200);
    }

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll('.site-search'));
    searchInputs.forEach(function(input) {
      var panel = input.closest('.filter-panel');
      var yearSelect = panel ? panel.querySelector('.year-filter') : null;
      var scope = panel ? panel.parentElement.querySelector('.search-scope') || document.querySelector('.search-scope') : document.querySelector('.search-scope');
      var run = function() {
        var term = input.value.trim().toLowerCase();
        var year = yearSelect ? yearSelect.value : '';
        var items = scope ? Array.prototype.slice.call(scope.querySelectorAll('[data-title]')) : [];
        items.forEach(function(item) {
          var text = [
            item.getAttribute('data-title'),
            item.getAttribute('data-region'),
            item.getAttribute('data-year'),
            item.getAttribute('data-genre'),
            item.getAttribute('data-type')
          ].join(' ').toLowerCase();
          var matchText = !term || text.indexOf(term) !== -1;
          var matchYear = !year || item.getAttribute('data-year') === year;
          item.classList.toggle('is-filtered-out', !(matchText && matchYear));
        });
      };
      input.addEventListener('input', run);
      if (yearSelect) {
        yearSelect.addEventListener('change', run);
      }
    });
  });
})();

function initMoviePlayer(url) {
  var video = document.getElementById('moviePlayer');
  var overlay = document.getElementById('playOverlay');
  var attached = false;
  if (!video) {
    return;
  }

  function attach() {
    if (attached) {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(url);
      hls.attachMedia(video);
    } else {
      video.src = url;
    }
    attached = true;
  }

  function start() {
    attach();
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
    var action = video.play();
    if (action && typeof action.catch === 'function') {
      action.catch(function() {});
    }
  }

  if (overlay) {
    overlay.addEventListener('click', start);
  }
  video.addEventListener('click', function() {
    if (video.paused) {
      start();
    }
  });
  video.addEventListener('play', function() {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  });
}
