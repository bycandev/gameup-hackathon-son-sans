var UI = (function () {
  var $ = function (id) { return document.getElementById(id); };
  var kuyruk = [], modalOnayi = null, acikModal = false;
  var panel = null, sekme = 'Barınma', yapimKod = null;
  var sur = { sx: 0, sy: 0, aktif: false, hareket: false, btn: 0 };
  var tus = {};
  var egitimOk = false;

  function ikon(ad, em) {
    return '<img class="ik" src="karakterler/' + ad + '.png" alt="" onerror="this.outerHTML=\'<span>' + (em || '') + '</span>\'">';
  }
  function resim(ad, w) { return '<img src="karakterler/' + ad + '.png" width="' + (w || 48) + '" height="' + (w || 48) + '" alt="" onerror="this.style.visibility=\'hidden\'">'; }

  // ---------- Toast ----------
  function toast(m, tip) {
    var t = document.createElement('div');
    t.className = 'toast ' + (tip || ''); t.textContent = m;
    var c = $('toastlar'); c.appendChild(t);
    while (c.children.length > 5) c.removeChild(c.firstChild);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 6000);
  }

  // ---------- Modal ----------
  function modalAcik() { return acikModal; }
  function modalGoster(html) {
    if (acikModal) { kuyruk.push(html); return; }
    acikModal = true;
    var m = $('modal'); m.innerHTML = '<div class="kutu">' + html + '</div>'; m.style.display = 'flex';
  }
  function modalKapat() {
    var m = $('modal'); m.style.display = 'none'; m.innerHTML = ''; acikModal = false;
    if (kuyruk.length) modalGoster(kuyruk.shift());
  }
  window.modalKapatGlobal = modalKapat;

  function bilgiKarti(baslik, metin, tedbir, kaynak) {
    var h = '<h2>' + U.esc(baslik) + '</h2><p>' + U.esc(metin) + '</p>';
    if (tedbir) h += '<div class="bilgi">' + U.esc(tedbir) + '</div>';
    if (kaynak) h += '<p class="kaynak">Kaynak: ' + U.esc(kaynak) + '</p>';
    h += '<button class="ana" onclick="modalKapatGlobal()">Tamam</button>';
    modalGoster(h);
  }

  function etkiMetni(e) {
    var p = [];
    var OZ = { fidan: 'fidan dikilir', agacKes: 'ağaç kesilir', copTemizle: 'çöp yığını temizlenir', copEkle: 'çöp birikir', kedi: 'kedi katılır', kitap: 'kitap bulunur', guclendir: 'yapı güçlendirilir', hasarBina: 'yapı hasar görür', duman: 'duman yayılır' };
    for (var k in e) {
      var v = e[k]; if (!v || k === 'kural') continue;
      if (OZ[k]) { p.push(v + ' ' + OZ[k]); continue; }
      var ad = D.KAYNAK[k] ? D.KAYNAK[k].ad : (k === 'moral' ? 'Moral' : (k === 'doga' ? 'Doğa' : (k === 'hasta' ? 'Hasta' : k)));
      p.push((v > 0 ? '+' : '') + v + ' ' + ad);
    }
    return p.join(' · ');
  }

  function portre(u) {
    var ad = u.kahraman ? (u.cins === 'k' ? 'kahraman_kadin' : 'kahraman_erkek') : (u.yas === 'cocuk' ? (u.cins === 'k' ? 'insan_cocuk_kiz' : 'insan_cocuk_erkek') : u.yas === 'yasli' ? (u.cins === 'k' ? 'insan_yasli_kadin' : 'insan_yasli_erkek') : (u.cins === 'k' ? 'insan_kadin' : 'insan_erkek'));
    return resim(ad, 64);
  }

  function soruGoster(q, kisi) {
    var m = D.MESLEK[kisi.meslek];
    var h = '<div class="portre">' + portre(kisi) + '<div><b>' + U.esc(kisi.ad) + '</b><br><small class="gri">' + (m ? m.ad : '') + '</small></div></div>';
    h += '<p>“' + U.esc(q.soru) + '”</p><div id="soruSec">';
    for (var i = 0; i < q.sec.length; i++) h += '<button class="sec" data-i="' + i + '">' + U.esc(q.sec[i].t) + '</button>';
    h += '</div>';
    window.__soru = q;
    modalGoster(h);
    setTimeout(function () {
      var bs = document.querySelectorAll('#soruSec .sec');
      for (var j = 0; j < bs.length; j++) bs[j].onclick = function () { soruCevap(+this.getAttribute('data-i')); };
    }, 0);
  }
  function soruCevap(i) {
    var q = window.__soru, r = S.soruCevap(q, i);
    var h = '<h2>Sonuç</h2><p>' + U.esc(r.sonuc) + '</p>';
    var em = etkiMetni(r.e || {});
    if (em) h += '<p class="gri">' + U.esc(em) + '</p>';
    h += '<div class="bilgi">' + U.esc(q.bilgi) + '</div><p class="kaynak">Kaynak: ' + U.esc(q.k) + '</p>';
    h += '<button class="ana" onclick="modalKapatGlobal()">Tamam</button>';
    $('modal').querySelector('.kutu').innerHTML = h;
  }

  function yeniGelenGoster(g) {
    var h = '<h2>Kapıda biri var</h2><p><b>' + U.esc(g.yer) + '</b> yönünden ' + g.kisiler.length + ' kişi geldi.</p>';
    for (var i = 0; i < g.kisiler.length; i++) {
      var q = g.kisiler[i], u = { cins: q.cins, yas: q.yas, kahraman: false };
      h += '<div class="portre">' + portre(u) + '<div><b>' + U.esc(q.ad) + '</b> · ' + (q.yas === 'cocuk' ? 'çocuk' : q.yas === 'yasli' ? 'yaşlı' : 'yetişkin') + '<br><small class="gri">Söylediği meslek: ' + D.MESLEK[q.meslek].ad + (q.hasta ? ' · <span class="kirmizi">öksürüyor</span>' : '') + '</small></div></div>';
    }
    h += '<p class="gri">Boş yatak: ' + Math.max(0, S.yatakSayisi() - B.nufus()) + '</p>';
    h += '<button class="sec ana" id="g1">Kabul et</button><button class="sec" id="g2">Karantinayla kabul et</button><button class="sec" id="g3">Reddet</button>';
    modalGoster(h);
    setTimeout(function () {
      var f = function (k) { return function () { S.gelenKarar(k); modalKapat(); }; };
      $('g1').onclick = f('kabul'); $('g2').onclick = f('karantina'); $('g3').onclick = f('ret');
    }, 0);
  }

  // ---------- Üst çubuk ----------
  var BASLIK = { yemek: 'yemek + konserve; kişi başı günde ~1 birim yenir', su: 'temiz içme suyu; kişi başı günde ~1,5 birim', odun: 'yapı ve soba için', tas: 'yapı ve güçlendirme için', metal: 'rüzgâr gülü, güneş paneli, batarya için', plastik: 'depo, filtre, panel için' };
  function kayHtml(k, deger, kirmizi) {
    return '<span class="kay' + (kirmizi ? ' az' : '') + '" title="' + D.KAYNAK[k].ad + ': ' + (BASLIK[k] || '') + '">' + ikon(D.KAYNAK[k].ikon, D.KAYNAK[k].em) + Math.floor(deger) + '</span>';
  }
  function ustYenile() {
    var n = B.nufus(), kk = G.kay, E = G.enerji, hv = G.hava;
    var g = S.gun(), ms = S.mevsim(), h = S.saat();
    var cap = 40 + 30 * W.sayBina('yagmur') + 20 * W.sayBina('kuyu');
    var hs = '<div class="grup"><b>Gün ' + (g + 1) + '</b> · ' + ikon(D.MEVSIM_IKON[ms], '') + D.MEVSIM[ms] + ' ' + S.yil() + ' · ' + U.pad(Math.floor(h)) + ':' + U.pad(Math.floor((h % 1) * 60 / 5) * 5) + '</div>';
    hs += '<div class="grup">' + (hv.kar ? '❄️' : hv.yagmur ? '🌧️' : (h < 6 || h >= 20) ? '🌙' : '☀️') + ' ' + Math.round(hv.t) + '°C · 💨 ' + U.f1(hv.ruzgar * 10) + '</div>';
    hs += '<div class="grup hiz">';
    [['⏸', 0], ['1x', 1], ['2x', 2], ['4x', 4]].forEach(function (a) {
      var on = a[1] === 0 ? G.duraklat : (!G.duraklat && G.hiz === a[1]);
      hs += '<button class="' + (on ? 'on' : '') + '" data-hiz="' + a[1] + '">' + a[0] + '</button>';
    });
    hs += '</div>';
    if (h >= 20 || h < 6) hs += '<div class="grup"><button data-gece="1" class="ana" title="Sabaha atla">⏭ Geceyi atla</button></div>';
    hs += '<div class="grup">';
    var yt = S.yemekToplam();
    hs += kayHtml('yemek', yt, yt < n * 3) + kayHtml('su', kk.su, kk.su < n * 3) + '<small class="gri">/' + cap + '</small>' + kayHtml('odun', kk.odun, kk.odun < 10) + kayHtml('tas', kk.tas, false) + kayHtml('metal', kk.metal, false) + kayHtml('plastik', kk.plastik, false) + '<span class="kay" title="Balık stoku">🐟 ' + Math.round(G.balik) + '</span>';
    hs += '<span class="kay" title="Enerji: üretim/tüketim kW (depo kWh). Rüzgâr ve güneş yenilenebilirdir">' + ikon('ikon_enerji', '⚡') + U.f1(E.uret) + '/' + U.f1(E.tuk) + (E.kap ? ' (' + Math.round(E.depo) + ')' : '') + '</span>';
    hs += '</div><div class="grup">';
    hs += '<span class="kay" title="Nüfus: yaşayan köylü sayısı">👥 ' + n + '</span>';
    hs += '<span class="kay' + (G.moral < 30 ? ' az' : '') + '" title="Moral: yiyecek, su, yatak, doğa ve ölümler etkiler. 15 altında köylüler köyü terk eder">' + ikon('ikon_moral', '🙂') + Math.round(G.moral) + '</span>';
    hs += '<span class="kay' + (G.doga < 25 ? ' az' : '') + '" title="Doğa Dengesi: ağaç dikmek artırır; ağaç kesmek, yangın ve toplanmamış çöp (şu an ' + (G.copSay || 0) + ') düşürür">' + ikon('ikon_doga', '🌿') + Math.round(G.doga) + '</span>';
    hs += '<span class="kay' + (G.kuresel >= 2 ? ' az' : '') + '" title="Küresel sıcaklık artışı (sanayi öncesine göre). 2°C aşılırsa afetler sertleşir">' + ikon('ikon_kuresel', '🌍') + U.f2(G.kuresel) + '°C</span>';
    hs += '</div>';
    var uy = '';
    G.afet.forEach(function (a) { uy += '<span class="kay az">' + ikon(D.AFET[a.id].ikon, D.AFET[a.id].em) + D.AFET[a.id].ad + '</span> '; });
    G.bekleyen.forEach(function (a) { uy += '<span class="kay" style="color:#ffd166">⚠ ' + D.AFET[a.id].ad + ' (' + Math.max(0, a.gun - g) + ' gün)</span> '; });
    if (uy) hs += '<div class="grup">' + uy + '</div>';
    var ust = $('ust');
    if (ust.__son !== hs) { ust.innerHTML = hs; ust.__son = hs; }
  }

  function altKur() {
    var b = [['insa', '🔨 İnşa (B)'], ['koy', '👥 Köylüler'], ['iklim', '🌍 İklim karnesi'], ['kitap', '📖 Kitaplar'], ['kural', '📜 Kurallar'], ['bilgi', '💡 Bilgiler'], ['gunluk', '📓 Günlük'], ['menu', '☰ Menü']];
    var h = '';
    b.forEach(function (a) { h += '<button data-p="' + a[0] + '">' + a[1] + '</button>'; });
    $('alt').innerHTML = h;
    var bs = $('alt').querySelectorAll('button');
    for (var i = 0; i < bs.length; i++) bs[i].onclick = function () { panelToggle(this.getAttribute('data-p')); };
  }

  // ---------- Paneller ----------
  function panelToggle(p) { if (panel === p) panelKapat(); else { panel = p; panelCiz(true); } if (p !== 'insa') yapimIptal(); }
  function panelKapat() { panel = null; $('panel').style.display = 'none'; yapimIptal(); }
  function yapimIptal() { yapimKod = null; R.setHayalet(null); }

  function malHtml(mal) {
    var h = '';
    for (var k in mal) h += '<span class="' + (G.kay[k] < mal[k] ? 'kirmizi' : '') + '">' + ikon(D.KAYNAK[k].ikon, D.KAYNAK[k].em) + mal[k] + '</span> ';
    return h;
  }

  function panelCiz(zorla) {
    var pe = $('panel');
    if (!panel) { pe.style.display = 'none'; return; }
    if (!zorla && ((document.activeElement && pe.contains(document.activeElement)) || pe.matches(':hover'))) return;
    var st = pe.scrollTop, h = '';
    if (panel === 'insa') {
      h += '<h3>İnşa <button onclick="UI.panelKapat()">✕</button></h3><div class="sek">';
      D.BINA_KAT.forEach(function (k) { h += '<button class="' + (k === sekme ? 'on' : '') + '" data-s="' + k + '">' + k + '</button>'; });
      h += '</div>';
      for (var kod in D.BINA) {
        var b = D.BINA[kod]; if (b.kat !== sekme) continue;
        var kilit = b.kitap && !G.kitap[b.kitap];
        h += '<div class="kart' + (kilit ? ' kilit' : '') + '" data-b="' + kod + '" style="cursor:' + (kilit ? 'not-allowed' : 'pointer') + ';' + (yapimKod === kod ? 'border-color:#ff9f43' : '') + '"><b>' + b.ad + '</b><br>' + malHtml(b.mal) + '<small class="gri">· ' + b.sure + ' dk</small><br><small class="gri">' + b.ac + '</small>' + (kilit ? '<br><small class="kirmizi">🔒 Gerekli kitap: ' + D.KITAP[b.kitap].ad + '</small>' : '') + '</div>';
      }
      h += '<p class="gri" style="font-size:15px">Bir yapı seç, haritaya tıkla. Sağ tık / Esc ile iptal. İnşaatçı ya da boştaki köylüler kurar. Yıkık evi onarmak için sağ tıkla.</p>';
    } else if (panel === 'koy') {
      h += '<h3>Köylüler <button onclick="UI.panelKapat()">✕</button></h3>';
      G.birim.forEach(function (u) {
        if (u.olu) return;
        var m = D.MESLEK[u.meslek];
        h += '<div class="kart"><b data-u="' + u.id + '" style="cursor:pointer">' + U.esc(u.ad) + '</b> <small class="gri">' + (m ? m.ad : '') + (u.yas === 'cocuk' ? ' (çocuk)' : u.yas === 'yasli' ? ' (yaşlı)' : '') + '</small><br>';
        if (u.yas !== 'cocuk') {
          h += '<select data-g="' + u.id + '">';
          for (var g in D.GOREV) h += '<option value="' + g + '"' + (u.gorev === g ? ' selected' : '') + '>' + D.GOREV[g].em + ' ' + D.GOREV[g].ad + (m && m.gorev === g ? ' ★' : '') + '</option>';
          h += '</select> ';
        }
        h += '<small class="' + (u.sag < 40 ? 'kirmizi' : 'gri') + '">Sağlık ' + Math.round(u.sag) + '%' + (u.hasta ? ' · ' + u.hasta.ad : '') + '</small><br><small class="gri">' + durum(u) + '</small></div>';
      });
    } else if (panel === 'iklim') {
      var kr = S.karne(), ort = 0; kr.forEach(function (k) { ort += k.p; }); ort = Math.round(ort / kr.length);
      var ys = Math.round(S.yenOran() * 100);
      h += '<h3>İklim karnesi <button onclick="UI.panelKapat()">✕</button></h3>';
      h += '<div class="kart"><b>Küresel sıcaklık: +' + U.f2(G.kuresel) + '°C</b> <small class="gri">(sanayi öncesine göre)</small><div class="bar"><i style="width:' + U.clamp((G.kuresel - 1.5) / 1 * 100, 0, 100) + '%;background:' + (G.kuresel >= 2 ? '#ff5e5e' : '#ffd166') + '"></i></div><small class="gri">1,5°C hedef · 2°C eşik' + (G.kuresel >= 2 ? ' — <span class="kirmizi">AŞILDI</span>' : '') + '. Tek köy küresel iklimi değiştiremez; ama yenilenebilir enerji ve doğa iyileştirmesi artışı yavaşlatır.</small></div>';
      h += '<div class="kart"><b>Genel iklim puanı: ' + ort + '/100</b> · Yenilenebilir enerji payı: %' + ys + '</div>';
      h += '<p class="gri" style="font-size:14px">COP31 odak alanları</p>';
      kr.forEach(function (k) { var c = k.p >= 66 ? '#7bd36b' : (k.p >= 33 ? '#ffd166' : '#ff5e5e'); h += '<div class="kart"><b>' + k.em + ' ' + k.ad + '</b> <small class="gri">' + Math.round(k.p) + '</small><div class="bar"><i style="width:' + k.p + '%;background:' + c + '"></i></div><small class="gri">' + k.ip + '</small></div>'; });
    } else if (panel === 'kitap') {
      h += '<h3>Kitaplar <button onclick="UI.panelKapat()">✕</button></h3><p class="gri" style="font-size:12px">Dedenin Defteri temel bilgileri verir. İleri bilgi, harabelerdeki (kütüphane, okul, evler) eski kitaplardan öğrenilir. Toplayıcılara “Yağmala” emri ver.</p>';
      for (var k2 in D.KITAP) {
        var var1 = G.kitap[k2];
        h += '<div class="kart' + (var1 ? '' : ' kilit') + '"><b>' + (var1 ? '📗 ' : '🔒 ') + D.KITAP[k2].ad + '</b><br><small class="gri">' + (var1 ? D.KITAP[k2].ac : 'Henüz bulunmadı.') + '</small></div>';
      }
    } else if (panel === 'kural') {
      h += '<h3>Kurallar <button onclick="UI.panelKapat()">✕</button></h3>';
      h += '<div class="kart"><b>Mesai</b><br><select data-k="mesai"><option value="normal"' + (G.kural.mesai === 'normal' ? ' selected' : '') + '>Normal (06-21)</option><option value="serin"' + (G.kural.mesai === 'serin' ? ' selected' : '') + '>Serin (sabah-akşam, öğle gölgede)</option></select><br><small class="gri">Isı dalgasında hayat kurtarır.</small></div>';
      h += '<div class="kart"><b>Tayın</b><br><select data-k="tayin"><option value="esit"' + (G.kural.tayin === 'esit' ? ' selected' : '') + '>Eşit</option><option value="kisitli"' + (G.kural.tayin === 'kisitli' ? ' selected' : '') + '>Kısıtlı (tasarruf, moral cezası)</option></select></div>';
      h += '<div class="kart"><b>Dizel jeneratör</b><br><select data-k="dizel"><option value="1"' + (G.kural.dizel ? ' selected' : '') + '>Gerekirse kullan</option><option value="0"' + (!G.kural.dizel ? ' selected' : '') + '>Sakla (kirletmez)</option></select></div>';
      h += '<div class="kart"><b>Yeni gelenler</b><br><select data-k="gelen"><option value="sor"' + (G.kural.gelen !== 'oto' ? ' selected' : '') + '>Her seferinde sor</option><option value="oto"' + (G.kural.gelen === 'oto' ? ' selected' : '') + '>Otomatik kabul et</option></select><br><small class="gri">Boş yatak varsa her gün yeni insanlar gelebilir. Yeni ev = yeni yatak.</small></div>';
      h += '<div class="kart"><b>Ekim tercihi</b><br><select data-k="ekim">';
      for (var e in D.EKIN) { var ek = D.EKIN[e]; if (ek.kitap && !G.kitap[ek.kitap]) continue; h += '<option value="' + e + '"' + (G.ekim === e ? ' selected' : '') + '>' + ek.ad + ' (' + ek.gun + ' gün, ' + ek.verim + ' verim)</option>'; }
      h += '</select></div>';
    } else if (panel === 'bilgi') {
      h += '<h3>Bilgiler <button onclick="UI.panelKapat()">✕</button></h3>';
      if (!G.bilgiler.length) h += '<p class="gri">Henüz bilgi kartı yok. Afetler, sorular ve kitaplar bilgi toplar.</p>';
      G.bilgiler.slice().reverse().forEach(function (b) { h += '<div class="kart"><b>' + U.esc(b.b) + '</b><br>' + U.esc(b.m) + (b.t ? '<br><i>' + U.esc(b.t) + '</i>' : '') + (b.k ? '<br><small class="gri">Kaynak: ' + U.esc(b.k) + '</small>' : '') + '</div>'; });
    } else if (panel === 'gunluk') {
      h += '<h3>Günlük <button onclick="UI.panelKapat()">✕</button></h3>';
      G.bildirimler.forEach(function (b) { h += '<div class="kart"><small class="gri">Gün ' + (b.gun + 1) + ' ' + U.pad(Math.floor(b.saat)) + ':00</small><br>' + U.esc(b.metin) + '</div>'; });
    } else if (panel === 'menu') {
      h += '<h3>Menü <button onclick="UI.panelKapat()">✕</button></h3>';
      h += '<button class="sec" id="mKaydet" style="width:100%;margin-bottom:6px">💾 Kaydet</button><button id="mIndir" style="width:100%;margin-bottom:6px">⬇ Kaydı dosyaya indir</button><button id="mYukle" style="width:100%;margin-bottom:6px">⬆ Dosyadan yükle</button><button id="mNasil" style="width:100%;margin-bottom:6px">❓ Nasıl oynanır</button><button id="mAna" style="width:100%">🏠 Ana menü</button>';
    }
    pe.innerHTML = h; pe.style.display = 'block'; pe.scrollTop = st;
    panelOlaylar(pe);
  }

  function durum(u) {
    if (u.uyku) return '😴 Uyuyor';
    if (u.mod === 'sigin') return '🏠 Sıcaktan korunuyor';
    if (u.is) return (B.IS[u.is.tur] ? B.IS[u.is.tur].ad : '') + (u.is.asama === 'yuru' ? ' (yolda)' : '');
    if (u.yas === 'cocuk') return 'Oynuyor';
    return 'Boşta';
  }

  function panelOlaylar(pe) {
    var i, q;
    q = pe.querySelectorAll('[data-s]'); for (i = 0; i < q.length; i++) q[i].onclick = function () { sekme = this.getAttribute('data-s'); panelCiz(true); };
    q = pe.querySelectorAll('[data-b]'); for (i = 0; i < q.length; i++) q[i].onclick = function () {
      var kod = this.getAttribute('data-b'), b = D.BINA[kod];
      if (b.kitap && !G.kitap[b.kitap]) { toast('Bu yapı için önce "' + D.KITAP[b.kitap].ad + '" bulunmalı.', 'uyari'); return; }
      yapimKod = kod; R.setHayalet({ kod: kod, x: -99, y: -99 }); panelCiz(true);
    };
    q = pe.querySelectorAll('[data-g]'); for (i = 0; i < q.length; i++) q[i].onchange = function () {
      var u = birim(+this.getAttribute('data-g')); if (u) { u.gorev = this.value; B.isBirak(u); if (!G.egitim.gorev) G.egitim.gorev = 1; }
    };
    q = pe.querySelectorAll('[data-u]'); for (i = 0; i < q.length; i++) q[i].onclick = function () { sec([+this.getAttribute('data-u')]); var u = birim(+this.getAttribute('data-u')); R.cam.x = u.x * D.T; R.cam.y = u.y * D.T; };
    q = pe.querySelectorAll('[data-k]'); for (i = 0; i < q.length; i++) q[i].onchange = function () {
      var k = this.getAttribute('data-k');
      if (k === 'dizel') G.kural.dizel = this.value === '1'; else if (k === 'gelen') G.kural.gelen = this.value; else if (k === 'ekim') G.ekim = this.value; else G.kural[k] = this.value;
    };
    if (panel === 'menu') {
      $('mKaydet').onclick = function () { toast(Kayit.kaydet('elle') ? 'Oyun kaydedildi.' : 'Kayıt başarısız.', 'iyi'); };
      $('mIndir').onclick = function () { Kayit.indir(); };
      $('mYukle').onclick = function () { $('dosya').click(); };
      $('mNasil').onclick = function () { Hikaye.nasilOynanir(); };
      $('mAna').onclick = function () { Kayit.kaydet('oto'); Main.menuyeDon(); };
    }
  }

  function birim(id) { for (var i = 0; i < G.birim.length; i++) if (G.birim[i].id === id) return G.birim[i]; return null; }

  // ---------- Seçim ----------
  function sec(ids) {
    G.secili = ids; G.secNesne = 0;
    for (var i = 0; i < G.birim.length; i++) G.birim[i].secili = ids.indexOf(G.birim[i].id) >= 0;
    secimYenile(true);
  }
  function bar(ad, v, tur) {
    var c = '#7bd36b';
    if (tur === 'isi') c = (v > 80 || v < 20) ? '#ff5e5e' : ((v > 68 || v < 32) ? '#ffd166' : '#7bd36b');
    else c = v < 25 ? '#ff5e5e' : (v < 50 ? '#ffd166' : '#7bd36b');
    return '<div class="sat"><span>' + ad + '</span><small>' + Math.round(v) + '</small></div><div class="bar"><i style="width:' + U.clamp(v, 0, 100) + '%;background:' + c + '"></i></div>';
  }
  function secimYenile(zorla) {
    var p = $('secim');
    if (!G) { p.style.display = 'none'; return; }
    var h = '';
    var sel = G.secili.map(birim).filter(function (u) { return u && !u.olu; });
    if (sel.length === 1) {
      var u = sel[0], m = D.MESLEK[u.meslek];
      if (!zorla && ((document.activeElement && p.contains(document.activeElement)) || p.matches(':hover'))) return;
      h += '<div class="portre" style="display:flex;gap:10px;align-items:center">' + portre(u) + '<div><h3>' + U.esc(u.ad) + '</h3><small class="gri">' + (m ? ikon(m.rozet, '') + m.ad : '') + ' · ' + (u.yas === 'cocuk' ? 'çocuk' : u.yas === 'yasli' ? 'yaşlı' : 'yetişkin') + '</small></div></div>';
      if (u.yas !== 'cocuk') {
        h += '<div class="sat"><span>Görev</span><select id="sGorev">';
        for (var g in D.GOREV) h += '<option value="' + g + '"' + (u.gorev === g ? ' selected' : '') + '>' + D.GOREV[g].em + ' ' + D.GOREV[g].ad + (m && m.gorev === g ? ' ★ (mesleği)' : '') + '</option>';
        h += '</select></div>';
        if (m && u.gorev !== m.gorev) h += '<button id="sMeslek" style="margin:4px 0">★ Mesleğine ver: ' + D.GOREV[m.gorev].ad + '</button>';
      }
      h += bar('Sağlık', u.sag) + bar('Tokluk', u.ac) + bar('Su', u.su) + bar('Isı (sıcak↔soğuk)', u.isi, 'isi') + bar('Hava kalitesi', u.hava);
      if (u.hasta) h += '<p class="kirmizi">🤒 ' + u.hasta.ad + ' (' + u.hasta.kalan + ' gün)</p>';
      h += '<p class="gri" style="font-size:12px;margin-top:4px">' + durum(u) + '</p>';
      h += '<div style="display:flex;gap:6px;margin-top:6px"><button id="sBirak">İşi bırak</button></div>';
      h += '<p class="gri" style="font-size:11px;margin-top:6px">Haritada sağ tıkla: emir ver.</p>';
    } else if (sel.length > 1) {
      h += '<h3>' + sel.length + ' köylü seçili</h3><p class="gri" style="font-size:12px">Sağ tık ile hepsine emir ver.</p>';
    } else if (G.secNesne && G.nesneler[G.secNesne]) {
      var o = G.nesneler[G.secNesne], t = W.tanim(o);
      h += '<h3>' + (o.tur === 'bina' ? t.ad : (t.ad && t.ad !== o.tur ? t.ad : ({ agac: 'Ağaç', cam: 'Çam', genc: 'Genç ağaç', yanik: 'Yanık ağaç', fidan: 'Fidan', kutuk: 'Kütük', cali: 'Çalı', bogurtlen: 'Böğürtlen', sifali: 'Şifalı bitki', kaya: 'Kaya', hurda: 'Hurda', cop: 'Çöp', araba: 'Araba hurdası', kitap: 'Kitap' }[o.tur] || o.tur))) + '</h3>';
      if (o.tur === 'bina') {
        if (!o.bitti) h += '<p>İnşaat: %' + Math.round((o.insa || 0) * 100) + '</p>';
        else {
          h += bar('Sağlamlık', o.hp === undefined ? 100 : o.hp);
          if (o.bina === 'tarla') h += '<p>' + (o.ekin ? D.EKIN[o.ekin].ad + (o.oldu ? ' (kurudu)' : ' — büyüme %' + Math.round(o.buyume * 100)) + '<br>Su %' + Math.round(o.su * 100) : 'Boş tarla') + '</p>';
          if (o.bina === 'ev' || o.bina === 'siginak') h += '<p>2 yatak</p>';
          h += '<p>' + (o.guclu ? '🛡️ Güçlendirilmiş' : '') + '</p>';
          if (!o.guclu && o.bina !== 'tarla') h += '<button id="oGuclu">Güçlendir (taş 4, odun 2)</button> ';
        }
        if (o.bina !== 'siginak' && o.bina !== 'dizel') h += '<button id="oYik">Yık / İptal</button>';
      } else if (['yikik_ev', 'market', 'okul', 'hastane', 'kutuphane'].indexOf(o.tur) >= 0) {
        h += '<p>' + (o.yagma ? 'Yağmalandı.' : 'Henüz yağmalanmadı. Bir köylüye sağ tıkla → Yağmala.') + '</p>';
        if (o.tur === 'yikik_ev') h += '<button id="oOnar">Onar → Ev (odun 10, taş 4, metal 2)</button>';
      } else if (o.tur === 'agac' || o.tur === 'cam') h += '<p class="gri">Olgun ağaç. Kesilirse 8 odun verir; doğa dengesi düşer.</p>';
      else if (o.tur === 'fidan' || o.tur === 'genc') h += '<p class="gri">Büyüyor. Ağaçlar doğa dengesini yükseltir.</p>';
    } else { p.style.display = 'none'; return; }
    if (!zorla && (p.__son === h || p.matches(':hover'))) return;
    p.innerHTML = h; p.style.display = 'block'; p.__son = h;
    var s1 = $('sGorev'); if (s1) s1.onchange = function () { sel[0].gorev = this.value; B.isBirak(sel[0]); G.egitim.gorev = 1; };
    var s6 = $('sMeslek'); if (s6) s6.onclick = function () { sel[0].gorev = D.MESLEK[sel[0].meslek].gorev; B.isBirak(sel[0]); G.egitim.gorev = 1; secimYenile(true); };
    var s2 = $('sBirak'); if (s2) s2.onclick = function () { B.isBirak(sel[0]); };
    var s3 = $('oGuclu'); if (s3) s3.onclick = function () { var o2 = G.nesneler[G.secNesne]; if (G.kay.tas >= 4 && G.kay.odun >= 2) { G.kay.tas -= 4; G.kay.odun -= 2; o2.guclu = true; toast('Yapı güçlendirildi.', 'iyi'); secimYenile(true); } else toast('Malzeme yetersiz.', 'uyari'); };
    var s4 = $('oYik'); if (s4) s4.onclick = function () { var o2 = G.nesneler[G.secNesne]; if (!o2) return; if (o2.bitti) { for (var k in D.BINA[o2.bina] ? D.BINA[o2.bina].mal : {}) G.kay[k] += Math.floor(D.BINA[o2.bina].mal[k] / 2); } else { for (var k2 in D.BINA[o2.bina].mal) G.kay[k2] += D.BINA[o2.bina].mal[k2]; } W.sil(o2); G.secNesne = 0; secimYenile(true); };
    var s5 = $('oOnar'); if (s5) s5.onclick = function () { onar(G.nesneler[G.secNesne]); };
  }

  function onar(o) {
    var mal = { odun: 10, tas: 4, metal: 2 };
    for (var k in mal) if (G.kay[k] < mal[k]) { toast('Onarım için malzeme yetersiz (odun 10, taş 4, metal 2).', 'uyari'); return; }
    for (var k2 in mal) G.kay[k2] -= mal[k2];
    var x = o.x, y = o.y; W.sil(o);
    W.ekle('bina', x, y, { bina: 'ev', bitti: false, insa: 0, hp: 100 });
    G.secNesne = 0; secimYenile(true); toast('Onarım sıraya alındı. Bir inşaatçı gelecek.', 'iyi');
  }

  // ---------- Bağlam menüsü ----------
  var KUTU = { hurda: 1, cop: 1, araba: 1, bogurtlen: 1, sifali: 1, cali: 1, kutuk: 1, kitap: 1 };
  function secenekler(o, tx, ty) {
    var s = [], i = W.idx(tx, ty);
    if (o) {
      if (o.tur === 'agac' || o.tur === 'cam' || o.tur === 'yanik') s.push(['Kes', 'kes', o]);
      else if (o.tur === 'kaya') s.push(['Taş çıkar', 'kaz', o]);
      else if (KUTU[o.tur]) s.push(['Topla', 'topla', o]);
      else if (['yikik_ev', 'market', 'okul', 'hastane', 'kutuphane'].indexOf(o.tur) >= 0) {
        if (!o.yagma) s.push(['Yağmala', 'yagmala', o]);
        if (o.tur === 'yikik_ev') { s.push(['Onar (ev yap)', 'onar', o]); s.push(['Sök', 'sok', o]); }
      } else if (o.tur === 'bina') {
        if (!o.bitti) s.push(['İnşa et', 'insa', o]);
        else if (o.bina === 'tarla') s.push(['Tarlayla ilgilen', 'tarla', o]);
      }
    }
    if (G.ates[i] !== undefined) s.push(['Söndür', 'sondur', null]);
    if (!o || (o.tur === 'bina' && o.bina === 'tarla') || o.tur === 'fidan' || o.tur === 'hurda' || o.tur === 'cop') {
      if (G.gec[i]) {
        s.push(['Git', 'git', null]);
        if (W.kiyiMi(tx, ty)) s.push(['Balık tut', 'balik', null]);
        if (W.dereKenari(tx, ty)) s.push(['Su taşı', 'su', null]);
        var tt = G.tile[i];
        if (!o && (tt === W.CIM || tt === W.TOP)) s.push(['Fidan dik', 'dik', null]);
        if (!G.kesif[i]) s.push(['Keşfet', 'kasif', null]);
      }
    }
    return s;
  }

  function emirVer(tur, o, tx, ty) {
    var sel = G.secili.map(birim).filter(function (u) { return u && !u.olu; });
    if (tur === 'onar') { onar(o); return; }
    var basari = 0;
    sel.forEach(function (u) {
      if (u.yas === 'cocuk' && tur !== 'git') return;
      if (B.emir(u, tur, o, tx, ty)) basari++;
    });
    if (!basari) toast('Oraya ulaşılamıyor ya da emir verilemedi.', 'uyari');
    else G.egitim.emir = (G.egitim.emir || 0) + 1;
  }

  function baglamGoster(sx, sy, liste, tx, ty) {
    var b = $('baglam'), h = '';
    liste.forEach(function (s, i) { h += '<div data-i="' + i + '">' + s[0] + '</div>'; });
    b.innerHTML = h; b.style.left = Math.min(sx, window.innerWidth - 160) + 'px'; b.style.top = Math.min(sy, window.innerHeight - 40 * liste.length) + 'px'; b.style.display = 'block';
    var d = b.querySelectorAll('div');
    for (var i = 0; i < d.length; i++) d[i].onclick = function () { var s = liste[+this.getAttribute('data-i')]; baglamKapat(); emirVer(s[1], s[2], tx, ty); };
  }
  function baglamKapat() { $('baglam').style.display = 'none'; }

  // ---------- Girdi ----------
  function birimBul(wx, wy) {
    var best = null, bd = 0.9;
    for (var i = 0; i < G.birim.length; i++) {
      var u = G.birim[i]; if (u.olu || u.icerde) continue;
      var d = U.dist(u.x, u.y - 0.25, wx, wy);
      if (d < bd) { bd = d; best = u; }
    }
    return best;
  }
  function nesneBul(wx, wy) {
    var x = Math.floor(wx), y = Math.floor(wy);
    if (!W.ic(x, y)) return null;
    var o = G.nesneler[G.occ[W.idx(x, y)]];
    if (o) return o;
    // ağaç/bina sprite'ı üst karoyu da kapsar
    var o2 = W.ic(x, y + 1) ? G.nesneler[G.occ[W.idx(x, y + 1)]] : null;
    if (o2 && (W.tanim(o2).sh > 64) && o2.tur !== 'bina') return o2;
    return null;
  }

  function sol(sx, sy, shift) {
    baglamKapat();
    if (!G) return;
    var wx = R.dunyaX(sx), wy = R.dunyaY(sy);
    if (yapimKod) { yerlestir(Math.floor(wx), Math.floor(wy)); return; }
    var u = birimBul(wx, wy);
    if (u) {
      if (shift) { var ids = G.secili.slice(); var ix = ids.indexOf(u.id); if (ix >= 0) ids.splice(ix, 1); else ids.push(u.id); sec(ids); }
      else sec([u.id]);
      return;
    }
    var o = nesneBul(wx, wy);
    if (o) { sec([]); G.secNesne = o.id; secimYenile(true); return; }
    sec([]);
  }
  function sag(sx, sy) {
    if (!G) return;
    if (yapimKod) { yapimIptal(); panelCiz(true); return; }
    var wx = R.dunyaX(sx), wy = R.dunyaY(sy), tx = Math.floor(wx), ty = Math.floor(wy);
    if (!W.ic(tx, ty)) return;
    if (!G.secili.length) { baglamKapat(); return; }
    var o = nesneBul(wx, wy), s = secenekler(o, tx, ty);
    if (!s.length) { toast('Burada yapılacak bir iş yok.', 'uyari'); return; }
    if (s.length === 1) { emirVer(s[0][1], s[0][2], tx, ty); return; }
    baglamGoster(sx, sy, s, tx, ty);
  }

  function yerlestir(x, y) {
    var h = R.getHayalet(); if (!h) return;
    var b = D.BINA[h.kod];
    if (!W.yerUygun(h.kod, h.x, h.y)) { toast('Buraya kurulamaz.', 'uyari'); return; }
    for (var k in b.mal) if (G.kay[k] < b.mal[k]) { toast('Malzeme yetersiz.', 'uyari'); return; }
    for (var k2 in b.mal) G.kay[k2] -= b.mal[k2];
    W.ekle('bina', h.x, h.y, { bina: h.kod, bitti: false, insa: 0, hp: 100 });
    panelCiz(true);
  }

  // ---------- Harita ipucu ----------
  var NB = {
    agac: ['Ağaç', 'Kesilirse 8 odun verir; doğa dengesi düşer. Gölge verir, toprağı tutar.', 'Sağ tık → Kes'],
    cam: ['Çam', 'Kesilirse 8 odun verir; doğa dengesi düşer. Gölge verir.', 'Sağ tık → Kes'],
    genc: ['Genç ağaç', 'Büyüyor; olgunlaşınca gölge ve odun verir.', ''],
    fidan: ['Fidan', 'Zamanla ağaç olur. Doğa dengesini yükseltir.', ''],
    yanik: ['Yanık ağaç', 'Yangında yandı. Kesilirse 4 odun verir.', 'Sağ tık → Kes'],
    kutuk: ['Kütük', 'Toplanırsa 4 odun verir.', 'Sağ tık → Topla'],
    cali: ['Çalı', 'Toplanırsa 2 odun verir.', 'Sağ tık → Topla'],
    bogurtlen: ['Böğürtlen', 'Yenilebilir: 4 yemek verir.', 'Sağ tık → Topla'],
    sifali: ['Şifalı bitki', '1 ilaç verir (hastaları iyileştirir).', 'Sağ tık → Topla'],
    kaya: ['Kaya', 'Her seferinde 4 taş çıkar (4 kez).', 'Sağ tık → Taş çıkar'],
    hurda: ['Hurda', '2 metal ve 1 plastik verir.', 'Sağ tık → Topla'],
    cop: ['Çöp yığını', '2 plastik verir. Toplanmazsa doğayı zehirler (doğa dengesi düşer); toplamak iyileştirir (sıfır atık).', 'Sağ tık → Topla'],
    araba: ['Araba hurdası', '6 metal ve 2 plastik verir.', 'Sağ tık → Topla'],
    kitap: ['Eski kitap', 'Okununca yeni bir bilgi/yapı açar.', 'Sağ tık → Topla'],
    yikik_ev: ['Yıkık ev', 'Yağmala: odun, metal, plastik, bazen konserve/kitap. Onar: 2 yataklı ev olur. Sök: odun, taş, metal.', 'Sağ tık → Yağmala / Onar / Sök'],
    market: ['Yıkık market', 'Yağmala: konserve, su, plastik, tohum.', 'Sağ tık → Yağmala'],
    okul: ['Yıkık okul', 'Yağmala: Afet Hazırlığı kitabı, plastik.', 'Sağ tık → Yağmala'],
    hastane: ['Yıkık hastane', 'Yağmala: ilaç ve metal.', 'Sağ tık → Yağmala'],
    kutuphane: ['Yıkık kütüphane', 'Yağmala: eski kitaplar (Ziraat, Elektrik, Su, İnşaat…).', 'Sağ tık → Yağmala']
  };
  var ZEMINAD = ['Çimen', 'Toprak', 'Kum', 'Derin deniz', 'Sığ su', 'Dere (kirli su alınır)', 'Kayalık', 'Orman zemini', 'Asfalt', 'Kaldırım', 'Moloz'];
  var OZELB = { siginak: '2 yatak, yalıtımlı. Gece ve aşırı sıcakta korur.', dizel: 'Enerji açığında 3 kW verir, yakıt harcar, havayı kirletir.', depo: 'Köyün malzeme deposu.' };

  function ipucuMetni(wx, wy) {
    var u = birimBul(wx, wy);
    if (u) {
      var m = D.MESLEK[u.meslek];
      return '<b>' + U.esc(u.ad) + ' · ' + (m ? m.ad : '') + '</b><small>Görev: ' + D.GOREV[u.gorev].ad + ' · ' + durum(u) + '<br>Sağlık ' + Math.round(u.sag) + ' · Tokluk ' + Math.round(u.ac) + ' · Su ' + Math.round(u.su) + (u.hasta ? '<br>🤒 ' + u.hasta.ad : '') + '</small>';
    }
    var x = Math.floor(wx), y = Math.floor(wy);
    if (!W.ic(x, y)) return '';
    if (!G.kesif[W.idx(x, y)]) return '<b>Keşfedilmemiş bölge</b><small>Bir köylüye sağ tıkla → Keşfet. Gözcü kulesi geniş alanı açar.</small>';
    var o = nesneBul(wx, wy);
    if (G.ates[W.idx(x, y)] !== undefined) return '<b>🔥 Yangın</b><small>Köylülere zarar verir, ağaçlara yayılır. Sağ tık → Söndür (su harcar). Yağmur söndürür.</small>';
    if (o) {
      if (o.tur === 'bina') {
        var b = D.BINA[o.bina], ad = b ? b.ad : (D.OZEL_BINA[o.bina] || {}).ad, ac = b ? b.ac : OZELB[o.bina];
        var d = !o.bitti ? 'İnşaat: %' + Math.round((o.insa || 0) * 100) + ' (bir köylü inşa edecek)' : ('Sağlamlık ' + Math.round(o.hp === undefined ? 100 : o.hp) + (o.guclu ? ' · 🛡️ güçlendirilmiş' : ''));
        if (o.bina === 'tarla' && o.bitti) d = o.ekin ? D.EKIN[o.ekin].ad + (o.oldu ? ' (kurudu)' : ': büyüme %' + Math.round(o.buyume * 100)) + ' · su %' + Math.round(o.su * 100) : 'Boş tarla, tohum ekilecek';
        return '<b>' + ad + '</b>' + (ac || '') + '<small>' + d + '</small>';
      }
      var n = NB[o.tur];
      if (n) return '<b>' + n[0] + '</b>' + n[1] + (n[2] && G.secili.length ? '<small>' + n[2] + '</small>' : '');
    }
    var t = G.tile[W.idx(x, y)];
    var ek = W.kiyiMi(x, y) ? '<small>Kıyı: balık tutulabilir.</small>' : (W.dereKenari(x, y) ? '<small>Dere kenarı: su taşınabilir (kirli su, filtrele).</small>' : (G.selAlan[W.idx(x, y)] ? '<small>Alçak alan: selde su basar.</small>' : ''));
    return '<b>' + ZEMINAD[t] + '</b>' + ek;
  }
  function ipucuGuncelle(e) {
    var tp = $('tip');
    if (!G || e.target !== $('c') || sur.hareket || yapimKod) { tp.style.display = 'none'; return; }
    var h = ipucuMetni(R.dunyaX(e.clientX), R.dunyaY(e.clientY));
    if (!h) { tp.style.display = 'none'; return; }
    if (tp.__h !== h) { tp.innerHTML = h; tp.__h = h; }
    tp.style.display = 'block';
    tp.style.left = Math.min(e.clientX + 16, window.innerWidth - 360) + 'px';
    tp.style.top = Math.min(e.clientY + 16, window.innerHeight - 120) + 'px';
  }

  function girdiKur() {
    var cv = $('c');
    cv.addEventListener('mousedown', function (e) { sur = { sx: e.clientX, sy: e.clientY, aktif: true, hareket: false, btn: e.button, cx: R.cam.x, cy: R.cam.y }; });
    window.addEventListener('mousemove', function (e) {
      if (!G) return;
      ipucuGuncelle(e);
      if (sur.aktif && sur.btn === 0) {
        var dx = e.clientX - sur.sx, dy = e.clientY - sur.sy;
        if (Math.abs(dx) + Math.abs(dy) > 6) sur.hareket = true;
        if (sur.hareket && !yapimKod) { R.cam.x = sur.cx - dx / R.cam.z; R.cam.y = sur.cy - dy / R.cam.z; }
      }
      var h = R.getHayalet();
      if (h && yapimKod) {
        var b = D.BINA[yapimKod], w = b.w || 1, hh = b.h || 1;
        h.x = Math.floor(R.dunyaX(e.clientX) - w / 2 + 0.5); h.y = Math.floor(R.dunyaY(e.clientY) - hh / 2 + 0.5);
      }
    });
    window.addEventListener('mouseup', function (e) {
      if (!sur.aktif) return;
      var t = e.target;
      if (sur.btn === 0 && !sur.hareket && t === cv) sol(e.clientX, e.clientY, e.shiftKey);
      sur.aktif = false;
    });
    cv.addEventListener('mouseleave', function () { $('tip').style.display = 'none'; });
    cv.addEventListener('contextmenu', function (e) { $('tip').style.display = 'none'; e.preventDefault(); sag(e.clientX, e.clientY); });
    cv.addEventListener('wheel', function (e) {
      e.preventDefault(); if (!G) return;
      var bx = R.dunyaX(e.clientX), by = R.dunyaY(e.clientY);
      R.cam.z *= e.deltaY < 0 ? 1.12 : 1 / 1.12; R.cam.z = U.clamp(R.cam.z, 0.6, 3);
      R.cam.x += (bx - R.dunyaX(e.clientX)) * D.T; R.cam.y += (by - R.dunyaY(e.clientY)) * D.T;
    }, { passive: false });
    window.addEventListener('keydown', function (e) {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT')) return;
      tus[e.key.toLowerCase()] = true;
      if (!G || $('ekran').style.display === 'block') return;
      var k = e.key.toLowerCase();
      if (k === ' ') { e.preventDefault(); Main.duraklatDegis(); }
      else if (k === '1') Main.hizAyarla(1); else if (k === '2') Main.hizAyarla(2); else if (k === '3' || k === '4') Main.hizAyarla(4);
      else if (k === 'b') panelToggle('insa');
      else if (k === 'escape') { baglamKapat(); if (yapimKod) { yapimIptal(); panelCiz(true); } else if (panel) panelKapat(); else sec([]); }
    });
    window.addEventListener('keyup', function (e) { tus[e.key.toLowerCase()] = false; });
    $('mini').addEventListener('mousedown', function (e) {
      if (!G) return;
      var r = this.getBoundingClientRect();
      R.cam.x = (e.clientX - r.left) / r.width * D.N * D.T; R.cam.y = (e.clientY - r.top) / r.height * D.N * D.T;
    });
    $('ust').addEventListener('mousedown', function (e) { if (e.target.closest('[data-gece]')) { Main.geceAtla(); return; } var b = e.target.closest('[data-hiz]'); if (b) { var v = +b.getAttribute('data-hiz'); if (v === 0) Main.duraklatDegis(true); else Main.hizAyarla(v); } });
    $('dosya').addEventListener('change', function () {
      var f = this.files[0]; if (!f) return;
      Kayit.dosyadanYukle(f, function (ok) { if (ok) { Main.oyunaGir(); toast('Kayıt yüklendi.', 'iyi'); } else toast('Dosya okunamadı.', 'kotu'); });
      this.value = '';
    });
  }

  // ---------- Eğitim ----------
  var ADIMLAR = [
    ['Kamerayı hareket ettir: WASD / oklar ya da fareyle sürükle. Tekerlekle yakınlaş.', function () { return G.egitim.kamera > 160; }],
    ['Bir köylüye sol tıkla.', function () { return G.secili.length > 0; }],
    ['Seçili köylüye bir ağaca SAĞ tıkla ve “Kes” de.', function () { return G.egitim.emir > 0; }],
    ['Bir köylünün görevini değiştir (alttaki Köylüler menüsü ya da seçim paneli).', function () { return !!G.egitim.gorev; }],
    ['İnşa menüsünden (B) bir Tarla kur.', function () { return W.say(function (o) { return o.tur === 'bina' && o.bina === 'tarla'; }) > 0; }],
    ['Su sorununu çöz: Yağmur suyu deposu kur.', function () { return W.say(function (o) { return o.tur === 'bina' && o.bina === 'yagmur'; }) > 0; }],
    ['Yenilenebilir enerji: bir Rüzgâr gülü kur.', function () { return W.say(function (o) { return o.tur === 'bina' && o.bina === 'ruzgar'; }) > 0; }],
    ['Üstteki hız düğmelerinden hızı değiştir (1x/2x/4x ya da ⏸).', function () { return !!G.egitim.hiz; }],
    ['Bulutlu (karanlık) bir yere sağ tıkla → “Keşfet”. Sonra yıkık bir evi “Yağmala”.', function () { return G.istat.kesif > 0; }]
  ];
  function egitimKontrol() {
    var el = $('ipucu'), e = G.egitim;
    if (!e || !e.aktif || $('modal').style.display === 'flex') { el.style.display = 'none'; return; }
    if (e.adim >= ADIMLAR.length) { e.aktif = false; el.style.display = 'none'; toast('Eğitim tamamlandı! Köyü ayakta tut.', 'iyi'); return; }
    if (ADIMLAR[e.adim][1]()) { e.adim++; return; }
    el.textContent = 'Eğitim ' + (e.adim + 1) + '/' + ADIMLAR.length + ' · ' + ADIMLAR[e.adim][0]; el.style.display = 'block';
  }

  // ---------- Ana yenileme ----------
  var sayac = 0;
  function ciz() {
    if (!G) return;
    ustYenile();
    secimYenile(false);
    if (panel) panelCiz(false);
    egitimKontrol();
    if (++sayac % 2 === 0) R.miniCiz($('mini'));
  }

  function goster(a) {
    $('ust').style.display = a ? 'flex' : 'none';
    $('alt').style.display = a ? 'flex' : 'none';
    $('mini').style.display = a ? 'block' : 'none';
    if (!a) { $('secim').style.display = 'none'; $('panel').style.display = 'none'; $('ipucu').style.display = 'none'; panel = null; yapimKod = null; R.setHayalet(null); }
  }

  function init() { altKur(); girdiKur(); }

  return {
    init: init, ciz: ciz, goster: goster, toast: toast, bilgiKarti: bilgiKarti, soruGoster: soruGoster, yeniGelenGoster: yeniGelenGoster,
    modalAcik: modalAcik, modalGoster: modalGoster, modalKapat: modalKapat, panelKapat: panelKapat, ikon: ikon, resim: resim, tus: tus,
    kervanGeldi: function () {}, secimYenile: secimYenile, sec: sec, panelCiz: panelCiz
  };
})();
