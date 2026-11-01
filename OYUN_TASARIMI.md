# OYUN TASARIM DOSYASI — GameUP Türkiye Oyun Hackathonu

> **Bu dosya kimin için?** CAN ve Claude Code için. Projeyle ilgili kararlaştırılmış ve henüz karar verilmemiş her şey burada. Claude Code'a bu dosyayı verip "Bu tasarıma göre devam et" demek yeterli olmalı.
>
> **Durum tarihi:** 1 Kasım 2026, 00:30 · **Oyunun adı:** henüz yok (`D.BASLIK = 'İSİM YAKINDA'`)

---

## 0. Hızlı özet

- **Ne:** Tek oyunculu, offline, tarayıcıda çalışan, tepeden bakılan (ilahi bakış) 2D bir **iklim hayatta kalma ve köy kurma** oyunu.
- **Nerede:** İstanbul'un kuzeyi; orman, Boğaz ve Karadeniz kıyısı arasında kurgusal **Kestanelik** mahallesi.
- **Hikâye:** 2026 normal hayat → 2026-2030 iklim işaretleri → 2030'da bilim insanları ölümcül sıcakların yıllarca süreceğini duyurur, market izdihamı yaşanır, karakter evinin altındaki sığınağa iner → **2040'ta yüzeye çıkar** ve köyü kurar.
- **Düşman yok.** Tek zorluk doğa: “Dengeyi biz bozduk, şimdi onarıyoruz.”
- **Oynanış:** Karaktere tıkla, “şuraya git, şunu topla, bunu inşa et” de. Emir yoksa herkes atandığı görevi kendisi yapar. Zaman gerçek zamanlı akar; duraklatılır, 1x/2x/4x hızlanır.
- **Bitiş:** Köyde kimse kalmayınca oyun biter ve mesaj gösterilir. Sabit bir sonu yok; oyun kaydedilip sonra devam edilebilir.
- **Ekip:** 2 kişi. CAN kod ve sunum, arkadaşı görseller (yapay zekâ ile). Kimin ne yaptığı sunumda yazılacak.
- **Dil:** Şimdilik yalnızca Türkçe. Reklam ya da gelir yok.
- **Yapay zekâ:** Oyunda şimdilik yok. Proje kabul alırsa ileride köylü diyaloglarına eklenecek.

---

## 1. Hackathon bilgileri (resmî belgelerden)

| Konu | Bilgi |
| --- | --- |
| Düzenleyen | HP, GameUP Türkiye Programı |
| Tarih | 30 Ekim - 1 Kasım 2026 |
| **Teslim** | **1 Kasım Pazar 23.59**: oyun tanıtım SUNUMU, WhatsApp'tan paylaşılacak form üzerinden. Paylaşılacak **sunum şablonu** kullanılmalı. |
| Seçim | Değerlendirme sonunda en iyi 10 oyun belirlenecek |
| Oyun şartı | İklim değişikliğine odaklı ve **demo aşamasında** |
| Katılım | Yayın ve webinarların **%60'ına** katılım gerekli, değerlendirmede dikkate alınıyor |
| 3. gün takvimi | Gün açılış yayını, mentorluk görüşmeleri (zorunlu değil), gün kapanış ve soru-cevap yayını, oyun tanıtım sunumu gönderimi |
| Kural | 3. kişi haklarına özen: görsel, ses ve müzikte telifli içerik yok |

**Değerlendirme kriterleri:** Odak tema · Takım/Motivasyon · Yaratıcılık · Özgünlük · Zaman yönetimi · Sunum · Etkili iletişim · Oyun tasarımı · Oynanabilirlik · Teknik işlevsellik

**Proje odak alanları (COP31):**
1. Yenilenebilir enerji ve sürdürülebilirlik
2. Karbon ayak izi ve bilinçli tüketim
3. İklim dirençli şehirler
4. Gıda güvenliği
5. Okyanuslar ve denizler
6. İklim değişikliği odağında eğitim
7. Sıfır atık

**İklim 101 webinarından kullanılacaklar:** Korku değil umut; “bir oyun, bir fikir”. Paris Anlaşması: 2°C'nin belirgin altı, 1,5°C için çaba. %89'luk “sessiz çoğunluk”. Atmosfer ortak mal ikilemi. Akdeniz dünya ortalamasından ~%20 hızlı ısınıyor. Fazla ısının ~%90'ı okyanusa gidiyor. Lancet Countdown 2025 ve WEF Küresel Riskler 2026 verileri. GameUP'ın 6 örnek fikri (Çöp Değil, Sıcak Şehir, Mavi Denge, Kuraklık Çiftliği, Şebeke, Kod Turuncu): hepsi bu oyunda tek sistemin parçası.

---

## 2. Kesinleşen kararlar

| # | Konu | Karar |
| --- | --- | --- |
| 1 | Motor | **Web (HTML5 Canvas + saf JavaScript)**. Kurulum yok, internetsiz çalışır, linkle paylaşılır. Godot yerine bu seçildi çünkü en hızlı ve en kararlısı. |
| 2 | Bakış | **Tepeden (ilahi bakış).** Karakterlere tıklanıp emir verilir. |
| 3 | Zaman | **Gerçek zamanlı**, duraklat (boşluk), hız 1x/2x/4x. 1 gerçek saniye = 1x'te 1 oyun dakikası × hız çarpanı (ayarlanabilir). |
| 4 | Görsel | Arkadaşın yapay zekâyla üreteceği PNG'ler. `karakterler/` klasöründen dosya adıyla yüklenir; olmayanın yerine kod şekil ya da emoji çizer. |
| 5 | Mekân | **İstanbul'un kuzeyi** (deprem bölgesi, tepeler, orman, Boğaz, Karadeniz) |
| 6 | Lider | **Lider yok.** Oyuncunun karakteri köyün ilk kişisi (turuncu atkılı). O ölse de oyun sürer; köyde kimse kalmayınca biter. |
| 7 | “Oksijen” barı | Adı **Hava** (hava kalitesi). İklim değişikliği oksijeni bitirmez ama duman, toz ve havasız ortam gerçek tehlike. |
| 8 | Deprem | Oyunda var, uyarısız ve nadir. Bilgi kartı: “Deprem iklim değişikliğinden kaynaklanmaz ama İstanbul için en büyük afet; hazırlık mantığı aynı.” |
| 9 | Takvim | 2026 başlangıç, 2026-2030 işaretler, 2030-2040 sığınak, **2040'ta yüzey** |
| 10 | Ölüm | Köyde kimse kalmayınca oyun biter |
| 11 | Ret ve olasılıklar | Kararların sonuçları olasılıklı (ör. %50 hastalık, %40 başarı) |
| 12 | “Doğa düşman” fikri | Hackathon ve COP31 konularına uyduğu sürece serbest. Mekaniği: **Doğa Dengesi** göstergesi. |
| 13 | Süre ve kayıt | Kaybedene kadar sürer. Elle kayıt + her gün sonunda otomatik kayıt; menüden “Devam et”. |
| 14 | Ana karakter | Oyuncunun kendisi: adını ve cinsiyetini kendisi seçer |
| 15 | Ad | Henüz yok, en son konacak |
| 16 | Dil | Yalnızca Türkçe |
| 17 | Ekip bilgisi | Sonra eklenecek (kim ne yaptı) |
| 18 | Zorluk adları | **Filiz** (kolay) · **Fırtına** (orta) · **Kıyamet** (zor) |
| 19 | Kitaplar | Dedenin Defteri yalnızca temel bilgileri verir. İleri teknoloji, harabelerdeki eski kitaplardan öğrenilir. |
| 20 | Yenilenebilir enerji | Oyunun ana enerji kaynağı. Dizel jeneratör sadece başta ve sınırlı, kirletir. |
| 21 | Afetler | Çoğunlukla iklimsel ve rastgele, mevsime bağlı. Yazın çok sıcak, kışın çok soğuk. |
| 22 | 2°C | Küresel sıcaklık göstergesi. 2°C aşılınca kalıcı sertleşme (aşağıda). |
| 23 | Diğer kasabalar | Radyoyla iletişim. Radyo bazen çalışır, bazen parazitlidir. |
| 24 | Ticaret | **Para yok, takas.** Kasabalardan kervanlar gelir. |
| 25 | Sorular | En az 50 köylü sorusu. Şu an **65** tane var. |
| 26 | Reklam, gelir | Yok |

---

## 3. Hikâye ve açılış akışı

