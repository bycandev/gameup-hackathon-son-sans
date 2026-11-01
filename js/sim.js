var G = null;

var S = (function () {
  var N = D.N;
  var HASTALIK = {
    ishal:    { ad: 'İshal', kayip: 6, gun: 3 },
    solunum:  { ad: 'Solunum hastalığı', kayip: 4, gun: 4 },
    bulasici: { ad: 'Bulaşıcı hastalık', kayip: 8, gun: 4, bulasici: true }
  };

  function gun() { return Math.floor(G.dk / 1440); }
  function saat() { return (G.dk % 1440) / 60; }
  function mevsim() { return Math.floor((gun() % D.YIL_GUN) / D.MEVSIM_GUN); }
  function yil() { return D.YIL0 + Math.floor(gun() / D.YIL_GUN); }
  function yemekToplam() { return G.kay.yemek + G.kay.konserve; }
  function dogaDegis(v) { G.doga = U.clamp(G.doga + v, 0, 100); }

  function bildir(metin, tip) {
    G.bildirimler.unshift({ gun: gun(), saat: saat(), metin: metin, tip: tip || '' });
    if (G.bildirimler.length > 120) G.bildirimler.pop();
    if (typeof UI !== 'undefined' && UI.toast) UI.toast(metin, tip);
  }

  function kart(id) {
    if (G.kartGor[id]) return;
    G.kartGor[id] = 1;
    var c = D.KART[id];
    if (!c) return;
    G.bilgiler.push({ b: c.b, m: c.m, t: c.t, k: c.k, gun: gun() });
    UI.bilgiKarti(c.b, c.m, c.t, c.k);
  }

  function yatakSayisi() { return (W.sayBina('ev') + W.sayBina('siginak')) * 4; }

  function yeniOyun(opt) {
    var seed = opt.seed || (Math.floor(Math.random() * 1e9));
    var zor = D.ZORLUK[opt.zorluk || 'furtina'];
    G = {
      seed: seed, rand: U.rng(seed), zorKod: opt.zorluk || 'furtina', zor: zor, ad: opt.ad || 'Hayatta Kalan', cins: opt.cins || 'k',
      dk: 7 * 60, gunNo: 0, hiz: 1, duraklat: false, bitti: false,
      kay: { yemek: 0, konserve: 12, su: 30, kirli: 0, odun: 40, tas: 15, metal: 15, plastik: 10, tohum: 8, yakit: 20, ilac: 0 },
      birim: [], hayvan: [], secili: [], yatakSay: {},
      hava: { t: 16, yagmur: false, kar: false, ruzgar: 0.5, gunes: 1 },
      sapma: 0, yagmurBas: -1, yagmurSon: -1,
      afet: [], bekleyen: [],
      balik: 100, moral: 55, moralKalici: 0, doga: 30, kuresel: D.KURESEL0, ikiAsildi: false, sonOlum: 0, kedi: 0,
      kural: { mesai: 'normal', dizel: true, tayin: 'esit' }, ekim: 'nohut',
      kitap: {}, bilgiler: [], bildirimler: [], kartGor: {}, soruGor: {}, soruGun: -1, soruSaat: 12,
      enerji: { uret: 0, tuk: 0, depo: 0, kap: 0, yeterli: true, dizel: false },
      istat: { kes: 0, hasat: 0, fidan: 0, balik: 0, yapi: 0, kesif: 0, olumler: [], enNufus: 3, uretYen: 0, uretDizel: 0, kurtarilan: 0, kitap: 0 },
      egitim: { aktif: !!opt.egitim, adim: 0, kamera: 0 }, gelen: null
    };
    for (var k in G.kay) if (k !== 'su' && k !== 'ilac' && k !== 'kirli') G.kay[k] = Math.round(G.kay[k] * zor.kay);
    G.kay.su = Math.round(30 * zor.kay);
    W.uret(seed);
    G.agacBaz = Math.max(20, W.say(function (o) { return o.tur === 'agac' || o.tur === 'cam' || o.tur === 'genc' || o.tur === 'fidan'; }));
    // Bonus (izdiham)
    if (opt.bonus) for (var b in opt.bonus) { if (b === 'kitaplar') { for (var q = 0; q < opt.bonus.kitaplar.length; q++) G.kitap[opt.bonus.kitaplar[q]] = true; } else G.kay[b] = (G.kay[b] || 0) + opt.bonus[b]; }
    // Birimler
    var mes = ['muhendis', 'usta', 'ogretmen'];
    var hero = B.yeni(G.ad, G.cins, 'yetiskin', mes[Math.floor(G.rand() * 3)], 23.5, 34.5);
    hero.kahraman = true; hero.gorev = 'serbest';
    var m2 = ['ciftci', 'balikci', 'saglikci', 'avci', 'asci', 'coban'];
    var u2 = B.yeni('Ayşe', 'k', 'yetiskin', m2.splice(Math.floor(G.rand() * m2.length), 1)[0], 24.5, 34.5);
    var u3 = B.yeni('Murat', 'e', 'yetiskin', m2.splice(Math.floor(G.rand() * m2.length), 1)[0], 22.5, 34.5);
    G.birim.push(hero, u2, u3);
    G.oyuncuId = hero.id;
    hayvanUret();
    G.havaHazir = false;
    gunluk(true);
    saatlik(true);
    return G;
  }

  function hayvanUret() {
    var tur = [['hayvan_tavsan', 8], ['hayvan_kus', 6], ['hayvan_marti', 4], ['hayvan_karaca', 3], ['hayvan_kedi', 3]];
    for (var i = 0; i < tur.length; i++) {
      var n = 0, tries = 0;
      while (n < tur[i][1] && tries++ < 400) {
        var x = Math.floor(G.rand() * N), y = Math.floor(G.rand() * N), id = W.idx(x, y);
        var t = G.tile[id], ok = G.gec[id] && !G.occ[id];
        if (tur[i][0] === 'hayvan_marti') ok = ok && W.kiyiMi(x, y);
        else if (tur[i][0] === 'hayvan_karaca') ok = ok && t === W.ORMAN;
        else if (tur[i][0] === 'hayvan_kedi') ok = ok && x > 30 && y > 36;
        else ok = ok && (t === W.CIM || t === W.ORMAN);
        if (ok) { G.hayvan.push({ s: tur[i][0], x: x + 0.5, y: y + 0.5, tx: x + 0.5, ty: y + 0.5, yon: 1 }); n++; }
      }
    }
  }

  function hayvanAdim(dt) {
    for (var i = 0; i < G.hayvan.length; i++) {
      var a = G.hayvan[i], dx = a.tx - a.x, dy = a.ty - a.y, d = Math.sqrt(dx * dx + dy * dy);
      if (d < 0.1) {
        if (G.rand() < 0.15 * dt / 5) {
          var nx = Math.floor(a.x + (G.rand() - 0.5) * 6), ny = Math.floor(a.y + (G.rand() - 0.5) * 6);
          if (W.ic(nx, ny) && G.gec[W.idx(nx, ny)] && !G.occ[W.idx(nx, ny)]) { a.tx = nx + 0.5; a.ty = ny + 0.5; }
        }
      } else {
        var sp = Math.min(d, 0.06 * dt);
        a.x += dx / d * sp; a.y += dy / d * sp; if (dx > 0.01) a.yon = 1; else if (dx < -0.01) a.yon = -1;
      }
      if (a.s === 'hayvan_kedi' && !a.katildi && U.dist(a.x, a.y, W.VX, W.VY) < 6) {
        a.katildi = true; G.kedi++; bildir('Bir sokak kedisi köye katıldı. Moral yükseldi.', 'iyi');
      }
    }
  }

  // ---------- Hava ----------
  function afetVar(id) { for (var i = 0; i < G.afet.length; i++) if (G.afet[i].id === id) return true; return false; }

  function havaHesapla() {
    var h = saat(), ms = mevsim(), gs = gun() % D.MEVSIM_GUN;
    var base = D.TABAN[ms], next = D.TABAN[(ms + 1) % 4];
    if (gs >= 4) base += (next - base) * ((gs - 4) / 6);
    var t = base + G.sapma + 5.5 * Math.sin(2 * Math.PI * (h - 9) / 24) + (G.kuresel - D.KURESEL0) * 4;
    if (G.ikiAsildi && ms === 1) t += 2;
    if (afetVar('isi')) t += 11;
    if (afetVar('kar')) t -= 13;
    var yag = h >= G.yagmurBas && h < G.yagmurSon;
    if (afetVar('sel')) yag = true;
    if (afetVar('kuraklik')) yag = false;
    var H = G.hava;
    H.t = t; H.yagmur = yag; H.kar = yag && t < 2 || afetVar('kar');
    H.gunes = Math.max(0, Math.sin(Math.PI * (h - 6) / 12)) * (yag ? 0.25 : 1);
    G.havaHazir = true;
  }

  // ---------- Sıcaklık etkisi ----------
  function golgede(u) {
    var x = Math.floor(u.x), y = Math.floor(u.y);
    for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) {
      if (!W.ic(x + dx, y + dy)) continue;
      var o = G.nesneler[G.occ[W.idx(x + dx, y + dy)]];
      if (o && (o.tur === 'agac' || o.tur === 'cam' || o.tur === 'genc')) return true;
    }
    for (var i = 0; i < G.etki.length; i++) { var e = G.etki[i]; if (e.t === 'golge' && U.dist(u.x, u.y, e.x, e.y) <= 3) return true; }
    return false;
  }
  function etkinSicaklik(u) {
    var t = G.hava.t;
    if (t > 26 && golgede(u)) t -= 5;
    for (var i = 0; i < G.etki.length; i++) {
      var e = G.etki[i];
      if (U.dist(u.x, u.y, e.x, e.y) > 3.2) continue;
      if (e.t === 'soba' && t < 12) t += 10;
      if (e.t === 'serin' && t > 24) t -= 8;
    }
    if (u.icerde) t = 20 + (t - 20) * 0.42;
    return t;
  }

  function hastalan(u, tur) {
    if (u.hasta || u.olu) return;
    var h = HASTALIK[tur];
    u.hasta = { tur: tur, ad: h.ad, kalan: h.gun, kayip: h.kayip, bulasici: !!h.bulasici };
    bildir(u.ad + ' hastalandı: ' + h.ad + '.', 'uyari');
  }

  function olum(u, neden) {
    u.olu = true; B.isBirak(u); u.secili = false;
    G.secili = G.secili.filter(function (x) { return x !== u.id; });
    G.istat.olumler.push({ ad: u.ad, gun: gun(), neden: neden });
    G.sonOlum += 1;
    bildir(u.ad + ' hayatını kaybetti (' + neden + ').', 'kotu');
    if (u.kahraman) UI.bilgiKarti('Anısına: ' + u.ad, 'Köyün ilk insanı, sığınaktan çıkan kişi artık aramızda değil. Köy onun açtığı yoldan devam ediyor.', '', '');
    if (B.nufus() === 0) { G.bitti = true; setTimeout(function () { Hikaye.oyunSonu(); }, 600); }
  }

  function uyar(u, tip, metin) {
    u.uy = u.uy || {};
    if (!u.uy[tip] || G.dk - u.uy[tip] > 360) { u.uy[tip] = G.dk; bildir(u.ad + ': ' + metin, 'uyari'); }
  }

  function yemekYe(u) {
    var k = G.kay, esik = G.kural.tayin === 'kisitli' ? 30 : 45;
    if (u.ac >= esik) return;
    var kazan = 35 * (W.sayBina('ocak') ? 1.25 : 1) * (G.kural.tayin === 'kisitli' ? 0.8 : 1);
    if (k.yemek >= 1) { k.yemek -= 1; u.ac = Math.min(100, u.ac + kazan); }
    else if (k.konserve >= 1) { k.konserve -= 1; u.ac = Math.min(100, u.ac + kazan); }
  }
  function suIc(u) {
    var k = G.kay;
    if (k.su >= 1) { k.su -= 1; u.su = Math.min(100, u.su + 40); }
    else if (k.kirli >= 1) {
      k.kirli -= 1; u.su = Math.min(100, u.su + 40);
      if (G.rand() < 0.15 * G.zor.hastalik) { hastalan(u, 'ishal'); if (!G.kartGor.kirlisu) kart('kirlisu'); }
    }
  }

  function ihtiyac(u, dt) {
    if (u.olu) return;
    var z = G.zor.ihtiyac, f = u.uyku ? 0.6 : 1, c = u.yas === 'cocuk' ? 0.7 : 1;
    var calis = (u.is && u.is.asama === 'calis') ? 1.2 : 1;
    u.ac = Math.max(0, u.ac - 0.024 * dt * z * f * c * calis);
    u.su = Math.max(0, u.su - 0.04 * dt * z * f * c * (1 + Math.max(0, G.hava.t - 27) * 0.06));
    yemekYe(u);
    if (u.su < 50) suIc(u);
    var te = etkinSicaklik(u);
    var hedef = U.clamp(50 + (te - 20) * 2, 0, 100);
    u.isi += (hedef - u.isi) * (1 - Math.exp(-dt / 120));
    // hava kalitesi
    var ht = 100;
    for (var kk in G.ates) { var i = +kk; if (U.dist(u.x, u.y, i % N, (i / N) | 0) < 9) { ht = 40; break; } }
    if (G.enerji.dizel && U.dist(u.x, u.y, 23.5, 33.5) < 6) ht = Math.min(ht, 70);
    u.hava += (ht - u.hava) * (1 - Math.exp(-dt / 60));
    if (u.hava < 55 && !u.hasta && G.rand() < 0.002 * dt * G.zor.hastalik) hastalan(u, 'solunum');

    var kayip = 0, neden = '';
    if (u.ac <= 0) { kayip += 0.045; neden = 'açlıktan'; uyar(u, 'ac', 'Açlıktan bitkin düştü!'); }
    else if (u.ac < 15) uyar(u, 'ac2', 'Çok aç.');
    if (u.su <= 0) { kayip += 0.09; neden = 'susuzluktan'; uyar(u, 'su', 'Susuzluktan bitkin düştü!'); }
    else if (u.su < 15) uyar(u, 'su2', 'Çok susadı.');
    if (u.isi > 85) { kayip += 0.025 * (1 + (u.isi - 85) / 15); neden = 'sıcak çarpmasından'; uyar(u, 'sicak', 'Sıcak çarpması riski! Gölgeye ve suya ihtiyaç var.'); }
    if (u.isi < 10) { kayip += 0.02 * (1 + (10 - u.isi) / 10); neden = 'soğuktan donarak'; uyar(u, 'soguk', 'Donuyor! Soba ve ev lazım.'); }
    if (u.hava < 30) { kayip += 0.015; neden = neden || 'dumandan'; }
    var ix = W.idx(Math.floor(u.x), Math.floor(u.y));
    if (G.ates[ix]) { kayip += 0.1; neden = 'yangında'; }
    if (u.hasta) { kayip += u.hasta.kayip / 1440; neden = neden || 'hastalıktan'; }
    if (kayip > 0) u.sag -= kayip * dt;
    else if (u.sag < 100) u.sag = Math.min(100, u.sag + (u.uyku ? 0.02 : 0.01) * dt);
    if (u.sag <= 0) olum(u, neden || 'bilinmeyen sebep');
  }

  // ---------- Saatlik ----------
  function etkiHesapla() {
    G.etki = [];
    for (var i = 1; i < G.nesneler.length; i++) {
      var o = G.nesneler[i];
      if (!o || o.tur !== 'bina' || !o.bitti) continue;
      if (o.bina === 'golgelik') G.etki.push({ t: 'golge', x: o.x + 0.5, y: o.y + 0.5 });
      else if (o.bina === 'soba' && G.kay.odun >= 1) G.etki.push({ t: 'soba', x: o.x + 0.5, y: o.y + 0.5 });
      else if (o.bina === 'serinletici' && G.enerji.yeterli) G.etki.push({ t: 'serin', x: o.x + 0.5, y: o.y + 0.5 });
    }
  }

  function enerjiHesapla() {
    var E = G.enerji, k = G.kay;
    var rg = W.sayBina('ruzgar'), gp = W.sayBina('gunes'), bt = W.sayBina('batarya');
    var sr = W.sayBina('serinletici'), ar = W.sayBina('aritma');
    var yen = rg * 3 * G.hava.ruzgar + gp * 2.5 * G.hava.gunes;
    var tuk = (G.hava.t > 28 ? sr * 0.5 : 0) + ar * 1;
    E.kap = bt * 12;
    var net = yen - tuk, kisa = 0, diz = 0;
    if (net >= 0) E.depo = Math.min(E.kap, E.depo + net);
    else {
      var gerek = -net, al = Math.min(E.depo, gerek);
      E.depo -= al; kisa = gerek - al;
      if (kisa > 0 && G.kural.dizel && k.yakit >= 1 && W.say(function (o) { return o.tur === 'bina' && o.bina === 'dizel'; })) {
        k.yakit -= 1; diz = Math.min(3, kisa); kisa -= diz; E.dizel = true; if (!G.kartGor.dizel) kart('dizel');
      } else E.dizel = false;
    }
    if (net >= 0) E.dizel = false;
    E.yeterli = kisa <= 0.01;
    E.uret = yen + diz; E.tuk = tuk;
    G.istat.uretYen += Math.min(yen, tuk + 0.0001) * (tuk > 0 ? 1 : 0) + (tuk > 0 ? 0 : yen * 0.5);
    G.istat.uretDizel += diz;
  }

  function suHesapla() {
    var k = G.kay, yd = W.sayBina('yagmur'), ku = W.sayBina('kuyu'), fl = W.sayBina('filtre'), ar = W.sayBina('aritma');
    var cap = 40 + 30 * yd + 20 * ku;
    if (G.hava.yagmur && yd) k.su += 3 * yd;
    if (ku) k.su += ku * (afetVar('kuraklik') ? 0.5 : 1);
    var x = Math.min(k.kirli, 2 * fl); k.kirli -= x; k.su += x;
    if (ar && G.enerji.yeterli) { x = Math.min(k.kirli, 8 * ar); k.kirli -= x; k.su += x; }
    k.su = Math.min(k.su, cap);
  }

  function tarlaHesapla() {
    var ms = mevsim(), t = G.hava.t;
    for (var i = 1; i < G.nesneler.length; i++) {
      var o = G.nesneler[i];
      if (!o || o.tur !== 'bina' || o.bina !== 'tarla' || !o.bitti) continue;
      if (o.su === undefined) o.su = 0.5;
      if (!o.ekin || o.oldu) continue;
      var e = D.EKIN[o.ekin];
      if (G.hava.yagmur) o.su = Math.min(1, o.su + 0.25);
      var kuru = afetVar('kuraklik') ? 2 : 1, sicak = t > 33 ? 1.3 : 1;
      o.su = Math.max(0, o.su - e.su / 24 * 0.35 * kuru * sicak);
      if (o.su <= 0) { o.kuru = (o.kuru || 0) + 1; if (o.kuru > 36) { o.oldu = true; bildir('Bir tarladaki ekin susuzluktan kurudu.', 'kotu'); } } else o.kuru = 0;
      if (ms === 3 && e.kis === 0 && t < 0) { o.oldu = true; bildir('Domates ekini dondan kurudu.', 'kotu'); }
      if (o.buyume >= 1) continue;
      var kis = ms === 3 ? e.kis : 1, tf = (t > 38 || t < 5) ? 0.5 : 1, komp = 1;
      for (var j = 0; j < G.etki.length; j++) { /* kompost basit kontrol */ }
      if (W.say(function (q) { return q.tur === 'bina' && q.bina === 'kompost' && q.bitti && Math.abs(q.x - o.x) < 6 && Math.abs(q.y - o.y) < 6; })) komp = 1.3;
      var g = 1 / (e.gun * 24) * kis * tf * komp * (o.su > 0 ? 1 : 0) * (1 + (G.doga - 30) / 200);
      o.buyume = Math.min(1, o.buyume + g);
    }
  }

  function atesHesapla() {
    var keys = Object.keys(G.ates);
    if (!keys.length) return;
    var kur = afetVar('kuraklik') ? 1.6 : 1;
    for (var n = 0; n < keys.length; n++) {
      var i = +keys[n];
      if (G.ates[i] === undefined) continue;
      var x = i % N, y = (i / N) | 0;
      if (G.hava.yagmur && G.rand() < 0.4) { delete G.ates[i]; continue; }
      var o = G.nesneler[G.occ[i]];
      if (o) {
        if (o.tur === 'agac' || o.tur === 'cam' || o.tur === 'genc') { var ox = o.x, oy = o.y; W.sil(o); W.ekle('yanik', ox, oy, {}); dogaDegis(-0.3); }
        else if (o.tur === 'fidan' || o.tur === 'cali' || o.tur === 'kutuk' || o.tur === 'bogurtlen' || o.tur === 'sifali') W.sil(o);
        else if (o.tur === 'bina') {
          o.hp = (o.hp === undefined ? 100 : o.hp) - (o.guclu ? 15 : 35);
          if (o.hp <= 0) { bildir(D.BINA[o.bina] ? D.BINA[o.bina].ad + ' yangında yıkıldı!' : 'Bir yapı yangında yıkıldı!', 'kotu'); W.sil(o); }
        }
      }
      var ch = 0.22 * (G.hava.ruzgar + 0.4) * kur * (G.hava.yagmur ? 0.2 : 1);
      if (G.rand() < ch) {
        var d = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1]][Math.floor(G.rand() * 6)];
        var nx = x + d[0], ny = y + d[1];
        if (W.ic(nx, ny) && !G.ates[W.idx(nx, ny)] && G.gec[W.idx(nx, ny)] !== undefined && G.tile[W.idx(nx, ny)] !== W.DENIZ) {
          var no = G.nesneler[G.occ[W.idx(nx, ny)]];
          if (no && (no.tur === 'agac' || no.tur === 'cam' || no.tur === 'genc' || no.tur === 'cali' || no.tur === 'kutuk' || no.tur === 'fidan' || no.tur === 'bina' || no.tur === 'bogurtlen')) G.ates[W.idx(nx, ny)] = 7;
        }
      }
      G.ates[i] -= 1;
      if (G.ates[i] <= 0) delete G.ates[i];
    }
  }

  function selHesapla() {
    if (!afetVar('sel')) return;
    for (var i = 1; i < G.nesneler.length; i++) {
      var o = G.nesneler[i];
      if (!o || o.tur !== 'bina') continue;
      if (!G.selAlan[W.idx(o.x, o.y)]) continue;
      if (o.guclu) continue;
      o.hp = (o.hp === undefined ? 100 : o.hp) - 4;
      if (o.hp <= 0) { bildir((D.BINA[o.bina] ? D.BINA[o.bina].ad : 'Bir yapı') + ' selde yıkıldı!', 'kotu'); W.sil(o); }
    }
  }

  function afetBasla(id) {
    var a = D.AFET[id], sure = a.sure[0] + Math.floor(G.rand() * (a.sure[1] - a.sure[0] + 1));
    var e = { id: id, bit: G.dk + sure * 1440, bas: G.dk };
    if (id === 'yangin') e.bit = 1e12;
    G.afet.push(e);
    bildir(a.ad + ' başladı!', 'kotu');
    if (id === 'yangin') {
      var best = null, tries = 0;
      while (tries++ < 400) {
        var o = G.nesneler[1 + Math.floor(G.rand() * (G.nesneler.length - 1))];
        if (!o || (o.tur !== 'agac' && o.tur !== 'cam')) continue;
        var d = U.dist(o.x, o.y, W.VX, W.VY);
        if (d > 9 && d < 26) { best = o; break; }
      }
      if (best) { G.ates[W.idx(best.x, best.y)] = 8; W.ac(best.x, best.y, 4); }
      else { G.afet.pop(); return; }
    }
    if (id === 'sel') {
      for (var i = 1; i < G.nesneler.length; i++) {
        var q = G.nesneler[i];
        if (q && q.tur === 'bina' && q.bina === 'tarla' && G.selAlan[W.idx(q.x, q.y)] && q.ekin && !q.guclu && G.rand() < 0.5) { q.ekin = null; q.buyume = 0; }
      }
    }
    kart(id);
  }

  function afetBitir() {
    for (var i = G.afet.length - 1; i >= 0; i--) {
      var a = G.afet[i];
      if (a.id === 'yangin') { if (!Object.keys(G.ates).length) a.bit = 0; }
      if (G.dk >= a.bit) { G.afet.splice(i, 1); bildir(D.AFET[a.id].ad + ' sona erdi.', 'iyi'); }
    }
  }

  function afetPlanla() {
    var g = gun(), ms = mevsim();
    // bekleyenler
    for (var i = G.bekleyen.length - 1; i >= 0; i--) {
      if (G.bekleyen[i].gun <= g) { var id = G.bekleyen[i].id; G.bekleyen.splice(i, 1); afetBasla(id); }
    }
    if (g < 1 || G.afet.length >= 3) return;
    var kc = 1 + Math.max(0, (G.kuresel - D.KURESEL0) / 0.1) * 0.16;
    if (G.ikiAsildi) kc *= 1.3;
    for (var id2 in D.AFET) {
      var a = D.AFET[id2];
      if (a.ms.indexOf(ms) < 0 || afetVar(id2)) continue;
      var bekliyor = false;
      for (var j = 0; j < G.bekleyen.length; j++) if (G.bekleyen[j].id === id2) bekliyor = true;
      if (bekliyor) continue;
      if (G.rand() < a.p * G.zor.afet * D.AFET_HIZ * Math.min(kc, 2.5)) {
        var uy = a.uyari - (G.kitap.afet && a.uyari > 0 ? 0 : 0);
        if (G.kitap.afet && uy > 0) uy += 1;
        if (uy > 0 && G.rand() >= G.zor.habersiz) {
          G.bekleyen.push({ id: id2, gun: g + uy });
          bildir('UYARI: ' + a.ad + ' ' + uy + ' gün içinde bekleniyor. Hazırlan!', 'uyari');
        } else afetBasla(id2);
        if (G.afet.length + G.bekleyen.length >= 3) break;
      }
    }
  }

  function saatlik(ilk) {
    havaHesapla();
    etkiHesapla();
    enerjiHesapla();
    suHesapla();
    tarlaHesapla();
    atesHesapla();
    selHesapla();
    // soba odun harcar
    for (var i = 0; i < G.etki.length; i++) if (G.etki[i].t === 'soba' && G.hava.t < 12 && G.rand() < 0.25) G.kay.odun = Math.max(0, G.kay.odun - 1);
    // soru saati
    if (!ilk && G.soruGun === gun() && Math.floor(saat()) === G.soruSaat) { G.soruGun = -1; soruSor(); }
    afetBitir();
  }

  // ---------- Günlük ----------
  function hastaGunluk() {
    for (var i = 0; i < G.birim.length; i++) {
      var u = G.birim[i];
      if (u.olu || !u.hasta) continue;
      u.hasta.kalan -= 1;
      if (G.kay.ilac >= 1 && G.rand() < (u.meslek === 'saglikci' ? 0.9 : 0.75)) { G.kay.ilac -= 1; u.hasta = null; bildir(u.ad + ' ilaçla iyileşti.', 'iyi'); continue; }
      if (u.hasta.bulasici && !u.karantina) {
        for (var j = 0; j < G.birim.length; j++) {
          var v = G.birim[j];
          if (v !== u && !v.olu && !v.hasta && !v.karantina && U.dist(u.x, u.y, v.x, v.y) < 6 && G.rand() < 0.3 * G.zor.hastalik) hastalan(v, 'bulasici');
        }
      }
      if (u.hasta.kalan <= 0) { u.hasta = null; bildir(u.ad + ' iyileşti.', 'iyi'); }
    }
  }

  function moralGunluk() {
    var n = B.nufus(), k = G.kay;
    var h = 50 + (yemekToplam() > n * 3 ? 8 : -12) + (k.su + k.kirli > n * 3 ? 4 : -8) + (yatakSayisi() >= n ? 6 : -8)
      + G.kedi * 3 + (G.doga - 30) * 0.2 - G.sonOlum * 4 + (G.kural.tayin === 'kisitli' ? -8 : 0) + G.moralKalici;
    h = U.clamp(h, 0, 100);
    G.moral += (h - G.moral) * 0.15;
    G.sonOlum = Math.max(0, G.sonOlum - 0.25);
    if (G.moral < 15 && n > 1 && G.rand() < 0.5) {
      var adaylar = G.birim.filter(function (x) { return !x.olu && !x.kahraman; });
      if (adaylar.length) {
        var u = U.pick(adaylar, G.rand); u.olu = true; u.gitti = true; B.isBirak(u);
        bildir(u.ad + ' moralsizlikten köyü terk etti.', 'kotu');
      }
    }
  }

  function dogaGunluk() {
    var s = W.say(function (o) { return o.tur === 'agac' || o.tur === 'cam' || o.tur === 'genc' || o.tur === 'fidan'; });
    dogaDegis((s - G.agacBaz) / G.agacBaz * 0.5);
    // Çöp yığınları doğayı zehirler; her gün kıyıya yeni çöp vurur
    G.copSay = W.say(function (o) { return o.tur === 'cop'; });
    dogaDegis(-G.copSay / 700);
    for (var c = 0, tr = 0; c < 4 && tr < 60; tr++) {
      var cx = Math.floor(G.rand() * N), cy = Math.floor(G.rand() * N), ci = W.idx(cx, cy);
      if (G.tile[ci] === W.KUM && G.gec[ci] && !G.occ[ci]) { W.ekle('cop', cx, cy, {}); c++; }
    }
    if (!G.kartGor.cop && G.copSay > 120) kart('cop');
    // fidanlar büyür
    for (var i = 1; i < G.nesneler.length; i++) {
      var o = G.nesneler[i];
      if (o && o.tur === 'fidan' && o.dogum !== undefined && G.dk - o.dogum > 1440 * 6) { var x = o.x, y = o.y; W.sil(o); W.ekle('genc', x, y, { dogum: G.dk }); }
      else if (o && o.tur === 'genc' && o.dogum !== undefined && G.dk - o.dogum > 1440 * 10) { var x2 = o.x, y2 = o.y; W.sil(o); W.ekle('agac', x2, y2, {}); }
    }
  }

  function kuresel() {
    var d = D.KURESEL_YIL / D.YIL_GUN;
    var top = G.istat.uretYen + G.istat.uretDizel;
    if (top > 0 && G.istat.uretYen / top > 0.9 && G.doga >= 60) d -= 0.004 / D.YIL_GUN;
    G.kuresel += Math.max(0, d);
    if (G.kuresel >= 2 && !G.ikiAsildi) {
      G.ikiAsildi = true; G.moralKalici = -8;
      bildir('Küresel sıcaklık 2°C eşiğini aştı!', 'kotu');
      kart('ikiderece');
    }
  }

  function gelenUret() {
    if (G.gelen || gun() < 2 || G.rand() > 0.12 || G.moral < 35 || B.nufus() >= yatakSayisi()) return;
    var n = 1 + Math.floor(G.rand() * 2), grup = [];
    var meslekler = Object.keys(D.MESLEK);
    for (var i = 0; i < n; i++) {
      var c = G.rand() < 0.5 ? 'k' : 'e', r = G.rand(), yas = r < 0.2 ? 'cocuk' : (r < 0.35 ? 'yasli' : 'yetiskin');
      var ad = yas === 'cocuk' ? U.pick(D.AD_C, G.rand) : U.pick(c === 'k' ? D.AD_K : D.AD_E, G.rand);
      var m = yas === 'cocuk' ? 'ogrenci' : (yas === 'yasli' ? 'emekli' : U.pick(meslekler.filter(function (q) { return q !== 'emekli' && q !== 'ogrenci'; }), G.rand));
      grup.push({ ad: ad, cins: c, yas: yas, meslek: m, hasta: G.rand() < 0.2 * G.zor.hastalik });
    }
    G.gelen = { yer: U.pick(D.YER, G.rand), kisiler: grup };
    UI.yeniGelenGoster(G.gelen);
  }

  function gelenKarar(k) {
    var g = G.gelen; G.gelen = null;
    if (!g) return;
    var cokvar = g.kisiler.some(function (q) { return q.yas !== 'yetiskin'; });
    if (k === 'ret') { G.moral += cokvar ? -8 : -3; bildir('Gelenler geri çevrildi. Moral düştü.', 'uyari'); return; }
    for (var i = 0; i < g.kisiler.length; i++) {
      var q = g.kisiler[i], u = B.yeni(q.ad, q.cins, q.yas, q.meslek, 21.5 + i, 36.5);
      if (q.hasta) { if (k === 'karantina') u.karantina = true; hastalan(u, 'bulasici'); }
      if (k === 'karantina' && !q.hasta) u.karantina = true;
      G.birim.push(u); G.istat.kurtarilan++;
    }
    G.moral += cokvar ? 4 : 2;
    G.istat.enNufus = Math.max(G.istat.enNufus, B.nufus());
    bildir(g.kisiler.length + ' kişi köye katıldı' + (k === 'karantina' ? ' (karantinalı)' : '') + '.', 'iyi');
    if (k === 'karantina') setTimeout(function () { for (var j = 0; j < G.birim.length; j++) G.birim[j].karantina = false; }, 0);
  }

  // ---------- Sorular ----------
  function soruSor() {
    if (!G.birim.some(function (u) { return !u.olu; })) return;
    var ms = mevsim(), havuz = [];
    for (var i = 0; i < QUESTIONS.length; i++) {
      var q = QUESTIONS[i];
      if (q.ms && q.ms.indexOf(ms) < 0) continue;
      if (q.kosul && !q.kosul()) continue;
      havuz.push(q);
    }
    var yeni = havuz.filter(function (q) { return !G.soruGor[q.id]; });
    if (!yeni.length) { G.soruGor = {}; yeni = havuz; }
    if (!yeni.length) return;
    var q2 = U.pick(yeni, G.rand);
    G.soruGor[q2.id] = 1;
    var yet = G.birim.filter(function (u) { return !u.olu && u.yas !== 'cocuk'; });
    var kisi = U.pick(yet.length ? yet : G.birim.filter(function (u) { return !u.olu; }), G.rand);
    UI.soruGoster(q2, kisi);
  }

  function etkiUygula(e) {
    for (var k in e) {
      var v = e[k];
      if (D.KAYNAK[k]) G.kay[k] = Math.max(0, G.kay[k] + v);
      else if (k === 'moral') G.moral = U.clamp(G.moral + v, 0, 100);
      else if (k === 'doga') dogaDegis(v);
      else if (k === 'kuresel') G.kuresel += v;
      else if (k === 'hasta') { var adaylar = G.birim.filter(function (u) { return !u.olu && !u.hasta; }); for (var i = 0; i < v && adaylar.length; i++) hastalan(adaylar.splice(Math.floor(G.rand() * adaylar.length), 1)[0], 'ishal'); }
    }
  }

  function soruCevap(q, i) {
    var s = q.sec[i], e = s.e, m = s.s;
    if (s.p !== undefined && G.rand() >= s.p) { e = s.e2 || {}; m = s.s2 || m; }
    etkiUygula(e || {});
    G.bilgiler.push({ b: q.baslik || 'Köylü sorusu', m: q.bilgi, t: '', k: q.k, gun: gun() });
    return { sonuc: m, e: e };
  }

  function kitapBul(kod) {
    var kalan = Object.keys(D.KITAP).filter(function (x) { return !G.kitap[x]; });
    if (!kalan.length) return;
    if (!kod || G.kitap[kod]) kod = U.pick(kalan, G.rand);
    G.kitap[kod] = true; G.istat.kitap++;
    UI.bilgiKarti('Yeni kitap: ' + D.KITAP[kod].ad, D.KITAP[kod].ac, '', 'Eski kitap, harabeden çıktı');
    G.bilgiler.push({ b: D.KITAP[kod].ad, m: D.KITAP[kod].ac, t: '', k: 'Bulunan kitap', gun: gun() });
  }

  function gunluk(ilk) {
    G.gunNo = gun();
    G.sapma = (G.rand() - 0.5) * 6;
    G.hava.ruzgar = 0.15 + G.rand() * 0.85;
    var ms = mevsim();
    var yagmurlu = G.rand() < D.YAGMUR[ms] * (afetVar('sel') ? 3 : 1) && !afetVar('kuraklik');
    G.yagmurBas = yagmurlu ? 6 + Math.floor(G.rand() * 12) : -1;
    G.yagmurSon = yagmurlu ? G.yagmurBas + 2 + Math.floor(G.rand() * 5) : -1;
    if (ilk) return;
    afetPlanla();
    kuresel();
    hastaGunluk();
    moralGunluk();
    dogaGunluk();
    gelenUret();
    G.balik = Math.min(100, G.balik + 3 + G.doga / 40);
    G.istat.enNufus = Math.max(G.istat.enNufus, B.nufus());
    if (gun() >= 2 && G.rand() < 0.75) { G.soruGun = gun(); G.soruSaat = 9 + Math.floor(G.rand() * 9); }
    if (typeof Kayit !== 'undefined') Kayit.kaydet('oto');
  }

  function adim(dt) {
    var kalan = dt;
    while (kalan > 0 && !G.bitti) {
      if (UI.modalAcik()) break;
      var d = Math.min(5, kalan); kalan -= d;
      var h0 = Math.floor(G.dk / 60), g0 = gun();
      G.dk += d;
      G.yatakSay = {};
      for (var i = 0; i < G.birim.length; i++) if (!G.birim[i].olu && G.birim[i].yatak) G.yatakSay[G.birim[i].yatak] = (G.yatakSay[G.birim[i].yatak] || 0) + 1;
      for (var j = 0; j < G.birim.length; j++) { B.guncelle(G.birim[j], d); ihtiyac(G.birim[j], d); }
      hayvanAdim(d);
      if (Math.floor(G.dk / 60) > h0) saatlik();
      if (gun() > g0) gunluk();
    }
  }

  return {
    gun: gun, saat: saat, mevsim: mevsim, yil: yil, adim: adim, yeniOyun: yeniOyun, bildir: bildir, kart: kart, dogaDegis: dogaDegis,
    yemekToplam: yemekToplam, yatakSayisi: yatakSayisi, kitapBul: kitapBul, ders: function () { G.moral = Math.min(100, G.moral + 0.4); dogaDegis(0.1); G.istat.ders = (G.istat.ders || 0) + 1; }, gelenKarar: gelenKarar, soruCevap: soruCevap, afetVar: afetVar,
    hastalan: hastalan, saatlik: saatlik, etkiHesapla: etkiHesapla, HASTALIK: HASTALIK
  };
})();
