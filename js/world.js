var W = (function () {
  var N = D.N;
  var CIM = 0, TOP = 1, KUM = 2, DENIZ = 3, SIG = 4, DERE = 5, KAYA = 6, ORMAN = 7, ASF = 8, KALD = 9, MOLOZ = 10;
  var ZEMIN = ['zemin_cimen', 'zemin_toprak', 'zemin_kum', 'zemin_deniz', 'zemin_sig_su', 'zemin_dere', 'zemin_kayalik', 'zemin_orman', 'zemin_asfalt', 'zemin_kaldirim', 'zemin_moloz'];
  var RENK = ['#5a8f3c', '#7a5a3a', '#d8c48a', '#2a5f9a', '#4a86b8', '#3c78b0', '#7d7d7d', '#2f6b2f', '#444444', '#8a8a8a', '#6a5f55'];
  var VX = 24, VY = 32;
  // Harita ön ayarları: her oyunda biri rastgele seçilir (ayrıca rastgele aynalama uygulanır)
  var PRESET = [
    { ad: 'Kıyı Köyü', orman: 0.38, kaya: 14, hurda: 1, kiyi: 7 },
    { ad: 'Sık Orman', orman: 0.2, kaya: 9, hurda: 0.8, kiyi: 6 },
    { ad: 'Kayalık Yamaç', orman: 0.52, kaya: 24, hurda: 1, kiyi: 8 },
    { ad: 'Terk Edilmiş Şehir', orman: 0.45, kaya: 12, hurda: 2.2, kiyi: 9 },
    { ad: 'Açık Kıyı', orman: 0.6, kaya: 10, hurda: 1.2, kiyi: 12 }
  ];
  var DIR = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  var _dist = new Int16Array(N * N), _prev = new Int32Array(N * N), _q = new Int32Array(N * N);

  function idx(x, y) { return y * N + x; }
  function ic(x, y) { return x >= 0 && y >= 0 && x < N && y < N; }

  function tanim(o) {
    if (o.tur === 'bina') {
      var b = D.BINA[o.bina] || D.OZEL_BINA[o.bina];
      var nonblock = (o.bina === 'tarla');
      return { s: b.s, w: b.w || 1, h: b.h || 1, sw: b.sw || 64, sh: b.sh || 64, engel: !nonblock, zemin: !!b.zemin, ad: b.ad };
    }
    var d = D.NESNE[o.tur];
    return { s: d.s, w: d.w || 1, h: d.h || 1, sw: d.sw || 64, sh: d.sh || 64, engel: !!d.engel, zemin: false, ad: d.ad || o.tur };
  }

  function gecHesapla(x, y) {
    var i = idx(x, y);
    var ok = G.tile[i] !== DENIZ;
    if (ok && G.occ[i]) {
      var o = G.nesneler[G.occ[i]];
      if (o && tanim(o).engel) ok = false;
    }
    G.gec[i] = ok ? 1 : 0;
  }

  function ekle(tur, x, y, ozel) {
    var o = { id: G.nesneler.length, tur: tur, x: x, y: y };
    if (ozel) for (var k in ozel) o[k] = ozel[k];
    var t = tanim(o);
    o.w = t.w; o.h = t.h;
    G.nesneler.push(o);
    for (var yy = y; yy < y + o.h; yy++) for (var xx = x; xx < x + o.w; xx++) {
      if (!ic(xx, yy)) continue;
      G.occ[idx(xx, yy)] = o.id;
      gecHesapla(xx, yy);
    }
    return o;
  }

  function sil(o) {
    for (var yy = o.y; yy < o.y + o.h; yy++) for (var xx = o.x; xx < o.x + o.w; xx++) {
      if (!ic(xx, yy)) continue;
      if (G.occ[idx(xx, yy)] === o.id) G.occ[idx(xx, yy)] = 0;
      gecHesapla(xx, yy);
    }
    G.nesneler[o.id] = null;
    for (var i = 0; i < G.birim.length; i++) if (G.birim[i].is && G.birim[i].is.hedef === o.id) G.birim[i].is = null;
  }

  function ac(cx, cy, r) {
    var n = 0;
    for (var y = Math.max(0, Math.floor(cy - r)); y <= Math.min(N - 1, Math.ceil(cy + r)); y++)
      for (var x = Math.max(0, Math.floor(cx - r)); x <= Math.min(N - 1, Math.ceil(cx + r)); x++) {
        if ((x - cx) * (x - cx) + (y - cy) * (y - cy) <= r * r && !G.kesif[idx(x, y)]) { G.kesif[idx(x, y)] = 1; n++; }
      }
    return n;
  }

  function yol(sx, sy, hedefFn, maxAdim) {
    sx = Math.floor(sx); sy = Math.floor(sy);
    if (!ic(sx, sy)) return null;
    if (hedefFn(sx, sy)) return [];
    _dist.fill(-1);
    var h = 0, t = 0, s = idx(sx, sy);
    _q[t++] = s; _dist[s] = 0; _prev[s] = -1;
    maxAdim = maxAdim || 200;
    while (h < t) {
      var cur = _q[h++], cx = cur % N, cy = (cur / N) | 0, d = _dist[cur];
      if (d >= maxAdim) continue;
      for (var k = 0; k < 8; k++) {
        var nx = cx + DIR[k][0], ny = cy + DIR[k][1];
        if (!ic(nx, ny)) continue;
        var ni = idx(nx, ny);
        if (_dist[ni] >= 0 || !G.gec[ni]) continue;
        if (k >= 4 && (!G.gec[idx(nx, cy)] || !G.gec[idx(cx, ny)])) continue;
        _dist[ni] = d + 1; _prev[ni] = cur;
        if (hedefFn(nx, ny)) {
          var p = [], c = ni;
          while (c !== s) { p.push([c % N, (c / N) | 0]); c = _prev[c]; }
          return p.reverse();
        }
        _q[t++] = ni;
      }
    }
    return null;
  }

  function yakin(o) {
    var x0 = o.x - 1, y0 = o.y - 1, x1 = o.x + o.w, y1 = o.y + o.h;
    return function (x, y) { return x >= x0 && x <= x1 && y >= y0 && y <= y1; };
  }
  function yakinMi(u, o) { return yakin(o)(Math.floor(u.x), Math.floor(u.y)); }

  // En yakın uygun nesne
  function bul(u, filtre, maxD) {
    var best = null, bd = maxD || 40;
    for (var i = 1; i < G.nesneler.length; i++) {
      var o = G.nesneler[i];
      if (!o || o.rez || !G.kesif[idx(o.x, o.y)]) continue;
      if (u.red && u.red[o.id] && u.red[o.id] > G.dk) continue;
      if (!filtre(o)) continue;
      var d = Math.abs(o.x - u.x) + Math.abs(o.y - u.y);
      if (d < bd) { bd = d; best = o; }
    }
    return best;
  }

  function say(f) { var n = 0; for (var i = 1; i < G.nesneler.length; i++) { var o = G.nesneler[i]; if (o && f(o)) n++; } return n; }
  function bina(ad) { return function (o) { return o.tur === 'bina' && o.bina === ad && o.bitti; }; }
  function sayBina(ad) { return say(bina(ad)); }

  function yerUygun(kod, x, y) {
    var b = D.BINA[kod], w = b.w || 1, h = b.h || 1;
    for (var yy = y; yy < y + h; yy++) for (var xx = x; xx < x + w; xx++) {
      if (!ic(xx, yy)) return false;
      var i = idx(xx, yy), t = G.tile[i];
      if (!G.kesif[i] || G.occ[i]) return false;
      if (t === DENIZ || t === SIG || t === DERE || t === KAYA || t === ASF) return false;
      if (G.ates[i]) return false;
    }
    return true;
  }

  function kiyiMi(x, y) {
    if (!ic(x, y) || !G.gec[idx(x, y)]) return false;
    for (var k = 0; k < 4; k++) {
      var nx = x + DIR[k][0], ny = y + DIR[k][1];
      if (ic(nx, ny) && (G.tile[idx(nx, ny)] === DENIZ || G.tile[idx(nx, ny)] === SIG)) return true;
    }
    return false;
  }
  function dereKenari(x, y) {
    if (!ic(x, y) || !G.gec[idx(x, y)] || G.tile[idx(x, y)] === DERE) return false;
    for (var k = 0; k < 4; k++) {
      var nx = x + DIR[k][0], ny = y + DIR[k][1];
      if (ic(nx, ny) && G.tile[idx(nx, ny)] === DERE) return true;
    }
    return false;
  }

  function cevir(fx, fy) {
    var nt = new Uint8Array(N * N), ns = new Uint8Array(N * N), x, y;
    for (y = 0; y < N; y++) for (x = 0; x < N; x++) {
      var nx = fx ? N - 1 - x : x, ny = fy ? N - 1 - y : y;
      nt[idx(nx, ny)] = G.tile[idx(x, y)]; ns[idx(nx, ny)] = G.selAlan[idx(x, y)];
    }
    G.tile = nt; G.selAlan = ns; G.occ = new Int32Array(N * N); G.kesif = new Uint8Array(N * N);
    for (var i = 1; i < G.nesneler.length; i++) {
      var o = G.nesneler[i]; if (!o) continue;
      if (fx) o.x = N - o.x - o.w;
      if (fy) o.y = N - o.y - o.h;
      for (var yy = o.y; yy < o.y + o.h; yy++) for (var xx = o.x; xx < o.x + o.w; xx++) G.occ[idx(xx, yy)] = o.id;
    }
    if (fx) VX = N - 1 - VX;
    if (fy) VY = N - 1 - VY;
    for (i = 0; i < N * N; i++) gecHesapla(i % N, (i / N) | 0);
  }

  function uret(seed) {
    var r = G.rand;
    VX = 24; VY = 32;
    var P = PRESET[Math.floor(r() * PRESET.length)];
    var fx = r() < 0.5, fy = r() < 0.5;
    G.harita = { ad: P.ad, fx: fx, fy: fy };
    G.tile = new Uint8Array(N * N);
    G.occ = new Int32Array(N * N);
    G.gec = new Uint8Array(N * N);
    G.kesif = new Uint8Array(N * N);
    G.selAlan = new Uint8Array(N * N);
    G.nesneler = [null];
    G.ates = {};
    var x, y, i;
    for (y = 0; y < N; y++) for (x = 0; x < N; x++) {
      i = idx(x, y);
      var t = CIM;
      var kiyi = P.kiyi + U.noise(x / 6, 3, seed + 1) * 4;
      var dk = 57 - U.noise(5, y / 6, seed + 2) * 3;
      if (x < P.kaya + U.noise(2, y / 5, seed + 4) * 4 && y > 22 && y < 50) t = KAYA;
      if (x < 34 && y > 9 && y < 26 && U.fbm(x / 5, y / 5, seed + 3) > P.orman) t = ORMAN;
      if (y < kiyi - 3) t = DENIZ; else if (y < kiyi - 1) t = SIG; else if (y < kiyi + 1) t = KUM;
      if (x > dk + 3) t = DENIZ; else if (x > dk + 1) t = SIG; else if (x > dk - 1 && t !== DENIZ) t = KUM;
      G.tile[i] = t;
    }
    // Dere
    for (x = 14; x < N; x++) {
      y = Math.round(18 + (x - 14) * 0.3 + Math.sin(x / 4) * 1.5);
      for (var dy = 0; dy < 2; dy++) {
        if (ic(x, y + dy) && G.tile[idx(x, y + dy)] !== DENIZ && G.tile[idx(x, y + dy)] !== SIG) G.tile[idx(x, y + dy)] = DERE;
      }
    }
    // Şehir
    var RX = [31, 38, 45, 52], RY = [37, 44, 51, 58];
    var ozel = [['hastane', 3], ['kutuphane', 2], ['okul', 2], null, ['market', 3], null, null, null, null];
    for (y = 37; y <= 58; y++) for (x = 31; x <= 52; x++) {
      i = idx(x, y);
      if (G.tile[i] === DENIZ || G.tile[i] === SIG || G.tile[i] === KUM) continue;
      var yolX = RX.indexOf(x) >= 0, yolY = RY.indexOf(y) >= 0;
      if (yolX || yolY) G.tile[i] = ASF;
      else if (RX.indexOf(x - 1) >= 0 || RX.indexOf(x + 1) >= 0 || RY.indexOf(y - 1) >= 0 || RY.indexOf(y + 1) >= 0) G.tile[i] = KALD;
      else G.tile[i] = U.noise(x / 2, y / 2, seed + 9) > 0.62 ? MOLOZ : CIM;
    }
    // Köy çevresi çimen
    for (y = VY - 8; y <= VY + 8; y++) for (x = VX - 9; x <= VX + 9; x++) {
      if (ic(x, y) && U.dist(x, y, VX, VY) < 8 && G.tile[idx(x, y)] !== DERE && G.tile[idx(x, y)] !== DENIZ) G.tile[idx(x, y)] = CIM;
    }
    // Alçak alan (sel)
    for (y = 0; y < N; y++) for (x = 0; x < N; x++) {
      if (G.tile[idx(x, y)] === DERE || G.tile[idx(x, y)] === SIG) {
        for (var yy = -2; yy <= 2; yy++) for (var xx = -2; xx <= 2; xx++) {
          if (ic(x + xx, y + yy) && xx * xx + yy * yy <= 5) G.selAlan[idx(x + xx, y + yy)] = 1;
        }
      }
    }
    for (i = 0; i < N * N; i++) gecHesapla(i % N, (i / N) | 0);

    // Yıkıntılar
    var bi = 0;
    for (var j = 0; j < 3; j++) for (var k = 0; k < 3; k++) {
      var bx = RX[k] + 1, by = RY[j] + 1, oz = ozel[bi++];
      if (oz && ic(bx + oz[1], by + oz[1])) { ekle(oz[0], bx, by, { yagma: false }); }
      else if (!oz) {
        if (bx + 6 < N && by + 6 < N) {
          ekle('yikik_ev', bx, by, {});
          if (r() < 0.7) ekle('yikik_ev', bx + 3, by + 3, {});
        }
      }
    }
    // Nesne serpiştirme
    for (y = 0; y < N; y++) for (x = 0; x < N; x++) {
      i = idx(x, y);
      if (G.occ[i] || !G.gec[i]) continue;
      if (U.dist(x, y, VX, VY) < 6.5) continue;
      var tt = G.tile[i], p = r(), tur = null;
      if (tt === ORMAN) {
        if (p < 0.5) tur = r() < 0.18 ? 'cam' : (r() < 0.2 ? 'genc' : 'agac');
        else if (p < 0.58) tur = 'cali'; else if (p < 0.61) tur = 'bogurtlen'; else if (p < 0.625) tur = 'sifali';
      } else if (tt === CIM) {
        if (p < 0.03) tur = 'agac'; else if (p < 0.05) tur = 'cali'; else if (p < 0.056) tur = 'bogurtlen'; else if (p < 0.059) tur = 'sifali';
        else if (x >= 31 && y >= 37 && p < 0.09 * P.hurda) tur = 'hurda';
      } else if (tt === KAYA) { if (p < 0.3) tur = 'kaya'; }
      else if (tt === KUM) { if (p < 0.03) tur = 'cop'; }
      else if (tt === ASF) { if (p < 0.05 * P.hurda) tur = 'araba'; else if (p < 0.08 * P.hurda) tur = 'hurda'; }
      else if (tt === KALD || tt === MOLOZ) { if (p < 0.07) tur = 'cop'; else if (p < 0.11) tur = 'hurda'; }
      if (!tur) {
        var dv = U.dist(x, y, VX, VY), cr = 0;
        if (tt === KUM) cr = 0.3; else if (tt === ASF || tt === KALD || tt === MOLOZ) cr = 0.45; else if (tt === CIM) cr = dv < 16 ? 0.2 : 0.11; else if (tt === ORMAN) cr = 0.04; else if (tt === TOP) cr = 0.1;
        if (r() < cr) tur = 'cop';
      }
      if (tur) ekle(tur, x, y, {});
    }
    // Köy
    var yer = function (kod, tur, bx, by, ek) { var o = ekle('bina', bx, by, { bina: kod, bitti: true, hp: 100 }); if (ek) for (var q in ek) o[q] = ek[q]; return o; };
    yer('ev', 'bina', 19, 30);
    yer('siginak', 'bina', 24, 29);
    var dz = yer('dizel', 'bina', 23, 33);
    yer('depo', 'bina', 27, 31);
    ekle('fidan', 21, 34, {});
    // evlerin yakınında başlangıç hurdası
    ekle('hurda', 18, 35, {}); ekle('cop', 29, 35, {}); ekle('hurda', 28, 28, {});
    ekle('agac', 17, 28, {}); ekle('agac', 30, 33, {}); ekle('kaya', 16, 33, {}); ekle('kaya', 29, 27, {});
    G.dizelId = dz.id;
    cevir(fx, fy);
    api.VX = VX; api.VY = VY;
    ac(VX, VY, 11);
  }

  var api = {
    CIM: CIM, TOP: TOP, KUM: KUM, DENIZ: DENIZ, SIG: SIG, DERE: DERE, KAYA: KAYA, ORMAN: ORMAN, ASF: ASF, KALD: KALD, MOLOZ: MOLOZ,
    ZEMIN: ZEMIN, RENK: RENK, VX: VX, VY: VY, idx: idx, ic: ic, tanim: tanim, ekle: ekle, sil: sil, ac: ac, yol: yol, yakin: yakin, yakinMi: yakinMi,
    bul: bul, say: say, bina: bina, sayBina: sayBina, yerUygun: yerUygun, kiyiMi: kiyiMi, dereKenari: dereKenari, uret: uret, gecHesapla: gecHesapla
  };
  return api;
})();
