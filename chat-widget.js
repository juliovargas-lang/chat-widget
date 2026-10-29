/*!
 * Chat Widget - prototipo visual (chat simulado)
 * Uso: <script src="https://TU-CDN/chat-widget.js" defer></script>
 * Paleta: Navy #0F2537 / #112336 · Cyan #00A3E0 / #0082B4 · Blanco #FFFFFF
 */
(function () {
  'use strict';

  if (window.__chatWidgetLoaded) return;
  window.__chatWidgetLoaded = true;

  var BOT_NAME = 'Asistente';

  var GREETING = '¡Hola! 👋 Soy el asistente del blog. Escríbeme lo que quieras o elige una opción.';

  var CHIPS = ['Ver novedades', 'Contactar', 'Quiero suscribirme'];

  var REPLIES = [
    'Interesante pregunta. Déjame pensarlo un momento… ya lo tengo: depende de lo que busques.',
    'Esto es solo un prototipo, pero me encanta que lo estés probando. 🙌',
    'Podría darte una respuesta seria, pero hoy me siento aleatorio.',
    'Anotado. Se lo paso al equipo (en realidad no, pero suena bien).',
    '¡Buena elección! Te recomiendo empezar por los artículos más recientes.',
    'Hmm, no estoy seguro de entenderte, pero voy a asentir con confianza.',
    'Dato curioso: este chat responde al azar y nunca se cansa.',
    'Claro, cuéntame más. Soy todo oídos (y cero cables).',
    '¿Sabías que los pulpos tienen tres corazones? No tiene relación, pero ahí queda.',
    'Gracias por escribir. Pronto este chat será real y podré ayudarte de verdad.',
    'Eso suena a una gran idea. Yo la apoyaría.',
    'Estoy en modo demostración, pero prometo mejorar. 🚀'
  ];

  var lastReply = -1;
  function randomReply() {
    var i;
    do { i = Math.floor(Math.random() * REPLIES.length); } while (i === lastReply && REPLIES.length > 1);
    lastReply = i;
    return REPLIES[i];
  }

  var CSS = `
:host{all:initial}
*{box-sizing:border-box;margin:0;padding:0}
.cw{--navy:#0F2537;--navy-2:#112336;--cyan:#00A3E0;--cyan-d:#0082B4;--white:#fff;
  --bg:#F3F6F9;--line:#DDE5EC;--muted:#5B6F80;
  font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  color:var(--navy);-webkit-font-smoothing:antialiased}

/* ---------- Botón flotante ---------- */
.launcher{position:fixed;right:max(20px,env(safe-area-inset-right));bottom:max(20px,env(safe-area-inset-bottom));
  width:60px;height:60px}
.ring{position:absolute;inset:0;border-radius:50%;background:var(--cyan);opacity:0;animation:ring 1.6s .8s ease-out 2;pointer-events:none}
@keyframes ring{0%{transform:scale(1);opacity:.45}100%{transform:scale(1.9);opacity:0}}
.fab{position:relative;width:60px;height:60px;border:0;border-radius:50%;cursor:pointer;background:var(--navy);
  display:flex;align-items:center;justify-content:center;color:var(--white);
  box-shadow:0 10px 24px rgba(15,37,55,.35),0 2px 6px rgba(15,37,55,.2),inset 0 0 0 2px rgba(0,163,224,.55);
  -webkit-tap-highlight-color:transparent;transition:transform .2s cubic-bezier(.3,1.4,.5,1),background .2s}
.fab:hover{transform:translateY(-2px) scale(1.05);background:var(--navy-2)}
.fab:active{transform:scale(.94)}
.fab:focus-visible,.send:focus-visible,.close:focus-visible,.chip:focus-visible{outline:3px solid var(--cyan);outline-offset:2px}
.fab svg{position:absolute;width:28px;height:28px;transition:transform .25s ease,opacity .2s ease}
.fab .i-close{opacity:0;transform:rotate(-90deg) scale(.6)}
.open .fab .i-chat{opacity:0;transform:rotate(90deg) scale(.6)}
.open .fab .i-close{opacity:1;transform:none}
.badge{position:absolute;top:-3px;right:-3px;min-width:20px;height:20px;padding:0 5px;border-radius:10px;
  background:var(--cyan);color:var(--white);font:700 11px/16px system-ui,sans-serif;text-align:center;
  border:2px solid var(--white);pointer-events:none}
.badge[hidden]{display:none}

/* ---------- Panel ---------- */
.panel{position:fixed;right:max(20px,env(safe-area-inset-right));bottom:calc(max(20px,env(safe-area-inset-bottom)) + 74px);
  width:370px;height:min(560px,calc(100dvh - 120px));display:flex;flex-direction:column;
  background:var(--white);border-radius:18px;overflow:hidden;
  box-shadow:0 24px 60px rgba(15,37,55,.28),0 4px 14px rgba(15,37,55,.12);
  opacity:0;visibility:hidden;transform:translateY(14px) scale(.97);transform-origin:bottom right;
  transition:opacity .22s ease,transform .22s ease,visibility 0s linear .22s}
.open .panel{opacity:1;visibility:visible;transform:none;transition:opacity .22s ease,transform .22s ease}

.head{background:var(--navy-2);color:var(--white);padding:14px 14px 14px 16px;display:flex;align-items:center;gap:12px;
  border-bottom:3px solid var(--cyan)}
.avatar{width:40px;height:40px;border-radius:50%;background:var(--cyan);display:flex;align-items:center;justify-content:center;flex:none}
.avatar svg{width:22px;height:22px}
.who{flex:1;min-width:0}
.name{font-size:16px;font-weight:650;line-height:1.2}
.status{font-size:12.5px;color:#B9CBD9;display:flex;align-items:center;gap:6px;margin-top:2px}
.status i{width:8px;height:8px;border-radius:50%;background:#3DDC97;display:inline-block}
.close{width:36px;height:36px;border:0;border-radius:50%;background:transparent;color:var(--white);cursor:pointer;
  display:flex;align-items:center;justify-content:center;transition:background .15s}
.close:hover{background:rgba(255,255,255,.12)}
.close svg{width:18px;height:18px}

.msgs{flex:1;overflow-y:auto;padding:16px 14px;background:var(--bg);display:flex;flex-direction:column;gap:10px;
  scroll-behavior:smooth;overscroll-behavior:contain}
.row{display:flex;flex-direction:column;max-width:82%;animation:pop .22s ease both}
.row.bot{align-self:flex-start;align-items:flex-start}
.row.user{align-self:flex-end;align-items:flex-end}
@keyframes pop{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.bubble{padding:10px 13px;font-size:15px;line-height:1.4;word-wrap:break-word;overflow-wrap:anywhere;white-space:pre-wrap}
.bot .bubble{background:var(--white);color:var(--navy);border:1px solid var(--line);border-radius:4px 16px 16px 16px}
.user .bubble{background:var(--cyan-d);color:var(--white);border-radius:16px 4px 16px 16px}
.time{font-size:11px;color:var(--muted);margin-top:4px;padding:0 4px}

.typing .bubble{display:flex;gap:4px;padding:13px 14px;align-items:center}
.typing .bubble span{width:7px;height:7px;border-radius:50%;background:var(--cyan);animation:blink 1.1s infinite ease-in-out}
.typing .bubble span:nth-child(2){animation-delay:.15s}
.typing .bubble span:nth-child(3){animation-delay:.3s}
@keyframes blink{0%,80%,100%{opacity:.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}

.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:2px}
.chip{border:1.5px solid var(--cyan-d);background:var(--white);color:var(--cyan-d);font:600 13.5px/1 inherit;font-family:inherit;
  padding:9px 13px;border-radius:999px;cursor:pointer;transition:background .15s,color .15s}
.chip:hover{background:var(--cyan-d);color:var(--white)}

.form{display:flex;align-items:center;gap:8px;padding:10px 12px;background:var(--white);border-top:1px solid var(--line)}
.field{flex:1;min-width:0;height:44px;border:1.5px solid var(--line);border-radius:22px;padding:0 16px;
  font:inherit;font-size:16px;color:var(--navy);background:var(--bg);outline:none;transition:border-color .15s,background .15s}
.field::placeholder{color:#7F91A1}
.field:focus{border-color:var(--cyan);background:var(--white)}
.send{flex:none;width:44px;height:44px;border:0;border-radius:50%;background:var(--cyan);color:var(--white);cursor:pointer;
  display:flex;align-items:center;justify-content:center;transition:background .15s,transform .15s,opacity .15s}
.send:hover:not(:disabled){background:var(--cyan-d)}
.send:active:not(:disabled){transform:scale(.92)}
.send:disabled{opacity:.4;cursor:default}
.send svg{width:20px;height:20px;margin-left:2px}
.foot{text-align:center;font-size:11px;color:var(--muted);padding:0 0 8px;background:var(--white)}

/* ---------- Móvil ---------- */
@media (max-width:480px){
  .panel{left:12px;right:12px;width:auto;bottom:calc(max(12px,env(safe-area-inset-bottom)) + 72px);
    height:min(600px,calc(100dvh - 100px))}
  .launcher{right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom))}
}
@media (prefers-reduced-motion:reduce){
  .ring{animation:none}
  .panel,.fab,.fab svg,.row{transition:none;animation:none}
  .typing .bubble span{animation:none;opacity:.7}
  .msgs{scroll-behavior:auto}
}
`;

  var HTML = `
<div class="cw" id="cw">
  <section class="panel" id="panel" role="dialog" aria-label="Chat con ${BOT_NAME}" aria-modal="false">
    <header class="head">
      <div class="avatar" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="7" width="16" height="12" rx="3.5"/><path d="M12 7V4"/><circle cx="12" cy="3.4" r="1"/>
          <circle cx="9" cy="13" r=".6" fill="#fff"/><circle cx="15" cy="13" r=".6" fill="#fff"/>
        </svg>
      </div>
      <div class="who">
        <div class="name">${BOT_NAME}</div>
        <div class="status"><i></i>En línea</div>
      </div>
      <button class="close" id="close" type="button" aria-label="Cerrar chat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </header>

    <div class="msgs" id="msgs" role="log" aria-live="polite"></div>

    <form class="form" id="form" autocomplete="off">
      <input class="field" id="field" type="text" placeholder="Escribe un mensaje…" aria-label="Escribe un mensaje" maxlength="500" enterkeyhint="send">
      <button class="send" id="send" type="submit" aria-label="Enviar" disabled>
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4l17.5-7.9a.6.6 0 000-1.1L3.4 3.6a.6.6 0 00-.85.7L4.9 11l8.6 1-8.6 1-2.35 6.7a.6.6 0 00.85.7z"/></svg>
      </button>
    </form>
    <div class="foot">Prototipo · las respuestas son aleatorias</div>
  </section>

  <div class="launcher">
    <span class="ring" aria-hidden="true"></span>
    <button class="fab" id="fab" type="button" aria-label="Abrir chat" aria-expanded="false" aria-controls="panel">
      <svg class="i-chat" viewBox="0 0 32 32" aria-hidden="true">
        <path fill="#fff" d="M16 3C8.8 3 3 8.1 3 14.5c0 3.3 1.5 6.2 4 8.3-.1 1.9-.8 3.7-2 5.1-.3.4 0 1 .5.9 2.6-.4 4.9-1.4 6.6-2.7 1.2.3 2.5.5 3.9.5 7.2 0 13-5.1 13-11.5S23.2 3 16 3z"/>
        <circle cx="10.5" cy="14.5" r="1.8" fill="#00A3E0"/><circle cx="16" cy="14.5" r="1.8" fill="#00A3E0"/><circle cx="21.5" cy="14.5" r="1.8" fill="#00A3E0"/>
      </svg>
      <svg class="i-close" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
    <span class="badge" id="badge" aria-hidden="true">1</span>
  </div>
</div>
`;

  function init() {
    var host = document.createElement('div');
    host.id = 'chat-widget-host';
    host.style.cssText = 'all:initial;position:fixed;right:0;bottom:0;z-index:2147483000;';
    var root = host.attachShadow({ mode: 'open' });
    root.innerHTML = '<style>' + CSS + '</style>' + HTML;
    document.body.appendChild(host);

    var $ = function (id) { return root.getElementById(id); };
    var cw = $('cw'), fab = $('fab'), closeBtn = $('close'), badge = $('badge'),
        msgs = $('msgs'), form = $('form'), field = $('field'), send = $('send');

    var isOpen = false;
    var busy = false;

    function timeNow() {
      try { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
      catch (e) { return ''; }
    }

    function scrollDown() { msgs.scrollTop = msgs.scrollHeight; }

    function addMessage(text, who) {
      var row = document.createElement('div');
      row.className = 'row ' + who;
      var bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.textContent = text;           // textContent: seguro frente a HTML inyectado
      var time = document.createElement('div');
      time.className = 'time';
      time.textContent = timeNow();
      row.appendChild(bubble);
      row.appendChild(time);
      msgs.appendChild(row);
      scrollDown();
      return row;
    }

    function showTyping() {
      var row = document.createElement('div');
      row.className = 'row bot typing';
      row.innerHTML = '<div class="bubble" aria-label="Escribiendo"><span></span><span></span><span></span></div>';
      msgs.appendChild(row);
      scrollDown();
      return row;
    }

    function botReply() {
      busy = true;
      var t = showTyping();
      var delay = 700 + Math.random() * 900;
      setTimeout(function () {
        t.remove();
        addMessage(randomReply(), 'bot');
        busy = false;
      }, delay);
    }

    function handleUser(text) {
      text = text.trim();
      if (!text || busy) return;
      var chips = msgs.querySelector('.chips');
      if (chips) chips.remove();
      addMessage(text, 'user');
      botReply();
    }

    // Mensaje de bienvenida + opciones rápidas
    addMessage(GREETING, 'bot');
    var chipsWrap = document.createElement('div');
    chipsWrap.className = 'chips';
    CHIPS.forEach(function (label) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = label;
      b.addEventListener('click', function () { handleUser(label); });
      chipsWrap.appendChild(b);
    });
    msgs.appendChild(chipsWrap);

    function setOpen(state) {
      isOpen = state;
      cw.classList.toggle('open', state);
      fab.setAttribute('aria-expanded', String(state));
      fab.setAttribute('aria-label', state ? 'Cerrar chat' : 'Abrir chat');
      if (state) {
        badge.hidden = true;
        scrollDown();
        setTimeout(function () { field.focus({ preventScroll: true }); }, 250);
      } else {
        fab.focus({ preventScroll: true });
      }
    }

    fab.addEventListener('click', function () { setOpen(!isOpen); });
    closeBtn.addEventListener('click', function () { setOpen(false); });
    root.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) setOpen(false); });

    field.addEventListener('input', function () { send.disabled = !field.value.trim(); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = field.value;
      if (!v.trim() || busy) return;
      field.value = '';
      send.disabled = true;
      handleUser(v);
      field.focus({ preventScroll: true });
    });
  }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
