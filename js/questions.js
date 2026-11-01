// Köylü soruları: karar kartları. e = etki, s = sonuç metni, p = başarı olasılığı (yoksa kesin)
var QUESTIONS = [
  { id: 'yamac_agac', soru: 'Odun azaldı. Köyün üstündeki yamaçta sık ağaçlar var; hepsini kesip bir kerede stok yapalım mı?', k: 'IPCC AR6',
    bilgi: 'Ormanlar karbon depolar, toprağı tutar ve yerel sıcaklığı düşürür. Seçici kesim ve yeniden ağaçlandırma, toptan kesime göre çok daha dirençlidir.',
    sec: [
      { t: 'Hepsini kes', e: { odun: 40, doga: -8, moral: -1 }, s: 'Bol odun geldi ama yamaç çıplak kaldı; toprak kaymaya açık.' },
      { t: 'Sadece kuru dalları topla', e: { odun: 10, doga: 0 }, s: 'Az ama zararsız bir odun toplandı.' },
      { t: 'Kesilen her ağaç yerine iki fidan dik', e: { odun: 18, doga: 4, moral: 1 }, s: 'Yamaç hem odun hem umut verdi.' }] },
  { id: 'fidan_gunu', soru: 'Çocuklarla bir fidan dikme günü yapalım mı? Bir günlük iş kaybederiz ama…', k: 'Avrupa Çevre Ajansı',
    bilgi: 'Ağaçlar gölge verir, kentsel ısıyı birkaç derece düşürür ve toprağı tutar. Topluluk çalışmaları aidiyet duygusunu da artırır.',
    sec: [
      { t: 'Evet, herkes katılsın', e: { doga: 5, moral: 5, odun: -5 }, s: 'Çocuklar çok eğlendi, köy yeşillendi.' },
      { t: 'Şimdi değil, iş çok', e: { moral: -1 }, s: 'İş devam etti ama içinizde bir burukluk kaldı.' }] },
  { id: 'dere_suyu', soru: 'Çok susadık. Dere suyunu kaynatmadan içelim mi? Odun da az.', k: 'WHO',
    bilgi: 'Kirli su ishal gibi hastalıkların başlıca nedenidir. Kaynatmak ya da filtrelemek riski büyük ölçüde azaltır.',
    sec: [
      { t: 'İçin, vakit yok', e: { su: 10, hasta: 1 }, s: 'Susuzluk geçti ama biri hasta oldu.' },
      { t: 'Önce kaynatın', e: { su: 10, odun: -4 }, s: 'Odun harcandı ama su temiz.' },
      { t: 'Kum-kömür filtresinden geçirin', e: { su: 8, plastik: -2 }, s: 'Basit filtre işe yaradı.' }] },
  { id: 'yagmur_kova', soru: 'Bulutlar toplanıyor. Bütün kova ve leğenleri dışarı çıkaralım mı?', ms: [0, 2, 3], k: 'UNEP',
    bilgi: 'Yağmur suyu hasadı, kurak dönemlerde su güvenliğini artıran ucuz ve eski bir yöntemdir.',
    sec: [
      { t: 'Evet', e: { su: 12, moral: 1 }, s: 'Yağmur suyundan epey biriktirdiniz.' },
      { t: 'Uğraşmayalım', e: {}, s: 'Yağmur yağdı, su toprağa gitti.' }] },
  { id: 'su_tasarruf', soru: 'Yaz çok kurak geçiyor. Yıkanma ve çamaşır suyunu yarıya indirelim mi?', ms: [1, 2], k: 'FAO',
    bilgi: 'Gri su (bulaşık, çamaşır suyu) tarla sulamada yeniden kullanılabilir; tatlı su kaynakları azalırken bu önemli bir tasarruftur.',
    sec: [
      { t: 'Yarıya indir', e: { su: 8, moral: -2 }, s: 'Su kaldı ama herkes biraz huysuz.' },
      { t: 'Kullanılan suyu tarlaya ver (gri su)', e: { su: 5, moral: 1 }, s: 'Atık su ikinci bir hayat buldu.' },
      { t: 'Değiştirme', e: { su: -6 }, s: 'Su stoğu hızla azaldı.' }] },
  { id: 'deniz_suyu', soru: 'Deniz bu kadar yakın, neden deniz suyu içmiyoruz?', k: 'NOAA',
    bilgi: 'Tuzlu su içmek vücudu daha da susuz bırakır; böbrekler tuzu atmak için fazladan su harcar.',
    sec: [
      { t: 'Tuzlu su vücudu daha da susuz bırakır, açıkla', e: { moral: 2 }, s: 'Çocuklar ve köylüler öğrendi.' },
      { t: 'Bir dene bakalım', e: { hasta: 1, moral: -1 }, s: 'Deneyen kişi daha kötü oldu.' }] },
  { id: 'tohum_ye', soru: 'Yiyecek azaldı. Ekmek için ayırdığımız tohumları yiyelim mi?', k: 'Crop Trust',
    bilgi: 'Tohum saklamak, yerel çeşitlerin ve gıda güvenliğinin temelidir. Tohum bankaları bu yüzden kurulur.',
    sec: [
      { t: 'Yiyelim', e: { yemek: 8, tohum: -4, moral: -1 }, s: 'Bu gün karnınız doydu, ama yarın için ekecek az şey kaldı.' },
      { t: 'Hayır, tohum yarındır', e: { moral: -1 }, s: 'Aç yattınız ama geleceği korudunuz.' }] },
  { id: 'kuraklik_tohum', soru: 'Bu yıl kurak geçecek gibi. Tarlaya çok su isteyen domates mi ekelim, az su isteyen nohut mu?', ms: [0, 1], k: 'FAO',
    bilgi: 'Kuraklığa dayanıklı ekinler (nohut gibi) su kıtlığında gıda güvenliğini korur. Çeşit çeşitlendirme riski azaltır.',
    sec: [
      { t: 'Nohut', e: { tohum: 2, doga: 1 }, s: 'Az suyla yetişen güvenli bir tercih.' },
      { t: 'Domates (çok verir)', e: { yemek: 5, su: -8 }, s: 'Verim yüksek ama su harcandı.' }] },
  { id: 'yemek_artik', soru: 'Yemek artıkları ne olsun?', k: 'FAO, UNEP',
    bilgi: 'Gıda atıkları çöpte metan salar. Kompost hem metanı azaltır hem toprağı besler.',
    sec: [
      { t: 'Komposta', e: { doga: 2, tohum: 1 }, s: 'Toprak zenginleşti.' },
      { t: 'Hayvanlara', e: { moral: 1 }, s: 'Sokak hayvanları sevindi.' },
      { t: 'Çöpe at', e: { doga: -1 }, s: 'Koku yayıldı, atık arttı.' }] },
  { id: 'hasat_senlik', soru: 'Hasat iyi geçti, şenlik yapalım mı?', k: 'UNDRR',
    bilgi: 'Topluluk bağları, afetlere dayanıklılığın en önemli unsurlarından biridir. Birlikte sevinmek de uyumun parçasıdır.',
    sec: [
      { t: 'Şenlik!', e: { yemek: -8, moral: 10 }, s: 'Bir akşam herkes güldü.' },
      { t: 'Yiyeceği saklayalım', e: { moral: -2 }, s: 'Güvenli ama sessiz bir akşam oldu.' }] },
  { id: 'et_tuketim', soru: 'Bir avcı bol hayvan olduğunu söylüyor. Her gün et mi yiyelim, haftada bir mi?', k: 'IPCC AR6',
    bilgi: 'Bitki ağırlıklı beslenme, kişi başına daha az sera gazı ve daha az arazi/su kullanımı demektir.',
    sec: [
      { t: 'Her gün', e: { yemek: 6, doga: -2, moral: 2 }, s: 'Karınlar doydu ama av baskısı arttı.' },
      { t: 'Haftada bir, bitki ağırlıklı', e: { yemek: 2, doga: 1 }, s: 'Dengeli bir seçim.' }] },
  { id: 'kiyi_cop', soru: 'Kıyıya yine plastik birikmiş. Bir gün kıyı temizliği yapalım mı?', k: 'UNEP',
    bilgi: 'Plastikler denizde parçalanıp mikroplastiğe dönüşür ve besin zincirine girer. Kıyı temizliği hem doğa hem geri dönüşüm için kazançtır.',
    sec: [
      { t: 'Yapalım', e: { plastik: 8, doga: 3, moral: 2 }, s: 'Kıyı tertemiz oldu, plastik de işe yarayacak.' },
      { t: 'Başka işlerimiz var', e: { doga: -1 }, s: 'Kıyı kirli kaldı.' }] },
  { id: 'dizel_mi', soru: 'Eski jeneratörde biraz yakıt kaldı. Bitene kadar çalıştıralım mı, yoksa acil durumlara mı saklayalım?', k: 'IPCC AR6, Climate Watch',
    bilgi: 'Fosil yakıt yakmak sera gazı ve hava kirliliği demektir. Yenilenebilir enerji ile birleşen acil yedekler dengeli bir geçiş sağlar.',
    sec: [
      { t: 'Acil durumlara sakla', e: { moral: 1, doga: 1 }, s: 'Yakıt güvence olarak kaldı.' },
      { t: 'Çalıştır', e: { yakit: -8, moral: 3, doga: -2 }, s: 'Bir süre ışık vardı, hava biraz kirlendi.' }] },
  { id: 'ruzgar_yer', soru: 'Rüzgâr gülünü tepeye mi kuralım, köyün içine mi? Tepe daha rüzgârlı ama fırtınada riskli.', k: 'IEA',
    bilgi: 'Rüzgâr hızı yükseklikle artar; türbin gücü rüzgâr hızının küpüyle orantılıdır. Ama yer seçimi güvenliği de gözetmelidir.',
    sec: [
      { t: 'Tepeye', e: { metal: -2, moral: 1 }, s: 'Verim yüksek, bakım biraz zor.' },
      { t: 'Köye yakın', e: { moral: 1 }, s: 'Bakımı kolay, verimi biraz düşük.' }] },
  { id: 'cati_rengi', soru: 'Evlerin çatısını beyaz kireçle boyayalım mı? Biraz malzeme gider.', ms: [0, 1], k: 'UNEP Cool Coalition',
    bilgi: 'Açık renkli “serin çatılar” güneş ışığını yansıtır, iç sıcaklığı ve enerji ihtiyacını belirgin biçimde düşürür.',
    sec: [
      { t: 'Boyayalım', e: { tas: -2, moral: 3 }, s: 'Evler serin kaldı.' },
      { t: 'Gerek yok', e: {}, s: 'Evler eskisi gibi kızgın.' }] },
  { id: 'ogle_mesai', soru: 'Öğle sıcağında çalışmak çok zor. Mesaiyi sabah erken ve akşama alalım mı?', ms: [1], k: 'Lancet Countdown 2025',
    bilgi: 'Aşırı sıcaklar iş gücü kaybına ve sıcakla ilişkili ölümlere yol açar. “Serin mesai” en ucuz ve etkili önlemlerdendir. Kurallar menüsünden de açabilirsin.',
    sec: [
      { t: 'Evet, sabah ve akşam çalışalım', e: { moral: 3 }, s: 'Köylüler öğleyi gölgede geçirecek (Kurallar menüsünden “Serin mesai” seçebilirsin).' },
      { t: 'Hayır, iş bitmeli', e: { hasta: 1, moral: -2 }, s: 'Biri sıcaktan bitap düştü.' }] },
  { id: 'sifali_ot', soru: 'İlaç azaldı. Yaşlıların bildiği şifalı otlarla mı idare edelim?', k: 'WHO',
    bilgi: 'Geleneksel bilgi tamamlayıcı olabilir ama ciddi hastalıkların yerini tutmaz. İkisini birlikte yürütmek en iyisidir.',
    sec: [
      { t: 'Ot toplayalım', e: { ilac: 2, moral: 2 }, s: 'Çaylar ve merhemler hazırlandı.' },
      { t: 'Kervandan ilaç almayı bekleyelim', e: { moral: -1 }, s: 'Beklemek zor oldu.' }] },
  { id: 'hasta_gelen', soru: 'Yeni gelenlerden biri öksürüyor. Herkesten ayrı mı yatsın?', k: 'WHO',
    bilgi: 'Bulaşıcı hastalıklarda karantina, toplulukları korumanın en eski ve en etkili yollarından biridir.',
    sec: [
      { t: 'Ayrı yatsın, karantina', e: { moral: 0, odun: -2 }, s: 'Bulaş riski azaldı.' },
      { t: 'Ayırmayalım, ayıp olur', e: { hasta: 2 }, s: 'Birkaç kişi daha hastalandı.' }] },
  { id: 'cocuk_okul', soru: 'Çocuklar çalışmak yerine her gün birkaç saat okusun mu?', k: 'COP31 Başkanlığı',
    bilgi: 'İklim eğitimi, gelecek nesillerin uyum kapasitesini artırır. Eğitim, en etkili iklim yatırımlarından biridir.',
    sec: [
      { t: 'Okusunlar', e: { moral: 4, doga: 1 }, s: 'Çocuklar öğrendi, köy umutlandı.' },
      { t: 'Önce iş', e: { odun: 6, moral: -2 }, s: 'İş ilerledi, ama çocuklar küstü.' }] },
  { id: 'tayin_karar', soru: 'Yiyecek dağıtımında nasıl bir kural olsun?', k: 'WFP',
    bilgi: 'Kıtlıkta adil dağıtım toplumsal güveni korur. Çocuk, yaşlı ve hastalar en savunmasız gruplardır.',
    sec: [
      { t: 'Herkese eşit', e: { moral: 2 }, s: 'Adil bulundu.' },
      { t: 'Çalışan daha çok alsın', e: { moral: -2, odun: 4 }, s: 'İş hızlandı ama sızlananlar oldu.' },
      { t: 'Önce çocuk, yaşlı ve hasta', e: { moral: 4 }, s: 'Köy birbirine daha çok güvendi.' }] },
  { id: 'yalan_haber', soru: 'Bir yolcu “iklim değişikliği uydurma, soğuk kış bunu kanıtlıyor” diyor; bazıları inandı.', k: 'WEF Küresel Riskler Raporu 2026',
    bilgi: 'Hava durumu günlük, iklim ise uzun dönemli ortalamadır. Tek bir soğuk kış, küresel ısınma trendini çürütmez. Yanlış bilgi, ciddi bir küresel risktir.',
    sec: [
      { t: 'Hava ile iklim farkını anlat', e: { moral: 3 }, s: 'Çoğu kişi ikna oldu.' },
      { t: 'Boş ver, tartışmayalım', e: { moral: -2 }, s: 'Köyde kuşku yayıldı.' }] },
  { id: 'sessiz_cogunluk', soru: 'Köylüler yenilenebilir enerji konusunda sessiz. Kimse “ben istiyorum” demiyor, herkes başkasının istemediğini sanıyor.', k: 'Andre vd., Nature Climate Change, 2024',
    bilgi: 'Araştırmalar, insanların yaklaşık %89\'unun iklim eylemini desteklediğini ama çoğunun başkalarının desteklemediğini sandığını gösteriyor. Bu “sessiz çoğunluk” etkisi, harekete geçmeyi geciktirir.',
    sec: [
      { t: 'Gizli oylama yap', e: { moral: 5, metal: 2 }, s: 'Çoğunluğun istediği ortaya çıktı, herkes rahatladı.' },
      { t: 'Konuyu kapat', e: { moral: -1 }, s: 'Sessizlik sürdü.' }] },
  { id: 'yasli_bilgi', soru: 'Yaşlılarımız eskiden kuraklıkta nasıl idare ettiklerini anlatmak istiyor. Bir akşam toplanalım mı?', k: 'IPCC AR6',
    bilgi: 'Yerel ve yerli bilgi, iklim uyumunun değerli bir kaynağıdır.',
    sec: [
      { t: 'Toplanalım', e: { moral: 4, tohum: 2 }, s: 'Eski yöntemlerden faydalı ipuçları çıktı.' },
      { t: 'Vakit yok', e: { moral: -1 }, s: 'Bu fırsat kaçtı.' }] },
  { id: 'kedi_besle', soru: 'Sokak kedileri depoya dadandı. Besleyelim mi, kovalım mı?', k: '—',
    bilgi: 'Kediler fare ve böceklerle mücadelede topluluğa yardımcı olur; moral için de iyidir.',
    sec: [
      { t: 'Besleyelim, fareleri kovarlar', e: { yemek: -2, moral: 4 }, s: 'Depo fareden kurtuldu, kediler mutlu.' },
      { t: 'Kovalım', e: { moral: -2 }, s: 'Çocuklar üzüldü.' }] },
  { id: 'cop_yak', soru: 'Çöp yığını büyüdü, kokuyor. Yakalım mı?', k: 'UNEP',
    bilgi: 'Çöp yakmak zehirli duman çıkarır ve karbon salar. Ayrıştırma ve geri dönüşüm atığı kaynağa çevirir (sıfır atık).',
    sec: [
      { t: 'Yak', e: { doga: -3, hasta: 1 }, s: 'Duman yüzünden biri öksürmeye başladı.' },
      { t: 'Ayrıştır, geri dönüştür', e: { plastik: 5, metal: 2, doga: 2 }, s: 'Çöpten işe yarar malzeme çıktı.' }] },
  { id: 'tamir_et', soru: 'Atölyede bir alet kırıldı. Yenisini mi yapalım, tamir mi?', k: 'Ellen MacArthur Vakfı',
    bilgi: 'Tamir ve yeniden kullanım, kaynak ve karbon tasarrufu sağlar. Döngüsel ekonominin temel adımıdır.',
    sec: [
      { t: 'Tamir et', e: { metal: 1, doga: 1, moral: 1 }, s: 'Alet yeniden işe yaradı.' },
      { t: 'Yenisini yap', e: { metal: -3 }, s: 'Metal harcandı.' }] },
  { id: 'deprem_hazirlik', soru: 'İstanbul\'da büyük deprem riski hep var. Evleri güçlendirmeye öncelik verelim mi?', k: 'AFAD',
    bilgi: 'Deprem iklim değişikliğinden kaynaklanmaz, ama İstanbul için en büyük afettir; hazırlık mantığı iklim afetleriyle aynıdır: önceden güçlendirmek, çanta hazırlamak, toplanma alanı belirlemek.',
    sec: [
      { t: 'Evet, malzeme ayır', e: { tas: -4, odun: -4, moral: 3 }, s: 'Evler daha sağlam, herkes daha huzurlu.' },
      { t: 'Önce yiyecek', e: { moral: 0 }, s: 'Yiyecek önceliği doğru, risk de duruyor.' }] },
  { id: 'cop_yok', soru: 'Köyde artık hemen hiç çöp yok; her şey ya tamir ya kompost ya geri dönüşüm. Bunu kutlayalım mı?', k: 'COP31 Başkanlığı', kosul: function () { return G.istat.yapi >= 4; },
    bilgi: 'Sıfır atık yaklaşımı hem kaynakları korur hem sera gazı azaltır. Küçük başarıları kutlamak sürdürülebilirliğe motivasyon verir.',
    sec: [
      { t: 'Kutlayalım', e: { moral: 6, doga: 2 }, s: 'Köy gururlandı.' },
      { t: 'İşe devam', e: { moral: 0 }, s: 'İş devam etti.' }] }
];
