(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero entrance
  window.addEventListener('load', function () {
    document.body.classList.add('loaded');
  });
  setTimeout(function () { document.body.classList.add('loaded'); }, 600);

  // Scroll reveals with stagger
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('vis'); });
  }

  // Animated counters
  function animateCount(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    var target = parseFloat(el.dataset.count);
    var from = parseFloat(el.dataset.from || '0');
    var pre = el.dataset.pre || '';
    var suf = el.dataset.suf || '';
    var dec = (el.dataset.count.split('.')[1] || '').length;
    if (reduced) { el.textContent = pre + target.toFixed(dec) + suf; return; }
    var dur = 1400, start = performance.now();
    function ease(t) { return 1 - Math.pow(1 - t, 3); }
    (function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var val = from + ease(p) * (target - from);
      el.textContent = pre + val.toFixed(dec) + suf;
      if (p < 1) { requestAnimationFrame(tick); } else { el.classList.add('confirmed'); }
    })(start);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) animateCount(e.target); });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cObs.observe(el); });
  }

  // Org growth dots
  document.querySelectorAll('.dots').forEach(function (box) {
    var n = parseInt(box.dataset.dots, 10) || 0;
    var seed = parseInt(box.dataset.seed || '1', 10);
    for (var i = 0; i < n; i++) {
      var dot = document.createElement('i');
      if (i < seed) dot.className = 'seed';
      dot.style.transitionDelay = (i * 28) + 'ms';
      box.appendChild(dot);
    }
  });
  var dotBoxes = document.querySelectorAll('.dots');
  if (dotBoxes.length) {
    var dObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); dObs.unobserve(e.target); } });
    }, { threshold: 0.5 });
    dotBoxes.forEach(function (b) { dObs.observe(b); });
  }

  // Framework scrollytelling
  var scrolly = document.querySelector('.scrolly');
  if (scrolly && window.matchMedia('(min-width: 881px)').matches) {
    var panels = scrolly.querySelectorAll('.panel');
    var idxs = scrolly.querySelectorAll('.idx');
    var bar = scrolly.querySelector('.scrolly-progress i');
    var current = -1;
    function onScroll() {
      var rect = scrolly.getBoundingClientRect();
      var total = scrolly.offsetHeight - window.innerHeight;
      var p = Math.min(1, Math.max(0, -rect.top / total));
      if (bar) bar.style.height = (p * 100) + '%';
      var i = Math.min(panels.length - 1, Math.floor(p * panels.length));
      if (i !== current) {
        current = i;
        panels.forEach(function (el, k) { el.classList.toggle('active', k === i); });
        idxs.forEach(function (el, k) { el.classList.toggle('active', k === i); });
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Custom cursor (fine pointers only)
  if (window.matchMedia('(pointer: fine)').matches && !reduced) {
    var dot = document.createElement('div'); dot.className = 'cursor-dot';
    var ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.appendChild(dot); document.body.appendChild(ring);
    document.body.classList.add('cursor-on');
    var cx = -100, cy = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', function (e) { cx = e.clientX; cy = e.clientY; });
    (function loop() {
      rx += (cx - rx) * 0.16; ry += (cy - ry) * 0.16;
      dot.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('grow'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('grow'); });
    });
  }

  // Magnetic nav CTA
  var cta = document.querySelector('.nav-cta');
  if (cta && window.matchMedia('(pointer: fine)').matches && !reduced) {
    cta.addEventListener('mousemove', function (e) {
      var r = cta.getBoundingClientRect();
      var mx = e.clientX - r.left - r.width / 2;
      var my = e.clientY - r.top - r.height / 2;
      cta.style.transform = 'translate(' + mx * 0.25 + 'px,' + my * 0.35 + 'px)';
    });
    cta.addEventListener('mouseleave', function () { cta.style.transform = ''; });
  }
})();
