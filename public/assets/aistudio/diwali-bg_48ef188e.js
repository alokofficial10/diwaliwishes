/*
 * diwali-bg.js
 * Diwali temple video ko poori website ka background bana deta hai.
 * Aapka card (Shubh Deepawali, naam, link) iske upar waisa hi rahega.
 *
 * Kaise use karein:
 *   1) diwali-bg.js, diwali-bg.mp4, diwali-bg-poster.jpg ko ek hi folder me rakhein
 *      (React/Vite me "public" folder me).
 *   2) index.html me </body> se pehle:  <script src="/diwali-bg.js"></script>
 *      (agar alag folder me hain to path badal dein)
 *   3) Bas. Video apne aap peeche chalega.
 *
 * Optional settings (script se pehle):
 *   <script>window.DIWALI_BG = { loop: true, dim: 0.15, sound: false }</script>
 */
(function () {
  'use strict';

  var scriptEl = document.currentScript;
  var base = scriptEl && scriptEl.src ? scriptEl.src.replace(/[^\/]*$/, '') : '/';

  var cfg = Object.assign(
    {
      src: base + 'diwali-bg.mp4',
      poster: base + 'diwali-bg-poster.jpg',
      loop: true,      // video 8 sec ka hai, loop me chalta rahega
      dim: 0.12,       // 0 se 0.6: upar ke text ko padhne layak banane ke liye halka andhera
      sound: false,    // true karne par neeche ek chhota sound button aata hai
      zIndex: -1       // content ke peeche
    },
    window.DIWALI_BG || {}
  );

  if (window.__diwaliBgStarted) return;
  window.__diwaliBgStarted = true;

  function start() {
    var wrap = document.createElement('div');
    wrap.id = 'diwali-bg';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.style.cssText =
      'position:fixed;inset:0;width:100%;height:100%;overflow:hidden;pointer-events:none;' +
      'background:#0a1230 url("' + cfg.poster + '") center/cover no-repeat;z-index:' + cfg.zIndex + ';';

    var v = document.createElement('video');
    v.src = cfg.src;
    v.poster = cfg.poster;
    v.muted = true;
    v.defaultMuted = true;
    v.loop = !!cfg.loop;
    v.autoplay = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.setAttribute('muted', '');
    v.disablePictureInPicture = true;
    v.style.cssText =
      'position:absolute;top:50%;left:50%;min-width:100%;min-height:100%;width:auto;height:auto;' +
      'transform:translate(-50%,-50%);object-fit:cover;';

    var shade = document.createElement('div');
    shade.style.cssText =
      'position:absolute;inset:0;background:rgba(0,0,0,' + cfg.dim + ');';

    wrap.appendChild(v);
    wrap.appendChild(shade);
    document.body.insertBefore(wrap, document.body.firstChild);

    // Body/html ka solid background hata do, warna video chhup jayega.
    var rootBg = getComputedStyle(document.body).backgroundColor;
    if (rootBg && rootBg !== 'rgba(0, 0, 0, 0)' && rootBg !== 'transparent') {
      document.body.style.background = 'transparent';
    }
    document.documentElement.style.background = '#0a1230';

    function play() {
      var p = v.play();
      if (p && p.catch) p.catch(function () { /* autoplay roka gaya, neeche tap par chalega */ });
    }
    play();

    // Phone par autoplay ruk jaye to pehle touch/click par chala do.
    ['touchstart', 'click', 'scroll', 'keydown'].forEach(function (ev) {
      window.addEventListener(ev, function once() {
        if (v.paused) play();
        window.removeEventListener(ev, once);
      }, { passive: true });
    });

    // Tab wapas aane par dobara chalao, chhupe tab me band rakho (battery bachti hai).
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) v.pause(); else play();
    });

    // Sound button (sirf agar sound:true ho)
    if (cfg.sound) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = '🔇';
      b.setAttribute('aria-label', 'Sound on/off');
      b.style.cssText =
        'position:fixed;right:14px;bottom:14px;z-index:9999;width:42px;height:42px;border-radius:50%;' +
        'border:1px solid rgba(255,215,120,.7);background:rgba(0,0,0,.45);color:#fff;font-size:18px;cursor:pointer;';
      b.addEventListener('click', function () {
        v.muted = !v.muted;
        b.textContent = v.muted ? '🔇' : '🔊';
        play();
      });
      document.body.appendChild(b);
    }

    // Doosre code ke liye: window.diwaliBg.video
    window.diwaliBg = { video: v, el: wrap, play: play, pause: function () { v.pause(); } };
  }

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
})();
