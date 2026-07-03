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
