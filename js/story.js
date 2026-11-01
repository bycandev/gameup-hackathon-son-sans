var Hikaye = (function () {
  var $ = function (id) { return document.getElementById(id); };
  var yazi = null;

  // Hikâye metinleri tek yerde: kolayca güzelleştirilebilir.
  var METIN = {
    acilis: 'Bu bir tahmin değil, “hiçbir şey yapılmasaydı” kurgusu. Ama içindeki her afet bugün gerçek.',
    slayt1: [
      { img: 'hikaye_1', baslik: '2026 · Normal bir yaz', metin: 'İstanbul\'un kuzeyinde, Kestanelik\'te sıradan bir yaz akşamı. Televizyonda Antalya\'daki COP31 haberi var. Kanalı değiştiriyorsun; kimsenin aklı o akşam yemeğinde değil.' },
      { img: 'hikaye_2', baslik: '2026–2030 · İşaretler', metin: 'Her yıl yeni bir sıcaklık rekoru. Barajlar boşalıyor, Marmara\'da deniz köpüklenip müsilajla kaplanıyor, ormanlar yanıyor, market fiyatları uçuyor. Herkes “Bir şeyler yapılır” diyor.', kart: 'Haberler gerçek: bugün de rekor sıcaklıklar, kuraklık ve orman yangınları yaşanıyor.' },
      { img: 'hikaye_3', baslik: '2030 · Uyarı', metin: 'Bilim kurulu açıklıyor: aşırı sıcaklar en az on yıl her yaz geri dönecek. Gündüz dışarıda kalmak ölümcül olabilir. Şehir paniğe kapılıyor; marketlerde izdiham başlıyor.', kart: 'Nem ve sıcaklık birlikte çok yükselince vücut terleyerek serinleyemez (ıslak termometre sıcaklığı).' }
    ],
    slayt2: [
      { img: 'hikaye_5', baslik: 'Sığınak yılları', metin: 'Dedenin sığınağında yıllar geçiyor. Günlük sayfaları, radyodan gelen kırık haberler… Kötü haberlerin yanında iyileri de var: bazı topluluklar uyum sağlıyor, rüzgâr ve güneşe geçiyor. Dedenin defteri tek rehberin.' },
      { img: 'hikaye_6', baslik: '2040 · Yüzeye çıkış', metin: 'Sığınaktaki kaynaklar tükeniyor; sıcak dönem hafifliyor. Kapak yıllar sonra açılıyor. Mahalle ıssız ve kurak… ama yerde tek bir yeşil filiz var. Dengeyi biz bozduk; şimdi onarma zamanı.' }
    ],
    nasil: [
      ['Amaç', 'Köyü ayakta tut, doğayı onar. Düşman yok; tek zorluk iklim ve doğa. Köyde kimse kalmayınca oyun biter.'],
      ['Kontroller', 'Sol tık: seç. Sağ tık: emir ver (kes, topla, yağmala, git, balık tut…). WASD/oklar ya da sürükleme: kamera. Tekerlek: zoom. Boşluk: duraklat. 1/2/4: hız. B: inşa.'],
      ['Köylüler', 'Her yetişkine bir görev ver; emir yoksa görevini kendisi yapar. Yemek, su, ısı ve sağlığı takip et.'],
      ['İklim', 'Isı dalgası, kuraklık, yangın, sel, kar fırtınası gelir. Uyarılara hazırlan. Ağaç dik, yenilenebilir enerjiye geç, küresel sıcaklığı yavaşlat.'],
      ['Bilgi', 'Soru kartlarını cevapla, harabelerden kitap bul. Her kart gerçek bir bilimsel kaynağa dayanır.']
    ]
  };

  function ekran(bg, html) {
    var e = $('ekran');
    e.style.display = 'block';
    e.style.backgroundImage = bg ? 'url("karakterler/' + bg + '.png")' : 'none';
    e.style.backgroundColor = '#0b1015';
    e.innerHTML = html;
  }
  function ekranKapat() { $('ekran').style.display = 'none'; }
  function yaziDurdur() { if (yazi) { clearInterval(yazi); yazi = null; } }

  function init() {
    A.hepsi();
    A.onYukle(['kapak', 'hikaye_1', 'hikaye_2', 'hikaye_3', 'hikaye_4', 'hikaye_5', 'hikaye_6', 'hikaye_son', 'kahraman_erkek', 'kahraman_kadin']);
  }

  function anaMenu() {
    yaziDurdur(); UI.goster(false);
    var h = '<div class="orta"><img src="logo/son_sans_logo.png" alt="' + U.esc(D.BASLIK) + '" style="width:300px;max-width:80%;image-rendering:pixelated;display:block;margin:0 auto 6px" onerror="this.style.display=&quot;none&quot;"><div class="alt">İklim hayatta kalma ve köy kurma · Kestanelik, 2040</div><div class="alt" style="font-size:14px;margin-top:-8px">GameUP Türkiye Oyun Hackathonu · COP31 odak alanları: enerji, gıda, dirençli şehirler, okyanus, eğitim, sıfır atık</div>';
    h += '<button class="b ana" id="mYeni">Yeni oyun</button>';
    if (Kayit.enYeni()) h += '<button class="b" id="mDevam">Devam et</button>';
    h += '<button class="b" id="mDosya">Kayıt dosyası yükle</button><button class="b" id="mNasil">Nasıl oynanır</button><button class="b" id="mFrag">🎬 Fragman</button><button class="b" id="mHak">Hakkında</button></div>';
    ekran('kapak', h);
    $('mYeni').onclick = yeniOyunForm;
    if ($('mDevam')) $('mDevam').onclick = function () { if (Kayit.yukle(Kayit.enYeni())) Main.oyunaGir(); else UI.toast('Kayıt yüklenemedi.', 'kotu'); };
    $('mDosya').onclick = function () { $('dosya').click(); };
    $('mNasil').onclick = nasilOynanir;
    $('mHak').onclick = hakkinda;
    $('mFrag').onclick = function () { fragman(anaMenu); };
  }

  function nasilOynanir() {
    var h = '<h2>Nasıl oynanır</h2>';
    METIN.nasil.forEach(function (a) { h += '<p><b>' + a[0] + ':</b> ' + a[1] + '</p>'; });
    h += '<button class="ana" onclick="modalKapatGlobal()">Tamam</button>';
    UI.modalGoster(h);
  }
  function hakkinda() {
    var h = '<h2>Hakkında</h2><p>GameUP Türkiye Oyun Hackathonu 2026 için geliştirilen demo. Tema: iklim değişikliği (COP31 odak alanları: yenilenebilir enerji, iklim dirençli şehirler, gıda güvenliği, okyanuslar, eğitim, sıfır atık, sağlık).</p>';
    h += '<p><b>Oyun tasarımı ve yazılım:</b> Muhammed Can Harmanşah<br><b>Karakter tasarımı:</b> Elif Pınar</p><p>Görseller yapay zekâ araçlarıyla üretilmiştir.</p>';
    h += '<p class="kaynak">Kaynaklar: IPCC AR6, MedECC, Lancet Countdown 2025, WEF Küresel Riskler 2026, Andre vd. 2024 (Nature Climate Change), FAO, UNEP, WHO, IEA, IRENA, AFAD, BM Early Warnings for All, COP31 Başkanlığı.</p>';
    h += '<p class="gri" style="font-size:12px">Bu bir tahmin değil, “hiçbir şey yapılmasaydı” kurgusudur. Tek bir köyün küresel iklimi değiştiremeyeceği, 2°C\'nin gerçekte bir şalter olmadığı açıktır; oyun bunları basitleştirir.</p>';
    h += '<button class="ana" onclick="modalKapatGlobal()">Tamam</button>';
    UI.modalGoster(h);
  }

  function yeniOyunForm() {
    var sec = { cins: 'k', zor: 'furtina' };
    var h = '<div class="orta form"><h1>Yeni oyun</h1><div class="alt">Sığınaktan çıkan ilk kişi sensin</div>';
    h += '<label>Adın</label><input type="text" id="fAd" maxlength="14" value="Elif">';
    h += '<label>Cinsiyet</label><div class="secenek"><button data-c="k" class="on">Kadın</button><button data-c="e">Erkek</button></div>';
    h += '<label>Zorluk</label><div class="secenek"><button data-z="filiz">🌱 Filiz</button><button data-z="furtina" class="on">🌪️ Fırtına</button><button data-z="kiyamet">🔥 Kıyamet</button></div>';
    h += '<label><input type="checkbox" id="fEgitim" checked> Eğitimli başla</label>';
    h += '<button class="b ana" id="fBasla">Başla</button><button class="b" id="fGeri">Geri</button></div>';
    ekran('kapak', h);
    var cs = document.querySelectorAll('[data-c]'), zs = document.querySelectorAll('[data-z]');
    cs.forEach(function (b) { b.onclick = function () { sec.cins = b.getAttribute('data-c'); cs.forEach(function (x) { x.className = x === b ? 'on' : ''; }); var a = $('fAd'); if (a.value === 'Elif' || a.value === 'Can') a.value = sec.cins === 'k' ? 'Elif' : 'Can'; }; });
    zs.forEach(function (b) { b.onclick = function () { sec.zor = b.getAttribute('data-z'); zs.forEach(function (x) { x.className = x === b ? 'on' : ''; }); }; });
    $('fGeri').onclick = anaMenu;
    $('fBasla').onclick = function () {
      var ad = $('fAd').value.trim() || 'Elif';
      acilisNotu({ ad: ad, cins: sec.cins, zorluk: sec.zor, egitim: $('fEgitim').checked });
    };
  }

  function acilisNotu(opt) {
    ekran('hikaye_1', '<div class="orta"><h2 style="color:#ff9f43;margin-bottom:10px">Bir not</h2><p style="line-height:1.6;margin-bottom:14px">' + U.esc(METIN.acilis) + '</p><button class="b ana" id="aDevam">Devam</button></div>');
    $('aDevam').onclick = function () { slaytlar(METIN.slayt1, 0, function () { izdiham(opt); }); };
  }

  function slaytlar(liste, i, bitir) {
    yaziDurdur();
    if (i >= liste.length) { bitir(); return; }
    var s = liste[i], tam = s.metin, n = 0;
    var h = '<button class="atla" id="sAtla">Atla ⏭</button><div class="hikaye"><h2>' + U.esc(s.baslik) + '</h2><p id="sMetin"></p>' + (s.kart ? '<div class="not" id="sKart" style="display:none">💡 ' + U.esc(s.kart) + '</div>' : '') + '<div class="not">Devam etmek için tıkla</div></div>';
    ekran(s.img, h);
    var p = $('sMetin');
    yazi = setInterval(function () { n += 2; p.textContent = tam.substr(0, n); if (n >= tam.length) { yaziDurdur(); if ($('sKart')) $('sKart').style.display = 'block'; } }, 22);
    $('ekran').onclick = function (e) {
      if (e.target.id === 'sAtla') { yaziDurdur(); $('ekran').onclick = null; bitir(); return; }
      if (yazi) { yaziDurdur(); p.textContent = tam; if ($('sKart')) $('sKart').style.display = 'block'; return; }
      $('ekran').onclick = null; slaytlar(liste, i + 1, bitir);
    };
  }

  // ---------- Market izdihamı mini oyunu ----------
  var URUN = [
    { id: 'su', ad: 'Su', w: 2, ik: 'ikon_temiz_su', b: { su: 12 } },
    { id: 'konserve', ad: 'Konserve', w: 2, ik: 'ikon_konserve', b: { konserve: 10 } },
    { id: 'tohum', ad: 'Tohum', w: 1, ik: 'ikon_tohum', b: { tohum: 6 } },
    { id: 'ilac', ad: 'İlk yardım', w: 1, ik: 'ikon_ilac', b: { ilac: 4 } },
    { id: 'pil', ad: 'Pil / akü', w: 1, ik: 'ikon_enerji', b: { metal: 6 } },
    { id: 'alet', ad: 'El aletleri', w: 2, ik: 'ikon_kazma', b: { odun: 15, tas: 6 } },
    { id: 'kumas', ad: 'Kumaş', w: 1, ik: 'ikon_kumas', b: { plastik: 5 } },
    { id: 'kitap', ad: 'Kitap', w: 1, ik: 'ikon_kitap', kitap: 1 },
    { id: 'yakit', ad: 'Yakıt', w: 2, ik: 'ikon_yakit', b: { yakit: 10 } }
  ];

  function izdiham(opt) {
    yaziDurdur();
    var raf = [], cap = 8, dolu = 0, torba = [], sure = 45, bitti = false, tim, kap;
    for (var i = 0; i < 12; i++) raf.push({ u: URUN[Math.floor(Math.random() * URUN.length)], var_: true });
    function ciz() {
      var h = '<div class="orta" style="max-width:640px"><h2 style="color:#ff9f43">Market izdihamı!</h2><p class="gri">Sığınağa götüreceklerini seç. Çanta: <b>' + dolu + '/' + cap + '</b> · Kalan süre: <b>' + sure + '</b> sn. Raflar hızla boşalıyor!</p><div class="raf">';
      raf.forEach(function (r, ix) { h += r.var_ ? '<button data-r="' + ix + '"><img src="karakterler/' + r.u.ik + '.png" onerror="this.style.visibility=\'hidden\'">' + r.u.ad + '<br><small>(' + r.u.w + ' birim)</small></button>' : '<button class="bos">-</button>'; });
      h += '</div><p style="font-size:13px">Çanta: ' + (torba.length ? torba.map(function (t) { return t.ad; }).join(', ') : 'boş') + '</p><button class="b ana" id="iBitir">Sığınağa in</button></div>';
      ekran('hikaye_4', h);
      document.querySelectorAll('[data-r]').forEach(function (b) {
        b.onclick = function () {
          var r = raf[+b.getAttribute('data-r')];
          if (!r.var_) return;
          if (dolu + r.u.w > cap) { UI.toast('Çanta dolu!', 'uyari'); return; }
          r.var_ = false; dolu += r.u.w; torba.push(r.u); ciz();
        };
      });
      $('iBitir').onclick = bitir;
    }
    function bitir() {
      if (bitti) return; bitti = true; clearInterval(tim); clearInterval(kap);
      var bonus = {}, kitaplar = [];
      torba.forEach(function (u) {
        if (u.b) for (var k in u.b) bonus[k] = (bonus[k] || 0) + u.b[k];
        if (u.kitap) kitaplar.push(['ziraat', 'elektrik', 'su'][Math.floor(Math.random() * 3)]);
      });
      if (kitaplar.length) bonus.kitaplar = kitaplar;
      opt.bonus = bonus;
      slaytlar(METIN.slayt2, 0, function () { baslat(opt); });
    }
    tim = setInterval(function () { sure--; if (sure <= 0) bitir(); else ciz(); }, 1000);
    kap = setInterval(function () {
      var kal = raf.filter(function (r) { return r.var_; });
      if (kal.length > 2) { kal[Math.floor(Math.random() * kal.length)].var_ = false; ciz(); }
    }, 1700);
    ciz();
  }

  function baslat(opt) {
    yaziDurdur();
    S.yeniOyun(opt);
    Main.oyunaGir();
    var b = opt.bonus || {};
    UI.toast('2040, bahar. Sığınaktan çıktın. Yeşil bir filiz var.', 'iyi');
    if (G.harita) UI.toast('Harita: ' + G.harita.ad, 'bilgi');
    if (b.kitaplar && b.kitaplar.length) UI.toast('Çantandaki kitaplardan öğrendiklerin: ' + b.kitaplar.map(function (k) { return D.KITAP[k].ad; }).join(', '), 'iyi');
  }

  // ---------- Oyun sonu ----------
  function oyunSonu() {
    UI.goster(false);
    var st = G.istat, gun = S.gun(), yil = Math.floor(gun / D.YIL_GUN), g = gun % D.YIL_GUN;
    var top = st.uretYen + st.uretDizel, oran = top > 0 ? Math.round(st.uretYen / top * 100) + '%' : '—';
    var h = '<div class="orta" style="max-width:640px;max-height:92vh;overflow:auto"><h1>Köyde kimse kalmadı</h1><div class="alt">Ama hikâye burada bitmek zorunda değil.</div>';
    h += '<p style="text-align:left;line-height:1.7">⏳ Dayanılan süre: <b>' + yil + ' yıl ' + g + ' gün</b><br>👥 En yüksek nüfus: <b>' + st.enNufus + '</b><br>🌳 Dikilen fidan: <b>' + st.fidan + '</b><br>🌾 Hasat: <b>' + st.hasat + '</b><br>⚡ Yenilenebilir enerji oranı: <b>' + oran + '</b><br>🤝 Köye alınan insan: <b>' + st.kurtarilan + '</b><br>🌍 Küresel sıcaklık: <b>' + U.f2(G.kuresel) + '°C</b></p>';
    if (st.olumler.length) h += '<p class="gri" style="text-align:left;font-size:12px">Kaybedilenler: ' + st.olumler.map(function (o) { return U.esc(o.ad) + ' (' + o.neden + ')'; }).join(', ') + '</p>';
    var kr = S.karne(), ort = 0;
    h += '<div style="text-align:left;margin:10px 0"><b style="color:#ff9f43">İklim karnen</b>';
    kr.forEach(function (k) { ort += k.p; h += '<div style="font-size:14px;margin-top:4px">' + k.em + ' ' + k.ad + ' <span style="float:right">' + Math.round(k.p) + '</span></div><div class="bar"><i style="width:' + k.p + '%;background:' + (k.p >= 66 ? '#7bd36b' : (k.p >= 33 ? '#ffd166' : '#ff5e5e')) + '"></i></div>'; });
    h += '<p style="margin-top:6px">Genel puan: <b>' + Math.round(ort / kr.length) + '/100</b></p></div>';
    h += '<p style="margin:12px 0;line-height:1.6">Bu oyundaki her çözüm — rüzgâr enerjisi, yağmur suyu toplama, kompost, erken uyarı, ağaçlandırma — bugün var. <b>2040\'ı beklemek zorunda değiliz.</b></p>';
    h += '<div style="text-align:left;font-size:13px"><b style="color:#ff9f43">Bugün yapabileceklerin</b><ul style="margin:6px 0 10px 18px">' + D.BUGUN.map(function (x) { return '<li>' + U.esc(x) + '</li>'; }).join('') + '</ul></div>';
    h += '<button class="b" id="sFrag">🎬 Bitiş fragmanı</button><button class="b ana" id="sTekrar">Tekrar dene</button><button class="b" id="sAna">Ana menü</button></div>';
    ekran('hikaye_son', h);
    $('sTekrar').onclick = yeniOyunForm; $('sAna').onclick = anaMenu;
    $('sFrag').onclick = function () { fragman(oyunSonu); };
  }

  // ---------- Bitiş fragmanı ----------
  var fragZ = [];
  function fragDurdur() { fragZ.forEach(clearTimeout); fragZ = []; }
  function fragman(donus) {
    fragDurdur(); yaziDurdur(); UI.goster(false);
    var kareler = [
      { img: 'kapak', ms: 5200, h: '<h1>SON ŞANS</h1><div class="cum">Bu bir tahmin değil.<br>“Hiçbir şey yapılmasaydı” kurgusu.</div>' },
      { img: 'hikaye_6', ms: 5200, h: '<div class="rol">2040</div><div class="cum">Sığınaktan çıktın.<br>Yerde tek bir yeşil filiz var.</div>' },
      { img: 'hikaye_son', ms: 5600, h: '<div class="rol">AMA HER ÇÖZÜM BUGÜN VAR</div><div class="cum">Rüzgâr · Güneş · Ağaç · Su · Kompost · Erken uyarı</div><div class="cum" style="font-size:36px;color:#ff9f43">2040\'ı beklemek zorunda değiliz.</div>' },
      { img: null, ms: 4800, h: '<div class="rol">OYUN TASARIMI VE YAZILIM</div><div class="ad">Muhammed Can Harmanşah</div>' },
      { img: null, ms: 4800, h: '<div class="rol">KARAKTER TASARIMI</div><div class="ad">Elif Pınar</div>' },
      { img: null, ms: 4800, h: '<div class="rol">GAMEUP TÜRKİYE OYUN HACKATHONU 2026</div><div class="cum">COP31 odak alanları:<br>enerji · gıda · dirençli şehirler · okyanus · eğitim · sıfır atık</div>' },
      { img: 'kapak', ms: 0, son: 1, h: '<h1>SON ŞANS</h1><div class="cum">Köyü sen kurtar.</div><div class="btnler"><button class="b ana" id="fAna" style="width:auto;padding:12px 26px">Ana menü</button><button class="b" id="fYeni" style="width:auto;padding:12px 26px">Yeni oyun</button></div>' }
    ];
    var cur = 0;
    function goster(i) {
      cur = i;
      var k = kareler[i];
      ekran(k.img, '<div class="frag">' + k.h + (k.son ? '' : '<div class="atlaipucu">Atlamak için tıkla</div>') + '</div>');
      if (k.son) {
        $('fAna').onclick = function (e) { e.stopPropagation(); fragDurdur(); $('ekran').onclick = null; anaMenu(); };
        $('fYeni').onclick = function (e) { e.stopPropagation(); fragDurdur(); $('ekran').onclick = null; yeniOyunForm(); };
        $('ekran').onclick = null;
        return;
      }
      fragZ.push(setTimeout(function () { goster(i + 1); }, k.ms));
    }
    goster(0);
    $('ekran').onclick = function (e) {
      if (e.target.closest && e.target.closest('button')) return;
      fragDurdur(); goster(Math.min(cur + 1, kareler.length - 1));
    };
  }

  return { fragman: fragman, init: init, anaMenu: anaMenu, ekranKapat: ekranKapat, oyunSonu: oyunSonu, nasilOynanir: nasilOynanir, METIN: METIN };
})();
