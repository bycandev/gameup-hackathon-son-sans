var B = (function () {
  var uid = 1;
  var IS = {
    kes:     { ad: 'Ağaç kesiyor', sure: 60 },
    topla:   { ad: 'Topluyor', sure: 20 },
    kaz:     { ad: 'Taş çıkarıyor', sure: 50 },
    yagmala: { ad: 'Yağmalıyor', sure: 70 },
    sok:     { ad: 'Söküyor', sure: 90 },
    insa:    { ad: 'İnşa ediyor', sure: 60 },
    tarla:   { ad: 'Tarlayla ilgileniyor', sure: 25 },
    dik:     { ad: 'Fidan dikiyor', sure: 25 },
    balik:   { ad: 'Balık tutuyor', sure: 90 },
    su:      { ad: 'Su taşıyor', sure: 40 },
    sondur:  { ad: 'Yangın söndürüyor', sure: 20 },
    kasif:   { ad: 'Keşfe çıktı', sure: 5 },
    tedavi:  { ad: 'Hasta tedavi ediyor', sure: 30 },
    pisir:   { ad: 'Yemek pişiriyor', sure: 40 },
    ders:    { ad: 'Ders veriyor', sure: 60 },
    onarim:  { ad: 'Yapıyı onarıyor', sure: 40 },
    guclen:  { ad: 'Yapıyı güçlendiriyor', sure: 60 },
    git:     { ad: 'Yürüyor', sure: 1 }
  };

  function yeni(ad, cins, yas, meslek, x, y) {
    var m = D.MESLEK[meslek];
    return {
      id: uid++, ad: ad, cins: cins, yas: yas, meslek: meslek, x: x, y: y, yol: [], is: null,
      gorev: yas === 'cocuk' ? 'serbest' : (m ? m.gorev : 'serbest'),
      ac: 80, su: 80, isi: 50, sag: 100, hava: 100, hasta: null, uyku: false, icerde: false, mod: null,
      secili: false, olu: false, yatak: 0, yon: 1, red: {}, bekle: 0, kahraman: false
    };
  }
  function idAyarla() { var m = 0; for (var i = 0; i < G.birim.length; i++) if (G.birim[i].id > m) m = G.birim[i].id; uid = m + 1; }

  function isBirak(u) {
    if (u.is && u.is.hedef) {
      var o = G.nesneler[u.is.hedef];
      if (o && o.rez === u.id) delete o.rez;
    }
    u.yol = []; u.is = null;
  }

  function hizCarpani(u, tur) {
    var c = 1;
    if (u.yas === 'yasli') c *= 0.75;
    if (u.hasta) c *= 0.7;
    var mm = D.MESLEK[u.meslek];
    if (mm && u.gorev === mm.gorev) c *= 1.25; // mesleğine uygun görevde biraz daha verimli; herkes her işi yapabilir
    if ((tur === 'insa' || tur === 'onarim' || tur === 'guclen') && (u.meslek === 'usta' || u.meslek === 'muhendis')) c *= 1.6;
    if (tur === 'tarla' && (u.meslek === 'ciftci' || u.meslek === 'asci')) c *= 1.3;
    return c;
  }

  function sureOf(tur, o) {
    if (tur === 'insa' && o) {
      var b = D.BINA[o.bina];
      return Math.max(5, b.sure * (1 - (o.insa || 0)));
    }
    return IS[tur].sure;
  }

  function isAta(u, tur, o, tx, ty) {
    isBirak(u);
    var goal;
    if (o) goal = W.yakin(o);
    else if (tur === 'sondur' || tur === 'tedavi') goal = function (x, y) { return Math.abs(x - tx) <= 1 && Math.abs(y - ty) <= 1; };
    else goal = function (x, y) { return x === tx && y === ty; };
    var p = W.yol(u.x, u.y, goal, 300);
    if (!p) { if (o) u.red[o.id] = G.dk + 720; return false; }
    u.yol = p;
    u.is = { tur: tur, hedef: o ? o.id : 0, tx: tx, ty: ty, asama: 'yuru', kalan: sureOf(tur, o) };
    if (o) o.rez = u.id;
    return true;
  }

  function adimAt(u, dt) {
    var sp = 0.14 * dt * (u.yas === 'yasli' ? 0.8 : 1) * (u.hasta ? 0.7 : 1);
    if (G.hava && G.hava.kar) sp *= 0.6;
    while (sp > 0 && u.yol.length) {
      var h = u.yol[0], hx = h[0] + 0.5, hy = h[1] + 0.5;
      var dx = hx - u.x, dy = hy - u.y, d = Math.sqrt(dx * dx + dy * dy);
      if (dx > 0.01) u.yon = 1; else if (dx < -0.01) u.yon = -1;
      if (d <= sp) { u.x = hx; u.y = hy; u.yol.shift(); sp -= d; W.ac(u.x, u.y, u.gorev === 'kasif' ? 8 : 5); }
      else { u.x += dx / d * sp; u.y += dy / d * sp; sp = 0; }
    }
  }

  function dene(u, tur, filtre, maxD) {
    for (var k = 0; k < 3; k++) {
      var o = W.bul(u, filtre, maxD || 45);
      if (!o) return false;
      if (isAta(u, tur, o)) return true;
    }
    return false;
  }

  var AGAC = function (o) { return o.tur === 'agac' || o.tur === 'cam' || o.tur === 'yanik'; };
  var TOPLA = function (o) { return o.tur === 'hurda' || o.tur === 'cop' || o.tur === 'araba' || o.tur === 'bogurtlen' || o.tur === 'sifali' || o.tur === 'cali' || o.tur === 'kutuk' || o.tur === 'kitap'; };
  var BERRY = function (o) { return o.tur === 'bogurtlen'; };
  var RUIN = function (o) { return (o.tur === 'yikik_ev' || o.tur === 'market' || o.tur === 'okul' || o.tur === 'hastane' || o.tur === 'kutuphane') && !o.yagma; };
  var SITE = function (o) { return o.tur === 'bina' && !o.bitti; };
  var TARLA = function (o) {
    if (o.tur !== 'bina' || o.bina !== 'tarla' || !o.bitti) return false;
    if (o.ekin && o.oldu) return true;
    if (o.ekin && o.buyume >= 1) return true;
    if (!o.ekin) return G.kay.tohum >= 1;
    return o.su < 0.45 && G.kay.su >= 1;
  };

  function tSondur(u) {
    var best = null, bd = 1e9;
    for (var k in G.ates) {
      var i = +k, x = i % D.N, y = (i / D.N) | 0, d = U.dist(x, y, W.VX, W.VY);
      if (d < bd) { bd = d; best = [x, y]; }
    }
    if (best && bd < 16) return isAta(u, 'sondur', null, best[0], best[1]);
    return false;
  }
  function tKiyi(u, tur, test) {
    var best = null, bd = 60;
    for (var tries = 0; tries < 40; tries++) {
      var x = Math.floor(G.rand() * D.N), y = Math.floor(G.rand() * D.N);
      if (!G.kesif[W.idx(x, y)] || !test(x, y)) continue;
      var d = Math.abs(x - u.x) + Math.abs(y - u.y);
      if (d < bd) { bd = d; best = [x, y]; }
    }
    if (best) return isAta(u, tur, null, best[0], best[1]);
    return false;
  }
  function tDik(u) {
    for (var t = 0; t < 30; t++) {
      var a = G.rand() * 6.28, r = 4 + G.rand() * 9;
      var x = Math.round(W.VX + Math.cos(a) * r), y = Math.round(W.VY + Math.sin(a) * r);
      if (!W.ic(x, y) || !G.gec[W.idx(x, y)] || G.occ[W.idx(x, y)] || G.ates[W.idx(x, y)]) continue;
      var tt = G.tile[W.idx(x, y)];
      if (tt !== W.CIM && tt !== W.TOP) continue;
      return isAta(u, 'dik', null, x, y);
    }
    return false;
  }
  var HASARLI = function (o) { return o.tur === 'bina' && o.bitti && o.hp !== undefined && o.hp < 85; };
  var GUCSUZ = function (o) { return o.tur === 'bina' && o.bitti && !o.guclu && ['ev', 'siginak', 'ruzgar', 'gunes', 'yagmur', 'kuyu', 'gozcu'].indexOf(o.bina) >= 0; };
  function tTedavi(u) {
    var best = null, bd = 1e9;
    for (var i = 0; i < G.birim.length; i++) {
      var v = G.birim[i];
      if (v === u || v.olu || !v.hasta) continue;
      var dd = Math.abs(v.x - u.x) + Math.abs(v.y - u.y);
      if (dd < bd) { bd = dd; best = v; }
    }
    return best ? isAta(u, 'tedavi', null, Math.floor(best.x), Math.floor(best.y)) : false;
  }
  function tDers(u) {
    for (var t = 0; t < 20; t++) {
      var x = W.VX + Math.floor(G.rand() * 7) - 3, y = W.VY + 4 + Math.floor(G.rand() * 3);
      if (W.ic(x, y) && G.gec[W.idx(x, y)]) return isAta(u, 'ders', null, x, y);
    }
    return false;
  }
  function tKasif(u) {
    for (var t = 0; t < 80; t++) {
      var x = Math.floor(G.rand() * D.N), y = Math.floor(G.rand() * D.N), i = W.idx(x, y);
      if (G.kesif[i] || !G.gec[i]) continue;
      // açık bölgeye komşu mu?
      var ok = false;
      for (var dy = -4; dy <= 4 && !ok; dy++) for (var dx = -4; dx <= 4; dx++) {
        if (W.ic(x + dx, y + dy) && G.kesif[W.idx(x + dx, y + dy)] && G.gec[W.idx(x + dx, y + dy)]) { ok = true; break; }
      }
      if (ok) return isAta(u, 'kasif', null, x, y);
    }
    return false;
  }

  function fidanSay() { return W.say(function (o) { return o.tur === 'fidan' || o.tur === 'genc'; }); }

  function nufus() { var n = 0; for (var i = 0; i < G.birim.length; i++) if (!G.birim[i].olu) n++; return n; }

  function serbestSec(u) {
    var n = nufus(), k = G.kay;
    if (tSondur(u)) return true;
    if (k.su + k.kirli < n * 3 && tKiyi(u, 'su', W.dereKenari)) return true;
    if (k.yemek + k.konserve < n * 4) {
      if (dene(u, 'tarla', TARLA)) return true;
      if (dene(u, 'topla', BERRY)) return true;
      if (tKiyi(u, 'balik', W.kiyiMi)) return true;
    }
    if (dene(u, 'insa', SITE)) return true;
    // Stok hedefleri: gereksiz yere ağaç kesip doğayı bozma
    if (k.odun < 80 && dene(u, 'kes', AGAC)) return true;
    if (k.tas < 40 && dene(u, 'kaz', function (o) { return o.tur === 'kaya'; })) return true;
    if ((k.metal < 40 || k.plastik < 30) && dene(u, 'topla', TOPLA)) return true;
    if (dene(u, 'yagmala', RUIN, 60)) return true;
    if (fidanSay() < 40 && tDik(u)) return true;
    return false;
  }

  function otoIs(u) {
    var g = u.gorev, ok = false;
    switch (g) {
      case 'oduncu': ok = G.kay.odun < 150 && dene(u, 'kes', AGAC); break;
      case 'tasci': ok = G.kay.tas < 80 && dene(u, 'kaz', function (o) { return o.tur === 'kaya'; }); break;
      case 'toplayici': ok = dene(u, 'topla', TOPLA) || dene(u, 'yagmala', RUIN, 60); break;
      case 'ciftci': ok = dene(u, 'tarla', TARLA); break;
      case 'ormanci': ok = fidanSay() < 40 && tDik(u); break;
      case 'balikci': ok = tKiyi(u, 'balik', W.kiyiMi); break;
      case 'insaatci': ok = dene(u, 'insa', SITE); break;
      case 'sucu': ok = tKiyi(u, 'su', W.dereKenari); break;
      case 'kasif': ok = tKasif(u); break;
      case 'doktor': ok = tTedavi(u) || dene(u, 'topla', function (o) { return o.tur === 'sifali'; }, 60); break;
      case 'asci': ok = (G.kay.yemek >= 2 && G.kay.odun >= 1 && dene(u, 'pisir', function (o) { return o.tur === 'bina' && o.bina === 'ocak' && o.bitti; }, 60)) || dene(u, 'topla', BERRY); break;
      case 'ogretmen': ok = tDers(u); break;
      case 'muhendis': ok = dene(u, 'insa', SITE) || (G.kay.odun >= 1 && G.kay.tas >= 1 && dene(u, 'onarim', HASARLI, 60)) || (G.kay.tas >= 4 && G.kay.odun >= 2 && dene(u, 'guclen', GUCSUZ, 60)); break;
      default: ok = serbestSec(u);
    }
    if (!ok && g !== 'serbest') ok = dene(u, 'insa', SITE);
    return ok;
  }

  function yatakBul(u) {
    var best = null, bd = 1e9;
    for (var i = 1; i < G.nesneler.length; i++) {
      var o = G.nesneler[i];
      if (!o || o.tur !== 'bina' || !o.bitti || (o.bina !== 'ev' && o.bina !== 'siginak')) continue;
      if (G.yatakSay && (G.yatakSay[o.id] || 0) >= 4) continue;
      var d = Math.abs(o.x - u.x) + Math.abs(o.y - u.y);
      if (d < bd) { bd = d; best = o; }
    }
    return best;
  }

  function sigin(u, yatak) {
    var o = yatakBul(u);
    if (!o) { u.yatak = 0; u.yol = []; return; }
    var p = W.yol(u.x, u.y, W.yakin(o), 300);
    if (!p) { u.yatak = 0; return; }
    u.yol = p;
    if (yatak) { u.yatak = o.id; G.yatakSay[o.id] = (G.yatakSay[o.id] || 0) + 1; }
    u.sigO = o.id;
  }

  function calisSaati(h) {
    if (G.kural.mesai === 'serin') return (h >= 5 && h < 11) || (h >= 17 && h < 21.5);
    return h >= 6 && h < 21.5;
  }

  function guncelle(u, dt) {
    if (u.olu) return;
    var h = S.saat();
    var uykuVakti = h >= 22 || h < 5.5;
    // Uyku
    if (uykuVakti && !u.uyku) {
      isBirak(u); u.uyku = true; u.mod = 'uyku'; u.icerde = false; sigin(u, true);
    } else if (!uykuVakti && u.uyku) {
      u.uyku = false; u.mod = null; u.icerde = false; u.yatak = 0; u.sigO = 0;
    }
    if (u.uyku) {
      if (u.yol.length) adimAt(u, dt); else if (u.yatak) u.icerde = true;
      return;
    }
    // Serin mesai: öğle saatlerinde ev içi
    if (G.kural.mesai === 'serin' && h >= 11 && h < 17) {
      if (u.mod !== 'sigin') { isBirak(u); u.mod = 'sigin'; u.icerde = false; sigin(u, false); }
      if (u.yol.length) adimAt(u, dt); else if (u.sigO) u.icerde = true;
      return;
    } else if (u.mod === 'sigin') { u.mod = null; u.icerde = false; u.sigO = 0; }

    if (u.yas === 'cocuk' || (!calisSaati(h) && !u.is)) { gez(u, dt); return; }

    if (u.is) {
      var is = u.is, o = is.hedef ? G.nesneler[is.hedef] : null;
      if (is.hedef && !o) { isBirak(u); return; }
      if (is.asama === 'yuru') {
        adimAt(u, dt);
        if (!u.yol.length) {
          var yakinMi = o ? W.yakinMi(u, o) : ((is.tur === 'sondur' || is.tur === 'tedavi') ? (Math.abs(Math.floor(u.x) - is.tx) <= 1 && Math.abs(Math.floor(u.y) - is.ty) <= 1) : (Math.floor(u.x) === is.tx && Math.floor(u.y) === is.ty));
          if (yakinMi) is.asama = 'calis'; else { if (o) u.red[o.id] = G.dk + 720; isBirak(u); }
        }
      } else {
        is.kalan -= dt * hizCarpani(u, is.tur);
        if (is.tur === 'insa' && o) o.insa = 1 - Math.max(0, is.kalan) / D.BINA[o.bina].sure * (1 - 0); // yaklaşık ilerleme
        if (is.kalan <= 0) { bitir(u, is, o); }
      }
      return;
    }
    // Boştayız
    if (u.bekle > 0) { u.bekle -= dt; if (u.yol.length) adimAt(u, dt); return; }
    if (!otoIs(u)) { u.bekle = 60; gezHedef(u); }
  }

  function gezHedef(u) {
    for (var t = 0; t < 8; t++) {
      var x = Math.floor(u.x + (G.rand() - 0.5) * 8), y = Math.floor(u.y + (G.rand() - 0.5) * 8);
      if (!W.ic(x, y) || !G.gec[W.idx(x, y)]) continue;
      var p = W.yol(u.x, u.y, function (a, b) { return a === x && b === y; }, 30);
      if (p) { u.yol = p; return; }
    }
  }
  function gez(u, dt) {
    if (u.yol.length) { adimAt(u, dt); return; }
    u.bekle -= dt;
    if (u.bekle <= 0) { u.bekle = 40 + G.rand() * 80; gezHedef(u); }
  }

  function bitir(u, is, o) {
    var r = G.rand, k = G.kay, tur = is.tur;
    u.red = {};
    if (o && o.rez === u.id) delete o.rez;
    u.is = null; u.yol = [];
    switch (tur) {
      case 'kes':
        if (!o) break;
        k.odun += o.tur === 'yanik' ? 4 : 8; G.istat.kes++;
        if (o.tur !== 'yanik') S.dogaDegis(-0.5);
        var ox = o.x, oy = o.y; W.sil(o);
        if (r() < 0.35) W.ekle('fidan', ox, oy, {}); else W.ekle('kutuk', ox, oy, {});
        break;
      case 'topla': topla(u, o); break;
      case 'kaz':
        k.tas += 4; o.kalan = (o.kalan === undefined ? 4 : o.kalan) - 1;
        if (o.kalan <= 0) W.sil(o);
        break;
      case 'yagmala': yagmala(u, o); break;
      case 'sok':
        k.odun += 6; k.tas += 5; k.metal += 3;
        for (var yy = o.y; yy < o.y + o.h; yy++) for (var xx = o.x; xx < o.x + o.w; xx++) G.tile[W.idx(xx, yy)] = W.MOLOZ;
        W.sil(o); S.bildir('Yıkık yapı söküldü: +6 odun, +5 taş, +3 metal.', 'iyi');
        break;
      case 'insa':
        if (!o) break;
        o.bitti = true; o.insa = 1; o.hp = 100; if (o.bina === 'tarla') { o.ekin = null; o.su = 0.5; o.buyume = 0; }
        if (o.bina === 'gozcu') W.ac(o.x, o.y, 14);
        G.istat.yapi++;
        S.bildir(D.BINA[o.bina].ad + ' tamamlandı.', 'iyi');
        break;
      case 'tarla': tarla(u, o); break;
      case 'dik':
        var i = W.idx(is.tx, is.ty);
        if (!G.occ[i]) { W.ekle('fidan', is.tx, is.ty, { dogum: G.dk }); S.dogaDegis(0.5); G.istat.fidan++; if (!G.kartGor.dikim) S.kart('dikim'); }
        break;
      case 'balik':
        if (G.balik >= 20) { k.yemek += 2 + (u.meslek === 'balikci' ? 1 : 0); G.balik -= 1.5; G.istat.balik++; }
        else if (!u.uy || !u.uy.balik || G.dk - u.uy.balik > 1440) { u.uy = u.uy || {}; u.uy.balik = G.dk; S.bildir('Balık stoku çok düştü; deniz dinlenmeli.', 'uyari'); }
        break;
      case 'su': k.kirli = Math.min(k.kirli + 8, 60); break;
      case 'sondur':
        var c = 0;
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
          var j = W.ic(is.tx + dx, is.ty + dy) ? W.idx(is.tx + dx, is.ty + dy) : -1;
          if (j >= 0 && G.ates[j]) { delete G.ates[j]; c++; }
        }
        if (c && k.su >= 1) k.su -= 1;
        break;
      case 'kasif': W.ac(u.x, u.y, 9); G.istat.kesif++; break;
      case 'tedavi':
        for (var qi = 0; qi < G.birim.length; qi++) {
          var v = G.birim[qi];
          if (v === u || v.olu || !v.hasta || Math.abs(v.x - is.tx - 0.5) > 3 || Math.abs(v.y - is.ty - 0.5) > 3) continue;
          var sans = 0.6 + (u.meslek === 'saglikci' ? 0.25 : 0);
          if (k.ilac >= 1) { k.ilac -= 1; sans = Math.min(0.95, sans + 0.3); }
          if (r() < sans) { S.bildir(u.ad + ', ' + v.ad + ' adlı hastayı iyileştirdi.', 'iyi'); v.hasta = null; }
        }
        break;
      case 'pisir':
        if (k.yemek >= 2 && k.odun >= 1) { k.yemek -= 2; k.odun -= 1; k.yemek += 3 + (u.meslek === 'asci' ? 1 : 0); }
        break;
      case 'ders': S.ders(); break;
      case 'onarim':
        if (o && k.odun >= 1 && k.tas >= 1) { k.odun -= 1; k.tas -= 1; o.hp = 100; S.bildir(u.ad + ' yapıyı onardı.', 'iyi'); }
        break;
      case 'guclen':
        if (o && k.tas >= 4 && k.odun >= 2) { k.tas -= 4; k.odun -= 2; o.guclu = true; S.bildir(u.ad + ' bir yapıyı güçlendirdi (sel, yangın ve fırtınaya karşı).', 'iyi'); }
        break;
    }
  }

  function topla(u, o) {
    if (!o) return;
    var k = G.kay;
    switch (o.tur) {
      case 'hurda': k.metal += 2; k.plastik += 1; break;
      case 'cop': k.plastik += 2; S.dogaDegis(0.15); break;
      case 'araba': k.metal += 6; k.plastik += 2; break;
      case 'bogurtlen': k.yemek += 4; break;
      case 'sifali': k.ilac += 1; break;
      case 'cali': k.odun += 2; break;
      case 'kutuk': k.odun += 4; break;
      case 'kitap': S.kitapBul(); break;
    }
    W.sil(o);
  }

  function yagmala(u, o) {
    if (!o) return;
    var k = G.kay, r = G.rand, m = G.zor.kay, msg = '';
    o.yagma = true;
    function ver(a, n) { n = Math.round(n * m); k[a] += n; return n + ' ' + D.KAYNAK[a].ad.toLowerCase(); }
    var l = [];
    switch (o.tur) {
      case 'market': l.push(ver('konserve', 14), ver('su', 12), ver('plastik', 6), ver('tohum', 6)); break;
      case 'hastane': l.push(ver('ilac', 6)); k.metal += 3; break;
      case 'okul': l.push(ver('plastik', 3)); S.kitapBul('afet'); break;
      case 'kutuphane': S.kitapBul(); S.kitapBul(); break;
      default:
        l.push(ver('odun', 4), ver('metal', 2 + Math.floor(r() * 3)), ver('plastik', 2));
        if (r() < 0.5) l.push(ver('konserve', 2));
        if (r() < 0.12) S.kitapBul();
    }
    if (l.length) S.bildir(u.ad + ' yağmaladı: ' + l.join(', ') + '.', 'iyi');
  }

  function tarla(u, o) {
    if (!o) return;
    var k = G.kay;
    if (o.ekin && o.oldu) { o.ekin = null; o.oldu = false; o.buyume = 0; return; }
    if (o.ekin && o.buyume >= 1) {
      var e = D.EKIN[o.ekin], v = e.verim * (0.9 + G.rand() * 0.3);
      k.yemek += Math.round(v); k.tohum += 2; G.istat.hasat++;
      o.ekin = null; o.buyume = 0;
      S.bildir(u.ad + ' ' + Math.round(v) + ' birim ' + e.ad.toLowerCase() + ' hasat etti.', 'iyi');
    } else if (!o.ekin) {
      if (k.tohum >= 1) { k.tohum -= 1; o.ekin = G.ekim && D.EKIN[G.ekim] && (!D.EKIN[G.ekim].kitap || G.kitap[D.EKIN[G.ekim].kitap]) ? G.ekim : 'nohut'; o.buyume = 0; o.su = Math.max(o.su || 0, 0.5); o.oldu = false; }
    } else if (o.su < 0.6 && k.su >= 1) { k.su -= 1; o.su = 1; }
  }

  // Oyuncu emri
  function emir(u, tur, o, tx, ty) {
    if (u.olu) return false;
    u.mod = u.mod === 'sigin' ? null : u.mod;
    var ok = isAta(u, tur, o, tx, ty);
    if (ok) u.bekle = 0;
    return ok;
  }

  return { IS: IS, yeni: yeni, idAyarla: idAyarla, isBirak: isBirak, isAta: isAta, guncelle: guncelle, emir: emir, nufus: nufus, calisSaati: calisSaati };
})();
