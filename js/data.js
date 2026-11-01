var D = {
  BASLIK: 'İSİM YAKINDA',
  N: 64, T: 32, YIL0: 2040, MEVSIM_GUN: 7, YIL_GUN: 28,
  AFET_HIZ: 2.6, // afet sıklığı çarpanı (demo için hızlı felaketler)
  DK_SANIYE: 8, // 1x hızda 1 gerçek saniye = 8 oyun dakikası (1 gün ≈ 3 dk)
  MEVSIM: ['İlkbahar', 'Yaz', 'Sonbahar', 'Kış'],
  MEVSIM_IKON: ['ikon_ilkbahar', 'ikon_yaz', 'ikon_sonbahar', 'ikon_kis'],
  TABAN: [16, 30, 17, 4],
  YAGMUR: [0.32, 0.08, 0.42, 0.45],
  KURESEL0: 1.86, KURESEL_YIL: 0.045,

  ZORLUK: {
    filiz:   { ad: 'Filiz',   ikon: '🌱', kay: 1.6, ihtiyac: 0.7, afet: 0.55, hastalik: 0.6, habersiz: 0 },
    furtina: { ad: 'Fırtına', ikon: '🌪️', kay: 1,   ihtiyac: 1,   afet: 1,    hastalik: 1,   habersiz: 0.10 },
    kiyamet: { ad: 'Kıyamet', ikon: '🔥', kay: 0.6, ihtiyac: 1.3, afet: 1.6,  hastalik: 1.4, habersiz: 0.35 }
  },

  // Gösterilen kaynaklar
  KAYNAK: {
    yemek:   { ad: 'Yemek',     ikon: 'ikon_yemek',     em: '🍲' },
    konserve:{ ad: 'Konserve',  ikon: 'ikon_konserve',  em: '🥫' },
    su:      { ad: 'Temiz su',  ikon: 'ikon_temiz_su',  em: '💧' },
    kirli:   { ad: 'Kirli su',  ikon: 'ikon_kirli_su',  em: '🟤' },
    odun:    { ad: 'Odun',      ikon: 'ikon_odun',      em: '🪵' },
    tas:     { ad: 'Taş',       ikon: 'ikon_tas',       em: '🪨' },
    metal:   { ad: 'Metal',     ikon: 'ikon_metal',     em: '🔩' },
    plastik: { ad: 'Plastik',   ikon: 'ikon_plastik',   em: '♻️' },
    tohum:   { ad: 'Tohum',     ikon: 'ikon_tohum',     em: '🌰' },
    yakit:   { ad: 'Yakıt',     ikon: 'ikon_yakit',     em: '⛽' },
    ilac:    { ad: 'İlaç',      ikon: 'ikon_ilac',      em: '💊' }
  },

  // Nesne türleri: s = sprite, w/h = ayak izi (karo), sw/sh = sprite piksel boyu
  NESNE: {
    agac:     { s: 'bitki_agac', sh: 128, engel: 1 },
    cam:      { s: 'bitki_cam', sh: 128, engel: 1 },
    genc:     { s: 'bitki_agac_genc', sh: 128, engel: 1 },
    yanik:    { s: 'bitki_agac_yanik', sh: 128, engel: 1 },
    fidan:    { s: 'bitki_fidan' },
    kutuk:    { s: 'bitki_kutuk' },
    cali:     { s: 'bitki_cali' },
    bogurtlen:{ s: 'bitki_bogurtlen' },
    sifali:   { s: 'bitki_sifali' },
    kaya:     { s: 'nesne_kaya', engel: 1 },
    hurda:    { s: 'nesne_hurda' },
    cop:      { s: 'nesne_cop' },
    araba:    { s: 'nesne_araba' },
    kitap:    { s: 'nesne_kitap' },
    yikik_ev: { s: 'yapi_ev_yikik', w: 2, h: 2, sw: 128, sh: 128, engel: 1, ad: 'Yıkık ev' },
    market:   { s: 'yikinti_market', w: 3, h: 3, sw: 192, sh: 192, engel: 1, ad: 'Yıkık market' },
    okul:     { s: 'yikinti_okul', w: 2, h: 2, sw: 128, sh: 128, engel: 1, ad: 'Yıkık okul' },
    hastane:  { s: 'yikinti_hastane', w: 3, h: 3, sw: 192, sh: 192, engel: 1, ad: 'Yıkık hastane' },
    kutuphane:{ s: 'yikinti_kutuphane', w: 2, h: 2, sw: 128, sh: 128, engel: 1, ad: 'Yıkık kütüphane' }
  },

  // Bina kataloğu
  BINA: {
    golgelik:  { ad: 'Gölgelik', kat: 'Barınma', s: 'yapi_golgelik', mal: { odun: 6 }, sure: 60, ac: 'Çevresini 5°C serinletir.' },
    soba:      { ad: 'Soba', kat: 'Barınma', s: 'yapi_soba', mal: { odun: 4, tas: 4 }, sure: 60, ac: 'Soğukta çevresini 10°C ısıtır, odun harcar.' },
    ev:        { ad: 'Ev', kat: 'Barınma', s: 'yapi_ev', w: 2, h: 2, sw: 128, sh: 128, mal: { odun: 25, tas: 10, metal: 5 }, sure: 240, ac: '2 yatak, yalıtımlı. Boş yatak varsa yeni insanlar gelir.' },
    ocak:      { ad: 'Ocak', kat: 'Gıda', s: 'yapi_ocak', mal: { tas: 6, odun: 4 }, sure: 60, ac: 'Pişmiş yemek %25 daha doyurucu.' },
    tarla:     { ad: 'Tarla', kat: 'Gıda', s: 'yapi_tarla', zemin: 1, mal: { odun: 2 }, sure: 30, ac: 'Ekin yetiştirir. Sulanması gerekir.' },
    kompost:   { ad: 'Kompost', kat: 'Gıda', s: 'yapi_kompost', mal: { odun: 4 }, sure: 45, ac: 'Yakındaki tarlalar %30 hızlı büyür.' },
    yagmur:    { ad: 'Yağmur suyu deposu', kat: 'Su', s: 'yapi_yagmur_deposu', mal: { odun: 8, plastik: 4 }, sure: 90, ac: 'Yağmurda temiz su biriktirir, kapasite +30.' },
    filtre:    { ad: 'Basit filtre', kat: 'Su', s: 'yapi_filtre', mal: { plastik: 4, tas: 4 }, sure: 60, ac: 'Saatte 2 birim kirli suyu temizler.' },
    kuyu:      { ad: 'Kuyu', kat: 'Su', s: 'yapi_kuyu', mal: { tas: 10, metal: 4 }, sure: 120, kitap: 'su', ac: 'Saatte 1 temiz su (kuraklıkta yarısı), kapasite +20.' },
    aritma:    { ad: 'Su arıtma', kat: 'Su', s: 'yapi_su_aritma', mal: { metal: 6, plastik: 6 }, sure: 120, kitap: 'su', ac: 'Elektrikle saatte 8 kirli suyu temizler (1 kW).' },
    ruzgar:    { ad: 'Rüzgâr gülü', kat: 'Enerji', s: 'yapi_ruzgar_gulu', sh: 128, mal: { metal: 8, odun: 4 }, sure: 120, ac: 'Rüzgâra bağlı 0-3 kW.' },
    gunes:     { ad: 'Güneş paneli', kat: 'Enerji', s: 'yapi_gunes_paneli', mal: { metal: 6, plastik: 8 }, sure: 90, kitap: 'elektrik', ac: 'Gündüz 0-2,5 kW.' },
    batarya:   { ad: 'Batarya', kat: 'Enerji', s: 'yapi_batarya', mal: { metal: 6, plastik: 2 }, sure: 60, kitap: 'elektrik', ac: '12 kWh depolar.' },
    serinletici:{ ad: 'Serinletici', kat: 'Enerji', s: 'yapi_serinletici', mal: { metal: 4, plastik: 3 }, sure: 60, kitap: 'elektrik', ac: 'Elektrikle çevresini 8°C serinletir (0,5 kW).' },
    gozcu:     { ad: 'Gözcü kulesi', kat: 'Hazırlık', s: 'yapi_gozcu', sh: 128, mal: { odun: 12, tas: 6 }, sure: 120, kitap: 'insaat', ac: 'Geniş alanı açar, yangını erken görür.' }
  },
  BINA_KAT: ['Barınma', 'Gıda', 'Su', 'Enerji', 'Hazırlık'],

  // Başlangıçta kurulu yapılar için ek tanımlar
  OZEL_BINA: {
    siginak: { ad: 'Sığınak', s: 'yapi_siginak', w: 2, h: 2, sw: 128, sh: 128 },
    dizel:   { ad: 'Dizel jeneratör', s: 'yapi_dizel', w: 1, h: 1, sw: 64, sh: 64 },
    depo:    { ad: 'Depo', s: 'yapi_depo', w: 2, h: 2, sw: 128, sh: 128 }
  },

  EKIN: {
    nohut:   { ad: 'Nohut',   gun: 8, su: 0.5, verim: 7,  kis: 0.3, kitap: null, not: 'Kuraklığa dayanıklı' },
    bugday:  { ad: 'Buğday',  gun: 9, su: 0.8, verim: 9,  kis: 0.3, kitap: 'ziraat', not: 'Saman verir' },
    domates: { ad: 'Domates', gun: 7, su: 1.3, verim: 11, kis: 0,   kitap: 'ziraat', not: 'Çok su ister' },
    patates: { ad: 'Patates', gun: 9, su: 0.8, verim: 10, kis: 0.5, kitap: 'ziraat', not: '' },
    lahana:  { ad: 'Lahana',  gun: 8, su: 0.7, verim: 8,  kis: 1,   kitap: 'ziraat', not: 'Kış ürünü' }
  },

  KITAP: {
    ziraat:  { ad: 'Ziraat El Kitabı', ac: 'Buğday, domates, patates, lahana ekebilirsin.' },
    elektrik:{ ad: 'Elektrik El Kitabı', ac: 'Güneş paneli, batarya ve serinletici yapabilirsin.' },
    su:      { ad: 'Su Mühendisliği', ac: 'Kuyu ve su arıtma yapabilirsin.' },
    insaat:  { ad: 'İnşaat Tekniği', ac: 'Gözcü kulesi yapabilirsin.' },
    afet:    { ad: 'Afet Hazırlığı', ac: 'Güçlendirme daha etkili; afet uyarısı 1 gün erken gelir.' }
  },

  GOREV: {
    serbest:   { ad: 'Serbest',   em: '🧭' },
    toplayici: { ad: 'Toplayıcı', em: '🧺' },
    oduncu:    { ad: 'Oduncu',    em: '🪓' },
    tasci:     { ad: 'Taşçı',     em: '⛏️' },
    ciftci:    { ad: 'Çiftçi',    em: '🌾' },
    ormanci:   { ad: 'Ormancı',   em: '🌱' },
    balikci:   { ad: 'Balıkçı',   em: '🎣' },
    insaatci:  { ad: 'İnşaatçı',  em: '🔨' },
    sucu:      { ad: 'Sucu',      em: '🪣' },
    kasif:     { ad: 'Kâşif',     em: '🗺️' },
    doktor:    { ad: 'Doktor',    em: '🩺' },
    asci:      { ad: 'Aşçı',      em: '🍳' },
    ogretmen:  { ad: 'Öğretmen',  em: '📚' },
    muhendis:  { ad: 'Mühendis',  em: '📐' }
  },

  MESLEK: {
    ciftci:    { ad: 'Çiftçi',      rozet: 'rozet_ciftci',    gorev: 'ciftci' },
    balikci:   { ad: 'Balıkçı',     rozet: 'rozet_balikci',   gorev: 'balikci' },
    avci:      { ad: 'Avcı',        rozet: 'rozet_avci',      gorev: 'toplayici' },
    saglikci:  { ad: 'Sağlıkçı',    rozet: 'rozet_saglikci',  gorev: 'doktor' },
    muhendis:  { ad: 'Mühendis',    rozet: 'rozet_muhendis',  gorev: 'muhendis' },
    usta:      { ad: 'İnşaat ustası', rozet: 'rozet_usta',    gorev: 'insaatci' },
    ogretmen:  { ad: 'Öğretmen',    rozet: 'rozet_ogretmen',  gorev: 'ogretmen' },
    asci:      { ad: 'Aşçı',        rozet: 'rozet_asci',      gorev: 'asci' },
    coban:     { ad: 'Çoban',       rozet: 'rozet_coban',     gorev: 'oduncu' },
    ogrenci:   { ad: 'Öğrenci',     rozet: 'rozet_ogrenci',   gorev: 'toplayici' },
    emekli:    { ad: 'Emekli',      rozet: 'rozet_bilge',     gorev: 'ormanci' }
  },

  AD_E: ['Murat', 'Kemal', 'Hasan', 'Emre', 'Burak', 'Selim', 'Orhan', 'Yusuf', 'Barış', 'Cem', 'Tarık', 'Volkan', 'Ömer', 'Deniz', 'Kaan'],
  AD_K: ['Ayşe', 'Fatma', 'Zeynep', 'Elif', 'Selin', 'Derya', 'Hülya', 'Esra', 'Gül', 'Naz', 'Ceren', 'Büşra', 'Melek', 'Aslı', 'Sevgi'],
  AD_C: ['Efe', 'Defne', 'Mert', 'Ada', 'Can', 'Ela', 'Kerem', 'Su'],
  YER: ['Sarıyer', 'Beykoz', 'Eyüp', 'Kağıthane', 'Bahçeköy', 'Zekeriyaköy', 'Şile yolu'],

  // Afet tanımları: ms = mevsimler, p = günlük olasılık, uyari = gün, sure = [min,max] gün
  AFET: {
    isi:      { ad: 'Isı dalgası', ikon: 'ikon_sicak_dalgasi', em: '🔥', ms: [1], p: 0.09, uyari: 1, sure: [3, 5] },
    kuraklik: { ad: 'Kuraklık', ikon: 'ikon_kuraklik', em: '🏜️', ms: [1, 2], p: 0.05, uyari: 2, sure: [7, 11] },
    yangin:   { ad: 'Orman yangını', ikon: 'ikon_yangin', em: '🔥', ms: [1], p: 0.05, uyari: 0, sure: [1, 1] },
    sel:      { ad: 'Sağanak ve sel', ikon: 'ikon_sel', em: '🌊', ms: [0, 2], p: 0.07, uyari: 1, sure: [1, 2] },
    kar:      { ad: 'Kar fırtınası', ikon: 'ikon_kar', em: '❄️', ms: [3], p: 0.1, uyari: 2, sure: [2, 4] }
  },

  KART: {
    isi: { b: 'Isı dalgası', m: 'Sıcaklık ve nem birlikte yükselince vücut terleyerek serinleyemez (ıslak termometre sıcaklığı). Yaşlılar ve çocuklar en çok risk altındadır.', t: 'Tedbir: su, gölgelik, serinletici ve öğle saatlerinde serin mesai.', k: 'Lancet Countdown 2025' },
    kuraklik: { b: 'Kuraklık', m: 'İklim değişikliği yağış rejimini bozar. Akdeniz havzası dünya ortalamasından yaklaşık %20 hızlı ısınıyor; kuraklıklar uzuyor ve yoğunlaşıyor.', t: 'Tedbir: su deposu, kuraklığa dayanıklı ekin (nohut), ağaçlandırma.', k: 'IPCC AR6, MedECC' },
    yangin: { b: 'Orman yangını', m: 'Sıcak, kuru ve rüzgârlı hava yangın mevsimini uzatır. Duman solunum hastalıklarını artırır, yanan ağaçlar karbon salar.', t: 'Tedbir: su, ormanla köy arasında boşluk, gözcü kulesi.', k: 'FAO, IPCC AR6' },
    sel: { b: 'Ani sel', m: 'Isınan hava daha fazla nem taşır; kısa sürede çok yağmur düşer. Kurak, sert toprak suyu emmediği için sel kötüleşir. Dere kıyısı ve alçak alanlar risklidir.', t: 'Tedbir: güçlendirme, yüksek yere yapı, ağaçlandırma (toprağı tutar).', k: 'AFAD, IPCC AR6' },
    kar: { b: 'Kar fırtınası ve soğuk dalgası', m: 'İklim ısınırken de aşırı soğuklar olabilir; hava ile iklim farklıdır. Tek bir soğuk kış küresel ısınmayı çürütmez.', t: 'Tedbir: odun, soba, ev içinde toplanmak.', k: 'NOAA' },
    ikiderece: { b: '2°C eşiği aşıldı', m: 'Paris Anlaşması sıcaklık artışını 2°C\'nin belirgin altında, mümkünse 1,5°C\'de tutmayı hedefler. Oyunda 2°C bir şalter gibi çalışır; gerçekte risk adım adım büyür ve devrilme noktaları yaklaşır.', t: 'Yazlar sertleşti, afetler arttı, moral düştü.', k: 'Paris Anlaşması, IPCC AR6' },
    dizel: { b: 'Fosil yakıtın bedeli', m: 'Dizel jeneratör hızlı elektrik verir ama havayı kirletir ve sera gazı salar. Yenilenebilir enerji (rüzgâr, güneş) bugün birçok yerde en ucuz elektrik kaynağıdır.', t: 'Yakıt bitince rüzgâr gülü ve güneş paneline geç.', k: 'IEA, IRENA' },
    dikim: { b: 'Ağaçlandırma', m: 'Ağaçlar gölge verir, toprağı tutar, karbon depolar ve yerel iklimi yumuşatır. Tek bir köy küresel iklimi değiştiremez ama yerel afetleri hafifletebilir (ekosistem temelli uyum).', t: '', k: 'IPCC AR6, FAO' },
    cop: { b: 'Çöp yığınları ve iklim', m: 'Çöpler çürürken metan salar, yakılınca zehirli duman ve karbondioksit çıkar; plastikler denizde mikroplastiğe dönüşür. Atık, iklim krizinin sessiz ortaklarından biridir. Oyunda toplanmayan çöp doğa dengesini yavaş yavaş düşürür.', t: 'Çöpü topla: plastik kazanırsın, doğa iyileşir. Ayrıştır, tamir et, geri dönüştür (sıfır atık).', k: 'UNEP, IPCC AR6' },
    kirlisu: { b: 'Kirli su', m: 'Dere suyu mikrop taşıyabilir. Kaynatmak ya da filtrelemek ishal riskini düşürür. Seller kirli suyu daha da artırır.', t: 'Tedbir: filtre, arıtma, yağmur suyu.', k: 'WHO' }
  },

  BILGI: [
    ['Akdeniz havzası dünya ortalamasından yaklaşık %20 daha hızlı ısınıyor.', 'MedECC'],
    ['Küresel ısınmayla biriken fazla ısının yaklaşık %90\'ı okyanus tarafından emiliyor.', 'IPCC AR6'],
    ['İnsanların yaklaşık %89\'u iklim eylemini destekliyor; ama çoğu başkalarının desteklemediğini sanıyor ("sessiz çoğunluk").', 'Andre vd., Nature Climate Change, 2024'],
    ['Paris Anlaşması: sıcaklık artışını 2°C\'nin belirgin altında tutmak, mümkünse 1,5°C için çaba göstermek.', 'UNFCCC'],
    ['Rüzgâr ve güneş birçok ülkede yeni elektrik üretiminin en ucuz yolu.', 'IEA, IRENA'],
    ['Deprem iklim değişikliğinden kaynaklanmaz ama İstanbul için en büyük afettir; hazırlık mantığı aynıdır.', 'AFAD'],
    ['Gıda atıkları çöplükte metan salar; kompost bu emisyonu azaltır ve toprağı besler.', 'UNEP'],
    ['Açık renkli "serin çatılar" güneşi yansıtır ve iç sıcaklığı düşürür.', 'UNEP Cool Coalition'],
    ['Aşırı sıcaklar iş gücü kaybına ve sıcakla ilişkili ölümlere yol açar; serin mesai ve gölge hayat kurtarır.', 'Lancet Countdown 2025'],
    ['Ağaçlar gölge verir, toprağı tutar ve yerel sıcaklığı birkaç derece düşürebilir.', 'IPCC AR6, FAO'],
    ['Plastikler denizde mikroplastiğe dönüşür ve besin zincirine girer.', 'UNEP']
  ],

  BUGUN: [
    'Evinde rüzgâr ve güneş gibi yenilenebilir enerji kullanımını sor, mümkünse destekle.',
    'Su ve enerji tasarrufu yap; yağmur suyunu toplamak mümkünse bahçeni sula.',
    'Çöpünü ayrıştır, yiyecek israfını azalt, eşyaları tamir ederek kullan.',
    'Kısa mesafeleri yürü, bisiklet ya da toplu taşıma kullan.',
    'Bir ağaç dik ya da yakınındaki ağaçlandırma çalışmasına katıl.',
    'Sıcak havalarda yaşlı komşularını ve çocukları kontrol et, onlara su ve gölge sağla.',
    'Sessiz çoğunluğun parçası ol: iklim için bir adım atmak isteyenlerin çok olduğunu çevrene göster.'
  ]
};
