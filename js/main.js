var Main = (function () {
  var son = 0, uiSon = 0, oyunda = false;

  function init() {
    R.init(); UI.init(); Hikaye.init();
    Hikaye.anaMenu();
    requestAnimationFrame(dongu);
  }

  function dongu(t) {
    var dt = Math.min(100, t - (son || t)); son = t;
    if (G && oyunda) {
      kamera(dt);
      if (!G.duraklat && !G.bitti && !UI.modalAcik()) S.adim(dt / 1000 * D.DK_SANIYE * G.hiz);
      if (t - uiSon > 250) { uiSon = t; UI.ciz(); }
    }
    R.ciz();
    requestAnimationFrame(dongu);
  }

  function kamera(dt) {
    var t = UI.tus, v = 700 / R.cam.z * dt / 1000, dx = 0, dy = 0;
    if (t['w'] || t['arrowup']) dy -= v; if (t['s'] || t['arrowdown']) dy += v;
    if (t['a'] || t['arrowleft']) dx -= v; if (t['d'] || t['arrowright']) dx += v;
    if (dx || dy) { R.cam.x += dx; R.cam.y += dy; G.egitim.kamera = (G.egitim.kamera || 0) + Math.abs(dx) + Math.abs(dy); }
  }

  function oyunaGir() {
    Hikaye.ekranKapat();
    UI.goster(true);
    oyunda = true;
    var h = null;
    for (var i = 0; i < G.birim.length; i++) if (G.birim[i].kahraman && !G.birim[i].olu) h = G.birim[i];
    h = h || G.birim[0];
    R.cam.x = (h ? h.x : 24) * D.T; R.cam.y = (h ? h.y : 32) * D.T; R.cam.z = 1.5;
    G.duraklat = false;
    UI.sec(h ? [h.id] : []);
    UI.ciz();
  }
  function geceAtla() {
    if (!G || G.bitti || UI.modalAcik()) return;
    var h = S.saat();
    if (h >= 6 && h < 20) { UI.toast('Henüz gece değil (20:00 sonrası atlanabilir).', 'uyari'); return; }
    var dk = h < 6 ? (6 - h) * 60 : (30 - h) * 60;
    S.adim(dk);
    UI.toast('Sabah oldu.', 'iyi');
  }
  function menuyeDon() { oyunda = false; Hikaye.anaMenu(); }
  function duraklatDegis(zorla) { G.duraklat = zorla ? true : !G.duraklat; G.egitim.hiz = 1; }
  function hizAyarla(v) { G.hiz = v; G.duraklat = false; G.egitim.hiz = 1; }

  window.addEventListener('load', init);
  return { geceAtla: geceAtla, oyunaGir: oyunaGir, menuyeDon: menuyeDon, duraklatDegis: duraklatDegis, hizAyarla: hizAyarla };
})();
