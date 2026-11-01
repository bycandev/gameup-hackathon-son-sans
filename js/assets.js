// Görselleri karakterler/<ad>.png yolundan tembel yükler; yoksa null döner (çizim yer tutucuya düşer).
var A = (function () {
  var onbellek = {};
  function img(ad) {
    var e = onbellek[ad];
    if (!e) {
      e = onbellek[ad] = { im: new Image(), ok: false, hata: false };
      e.im.onload = function () { e.ok = true; };
      e.im.onerror = function () { e.hata = true; };
      e.im.src = 'karakterler/' + ad + '.png';
    }
    return e.ok ? e.im : null;
  }
  function onYukle(liste) { for (var i = 0; i < liste.length; i++) img(liste[i]); }
  function hepsi() {
    var l = [], k;
    for (var i = 0; i < 11; i++) l.push(['zemin_cimen','zemin_toprak','zemin_kum','zemin_deniz','zemin_sig_su','zemin_dere','zemin_kayalik','zemin_orman','zemin_asfalt','zemin_kaldirim','zemin_moloz'][i]);
    l.push('zemin_kuru_cimen', 'yapi_ruzgar_gulu_kanat', 'efekt_ates', 'efekt_duman');
    for (k in D.NESNE) l.push(D.NESNE[k].s);
    for (k in D.BINA) l.push(D.BINA[k].s);
    for (k in D.OZEL_BINA) l.push(D.OZEL_BINA[k].s);
    for (k in D.EKIN) l.push('ekin_' + k);
    for (k in D.MESLEK) l.push(D.MESLEK[k].rozet);
    for (k in D.KAYNAK) l.push(D.KAYNAK[k].ikon);
    l.push('ekin_filiz', 'ekin_kurumus', 'kahraman_erkek', 'kahraman_kadin', 'insan_erkek', 'insan_kadin', 'insan_cocuk_erkek', 'insan_cocuk_kiz', 'insan_yasli_erkek', 'insan_yasli_kadin');
    l.push('hayvan_tavsan', 'hayvan_kus', 'hayvan_marti', 'hayvan_karaca', 'hayvan_kedi');
    onYukle(l);
  }
  return { img: img, onYukle: onYukle, hepsi: hepsi };
})();