**Ekran sırası:**
1. **Ana menü:** Yeni oyun · Devam et (kayıt varsa) · Nasıl oynanır · Hakkında (kaynaklar, ekip). Arka plan: `kapak.png`.
2. **Yeni oyun:** Ad, cinsiyet (kadın/erkek) ve zorluk (Filiz / Fırtına / Kıyamet) seçimi, ardından “Eğitimli başla” kutusu.
3. **Açılış notu:** “Bu bir tahmin değil, ‘hiçbir şey yapılmasaydı’ kurgusu. Ama içindeki her afet bugün gerçek.”
4. **Hikâye slaytları:** Her biri bir görsel ve kısa metin, tıklayarak ilerler, atlanabilir.
    - **2026, normal hayat** (`hikaye_1`): Kestanelik'te sıradan bir yaz. Televizyonda Antalya'daki COP31 haberi; karakter kanalı değiştirir.
    - **2026-2030, işaretler** (`hikaye_2`): Gazete manşetleri, her birinin altında gerçek bir veri: rekor sıcak yaz, barajlar %30'un altında, Marmara'da müsilaj, gıda fiyatları, orman yangınları.
    - **2030, uyarı** (`hikaye_3`): Bilim kurulu, aşırı sıcakların en az 10 yıl her yaz geri döneceğini, gündüz dışarıda kalmanın ölümcül olacağını duyurur. Bilgi kartı: nem ve sıcaklık birlikte çok yükselince vücut terleyerek serinleyemez (ıslak termometre sıcaklığı).
    - **İzdiham** (`hikaye_4`): Mini oyuna geçiş.
5. **Market izdihamı mini oyunu (oynanabilir):** 45-60 saniyede raflardan sığınağa götürülecekler seçilir. Çanta kapasitesi sınırlı (ör. 8 birim). Seçenekler: su, konserve, tohum, ilk yardım, pil/akü, el aletleri, kumaş, kitap, ilaç, yakıt. Bazı raflar boşalır (başkaları kapar). Seçimler 2040'taki başlangıç kaynaklarına bonus olarak eklenir. AFAD afet çantası mantığını öğretir.
6. **Sığınak yılları** (`hikaye_5`): Günlük sayfaları, radyo kırıntıları ve dedenin defteri; 2030'dan 2040'a zaman atlaması. Kötü haberlerin yanında iyi haberler de var: uyum sağlayan topluluklar.
7. **2040, yüzeye çıkış** (`hikaye_6`): Sığınaktaki kaynaklar bitiyor, sıcak dönem hafiflemiş. Kapak açılıyor; ıssız, kurak mahalle; yerde tek bir yeşil filiz.
8. **Oyun:** İlk 2-3 gün rehberli eğitim (eğitim seçiliyse), sonra serbest.

**Başlangıç durumu (kodda var):** Oyuncu + 2 köylü (Ayşe ve Murat, meslekleri rastgele), ev ve sığınak, eski dizel jeneratör, biraz konserve, su, tohum, odun, metal ve plastik (zorluğa göre çarpılır), çevrede birkaç hurda, çöp, ağaç ve kaya.

---

## 4. Harita

