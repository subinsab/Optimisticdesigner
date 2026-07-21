// Shared footer wordmark: ghost dot-matrix with a flashlight hover and one breathing pixel
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fgEl = document.querySelector('.foot-giant');
  if (!fgEl || reduced) return;

  var parts3 = [], raf4 = 0, frame3 = 0, started = false, assembled = false, initedF = false;
  var cellF = 4, cwF = 0, chF = 0, dprF = Math.min(2, window.devicePixelRatio || 1);
  var cvF, ctxF, pulseIdx = -1, mxF = -1e4, myF = -1e4;
  var DURF = 50;

  function buildF() {
    var W = fgEl.clientWidth || fgEl.parentElement.clientWidth;
    if (!W) return;
    var text = 'The Optimistic Designer';
    var meas = document.createElement('canvas').getContext('2d');
    var fs = 100;
    meas.font = '600 100px Switzer, sans-serif';
    fs = Math.floor(100 * W / meas.measureText(text).width * 0.99);
    var font = '600 ' + fs + 'px Switzer, sans-serif';
    meas.font = font;
    cellF = Math.max(3, Math.round(fs / 26));
    var tw = Math.ceil(meas.measureText(text).width) + cellF;
    var th = Math.ceil(fs * 1.16);
    var oc = document.createElement('canvas');
    oc.width = tw; oc.height = th;
    var o = oc.getContext('2d');
    o.font = font; o.fillStyle = '#fff'; o.textBaseline = 'top';
    o.fillText(text, 0, 0);
    var gw = Math.ceil(tw / cellF), gh = Math.ceil(th / cellF);
    var sc = document.createElement('canvas');
    sc.width = gw; sc.height = gh;
    var s = sc.getContext('2d');
    s.imageSmoothingEnabled = true;
    s.drawImage(oc, 0, 0, gw, gh);
    var d = s.getImageData(0, 0, gw, gh).data;
    parts3 = [];
    for (var gy = 0; gy < gh; gy++) for (var gx = 0; gx < gw; gx++) {
      if (d[(gy * gw + gx) * 4 + 3] > 90) {
        parts3.push({ x: gx * cellF, y: gy * cellF, on: assembled ? 1 : 0, e: 0, j: Math.random() });
      }
    }
    // heartbeat pixel: the top-most pixel nearest 40% of the width
    pulseIdx = -1;
    var best = 1e9;
    for (var k = 0; k < parts3.length; k++) {
      var p = parts3[k];
      var score = Math.abs(p.x - tw * 0.4) + p.y * 3;
      if (score < best) { best = score; pulseIdx = k; }
    }
    cwF = tw; chF = th;
    if (!cvF) {
      cvF = document.createElement('canvas');
      cvF.setAttribute('aria-hidden', 'true');
      fgEl.style.position = 'relative';
      fgEl.style.color = 'transparent';
      fgEl.appendChild(cvF);
      ctxF = cvF.getContext('2d');
      cvF.addEventListener('mousemove', function (ev) {
        var r = cvF.getBoundingClientRect();
        mxF = ev.clientX - r.left; myF = ev.clientY - r.top;
        var R2 = 52 * 52;
        for (var k2 = 0; k2 < parts3.length; k2++) {
          var q = parts3[k2];
          if (!q.on) continue;
          var dx = q.x - mxF, dy = q.y - myF;
          if (dx * dx + dy * dy < R2) q.e = 1;
        }
        wakeF();
      });
    }
    cvF.width = cwF * dprF; cvF.height = chF * dprF;
    cvF.style.cssText = 'position:absolute;left:0;top:0;width:' + cwF + 'px;height:' + chF + 'px';
    fgEl.style.height = chF + 'px';
    ctxF.setTransform(dprF, 0, 0, dprF, 0, 0);
    drawF();
  }
  function drawF() {
    ctxF.clearRect(0, 0, cwF, chF);
    var sz = cellF - 1;
    var pulse = 0.5 + 0.5 * Math.sin(frame3 * 0.045);
    for (var k = 0; k < parts3.length; k++) {
      var p = parts3[k];
      if (!p.on) continue;
      var a = 0.09 + 0.5 * p.e;
      if (k === pulseIdx) a = Math.max(a, 0.12 + 0.3 * pulse);
      ctxF.globalAlpha = Math.min(1, a);
      ctxF.fillStyle = '#FFFFFF';
      var g = p.e * 1.2;
      ctxF.fillRect(p.x - g, p.y - g, sz + g * 2, sz + g * 2);
    }
    ctxF.globalAlpha = 1;
  }
  function tickF() {
    frame3++;
    var busy = false;
    if (!assembled) {
      var wave = frame3 / DURF;
      var pending = 0;
      for (var k = 0; k < parts3.length; k++) {
        var p = parts3[k];
        if (!p.on) {
          if (p.x / cwF < wave * 1.3 - p.j * 0.3) { p.on = 1; p.e = 1; }
          else pending++;
        }
      }
      if (!pending) assembled = true;
      busy = true;
    }
    for (var k2 = 0; k2 < parts3.length; k2++) {
      var q = parts3[k2];
      if (q.e > 0.02) { q.e *= 0.9; busy = true; } else { q.e = 0; }
    }
    drawF();
    var r = fgEl.getBoundingClientRect();
    var onScreen = r.bottom > 0 && r.top < window.innerHeight;
    if (busy || onScreen) { raf4 = requestAnimationFrame(tickF); } else { raf4 = 0; }
  }
  function wakeF() { if (!raf4 && parts3.length) raf4 = requestAnimationFrame(tickF); }
  function checkF() {
    if (!started && fgEl.getBoundingClientRect().top < window.innerHeight * 0.92) {
      started = true;
      frame3 = 0;
      wakeF();
    } else if (started) { wakeF(); }
  }
  function initF() {
    if (initedF) return;
    initedF = true;
    document.fonts.ready.then(function () {
      buildF();
      window.addEventListener('scroll', checkF, { passive: true });
      checkF();
      var rtF;
      window.addEventListener('resize', function () {
        clearTimeout(rtF);
        rtF = setTimeout(buildF, 150);
      });
    });
  }
  if (!document.hidden) { initF(); }
  else document.addEventListener('visibilitychange', function () { if (!document.hidden) initF(); });
})();
