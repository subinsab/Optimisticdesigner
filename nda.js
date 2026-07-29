// Protected work: product screenshots stay blurred until the shared password is entered.
// Each case study unlocks on its own: the password opens every screen on the current page only.
(function () {
  var KEY = 'od-nda-2026::' + location.pathname;
  var HASH = 'fd3487ff783247e5b6462010495b40325620eff61b2eb8c36d5839a8a1e75a1a';

  if (localStorage.getItem(KEY) === '1') { document.body.classList.add('nda-open'); }

  var modal = null;

  function sha256hex(str) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(function (buf) {
      return [].map.call(new Uint8Array(buf), function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    });
  }

  function openModal() {
    if (document.body.classList.contains('nda-open')) return;
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'nda-modal';
      modal.innerHTML =
        '<div class="nda-box">' +
        '<div class="nda-box-t">Protected case work</div>' +
        '<div class="nda-box-s">Enter the password shared with you to view the product screens.</div>' +
        '<input class="nda-input" type="password" autocomplete="off" spellcheck="false" aria-label="Password">' +
        '<div class="nda-err" hidden>That password is not right. Try again.</div>' +
        '<div class="nda-actions"><button type="button" class="nda-cancel">Cancel</button><button type="button" class="nda-go">Unlock</button></div>' +
        '</div>';
      document.body.appendChild(modal);
      var input = modal.querySelector('.nda-input');
      var err = modal.querySelector('.nda-err');
      function attempt() {
        sha256hex(input.value.trim()).then(function (hex) {
          if (hex === HASH) {
            localStorage.setItem(KEY, '1');
            document.body.classList.add('nda-open');
            close();
          } else {
            err.hidden = false;
            input.select();
          }
        });
      }
      function close() { modal.classList.remove('on'); err.hidden = true; input.value = ''; }
      modal.querySelector('.nda-go').addEventListener('click', attempt);
      modal.querySelector('.nda-cancel').addEventListener('click', close);
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') attempt(); if (e.key === 'Escape') close(); });
      modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    }
    modal.classList.add('on');
    setTimeout(function () { modal.querySelector('.nda-input').focus(); }, 40);
  }

  document.querySelectorAll('img.nda, video.nda').forEach(function (el) {
    if (el.closest('.nda-wrap')) return;
    var w = document.createElement('div');
    w.className = 'nda-wrap';
    el.parentNode.insertBefore(w, el);
    w.appendChild(el);
    var c = document.createElement('button');
    c.type = 'button';
    c.className = 'nda-cover';
    c.innerHTML = '<span class="nda-t">Protected work</span><span class="nda-s">Click to enter password</span>';
    c.addEventListener('click', openModal);
    w.appendChild(c);
  });
})();
