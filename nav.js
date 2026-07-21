// Mobile menu: builds a toggle and a full-screen sheet from the existing nav links.
(function () {
  var nav = document.querySelector('.wy-nav');
  if (!nav) return;
  var links = nav.querySelector('.n-links');
  if (!links) return;

  var btn = document.createElement('button');
  btn.className = 'nav-toggle';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<i></i>';
  nav.appendChild(btn);

  var sheet = document.createElement('div');
  sheet.className = 'nav-sheet';
  sheet.setAttribute('aria-hidden', 'true');
  [].slice.call(links.querySelectorAll('a')).forEach(function (a, i) {
    var c = document.createElement('a');
    c.href = a.getAttribute('href');
    c.textContent = a.textContent.trim();
    if (a.target) c.target = a.target;
    if (a.rel) c.rel = a.rel;
    if (a.classList.contains('on')) c.className = 'on';
    c.style.setProperty('--i', i);
    sheet.appendChild(c);
  });
  document.body.appendChild(sheet);

  function setOpen(open) {
    document.body.classList.toggle('nav-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    sheet.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  btn.addEventListener('click', function () {
    setOpen(!document.body.classList.contains('nav-open'));
  });
  sheet.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) setOpen(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 760) setOpen(false);
  });
})();
