/*!
 * Chat Widget - solo diseño (icono flotante)
 * Uso: <script src="https://TU-CDN/chat-widget.js" defer></script>
 */
(function () {
  'use strict';

  // Evita cargar el widget dos veces
  if (window.__chatWidgetLoaded) return;
  window.__chatWidgetLoaded = true;

  function init() {
    // Contenedor host + Shadow DOM: el CSS del blog no afecta al widget
    var host = document.createElement('div');
    host.id = 'chat-widget-host';
    host.style.cssText = 'all:initial;position:fixed;right:0;bottom:0;z-index:2147483000;';
    var root = host.attachShadow({ mode: 'open' });

    root.innerHTML = [
      '<style>',
      ':host{all:initial}',
      '.wrap{position:fixed;right:max(20px,env(safe-area-inset-right));bottom:max(20px,env(safe-area-inset-bottom));width:60px;height:60px}',

      /* anillo que late una sola vez al cargar */
      '.ring{position:absolute;inset:0;border-radius:50%;background:#2f4bff;opacity:0;animation:ring 1.6s .8s ease-out 2}',
      '@keyframes ring{0%{transform:scale(1);opacity:.45}100%{transform:scale(1.9);opacity:0}}',

      '.btn{position:relative;width:60px;height:60px;border:0;padding:0;border-radius:50%;cursor:pointer;',
      'background:linear-gradient(145deg,#3d5afe 0%,#2338d6 100%);',
      'box-shadow:0 10px 24px rgba(35,56,214,.38),0 2px 6px rgba(15,23,42,.18),inset 0 1px 0 rgba(255,255,255,.25);',
      'display:flex;align-items:center;justify-content:center;',
      '-webkit-tap-highlight-color:transparent;transition:transform .2s cubic-bezier(.3,1.4,.5,1),box-shadow .2s ease}',
      '.btn:hover{transform:translateY(-2px) scale(1.05);box-shadow:0 14px 30px rgba(35,56,214,.45),0 3px 8px rgba(15,23,42,.2),inset 0 1px 0 rgba(255,255,255,.25)}',
      '.btn:active{transform:scale(.94)}',
      '.btn:focus-visible{outline:3px solid #fff;outline-offset:-6px;box-shadow:0 0 0 3px #2338d6,0 10px 24px rgba(35,56,214,.38)}',

      '.icon{width:30px;height:30px;display:block;overflow:visible}',
      '.bubble{fill:#fff}',
      '.dot{fill:#2f4bff;transform-box:fill-box;transform-origin:center}',
      '.btn:hover .dot{animation:hop .7s ease-in-out infinite}',
      '.btn:hover .dot:nth-child(2){animation-delay:.12s}',
      '.btn:hover .dot:nth-child(3){animation-delay:.24s}',
      '@keyframes hop{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-2.2px)}}',

      /* indicador de mensaje nuevo */
      '.badge{position:absolute;top:-2px;right:-2px;min-width:20px;height:20px;padding:0 5px;box-sizing:border-box;',
      'border-radius:10px;background:#ff3d57;color:#fff;font:700 11px/20px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;',
      'text-align:center;border:2px solid #fff;pointer-events:none}',

      '@media (prefers-reduced-motion:reduce){.ring,.btn:hover .dot{animation:none}.btn{transition:none}}',
      '</style>',

      '<div class="wrap">',
      '  <span class="ring" aria-hidden="true"></span>',
      '  <button class="btn" type="button" aria-label="Abrir chat">',
      '    <svg class="icon" viewBox="0 0 32 32" aria-hidden="true">',
      '      <path class="bubble" d="M16 3C8.8 3 3 8.1 3 14.5c0 3.3 1.5 6.2 4 8.3-.1 1.9-.8 3.7-2 5.1-.3.4 0 1 .5.9 2.6-.4 4.9-1.4 6.6-2.7 1.2.3 2.5.5 3.9.5 7.2 0 13-5.1 13-11.5S23.2 3 16 3z"/>',
      '      <circle class="dot" cx="10.5" cy="14.5" r="1.8"/>',
      '      <circle class="dot" cx="16" cy="14.5" r="1.8"/>',
      '      <circle class="dot" cx="21.5" cy="14.5" r="1.8"/>',
      '    </svg>',
      '  </button>',
      '  <span class="badge" aria-hidden="true">1</span>',
      '</div>'
    ].join('');

    document.body.appendChild(host);
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
