// ===== scroll reveal =====
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.14 });
  els.forEach(function (e) { io.observe(e); });
})();

// ===== count-up stats =====
(function () {
  var nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  var run = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var dur = 1100, start = 0, t0 = null;
    var step = function (ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var val = Math.floor(start + (target - start) * (0.5 - Math.cos(p * Math.PI) / 2));
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(step); else el.textContent = prefix + target + suffix;
    };
    requestAnimationFrame(step);
  };
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
  }, { threshold: 0.5 });
  nums.forEach(function (e) { io.observe(e); });
})();

// ===== scroll progress bar =====
(function () {
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  var update = function () {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// ===== active-section nav (scrollspy) =====
(function () {
  var links = [].slice.call(document.querySelectorAll('.nav nav a[href^="#"]'));
  if (!links.length) return;
  var map = {};
  links.forEach(function (a) { var id = a.getAttribute('href').slice(1); if (id) map[id] = a; });
  var sections = Object.keys(map).map(function (id) { return document.getElementById(id); }).filter(Boolean);
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        links.forEach(function (l) { l.classList.remove('active'); });
        if (map[en.target.id]) map[en.target.id].classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(function (s) { io.observe(s); });
})();

// ===== hover tooltips (incl. SVG diagram nodes) =====
(function () {
  var tip = document.createElement('div');
  tip.className = 'tip'; document.body.appendChild(tip);
  var show = function (e) {
    var t = e.currentTarget.getAttribute('data-tip'); if (!t) return;
    tip.textContent = t; tip.classList.add('on');
    move(e);
  };
  var move = function (e) {
    var x = (e.clientX || 0), y = (e.clientY || 0);
    tip.style.left = Math.min(x + 14, window.innerWidth - tip.offsetWidth - 12) + 'px';
    tip.style.top = (y + 16) + 'px';
  };
  var hide = function () { tip.classList.remove('on'); };
  document.querySelectorAll('[data-tip]').forEach(function (el) {
    el.addEventListener('mouseenter', show);
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', hide);
  });
})();

// ===== filterable work =====
(function () {
  var bar = document.querySelector('[data-filterbar]');
  if (!bar) return;
  var cases = [].slice.call(document.querySelectorAll('.case[data-tags]'));
  bar.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-filter]'); if (!btn) return;
    var f = btn.getAttribute('data-filter');
    bar.querySelectorAll('[data-filter]').forEach(function (b) { b.classList.toggle('on', b === btn); });
    cases.forEach(function (c) {
      var show = f === 'all' || (c.getAttribute('data-tags') || '').split(' ').indexOf(f) > -1;
      c.style.display = show ? '' : 'none';
    });
  });
})();

// ===== theme toggle =====
(function () {
  var btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) { document.documentElement.removeAttribute('data-theme'); try { localStorage.setItem('theme', 'dark'); } catch (e) {} }
    else { document.documentElement.setAttribute('data-theme', 'light'); try { localStorage.setItem('theme', 'light'); } catch (e) {} }
  });
})();

// ===== rotating hero keyword =====
(function () {
  var el = document.getElementById('rotate');
  if (!el) return;
  var words = ['multi-agent systems', 'Text-to-SQL', 'agentic apps', 'real-time voice AI', 'search at scale'];
  var i = 0, c = 0, deleting = false;
  var tick = function () {
    var w = words[i];
    el.textContent = w.substring(0, c);
    if (!deleting && c < w.length) { c++; setTimeout(tick, 70); }
    else if (!deleting && c === w.length) { deleting = true; setTimeout(tick, 1400); }
    else if (deleting && c > 0) { c--; setTimeout(tick, 35); }
    else { deleting = false; i = (i + 1) % words.length; setTimeout(tick, 250); }
  };
  setTimeout(tick, 600);
})();