- **100 x 100 karo**, 1 karo = 32 birim (zoom'a göre ölçeklenir). Her oyunda rastgele tohumla yeniden üretilir.
- **Kuzeyde** Karadeniz kıyısı (deniz, sığ su, kum), **doğuda** Boğaz.
- **Kuzeybatıda** orman; ağaç, böğürtlen, şifalı bitki, yaban hayvanları.
- **Batıda** kayalık tepe: taş.
- **Kuzeybatıdan Boğaz'a** akan dere: tatlı (kirli) su, su değirmeni.
- **Doğu ve güneyde** terk edilmiş şehir: sokak ızgarası, asfalt, moloz, kaldırım; yıkık evler (yağmala, onar ya da sök), araba hurdaları (metal, akü), çöp ve hurda.
- **Özel kalıntılar:**
    - **Market:** konserve, su, plastik, tohum
    - **Kütüphane:** İnşaat, Ziraat, Elektrik ve Su kitapları
    - **Okul:** Afet ve Dikiş kitapları
    - **Hastane:** ilaç, kumaş ve Tıp kitabı
    - Bazı evlerde rastgele kitaplar
- **Güneybatı tarlalarında** sahipsiz inek, koyun, keçi, tavuk; şehirde sokak kedileri.
- **Alçak alanlar** (dere ve kıyı çevresi) selden etkilenir.
- **Keşif:** Başta yalnızca köy çevresi açık. Gerisi **bulutla kaplı**; köylüler yürüdükçe açılır. Kâşif görevi özellikle sınıra gider, gözcü kulesi geniş alanı açar.

---

## 5. Göstergeler

### Kişisel barlar (her insan)

| Bar | Düşüren | Yükselten | Kritikte |
| --- | --- | --- | --- |
| Açlık (yemek) | Zaman, ağır iş | Yemek; pişmiş yemek en doyurucu | Sağlık kaybı, ölüm |
| Susuzluk (su) | Zaman; sıcakta daha hızlı | Temiz su; kirli su ishal riski taşır | En hızlı ölüm |
| Isı (sıcak ↔ soğuk) | Hava sıcaklığı, gölgesizlik, öğle sıcağında çalışmak; kışın yalıtımsızlık | Gölge, ağaç, gölgelik, serinletici, ev içi; soba, ocak, kışlık giysi | Sıcak çarpması ya da hipotermi |
| Hava (kalite) | Yangın dumanı, dizel, kuraklıkta toz | Maske, temiz hava, uzaklık | Solunum hastalığı |
| Sağlık | Diğer barlar kritikse, hastalık, yaralanma | Dinlenme, uyku, tedavi, revir | 0'da ölüm |

### Köy göstergeleri

- **Moral (0-100):** Yiyecek çeşitliliği, yatak yeterliliği, kediler, radyo bağlantısı, doğa, son ölümler, tayın kuralı ve kararlar etkiler. 15'in altında insanlar köyü terk eder.
- **Doğa Dengesi (0-100, başta 30):** Ağaç sayısı, fidan, kompost, kıyı temizliği artırır. Ağaç kesmek, yangın, çöp yakmak, dizel ve aşırı av düşürür. Düşükse sel ve heyelan sertleşir, av azalır, harita kurak görünür. Yüksekse hayvanlar ve balık döner, harita yeşerir.
- **Küresel sıcaklık (başta 1,86°C):** Her yıl ~0,045°C artar. Temiz enerjiye geçen her kasaba artışı yavaşlatır.
- **Balık stoku (0-100):** Avla düşer, doğa ve koruma ile yenilenir.
- **Enerji:** Üretim, tüketim, batarya. Yenilenebilir oranı gösterilir.

---

## 6. Görevler ve iş sistemi

Her yetişkin köylüye bir **görev** atanır. Emir verilmezse görevini kendisi yapar. Çocuklar çalışmaz; okur ya da gezer.

| Görev | Ne yapar |
| --- | --- |
| Serbest | Önce acil işler: yangın, inşaat, yemek, su; sonra toplama |
| Toplayıcı | Hurda, çöp, böğürtlen, çalı toplar; evleri ve harabeleri yağmalar |
| Oduncu | Olgun ağaç keser (%35 fidan çıkar, kütük kalır, doğa düşer); kereste atölyesinde kereste yapar |
| Taşçı | Kaya ve taş ocağından taş çıkarır |
| Çiftçi | Ek, sula, gübrele, hasat; hasat tohum ve organik atık da verir |
| Ormancı | Fidan diker (köy çevresine, aralıklı) |
| Avcı | Silahla avlanır, saldıran hayvanlara karşı köyü korur, av kotasına uyar |
| Balıkçı | Kıyıdan, iskeleden ya da salla balık tutar (olta ya da ağ gerekir); lodosta çıkmaz |
| İnşaatçı | İnşa, onarım, güçlendirme, atölye üretimi |
| Aşçı | Çiğ yiyeceği pişirir (odun harcar), su kaynatır |
| Sucu | Dereden kirli su taşır |
| Doktor | Hastaları tedavi eder, şifalı bitkiden ilaç yapar |
| Okuyucu | Bulunan kitabı okur |
| Hayvan bakıcısı | Sahipsiz hayvanları ahıra getirir, besler, süt, yün ve yumurta toplar, ot biçer |
| Kâşif | Bulutlu alanlara gider |
| Radyocu | Radyoyu dinler: güçlü bağlantı, uyarılar, kasabalar |

**Günlük ritim:** 06-21 çalışma, 22-05.30 uyku (yatak gerekir; yoksa açıkta uyunur). **Mesai kuralı “serin”:** 05-11 ve 17-21.30 arası çalışılır, öğle gölgede geçer; ısı dalgasında hayat kurtarır. Acil susuzluk ya da açlık her işi keser.

**Oyuncu emirleri (karakter seçiliyken):** Haritada bir şeye sağ tıkla ya da tıkla ve menüden seç: git, topla, kes, kaz, yağmala, sök, onar, güçlendir, ek, hasat, avla, evcilleştir, balık tut, dik (fidan), keşfet, söndür.

**Meslekler (felaketten önce):** Çiftçi, Balıkçı, Avcı, Sağlıkçı, Mühendis, İnşaat ustası, Öğretmen, Aşçı, Çoban, Öğrenci, Emekli; ayrıca Çocuk. Mesleğine uygun işte daha verimli: usta ve mühendis 1,6 kat inşa, öğretmen 1,6 kat okuma, aşçı 1,3 kat yemek, balıkçı +1 balık, avcı +%20 isabet, sağlıkçı +%25 tedavi.

---

## 7. Hayatta kalma sistemleri

### Su
- Kaynaklar: yağmur suyu deposu (yağmurda temiz su), dereden taşıma (kirli), kova (yağmurda biraz), kuyu (temiz, kuraklıkta azalır).
- Temizleme: basit filtre (saatte 2), su arıtma ünitesi (elektrikle saatte 10), ocakta kaynatma (odun).
- Kapasite: 40 + depo başına 30 + kuyu başına 20.
- Kirli su içmek %15 ishal riski taşır; sel sonrası %30.

### Yiyecek
- **Tarım:** Ekinler aşağıda. Tarla sulanmazsa kurur. Gübre +%30 büyüme ve +%25 verim. Kış ve olaylar büyümeyi etkiler. Damla sulama (Ziraat kitabı) su ihtiyacını %40 azaltır.
- **Toplayıcılık:** Böğürtlen (kışın büyümez), şifalı bitki.
- **Avcılık:** Tavşan (silahsız da olur, tuzak kolaylaştırır), karaca ve yaban domuzu (silah gerekir). Et ve deri verir. Av kotası açıkken bir türden 2'den az kalınca avlanmaz.
- **Balıkçılık:** Olta (kıyı), ağ (×1,8, stok hızlı tükenir), iskele (×2), sal (×2,5, fırtınada batabilir). Müsilajda ×0,2.
- **Ahır:** Sahipsiz hayvanlar evcilleştirilir (Hayvancılık kitabı ve ahır gerekir). İnek süt ve gübre, koyun yün, süt ve gübre, keçi süt ve gübre, tavuk yumurta verir. Saman yer; aç kalırsa 4 günde ölür.
- **Pişirme:** Ocakta çiğ yiyecek (sebze, tahıl, et, balık) pişmiş yemeğe döner. Çiğ et ve balık %10 ishal riski taşır.
- **Yeme sırası:** yemek, konserve, süt, yumurta, sebze, tahıl, meyve, balık, et.

| Ekin | Gün | Su | Verim | Ürün | Kış | Gerekli kitap | Not |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Nohut | 8 | 0,5 | 7 | tahıl | %30 | Defter | Kuraklığa dayanıklı |
| Buğday | 9 | 0,8 | 9 | tahıl + saman | %30 | Ziraat | Hayvan yemi |
| Domates | 7 | 1,3 | 11 | sebze | 0 | Ziraat | Çok su |
| Patates | 9 | 0,8 | 10 | sebze | %50 | Ziraat | |
| Lahana | 8 | 0,7 | 8 | sebze | %100 | Ziraat | Kış ürünü, dona dayanıklı |

### Enerji
| Kaynak | Güç | Not |
| --- | --- | --- |
| Rüzgâr gülü | 0-3 kW | Rüzgâra bağlı; lodosta bol üretir ama hasar riski var |
| Güneş paneli | 0-2,5 kW | Gündüz, bulutta azalır. Kervandan panel parçası gerekir. |
| Su değirmeni | 1,5 kW | Dere kenarı, gece gündüz; kuraklıkta yarıya iner |
| Biyogaz | 2 kW | Gübre ya da organik atık yakar |
| Batarya | 12 kWh depo | Eski araba aküsünden |
| Dizel (başta var) | 3 kW | Yakıt biter, havayı ve doğayı kirletir; kural ile kapatılabilir |

**Tüketiciler:** revir (0,5), su arıtma (1), radyo (0,5), serinletici (0,5). Öncelik sırası: revir > su > radyo > serinletici. Yetmezse son sıradakiler kapanır. Gece ışıkları enerji varsa yanar.

### Barınma, ısı ve savunma
- Ev ve sığınak 4 yatak verir, yalıtımlı (dış sıcaklığın etkisini %55-60 azaltır, güçlendirilmişse daha çok).
- Yıkık ev **onarılır** (odun 10, taş 4, metal 2) ya da **sökülür** (odun 6, taş 5, metal 3).
- **Güçlendirme** (Afet kitabı): kum torbası, taş, odun. Sel, lodos ve depremde koruma.
- **Gölgelik:** 5°C serinletir. **Serinletici:** elektrikle 8°C. **Soba:** odunla 10°C ısıtır. **Ocak:** ısıtır ve pişirir. **Kışlık giysi:** soğuğa +7°C.
- **Çit ve taş duvar:** Hayvanlar geçemez. Tarlanın çevresinde en az 5 parça varsa yaban domuzu giremez.
- **Gözcü kulesi:** Çevreyi açar, yangın ve lodosu önceden görür.
- **Toplanma alanı:** Depremde yaralanmayı yarıya indirir.

### Yapılar (kodda: `D.BINA`)

| Kategori | Yapılar (gerekli kitap) |
| --- | --- |
| Barınma | Depo (Defter), Gölgelik (Defter), Serinletici (Elektrik), Soba (Defter), Ev (yıkık evi onararak) |
| Gıda | Ocak, Tarla, Kompost (Defter), Fidanlık (Ziraat), Ahır (Hayvancılık), İskele (Denizcilik) |
| Su | Yağmur suyu deposu, Basit filtre (Defter), Su arıtma, Kuyu (Su Mühendisliği) |
| Enerji | Rüzgâr gülü (Defter), Güneş paneli (Güneş), Su değirmeni (Su), Biyogaz (Biyogaz), Batarya (Elektrik) |
| Üretim | Atölye (Defter), Kereste atölyesi ve Taş ocağı (İnşaat) |
| Sağlık ve bilgi | Revir (Tıp), Köy kütüphanesi (İnşaat), Radyo istasyonu (Elektrik) |
| Savunma ve hazırlık | Ahşap çit (Defter), Taş duvar ve Gözcü kulesi (İnşaat), Toplanma alanı (Afet) |

**Maliyetler, süreler ve açıklamalar `js/data.js` içinde.** Tarla çimen ya da toprakta, taş ocağı kayalıkta, iskele kıyıda, su değirmeni dere kenarında kurulur.

### Atölye üretimi (kodda: `D.TARIF`)
- **Defter:** Balta (kesme ×2), Kazma (kazma ×2), Olta, Mızrak, Tuzak
- **Avcılık:** Ok ve yay (uzaktan av), Kılıç (en iyi korunma), Balık ağı
- **Afet:** Kum torbası
- **Dikiş:** Maske, Cibinlik, Kışlık giysi, Yünden kumaş
- **Denizcilik:** Sal

**Malzeme döngüsü:** ağaç → odun → kereste; kaya → taş; hurda ve araba → metal, plastik, akü; çöp → plastik, organik, metal; organik → kompost → gübre → tarla ve biyogaz; ahır → gübre; yün → kumaş.

---

## 8. Bilgi sistemi: Dedenin Defteri ve kitaplar

- **Dedenin Defteri** (baştan açık): temel barınma, ocak, yağmur suyu, basit filtre, nohut tarlası, kompost, fidan, çit, gölgelik, soba, rüzgâr gülü, atölye, depo, balta, kazma, olta, mızrak, tuzak.
- **Eski kitaplar** harabelerden bulunur (kütüphane, okul, hastane, evler). Kasabalar radyodan okuyabilir, kervan satabilir. Bir “Okuyucu” okur; öğretmen ×1,6, köy kütüphanesi ×1,5 hızlandırır, çocuklar yarı hızda okur.
- Her kitap bitince bir **bilgi kartı** çıkar ve “Bilgiler” defterine eklenir.

| Kitap | Okuma süresi (birim) | Açtıkları |
| --- | --- | --- |
| İnşaat Tekniği | 10 | Kereste atölyesi, taş ocağı, taş duvar, gözcü kulesi, kütüphane |
| Ziraat El Kitabı | 10 | Buğday, domates, patates, lahana, damla sulama, fidanlık, kış ekimi |
| Elektrik El Kitabı | 12 | Batarya, radyo istasyonu, serinletici |
| Su Mühendisliği | 12 | Su arıtma, kuyu, su değirmeni |
| Tıp El Kitabı | 10 | Revir, şifalı bitkiden ilaç |
| Afet Hazırlığı | 6 | Kum torbası, güçlendirme, toplanma alanı, erken uyarı +1 gün |
| Hayvancılık Rehberi | 8 | Ahır, evcilleştirme |
| Avcılık ve Savunma | 8 | Ok ve yay, kılıç, ağ |
| Güneş Enerjisi | 10 | Güneş paneli |
| Denizcilik | 8 | İskele, sal |
| Biyogaz ve Kompost | 8 | Biyogaz tesisi |
| Dikiş ve Giyim | 6 | Kışlık giysi, maske, cibinlik, kumaş |

---

## 9. Takvim, mevsimler ve hava

- **1 mevsim = 7 gün, 1 yıl = 28 gün** (`D.MEVSIM_GUN`, `D.YIL_GUN`). Oyun 2040 ilkbaharında başlar.
- **Taban sıcaklıklar:** İlkbahar 16°C, Yaz 30°C, Sonbahar 17°C, Kış 4°C. Gün içi ±5,5°C, günlük sapma ±3°C. Mevsim sonunda bir sonrakine yumuşak geçiş. Küresel sıcaklık arttıkça her şey ısınır.
- **Yağmur olasılığı:** İlkbahar %32, Yaz %8, Sonbahar %42, Kış %45. Kışın 2°C altında kar yağar.
- **Rüzgâr** her gün rastgele; lodos ve kar fırtınasında güçlü.
- **Görsel efektler:** yağmur, kar, rüzgâr çizgileri, ısı dalgası turuncu filtresi, gece karanlığı ve ışıklar, yazın ve doğa düşükken kurak renk, kışın kar örtüsü, selde alçak alanların suyla kaplanması, müsilajlı deniz.

---

## 10. Afetler (rastgele, çoğu iklimsel)

Mevsimdeki günlük olasılık × zorluk × küresel sıcaklık çarpanı (her 0,1°C için +%16) × 2°C aşılmışsa 1,3. İlk 3 gün afet yok. Aynı anda en fazla 2 tanesi baskın.

| Afet | Mevsim | Uyarı | Süre (gün) | Etkisi | Tedbir |
| --- | --- | --- | --- | --- | --- |
| Isı dalgası | Yaz (ilkbahar ve sonbahar az) | 2 gün önce | 3-5 | +11°C, su tüketimi artar, ekin yavaşlar, sıcak çarpması | Su, gölgelik, serinletici, serin mesai |
| Kuraklık | Yaz, sonbahar | 3 gün önce | 7-11 | Yağmur yok, tarla hızlı kurur, kuyu ve değirmen azalır, yangın riski | Depo, damla sulama, nohut |
| Orman yangını | Yaz | Yok (gözcü kulesi görür) | Sönene kadar | Ağaç ve çalı üzerinden yayılır; rüzgâr ve kuraklık hızlandırır, yağmur söndürür; binalara zarar, duman | Su, söndürme, ormanla köy arasında boşluk |
| Müsilaj ve deniz ısı dalgası | Yaz | 1 gün | 5-7 | Balık stoku -15, balıkçılık ×0,2 | Başka yiyecek |
| Sağanak ve ani sel | Sonbahar, ilkbahar | 1 gün | 1-2 | Alçak alandaki yapılara hasar, tarla kaybı, kirli su riski; doğa düşükse heyelan | Güçlendirme, kum torbası, yüksek yere yapı |
| Lodos fırtınası | Sonbahar, kış | 1 gün | 1-2 | Güçlendirilmemiş yapılara hasar, denize çıkılmaz, rüzgâr gülü bol üretir | Güçlendirme |
| Kar fırtınası, soğuk dalgası | Kış | 2 gün | 2-4 | -13°C, hareket yavaşlar, ekin durur, hipotermi | Odun, soba, kışlık giysi |
| Ani don | İlkbahar | 1 gün | 1 | Lahana dışındaki ekinlerin %55'i donar | Ekimi ertele |
| Sivrisinek salgını | Yaz, sonbahar (selden sonra ×4) | Yok | 5-7 | Ateşli hastalık | Cibinlik, durgun suyu kurutmak |
| Deprem | Her mevsim, çok nadir | Asla | 1 | Güçlendirilmemiş yapılara ağır hasar, yaralanmalar, yıkık evlerin bazıları çöker | Güçlendirme, toplanma alanı |

**Erken uyarı:** Radyo istasyonu + radyocu = uyarı kesin gelir. Radyo yoksa ya da dinlenmiyorsa %45 şans. Gözcü kulesi yangın ve lodosu görür. Kıyamet modunda %35, Fırtına'da %10 afet habersiz gelir. Afet kitabı uyarıyı 1 gün erkene çeker. Uyarı seviyeleri: Sarı (1 gün), Turuncu (2+ gün). Her afetin ilk gelişinde **bilgi kartı** çıkar: bilimsel açıklama ve tedbir.

**Not:** İstanbul'da çığ olmadığı için çığ çıkarıldı (kullanıcı başta istemişti).

---

## 11. Hastalıklar

| Hastalık | Nereden | Günlük sağlık kaybı | Süre | Not |
| --- | --- | --- | --- | --- |
| İshal | Kirli su, çiğ et ve balık, sel sonrası | düşük | 3 gün | |
| Sıcak çarpması | Isı barı yüksek | yüksek | 2 | |
| Hipotermi | Isı barı düşük | yüksek | 2 | |
| Solunum hastalığı | Hava barı düşük | düşük | 4 | |
| Sivrisinek ateşi | Sivrisinek salgını | orta | 4 | |
| Bulaşıcı hastalık | Kervan, yeni gelen | orta | 4 | Yakındakine bulaşır; karantina |
| Yaralı | Hayvan saldırısı, deprem | düşük | 3 | |

**Tedavi:** Doktor %25 (+%25 sağlıkçı, +%20 revir, +%30 ilaç). Hastalık süre dolunca kendiliğinden de geçer. Revir hasta kaybını %30 azaltır.

---

## 12. Köy ve insanlar

- **Yeni gelenler:** Moral ve yatak durumuna göre günde ~%20 olasılıkla 1-3 kişilik grup gelir. Kart gösterilir: ad, yaş grubu, söylediği meslek, nereden geldiği (Sarıyer, Beykoz, Eyüp, Kağıthane, Bahçeköy, Zekeriyaköy, Şile yolu), yanında getirdiği, varsa hastalık belirtisi.
- **Kararlar:**
    - **Kabul:** Moral +2 (çocuk ya da yaşlı varsa +4).
    - **Karantinayla kabul:** 1-2 gün ayrı bekler; hastalık bulaşmaz.
    - **Ret:** Moral -3 (çocuk ya da yaşlı varsa -8). Sonradan haber gelebilir.
- **Söylenen meslek** %20 olasılıkla yalan çıkabilir; sonra ortaya çıkar.
- **Tayın kuralı:** Eşit · Çalışan daha çok · Önce savunmasızlar · Kısıtlı (yiyecek tasarrufu, moral cezası)
- **Diğer kurallar:** Mesai (normal / serin saatler), Av kotası (açık / kapalı), Dizel (kullan / sakla), Ekim tercihi (otomatik / belirli ekin)
- **Sokak kedileri:** Yaklaşınca köye katılır, moral verir.
- **Ad havuzları** `D.AD_E`, `D.AD_K` ve çocuk adları kodda.

---

## 13. Ticaret, kervanlar, radyo ve kasabalar

**Kasabalar:** Şile, Kilyos, Polonezköy, Adalar, Riva, Çatalca. Her birinin teklif ettiği ve ihtiyaç duyduğu mallar var.

**Kervan:**
- 7-11 günde bir rastgele gelir (zorluğa göre). Radyo güçlüyse kervan çağrılabilir; 2 günde gelir. Yaklaşık 1 gün kalır.
- **Takas:** Para yok, değer puanı var (`D.KAYNAK[x].deger`). Mevsime göre değer değişir: yazın su ve tohum ×1,6, kışın odun, yün ve kışlık ×1,6.
- Verilen değer, istenenin %90'ı kadar olmalı. Cömert takas güveni artırır; kervan daha sık ve daha iyi teklifle gelir.
- Kervan bazen kitap satar (değer 20).
- **Risk:** %12 olasılıkla hastalık getirir; karantinalı takas korur.

**Radyo:**
- Radyo istasyonu (Elektrik kitabı, 0,5 kW) + radyocu = güçlü bağlantı. Yoksa zayıf ve parazitli; mesaj bazen gelir.
- **Mesaj türleri:** kasabanın durumu, ihtiyacı, yaklaşan afet uyarısı, kitap bilgisi okuma (güven yüksekse).
- **Bilgi paylaşımı:** Kendi öğrendiğin teknolojiyi bir kasabaya anlatırsın (rüzgâr gülü 30 puan, yağmur suyu 20, kompost 15, güneş 35, damla sulama 25, biyogaz 30, su değirmeni 25). Zayıf bağlantıda %40 ulaşır. 60 puana ulaşan kasaba **temiz enerjiye geçer.**

---

## 14. Küresel sıcaklık ve 2°C eşiği

- Başta **1,86°C** (sanayi öncesine göre, 2040 kurgusu). Her yıl **+0,045°C**.
- Temiz enerjiye geçen her kasaba artışı **0,0065°C/yıl** azaltır. Köyün kendisi %90+ yenilenebilir ve doğa 60+ ise -0,004. Hepsi yeşilse artış neredeyse durur. Dizel kullanımı da küçük katkı yapar.
- **2°C aşılınca (kalıcı):**
    - Yazlar +2°C
    - Afet olasılığı ×1,3
    - Balık stoku tavanı 100 → 80
    - Moral -8
    - Bilgi kartı: Paris Anlaşması ve devrilme noktaları; “Oyunda bu bir şalter, gerçekte risk adım adım büyür.”
- **Bilimsel dürüstlük:** Tek bir köyün küresel iklimi değiştiremeyeceği açıkça söylenir. Yerel ekosistem iyileşmesi yerel afetleri gerçekten yumuşatır (ekosistem temelli uyum). Küresel kısım kolektif eylem ister, bu yüzden kasabalarla bilgi paylaşımı var.

---

## 15. Zorluk seviyeleri

| Ayar | Filiz 🌱 | Fırtına 🌪️ | Kıyamet 🔥 |
| --- | --- | --- | --- |
| Başlangıç ve bulunan kaynak | ×1,6 | ×1 | ×0,6 |
| İhtiyaç düşüşü | ×0,7 | ×1 | ×1,3 |
| Afet sıklığı | ×0,55 | ×1 | ×1,6 |
| Hastalık | ×0,6 | ×1 | ×1,4 |
| Habersiz afet | %0 | %10 | %35 |
| Kervan sıklığı | ×1,3 | ×1 | ×0,75 |
| Çakallar | Sadece kış gecesi | Sadece kış gecesi | Her gece |

---

## 16. Köylü soruları (karar kartları)

- Günde ~%75 olasılıkla, gün içinde rastgele bir saatte bir köylü soru getirir. Oyun duraklar; köylünün portresi, sorusu ve 2-3 seçenek gösterilir.
- Seçimden sonra sonuç (kaynak, moral, doğa, hastalık, kural; bazıları olasılıklı) ve **bilgi kartı + kaynak** gösterilir.
- Mevsim, gün ve durum koşulu olan sorular var (ör. yangın varsa maske, kervan varsa karantina). Aynı soru, havuzun %80'i görülmeden tekrar gelmez.
- İleride yapay zekâ ile dinamik sorular eklenebilir (kabul alırsa).

**Mevcut 65 soru** (`js/questions.js`):

| # | id | Soru | Seçenekler | Kaynak |
| --- | --- | --- | --- | --- |
| 1 | `yamac_agac` | Odun azaldı. Köyün üstündeki yamaçta sık ağaçlar var, hepsini kesip bir kerede stok yapalım mı? | Hepsini kes / Sadece kuru dalları topla / Kesilen her ağaç yerine iki fidan dik | IPCC AR6 |
| 2 | `fidan_gunu` | Çocuklarla bir fidan dikme günü yapalım mı? Bir gün iş kaybederiz ama… | Evet, herkes katılsın / Şimdi değil, iş çok | Avrupa Çevre Ajansı |
| 3 | `kuru_agac` | Yangından kalan kara ağaçlar duruyor. Odun olarak kullanalım mı, yoksa bırakalım mı? | Kesip odun yap / Bırak, toprağa karışsın | FAO |
| 4 | `mangal` | Kömür yapıp ocakta daha sıcak ateş yakalım mı? Bunun için çok odun yanar. | Yap / Gerek yok, ocak yeter | WHO |
| 5 | `dere_suyu` | Çok susadık. Dere suyunu kaynatmadan içelim mi? Odun da az. | İçin, vakit yok / Önce kaynatın / Kum-kömür filtresinden geçirin | WHO |
| 6 | `yagmur_kova` | Bulutlar toplanıyor. Bütün kova ve leğenleri dışarı çıkaralım mı? | Evet / Uğraşmayalım | UNEP |
| 7 | `su_tasarruf` | Yaz çok kurak geçiyor. Yıkanma ve çamaşır suyunu yarıya indirelim mi? | Yarıya indir / Kullanılan suyu tarlaya ver (gri su) / Değiştirme | FAO |
| 8 | `deniz_suyu` | Deniz bu kadar yakın, neden deniz suyu içmiyoruz? | Tuzlu su vücudu daha da susuz bırakır, açıkla / Bir dene bakalım | NOAA |
| 9 | `kuyu_kazma` | Eski bir el pompası bulduk. Derin kuyu açmaya çalışalım mı? | Deneyelim / Malzemeyi harcamayalım | DSİ |
| 10 | `tohum_ye` | Yiyecek azaldı. Ekmek için ayırdığımız tohumları yiyelim mi? | Yiyelim / Hayır, tohum yarındır | Crop Trust |
| 11 | `kuraklik_tohum` | Bu yıl kurak geçecek gibi. Tarlaya çok su isteyen domates mi ekelim, az su isteyen nohut mu? | Nohut / Domates (çok verir) / Çiftçi karar versin | FAO |
| 12 | `yemek_artik` | Yemek artıkları ne olsun? | Komposta / Hayvanlara / Çöpe at | FAO, UNEP |
| 13 | `ozel_bostan` | Bazı köylüler herkesin tarlası yerine kendi küçük bostanlarını istiyor. | Ortak tarla devam / Küçük bostanlara izin ver | FAO |
| 14 | `saklanan_yemek` | Biri depodan gizlice yemek almış. Ne yapalım? | Herkesin önünde uyar / Konuş, neden yaptığını anla / Tayını kısıtla | Lancet Countdown 2025 |
| 15 | `sebze_sat` | Bol sebze çıktı. Fazlasını kurutup kışa saklayalım mı? | Kurut, sakla / Şimdi yiyelim, bayram olsun | FAO |
| 16 | `hasat_senlik` | Hasat iyi geçti, şenlik yapalım mı? | Şenlik! / Yiyeceği saklayalım | UNDRR |
| 17 | `et_tuketim` | Avda bol hayvan var. Her gün et mi yiyelim, haftada bir mi? | Her gün / Haftada bir, bitki ağırlıklı | IPCC AR6 |
| 18 | `dogan_ari` | Yabani bir arı kovanı bulduk. Balını alıp kovanı mı yakalım, yoksa koruyalım mı? | Balını al / Koru, tarlalara yararı var | IPBES |
| 19 | `butun_ag` | Balık bol! Elimizdeki bütün ağları atalım mı? | Hepsini at / Kota koy / Kıyının bir kısmını koruma alanı yap | FAO GFCM |
| 20 | `kucuk_balik` | Ağa çok küçük, yavru balık takıldı. Atalım mı, yiyelim mi? | Denize geri at / Yiyelim | Tarım ve Orman Bakanlığı |
| 21 | `kiyi_cop` | Kıyıya yine plastik birikmiş. Bir gün kıyı temizliği yapalım mı? | Yapalım / Başka işlerimiz var | UNEP |
| 22 | `musilaj_soru` | Deniz köpükle kaplandı. Balıkçılar yine de denize çıkmak istiyor. | Çıkmasınlar, deniz dinlensin / Çıksınlar | TÜBİTAK MAM |
| 23 | `sal_firtina` | Fırtına uyarısı var ama gençler salla açılmak istiyor; açıkta balık bolmuş. | İzin ver / Yasakla | BM Early Warnings for All |
| 24 | `dizel_mi` | Eski jeneratörde biraz yakıt kaldı. Bitene kadar çalıştıralım mı, yoksa acil durumlara mı saklayalım? | Acil durumlara sakla / Çalıştır | IPCC AR6, Climate Watch |
| 25 | `ruzgar_yer` | Rüzgâr gülünü tepeye mi kuralım, köyün içine mi? Tepe daha rüzgârlı ama fırtınada riskli. | Tepeye / Köye yakın | IEA |
| 26 | `gece_isik` | Geceleri ışıkları açık tutalım mı? İnsanlar karanlıktan korkuyor. | Açık kalsın / Sadece ortak alanda bir ışık / Enerji tasarrufu | IEA |
| 27 | `aku_kullan` | Bulduğumuz eski aküleri bataryada mı kullanalım, yoksa radyoya mı? | Batarya için sakla / Radyoya bağla, haber alalım | UNEP |
| 28 | `yakit_takas` | Bir yolcu, 10 litre dizel karşılığında tohumlarımızın yarısını istiyor. | Kabul et / Reddet, rüzgâr bize yeter | IRENA |
| 29 | `cati_rengi` | Evlerin çatısını beyaz kireçle boyayalım mı? Biraz malzeme gider. | Boyayalım / Gerek yok | UNEP Cool Coalition |
| 30 | `ev_yik` | Malzeme için sağlam ama boş bir evi yıkalım mı, yoksa onarıp yeni gelenlere mi saklayalım? | Yık, malzemeyi kullan / Onarmak için sakla | UNEP Küresel Binalar Raporu |
| 31 | `yuksek_yer` | Bazı evler dere kenarında. Daha yükseğe taşınalım mı? | Kum torbası ve drenaj yapalım / Risk alalım | AFAD |
| 32 | `yesil_alan` | Köyün ortasındaki boş alana bina mı yapalım, ağaçlık bir meydan mı? | Ağaçlık meydan / Depo yap | WHO Avrupa |
| 33 | `revir_sogutucu` | Sıcakta tek serin oda revir. Yaşlı teyze mi kalsın, ateşi çıkan çocuk mu? | Yaşlı teyze / Çocuk / Herkes için gölgelik kurun | Lancet Countdown 2025 |
| 34 | `ogle_mesai` | Öğle sıcağında çalışmak çok zor. Mesaiyi sabah erken ve akşama alalım mı? | Evet, sabah ve akşam çalışalım / Hayır, iş bitmeli | Lancet Countdown 2025 |
| 35 | `sifali_ot` | İlaç azaldı. Yaşlıların bildiği şifalı otlarla mı idare edelim? | Ot toplayalım / Kervandan ilaç almayı bekleyelim | WHO |
| 36 | `maske_duman` | Yangın dumanı köye geliyor. Kumaşlardan maske yapalım mı? | Yapalım / İçeride kalalım | WHO |
| 37 | `hasta_gelen` | Gelenlerden biri öksürüyor. Herkesten ayrı mı yatsın? | Ayrı yatsın, karantina / Ayırmayalım, ayıp olur | WHO |
| 38 | `cocuk_okul` | Çocuklar çalışmak yerine her gün birkaç saat okusun mu? | Okusunlar / Önce iş | COP31 Başkanlığı |
| 39 | `komsu_sel` | Radyodan haber: komşu kasaba selden etkilenmiş, yardım istiyorlar. | Yiyecek ve kumaş gönder / Kendi stoğumuz bize zor yetiyor | UNFCCC |
| 40 | `tayin_karar` | Yiyecek dağıtımında nasıl bir kural olsun? | Herkese eşit / Çalışan daha çok alsın / Önce çocuk, yaşlı ve hasta | WFP |
| 41 | `yalan_haber` | Bir yolcu “iklim değişikliği uydurma, soğuk kış bunu kanıtlıyor” diyor; bazıları inandı. | Hava ile iklim farkını anlat / Boş ver, tartışmayalım | WEF Küresel Riskler Raporu 2026 |
| 42 | `sessiz_cogunluk` | Köylüler rüzgâr gülü konusunda sessiz. Kimse “ben istiyorum” demiyor, herkes başkasının istemediğini sanıyor. | Gizli oylama yap / Konuyu kapat | Andre vd., Nature Climate Change, 2024 |
| 43 | `yasli_bilgi` | Yaşlılarımız eskiden kuraklıkta nasıl idare ettiklerini anlatmak istiyor. Bir akşam toplanalım mı? | Toplanalım / Vakit yok | IPCC AR6 |
| 44 | `kedi_besle` | Sokak kedileri depoya dadandı. Besleyelim mi, kovalım mı? | Besleyelim, fareleri kovarlar / Kovalım | — |
| 45 | `kervan_karantina` | Kervandakilerden biri hasta görünüyor. Takası köyün dışında mı yapalım? | Köyün dışında, mesafeli / Normal karşılayalım | WHO |
| 46 | `gelenler_cok` | Kapıda kalabalık bir aile var ama yatak az. Ne yapalım? | Sıkışırız, kabul / Önce ev onaralım, sonra | IDMC |
| 47 | `yardim_iste` | Durumumuz zor. Radyodan kasabalardan yardım isteyelim mi? | İsteyelim / Kendi başımızın çaresine bakalım | UNDRR |
| 48 | `cop_yak` | Çöp yığını büyüdü, kokuyor. Yakalım mı? | Yak / Ayrıştır, geri dönüştür | UNEP |
| 49 | `plastik_sise` | Yüzlerce plastik şişe topladık. Ne yapalım? | Sal yapımında kullan / Su deposu yap | UNEP |
| 50 | `tamir_et` | Atölyede bir balta kırıldı. Yenisini mi yapalım, tamir mi? | Tamir et / Yenisini yap | Ellen MacArthur Vakfı |
| 51 | `eski_giysi` | Eski giysiler yırtıldı. Atalım mı, yama yapalım mı? | Yama yap / At, yenisini dikeriz | UNEP |
| 52 | `domuz_tarla` | Yaban domuzları tarlaya dadandı. Ne yapalım? | Tarlanın çevresine çit çekelim / Avlayalım | — |
| 53 | `karaca_yavru` | Ormanda yavrulu bir karaca gördük. Avlayalım mı? | Bırakın / Avlayın | Doğa Koruma ve Milli Parklar |
| 54 | `inek_bulundu` | Tarlalarda sahipsiz inekler dolaşıyor. Ne yapalım? | Ahır kurup bakalım / Kesip etini kurutalım | FAO |
| 55 | `cakal_gece` | Geceleri çakallar köye yaklaşıyor. Nöbet tutalım mı? | Nöbet tutalım / Duvarları yükseltelim / Bir şey olmaz | — |
| 56 | `kasaba_bilgi` | Radyodan bir kasaba rüzgâr gülünü nasıl yaptığımızı soruyor. Anlatalım mı? | Anlatalım, bilgi paylaştıkça çoğalır / Bize avantaj, saklayalım | UNFCCC |
| 57 | `cop31_hatira` | Biri 2026daki COP31 konferansını hatırlıyor: “Keşke o zaman daha çok şey yapılsaydı.” | Şimdi yapabileceklerimize bakalım / Geçmişe yanıp duralım | COP31 Başkanlığı |
| 58 | `uyari_inan` | Radyo yarın ısı dalgası diyor ama bazıları “hep abartıyorlar” diyor. | Uyarıyı ciddiye al, hazırlan / Boş ver | Küresel Uyum Komisyonu |
| 59 | `gunes_mi_ruzgar` | Sınırlı metalimiz var: bir rüzgâr gülü mü yapalım, bataryaya mı ayıralım? | Rüzgâr gülü / Batarya, geceler için | IRENA |
| 60 | `cocuk_soru` | Dünya neden bu kadar ısındı? Bir daha soğur mu? | Sera etkisini battaniye örneğiyle anlat / “Büyüyünce anlarsın” | NOAA, IPCC AR6 |
| 61 | `okyanus_isi` | Deniz her yıl biraz daha ılık. Balıklar kuzeye mi gidiyor? | Evet, anlat / Bilmiyorum | IPCC AR6 |
| 62 | `deprem_hazirlik` | İstanbulda büyük deprem riski hep var. Evleri güçlendirmeye öncelik verelim mi? | Evet, malzeme ayır / Önce yiyecek | AFAD |
| 63 | `kar_odun` | Kar fırtınası geliyor, odun azaldı. Kullanılmayan çitleri yakalım mı? | Yakalım / Hep birlikte tek evde ısınalım | Kızılay |
| 64 | `ruzgar_gurultu` | Bazıları rüzgâr gülünün gece gürültü yaptığından şikâyetçi. | Evlerden biraz uzağa taşıyalım / Alışırlar, enerji lazım | IRENA |
| 65 | `cop_yok` | Köyde artık hemen hiç çöp yok; her şey ya tamir ya kompost ya geri dönüşüm. Bunu kutlayalım mı? | Kutlayalım / İşe devam | COP31 Başkanlığı |

---

## 17. Tema haritası (sunum için)

| COP31 odak alanı | GameUP örneği | Oyundaki karşılığı |
| --- | --- | --- |
| Yenilenebilir enerji | Şebeke | Rüzgâr gülü, güneş, su değirmeni, biyogaz, batarya; dizelin sınırı ve kirliliği; kasabalara bilgi paylaşımı |
| Karbon ayak izi ve bilinçli tüketim | — | Tamir, israfsız tayın, et-bitki dengesi sorusu, dizel ve çöp yakmanın bedeli, küresel sıcaklık göstergesi |
| İklim dirençli şehirler | Sıcak Şehir | Gölgelik, ağaçlandırma, serin çatı, güçlendirme, toplanma alanı, erken uyarı ve radyo, deprem hazırlığı |
| Gıda güvenliği | Kuraklık Çiftliği | 5 ekin, damla sulama, kuraklığa dayanıklı tohum, tohum saklama, ahır, kompost, tayın |
| Okyanuslar ve denizler | Mavi Denge | Balık stoku, av kotası, yavru balık, müsilaj, kıyı temizliği, sal ve iskele |
| İklim eğitimi | — | Dedenin Defteri, kitaplar, okuyucu, köy kütüphanesi, çocuklar, 65 bilgi kartı ve kaynakları |
| Sıfır atık | Çöp Değil | Çöp ve hurda toplama, ayrıştırma, geri dönüşüm, kompost, plastikten sal ve depo, söküp yeniden kullanma |
| Sağlık (COP31 önceliği) | Kod Turuncu | Isı barı, sıcak çarpması, yaşlı ve çocuk riski, revir, serin mesai, sivrisinek, salgın ve karantina |

---

## 18. Teknik mimari

- Saf JavaScript (ES5 tarzı, modül yok, kütüphane yok), HTML5 Canvas 2D. `index.html` doğrudan dosyadan açılır (`file://`) ya da herhangi bir statik sunucudan çalışır.
- Global modüller: `D` (veri), `U` (yardımcı), `W` (dünya), `B` (birimler), `S` (simülasyon), `G` (oyun durumu), `A` (görseller), `R` (çizim), `UI` (arayüz), `Hikaye`, `Kayit`, `Main`.
- **Simülasyon adımı:** `S.adim(dt)`, dt oyun dakikası cinsinden. Saatlik `S.saatlik()`: hava, enerji, su, tarım, yangın. Günlük `S.gunluk()`: afet planı, büyüme, moral, kasabalar, kervan, gelenler, soru, otomatik kayıt.
- **Yol bulma:** A* (8 yön), `W.yol()`. Hayvanlar çit ve duvardan geçemez (`G.hEngel`).
- **Rastgelelik:** Tohumlu (`G.seed`, `G.rand`), harita tohumdan üretilir.
- **Kayıt:** `localStorage`, try/catch ile. `G`'deki tipli diziler (tiles, occ, objAt, hEngel, kesif, dusuk) base64'e ya da diziye çevrilip saklanır; yüklemede geri dönüştürülür. Otomatik kayıt `oto` yuvası, elle kayıt `elle` yuvası. **Kayıt dosyası indir/yükle** (JSON) de olmalı, çünkü tarayıcı verisi silinebilir.
- **Görseller:** `js/manifest.js` (176 ad) → `karakterler/<ad>.png`. Yoksa yer tutucu çizilir; hata vermez.
- **Performans:** Görünür karolar çizilir; nesneler y'ye göre sıralanır. Hedef 60 fps, 100x100 harita, ~40 insan, ~60 hayvan.

### Dosya yapısı

```
oyun/
  index.html            # HENÜZ YOK — canvas + arayüz iskeleti + script sırası
  css/oyun.css          # VAR — arayüz stili (koyu tema, turuncu vurgu, mobil uyumlu)
  karakterler/          # arkadaşın PNG'leri buraya
  js/
    manifest.js         # VAR — görsel ad listesi (otomatik üretildi)
    util.js             # VAR — rng, noise, A*, yardımcılar
    data.js             # VAR — bütün oyun verisi ve dengeler
    world.js            # VAR — harita üretimi, nesne yerleşimi, sis, yer kontrolü
    units.js            # VAR — insan ve hayvan davranışı, 35 iş türü, emirler
    sim.js              # VAR — zaman, hava, barlar, hastalık, enerji, su, tarım, yangın, afet, radyo, kervan, gelenler, sorular, kitaplar, moral, doğa, 2°C
    questions.js        # VAR — 65 soru
    assets.js           # VAR — PNG yükleme ve yer tutucu dokular
    render.js           # VAR — zemin, nesne, birim, sis, ateş, hava efektleri, gece
    ui.js               # HENÜZ YOK
    story.js            # HENÜZ YOK
    save.js             # HENÜZ YOK
    main.js             # HENÜZ YOK
```

**Script sırası:** manifest, util, data, questions, world, units, sim, assets, render, ui, story, save, main.

**Diğer modüllerin çağırdığı ama henüz yazılmamış fonksiyonlar:** `UI.toast(metin, tip)`, `UI.bilgiKarti(baslik, metin, tedbir)`, `UI.soruGoster(soru, kisi)`, `UI.yeniGelenGoster(grup)`, `UI.kervanGeldi()`, `UI.ciz()`, `UI.modalAcik()`, `Hikaye.oyunSonu()`, `Kayit.kaydet(yuva)`, `Main.hiz`, `Main.duraklat`.

---

## 19. Yapılacaklar (sırayla)

### A) `ui.js`: arayüz
- [ ] **Üst çubuk:** gün, mevsim, yıl, saat, hava (°C, yağmur, rüzgâr ikonu); hız düğmeleri (⏸ 1x 2x 4x); kaynaklar (yiyecek toplamı, temiz su / kapasite, odun, taş, metal, plastik, enerji üretim-tüketim, batarya; az olanlar kırmızı); göstergeler (nüfus, moral, doğa, küresel °C, balık).
- [ ] **Alt menü:** İnşa · Köylüler · Atölye · Kitaplar · Kervan (geldiğinde rozet) · Radyo · Kurallar · Bilgiler · Günlük · Menü (kaydet / çık).
- [ ] **Bildirimler:** Sol üstte toast'lar, 6 sn, en fazla 5 tane.
- [ ] **Seçim:** Sol tık insanı seçer. Panelde ad, yaş, meslek, görev açılır menüsü, 5 bar, hastalık, taşıdıkları, mevcut iş. Shift ile çoklu seçim olabilir.
- [ ] **Emir:** İnsan seçiliyken sağ tık (mobilde uzun bas) → tıklanan nesneye göre bağlam menüsü (Kes, Kaz, Topla, Yağmala, Sök, Onar, Güçlendir, Ek, Hasat, Avla, Evcilleştir, Balık tut, Fidan dik, Git, Keşfet, Söndür). Tek seçenekse doğrudan uygula.
- [ ] **Nesneye tıklayınca:** Bilgi paneli (ağaç evresi, tarla ekin ve su durumu, bina canı, güçlü mü, çalışıyor mu; yıkık ev için “Onarım sırasına al”, “Söküm”; yapı için “Güçlendir”, “Yık”).
- [ ] **İnşa paneli:** Kategori sekmeleri, kitap kilidi göstergesi, maliyet (yetmeyen kırmızı). Seçince hayalet önizleme (yeşil/kırmızı, `R.hayalet`, `W.yerUygun`). Tıkla yerleştir, Esc iptal, sürükleyerek çit ve duvar çizme.
- [ ] **Köylüler paneli:** Tablo (ad, meslek, görev açılır menüsü, sağlık, durum) ve görev başına sayı.
- [ ] **Atölye:** Tarif listesi, kuyruğa ekle (`G.uretimSira`), atölye ve inşaatçı gerekir.
- [ ] **Kitaplar:** Okunanlar, sahip olunanlar, okuma sırası, aktif kitap ve ilerleme.
- [ ] **Kervan:** İki sütun (senin malın / kervanın malı), +/- ile seçim, değer çubuğu, “Takas et” (`S.takas(ver, al)`), kitap satın alma.
- [ ] **Radyo:** Bağlantı durumu, son mesajlar (`G.mesaj`), her kasabanın kartı (yeşil mi, puan/60, güven, ilk iletişim), “Bilgi paylaş” (`S.bilgiPaylas`), “Kervan iste” (`S.kervanIste`).
- [ ] **Kurallar:** Tayın, mesai, av kotası, dizel, ekim tercihi.
- [ ] **Bilgiler:** Toplanan bilgi kartları (`G.bilgiler`). Okul ansiklopedisi gibi; sunumda gösterilecek.
- [ ] **Günlük:** `G.bildirimler` geçmişi.
- [ ] **Modallar:** Soru kartı (portre, soru, seçenekler, sonra sonuç ve bilgi kartı), yeni gelen kartı (Kabul / Karantina / Ret), bilgi kartı, kilometre taşı.
- [ ] **Mini harita** (sağ altta, tıklayınca kamera gider) ve kamera kontrolleri: WASD / oklar / sürükleme, tekerlek ile zoom, mobilde iki parmakla zoom.
- [ ] **Klavye:** Boşluk duraklat, 1/2/3 hız, B inşa, Esc kapat.

### B) `story.js`: hikâye
- [ ] Ana menü, yeni oyun formu, hikâye slaytları (3. bölüm), izdiham mini oyunu (bonus → `S.yeniOyun({bonus})`), sığınak geçişi, 2040 çıkışı.
- [ ] **Eğitim:** Adım adım ipucu kutusu, her adım bir koşul tamamlanınca geçer:
    1. Kamerayı hareket ettir
    2. Bir köylüye tıkla
    3. Ağacı kestir
    4. Görev ata
    5. Tarla kur
    6. Yağmur suyu deposu kur
    7. Rüzgâr gülü kur
    8. Hızı değiştir
    9. Bulutlu yere kâşif gönder
    10. Yıkık evi yağmala
- [ ] **Oyun sonu ekranı:** Kaç yıl ve gün dayanıldı, en yüksek nüfus, dikilen ağaç, hasat, yenilenebilir enerji oranı, kurtarılan insan, yeşil kasaba sayısı, ölümler listesi. Mesaj: “Bu oyundaki her çözüm (rüzgâr enerjisi, yağmur suyu toplama, kompost, erken uyarı, ağaçlandırma) bugün var. 2040'ı beklemek zorunda değiliz.” Ardından “Bugün yapabileceklerin” (`D.BUGUN`) ve “Tekrar dene”.

### C) `save.js`
- [ ] `Kayit.kaydet(yuva)`, `Kayit.yukle(yuva)`, `Kayit.var(yuva)`, dosyaya indir / dosyadan yükle. Bütün çağrılar try/catch içinde.

### D) `main.js` ve `index.html`
- [ ] Oyun döngüsü: `requestAnimationFrame`. dt = gerçek ms × hız × (1 oyun dakikası / 1000 ms). 1x'te 1 gün yaklaşık 4 dakika olmalı; ayarlanacak. Sim adımı 5 dakikalık parçalara bölünür.
- [ ] Kamera, giriş olayları, UI yenileme (her 250 ms).

### E) Test ve denge
- [ ] Playwright ile tarayıcıda açılış testi, konsol hatası olmamalı, ekran görüntüsü.
- [ ] Hızlı simülasyon testi (headless 3 oyun yılı): Filiz'de rahat, Fırtına'da zorlayıcı, Kıyamet'te 1-2 yılda ölüm olası.
- [ ] Ölçülecekler: ilk 3 günde açlık var mı, suyun yetişip yetişmediği, enerji, afet sıklığı.

### F) Teslim
- [ ] Oyunu ZIP'le ve claude.ai Artifact olarak yayınla (link). `karakterler` klasörü ayrı eklenecek.
- [ ] Sunum (hackathon şablonu gelince): problem, oyun fikri, tema haritası, oynanış ekran görüntüleri, bilimsel temel ve kaynaklar, ekip ve rol dağılımı, yol haritası (online, yapay zekâ, mobil, İngilizce), demo linki ve kısa video.
- [ ] Teslim formu: Pazar 23.59'dan önce, hedef 22.00.

---

## 20. Henüz kararı verilmemiş sorular

| # | Soru | Önerim |
| --- | --- | --- |
| 1 | Oyunun adı | Aday: “Sığınaktan Sonra”, “Yeniden Filiz”, “Kestanelik 2040”, “Uzun Yaz”, “Yeşil Sinyal” |
| 2 | Ekip adları ve rolleri (sunum ve Hakkında ekranı) | CAN dolduracak |
| 3 | 1x hızda bir günün kaç gerçek dakika süreceği | 4 dk (1 mevsim ≈ 28 dk, 1 yıl ≈ 2 saat) |
| 4 | Sığınaktan kaç kişi çıkıyor? | Oyuncu + 2 (şu anki kod) |
| 5 | Oyuncunun karakteri ölünce kamera ve takip nasıl olacak, özel sahne olacak mı? | Kısa bir anma kartı (kodda var); oyun sürer |
| 6 | Ses ve müzik olacak mı? | Demoda yok. Varsa CC0 (ör. freesound CC0, Kenney ses paketleri). |
| 7 | İngilizce sürüm | Sonra |
| 8 | Online | Sonra: kervanlar ve kasabalar gerçek oyuncu olur, ortak küresel sıcaklık |
| 9 | Yapay zekâ | Sonra (kabul alırsa): köylülerle serbest diyalog, dinamik sorular |
| 10 | Mobil kontrol | Temel dokunma (tıkla, uzun bas, iki parmakla zoom) demoda olsun mu? Önerim: evet, basit hali. |
| 11 | Kazanma koşulu olacak mı? | Şu an yok, sonsuz. İsteğe bağlı “Yeniden Yeşerdi” kilometre taşı var. |
| 12 | Sunum şablonu | Hackathon paylaşınca doldurulacak |
| 13 | Demo videosu | 1-2 dk ekran kaydı, sunuma eklenir |
| 14 | Görsel üretiminde yapay zekâ kullanıldığı sunumda nasıl yazılacak? | “Görseller ekip tarafından yapay zekâ araçlarıyla üretildi” |

---

## 21. Görsel üretim süreci

- Arkadaşa `karakter_paketi.zip` verildi: `YAPAY_ZEKA_TALIMATI.md`, `DOSYA_LISTESI.txt`, `sablonlar/`, boş `karakterler/`.
- Arkadaşın, talimatı kendi yapay zekâsına verir. Yapay zekâ önce stil önerir, sonra 176 görseli tek tek üretir; arkadaşın her birine “oldu” ya da “olmamış, düzelt” der.
- Bitenler `karakterler/` klasörüne kaydedilir, ZIP'lenip CAN'a gelir, `oyun/karakterler/` içine konur.
- **Gruplar:** İnsanlar (9), meslek rozetleri (11), hayvanlar (12), bitkiler ve ekinler (16), yapılar (36), kalıntılar ve nesneler (13), zemin karoları (12), arayüz ikonları (59), hikâye görselleri (8).
- **Kurallar özeti:** Şeffaf PNG; boyutlar 64x64, 64x128, 128x128, 192x192, 1280x720; sağa bakan; hafif yukarıdan önden; kalın dış çizgi; yazı ve logo yok; ana karakter turuncu atkılı; sağlıkta yeşil artı.
- **Kodda dikkat:** Ağaç, ev ve benzeri sprite'lar ayak izinin altına oturtulur (`R.sprite`); karakterler 1,1 karo boyunda çizilir; rüzgâr gülü kanadı ayrı döndürülür; zemin karoları 32 px'e ölçeklenir.

---

## 22. Bilimsel doğruluk notları (jüri için)

- Açılış notu: “Bu bir tahmin değil, ‘hiçbir şey yapılmasaydı’ kurgusu.”
- **Oksijen değil hava kalitesi;** deprem iklimle ilişkilendirilmiyor; tek köyün küresel iklimi değiştiremeyeceği söyleniyor; 2°C'nin gerçekte şalter olmadığı belirtiliyor.
- **Kullanılan kaynaklar:** IPCC AR6, MedECC, Lancet Countdown 2025, WEF Küresel Riskler Raporu 2026, Andre vd. 2024 (Nature Climate Change, %89), FAO, UNEP, WHO, IEA, IRENA, AFAD, BM Early Warnings for All, COP31 Başkanlığı, İklim 101 webinarı (31 Ekim 2026).
- **Kodlamada kontrol edilecek rakamlar:** Damla sulama tasarrufu, ağaç başına CO₂, güneş paneli fiyat düşüşü (2010-2020 ~%80-90), sıcakla bağlantılı ölüm artışı (%23), iş gücü kaybı. Teslimden önce kaynaklarına bakılmalı; emin olunmayan rakam “yaklaşık” yazılmalı ya da çıkarılmalı.

---

## 23. Dengeleme sabitleri (hızlı bakış, `data.js` ve `sim.js`)

- **İhtiyaç düşüşü (oyun dakikası başına):** yemek 0,024, su 0,04 (+%6 / 27°C üstündeki her derece), uykuda ×0,6.
- **Sağlık kaybı:** açlık 0,045/dk, susuzluk 0,09/dk, aşırı sıcak 0,025, soğuk 0,025, kötü hava 0,015.
- **Taşıma kapasitesi:** 12. **Hareket hızı:** 0,14 karo/dk (yaşlı ×0,8, hasta ×0,7, kar fırtınasında ×0,6).
- **Moral hedefi:** 50 + yiyecek çeşidi + kedi + radyo + doğa − ölüm − yatak yetersizliği − kısıtlı tayın. Günde %15 hedefe yaklaşır.
- **Doğa:** Ağaç oranına göre günlük değişim; kesim -0,5, dikim +0,8, çöp toplama +0,15, kompost +0,1, yangın -0,3 karo başına.
- **Küresel:** `D.KURESEL`.
