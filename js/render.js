var R = (function () {
  var N = D.N, T = D.T;
  var cv, cx, W_, H_;
  var cam = { x: 24 * T, y: 30 * T, z: 1.4 };
  var yagmurParcaci = [];
  var hayalet = null;

  function init() {
    cv = document.getElementById('c'); cx = cv.getContext('2d');
    resize(); window.addEventListener('resize', resize);
    for (var i = 0; i < 160; i++) yagmurParcaci.push({ x: Math.random(), y: Math.random(), v: 0.5 + Math.random() });
  }
  function resize() { cv.width = W_ = window.innerWidth; cv.height = H_ = window.innerHeight; cx.imageSmoothingEnabled = false; }
  function ts() { return T * cam.z; }
  function ekranX(wx) { return (wx * T - cam.x) * cam.z + W_ / 2; }
  function ekranY(wy) { return (wy * T - cam.y) * cam.z + H_ / 2; }
  function dunyaX(sx) { return ((sx - W_ / 2) / cam.z + cam.x) / T; }
  function dunyaY(sy) { return ((sy - H_ / 2) / cam.z + cam.y) / T; }
  function kameraSinir() {
    cam.z = U.clamp(cam.z, 0.6, 3);
    var hw = W_ / 2 / cam.z, hh = H_ / 2 / cam.z;
    cam.x = U.clamp(cam.x, Math.min(hw, N * T / 2), Math.max(N * T - hw, N * T / 2));
    cam.y = U.clamp(cam.y, Math.min(hh, N * T / 2), Math.max(N * T - hh, N * T / 2));
  }

  function sprite(ad, tx, ty, sw, sh, alpha, flip) {
    // tx,ty = ayak izinin alt-orta noktası (dünya, karo) ; sw/sh = piksel
    var im = A.img(ad), s = ts() / 64;
    var dw = sw * s, dh = sh * s, x = ekranX(tx) - dw / 2, y = ekranY(ty) - dh;
    if (!im) return false;
    if (alpha !== undefined) cx.globalAlpha = alpha;
    if (flip) { cx.save(); cx.translate(x + dw, y); cx.scale(-1, 1); cx.drawImage(im, 0, 0, dw, dh); cx.restore(); }
    else cx.drawImage(im, x, y, dw, dh);
    cx.globalAlpha = 1;
    return true;
  }

  function zeminCiz(x0, y0, x1, y1) {
    var s = ts(), kuru = G.doga < 35 || S.afetVar('kuraklik');
    for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) {
      var t = G.tile[y * N + x], px = Math.floor(ekranX(x)), py = Math.floor(ekranY(y)), sz = Math.ceil(s) + 1;
      var ad = W.ZEMIN[t];
      if (t === W.CIM && kuru && U.hash(x, y, 5) < (0.5 - G.doga / 100)) ad = 'zemin_kuru_cimen';
      var im = A.img(ad);
      if (im) cx.drawImage(im, px, py, sz, sz);
      else { cx.fillStyle = W.RENK[t]; cx.fillRect(px, py, sz, sz); }
    }
  }

  function tarlaCiz(o) {
    var t = W.tanim(o), s = ts();
    sprite(t.s, o.x + 0.5, o.y + 1, 64, 64, 1);
    if (!o.bitti) return;
    if (o.ekin) {
      var ad = o.oldu ? 'ekin_kurumus' : (o.buyume < 0.5 ? 'ekin_filiz' : 'ekin_' + o.ekin);
      if (!sprite(ad, o.x + 0.5, o.y + 1, 64, 64, 1)) { cx.fillStyle = o.oldu ? '#8a6' : '#6c3'; cx.fillRect(ekranX(o.x) + s * 0.2, ekranY(o.y) + s * 0.2, s * 0.6 * Math.max(0.3, o.buyume), s * 0.6); }
      if (!o.oldu && o.su < 0.3) { cx.fillStyle = 'rgba(255,90,60,.9)'; cx.fillRect(ekranX(o.x) + 2, ekranY(o.y) + s - 5, (s - 4) * o.su / 0.3, 3); }
    }
  }

  function nesneCiz(o) {
    var t = W.tanim(o), s = ts();
    if (o.tur === 'bina' && o.bina === 'tarla') return;
    var cx0 = o.x + o.w / 2, cy0 = o.y + o.h;
    var alpha = (o.tur === 'bina' && !o.bitti) ? 0.5 : 1;
    var ok = sprite(t.s, cx0, cy0, t.sw, t.sh, alpha);
    if (!ok) {
      cx.fillStyle = o.tur === 'bina' ? '#b98' : '#684';
      cx.fillRect(ekranX(o.x) + 2, ekranY(o.y) + 2, o.w * s - 4, o.h * s - 4);
    }
    if (o.tur === 'bina' && !o.bitti) {
      var bx = ekranX(o.x), by = ekranY(o.y) - 6;
      cx.fillStyle = '#000a'; cx.fillRect(bx, by, o.w * s, 5);
      cx.fillStyle = '#ffb347'; cx.fillRect(bx, by, o.w * s * (o.insa || 0), 5);
    }
    if (o.tur === 'bina' && o.bina === 'ruzgar' && o.bitti) {
      var kd = A.img('yapi_ruzgar_gulu_kanat');
      if (kd) { var pr = ekranX(o.x + 0.5), py = ekranY(o.y + 1) - s * 1.55; cx.save(); cx.translate(pr, py); cx.rotate(G.dk / 120 * (0.3 + G.hava.ruzgar * 2)); cx.drawImage(kd, -s * 0.5, -s * 0.5, s, s); cx.restore(); }
    }
    if (o.tur === 'bina' && o.bitti && o.guclu) { cx.fillStyle = '#7bd36b'; cx.fillRect(ekranX(o.x) + 2, ekranY(o.y + o.h) - 6, 6, 4); }
  }

  function birimCiz(u) {
    var s = ts();
    if (u.icerde) return;
    var ad = u.kahraman ? (u.cins === 'k' ? 'kahraman_kadin' : 'kahraman_erkek') :
      (u.yas === 'cocuk' ? (u.cins === 'k' ? 'insan_cocuk_kiz' : 'insan_cocuk_erkek') :
        u.yas === 'yasli' ? (u.cins === 'k' ? 'insan_yasli_kadin' : 'insan_yasli_erkek') : (u.cins === 'k' ? 'insan_kadin' : 'insan_erkek'));
    var px = ekranX(u.x), py = ekranY(u.y + 0.45);
    if (u.secili) {
      cx.strokeStyle = '#ffb347'; cx.lineWidth = 2; cx.beginPath(); cx.ellipse(px, py - s * 0.05, s * 0.45, s * 0.2, 0, 0, 7); cx.stroke();
    }
    cx.fillStyle = 'rgba(0,0,0,.25)'; cx.beginPath(); cx.ellipse(px, py - s * 0.05, s * 0.3, s * 0.12, 0, 0, 7); cx.fill();
    var boy = 70 * (u.yas === 'cocuk' ? 0.8 : 1);
    var ok = sprite(ad, u.x, u.y + 0.45, boy, boy, 1, u.yon < 0);
    if (!ok) { cx.fillStyle = u.kahraman ? '#ff9f43' : '#e8d0b0'; cx.fillRect(px - s * 0.2, py - s * 0.8, s * 0.4, s * 0.8); }
    if (u.uyku) { cx.fillStyle = '#fff'; cx.font = Math.round(s * 0.4) + 'px sans-serif'; cx.fillText('z', px + s * 0.2, py - s * 0.8); }
    if (u.hasta) { cx.fillStyle = '#7bd36b'; cx.font = 'bold ' + Math.round(s * 0.45) + 'px sans-serif'; cx.fillText('+', px - s * 0.1, py - s * 0.95); }
    if (u.secili || u.sag < 50 || cam.z > 1.8) {
      cx.fillStyle = '#000a'; cx.fillRect(px - s * 0.3, py - s * 0.95, s * 0.6, 4);
      cx.fillStyle = u.sag > 50 ? '#7bd36b' : (u.sag > 25 ? '#ffd166' : '#ff5e5e'); cx.fillRect(px - s * 0.3, py - s * 0.95, s * 0.6 * U.clamp(u.sag / 100, 0, 1), 4);
    }
    if (cam.z >= 1.1) { cx.fillStyle = '#fff'; cx.font = '11px Segoe UI'; cx.textAlign = 'center'; cx.strokeStyle = '#000'; cx.lineWidth = 3; cx.strokeText(u.ad, px, py + 12); cx.fillText(u.ad, px, py + 12); cx.textAlign = 'left'; }
  }

  function hayvanCiz(a) {
    var boy = a.s === 'hayvan_karaca' ? 64 : 48;
    var ok = sprite(a.s, a.x, a.y + 0.4, boy, boy, 1, a.yon < 0);
    if (!ok) { cx.fillStyle = '#ccc'; cx.fillRect(ekranX(a.x) - 4, ekranY(a.y) - 4, 8, 8); }
  }

  function sisCiz(x0, y0, x1, y1) {
    var s = ts();
    cx.fillStyle = '#10181e';
    for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) {
      if (!G.kesif[y * N + x]) { cx.globalAlpha = 0.96; cx.fillRect(Math.floor(ekranX(x)), Math.floor(ekranY(y)), Math.ceil(s) + 1, Math.ceil(s) + 1); }
      else {
        // kenar yumuşatma
        var kom = 0;
        if (x > 0 && !G.kesif[y * N + x - 1]) kom++; if (x < N - 1 && !G.kesif[y * N + x + 1]) kom++;
        if (y > 0 && !G.kesif[(y - 1) * N + x]) kom++; if (y < N - 1 && !G.kesif[(y + 1) * N + x]) kom++;
        if (kom) { cx.globalAlpha = 0.18 * kom; cx.fillRect(Math.floor(ekranX(x)), Math.floor(ekranY(y)), Math.ceil(s) + 1, Math.ceil(s) + 1); }
      }
    }
    cx.globalAlpha = 1;
  }

  function ateşCiz(x0, y0, x1, y1) {
    var s = ts();
    for (var k in G.ates) {
      var i = +k, x = i % N, y = (i / N) | 0;
      if (x < x0 || x > x1 || y < y0 || y > y1) continue;
      var f = 0.8 + 0.2 * Math.sin(G.dk / 3 + i);
      if (!sprite('efekt_ates', x + 0.5, y + 1, 64 * f, 64 * f, 0.95)) { cx.fillStyle = 'rgba(255,120,30,.8)'; cx.fillRect(ekranX(x) + 4, ekranY(y) + 4, s - 8, s - 8); }
      if (G.rand() < 0.01) sprite('efekt_duman', x + 0.5, y, 64, 64, 0.6);
    }
  }

  function hayaletCiz() {
    if (!hayalet) return;
    var b = D.BINA[hayalet.kod], w = b.w || 1, h = b.h || 1, s = ts();
    var ok = W.ic(hayalet.x, hayalet.y) && W.yerUygun(hayalet.kod, hayalet.x, hayalet.y);
    var kod = hayalet.kod;
    var vard = W.tanim({ tur: 'bina', bina: kod });
    sprite(vard.s, hayalet.x + w / 2, hayalet.y + h, vard.sw, vard.sh, 0.55);
    cx.fillStyle = ok ? 'rgba(80,220,100,.35)' : 'rgba(240,70,60,.4)';
    cx.fillRect(ekranX(hayalet.x), ekranY(hayalet.y), w * s, h * s);
  }

  function havaCiz() {
    var h = S.saat(), t = G.hava;
    // Gece
    var gece = 0;
    if (h >= 21 || h < 5) gece = 0.62; else if (h >= 19) gece = (h - 19) / 2 * 0.62; else if (h < 7) gece = (7 - h) / 2 * 0.62;
    if (gece > 0) { cx.fillStyle = 'rgba(8,12,40,' + gece.toFixed(3) + ')'; cx.fillRect(0, 0, W_, H_); }
    // Isı dalgası
    if (S.afetVar('isi')) { cx.fillStyle = 'rgba(255,130,20,.17)'; cx.fillRect(0, 0, W_, H_); }
    else if (t.t > 33) { cx.fillStyle = 'rgba(255,170,40,.08)'; cx.fillRect(0, 0, W_, H_); }
    if (S.afetVar('kuraklik')) { cx.fillStyle = 'rgba(200,170,90,.10)'; cx.fillRect(0, 0, W_, H_); }
    // Kış
    if (S.mevsim() === 3 || t.kar) { cx.fillStyle = 'rgba(220,235,255,.10)'; cx.fillRect(0, 0, W_, H_); }
    // Yağış
    if (t.yagmur || t.kar) {
      cx.strokeStyle = 'rgba(190,215,255,.55)'; cx.fillStyle = 'rgba(255,255,255,.8)'; cx.lineWidth = 1;
      var hz = G.duraklat ? 0 : 1;
      for (var i = 0; i < yagmurParcaci.length; i++) {
        var p = yagmurParcaci[i];
        p.y += (t.kar ? 0.004 : 0.03) * p.v * hz; p.x += (t.kar ? 0.001 : 0.004) * hz * (1 + t.ruzgar); if (p.y > 1) { p.y = 0; p.x = Math.random(); } if (p.x > 1) p.x = 0;
        if (t.kar) cx.fillRect(p.x * W_, p.y * H_, 3, 3);
        else { cx.beginPath(); cx.moveTo(p.x * W_, p.y * H_); cx.lineTo(p.x * W_ - 4, p.y * H_ + 12); cx.stroke(); }
      }
      cx.fillStyle = 'rgba(30,50,80,.18)'; cx.fillRect(0, 0, W_, H_);
    }
    // Sel
    if (S.afetVar('sel')) {
      var s = ts(); cx.fillStyle = 'rgba(60,120,200,.38)';
      var x0 = Math.max(0, Math.floor(dunyaX(0))), x1 = Math.min(N - 1, Math.ceil(dunyaX(W_))), y0 = Math.max(0, Math.floor(dunyaY(0))), y1 = Math.min(N - 1, Math.ceil(dunyaY(H_)));
      for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) if (G.selAlan[y * N + x] && G.kesif[y * N + x]) cx.fillRect(Math.floor(ekranX(x)), Math.floor(ekranY(y)), Math.ceil(s) + 1, Math.ceil(s) + 1);
    }
  }

  function ciz() {
    if (!G) { cx.fillStyle = '#10161c'; cx.fillRect(0, 0, W_, H_); return; }
    kameraSinir();
    cx.fillStyle = '#0b1015'; cx.fillRect(0, 0, W_, H_);
    var x0 = Math.max(0, Math.floor(dunyaX(0)) - 1), x1 = Math.min(N - 1, Math.ceil(dunyaX(W_)) + 1);
    var y0 = Math.max(0, Math.floor(dunyaY(0)) - 1), y1 = Math.min(N - 1, Math.ceil(dunyaY(H_)) + 1);
    zeminCiz(x0, y0, x1, y1);
    // Çizim listesi
    var liste = [];
    for (var i = 1; i < G.nesneler.length; i++) {
      var o = G.nesneler[i];
      if (!o || o.x + o.w < x0 - 2 || o.x > x1 + 2 || o.y + o.h < y0 || o.y > y1 + 4) continue;
      if (o.tur === 'bina' && o.bina === 'tarla') { tarlaCiz(o); continue; }
      liste.push({ y: o.y + o.h, o: o });
    }
    for (var j = 0; j < G.birim.length; j++) { var u = G.birim[j]; if (!u.olu) liste.push({ y: u.y + 0.45, u: u }); }
    for (var k = 0; k < G.hayvan.length; k++) liste.push({ y: G.hayvan[k].y + 0.4, a: G.hayvan[k] });
    liste.sort(function (a, b) { return a.y - b.y; });
    for (var q = 0; q < liste.length; q++) {
      var e = liste[q];
      if (e.o) nesneCiz(e.o); else if (e.u) birimCiz(e.u); else hayvanCiz(e.a);
    }
    ateşCiz(x0, y0, x1, y1);
    hayaletCiz();
    havaCiz();
    sisCiz(x0, y0, x1, y1);
  }

  function miniCiz(mc) {
    var m = mc.getContext('2d'), sz = mc.width, k = sz / N;
    m.clearRect(0, 0, sz, sz);
    if (!G) return;
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      if (!G.kesif[y * N + x]) { m.fillStyle = '#10181e'; }
      else { m.fillStyle = W.RENK[G.tile[y * N + x]]; }
      m.fillRect(x * k, y * k, Math.ceil(k), Math.ceil(k));
    }
    for (var i = 1; i < G.nesneler.length; i++) {
      var o = G.nesneler[i];
      if (!o || o.tur !== 'bina' || !G.kesif[o.y * N + o.x]) continue;
      m.fillStyle = '#ff9f43'; m.fillRect(o.x * k, o.y * k, Math.max(2, o.w * k), Math.max(2, o.h * k));
    }
    for (var j = 0; j < G.birim.length; j++) { var u = G.birim[j]; if (u.olu) continue; m.fillStyle = u.kahraman ? '#fff' : '#ffe08a'; m.fillRect(u.x * k - 1, u.y * k - 1, 3, 3); }
    m.strokeStyle = '#fff'; m.lineWidth = 1;
    var vx = cam.x / T, vy = cam.y / T, vw = W_ / cam.z / T, vh = H_ / cam.z / T;
    m.strokeRect((vx - vw / 2) * k, (vy - vh / 2) * k, vw * k, vh * k);
  }

  return {
    init: init, ciz: ciz, miniCiz: miniCiz, cam: cam, ekranX: ekranX, ekranY: ekranY, dunyaX: dunyaX, dunyaY: dunyaY,
    setHayalet: function (h) { hayalet = h; }, getHayalet: function () { return hayalet; },
    boyut: function () { return { w: W_, h: H_ }; }
  };
})();
