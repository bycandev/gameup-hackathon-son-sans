# Son Şans (demo)

Tarayıcıda çalışan, tepeden bakılan, iklim odaklı hayatta kalma ve köy kurma oyunu. Saf JavaScript + Canvas; kurulum yok.

## Çalıştırma
- `index.html` dosyasını tarayıcıda aç (çoğu tarayıcıda `file://` ile çalışır), ya da
- `python serve.py` çalıştırıp `http://localhost:8766` adresine git.

## Kontroller
Sol tık seç · Sağ tık emir (kes, topla, yağmala, git, balık, fidan…) · WASD/oklar/sürükleme kamera · Tekerlek zoom · Boşluk duraklat · 1/2/4 hız · B inşa.

## Dosyalar
`js/data.js` veri ve denge · `js/world.js` harita · `js/units.js` köylü davranışı · `js/sim.js` simülasyon (hava, afet, enerji, su, tarım, moral) · `js/questions.js` köylü soruları · `js/story.js` menü, hikâye, izdiham mini oyunu, oyun sonu · `js/ui.js` arayüz · `js/save.js` kayıt.

Hikâye metinleri `js/story.js` içindeki `METIN` nesnesinde, oyun adı `js/data.js` içindeki `D.BASLIK` alanında.

## Yol haritası
- **Bilgisayar sürümü:** Web'den çıkıp Windows, Mac ve Linux için masaüstü oyun (Steam).
- **Daha çok bina ve sistem:** atölye üretim zincirleri, kervan ve radyo, kasaba diplomasisi, deprem, hayvancılık.
- **Daha kapsamlı oynanış:** teknoloji ağacı, bölgesel iklim senaryoları (Akdeniz, Ege, Karadeniz), uzun soluklu hedefler.
- **Online mod:** ortak küresel sıcaklık, gerçek oyuncu kasabaları, kervanla takas.
- **Yapay zekâlı köylü diyalogları** ve dinamik sorular.
- **Eğitim modu:** okullar için öğretmen paneli ve iklim müfredatı.
- **İngilizce, mobil, ses ve müzik.**

## Yayınlama (Coolify)
Depoyu Coolify'a bağla (Private Repository, GitHub App ya da deploy key) → Build Pack: **Dockerfile** → Port: **80**. `Dockerfile` statik dosyaları nginx ile sunar; derleme adımı yoktur.
