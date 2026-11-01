var Kayit = (function () {
  var ANA = 'kestanelik_';
  function paketle() {
    var o = {};
    for (var k in G) {
      var v = G[k];
      if (k === 'rand' || k === 'zor' || k === 'etki' || typeof v === 'function') continue;
      if (v instanceof Uint8Array || v instanceof Int32Array) o[k] = Array.prototype.slice.call(v);
      else o[k] = v;
    }
    return JSON.stringify(o);
  }
  function ac(json) {
    var o = JSON.parse(json);
    o.tile = Uint8Array.from(o.tile); o.occ = Int32Array.from(o.occ);
    o.gec = new Uint8Array(D.N * D.N); o.kesif = Uint8Array.from(o.kesif); o.selAlan = Uint8Array.from(o.selAlan);
    o.zor = D.ZORLUK[o.zorKod]; o.rand = U.rng(o.seed + Math.floor(o.dk));
    o.etki = []; o.yatakSay = {};
    G = o;
    for (var i = 0; i < D.N * D.N; i++) W.gecHesapla(i % D.N, (i / D.N) | 0);
    W.VX = o.vx || 24; W.VY = o.vy || 32; o.vx = W.VX; o.vy = W.VY;
    B.idAyarla();
    G.secili = [];
    for (var j = 0; j < G.birim.length; j++) { G.birim[j].secili = false; G.birim[j].red = {}; if (G.birim[j].is) { G.birim[j].is = null; G.birim[j].yol = []; } }
    for (var n = 1; n < G.nesneler.length; n++) if (G.nesneler[n]) delete G.nesneler[n].rez;
    S.saatlik(true);
  }
  function kaydet(yuva) {
    try { localStorage.setItem(ANA + yuva, paketle()); return true; } catch (e) { return false; }
  }
  function var_(yuva) { try { return !!localStorage.getItem(ANA + yuva); } catch (e) { return false; } }
  function yukle(yuva) {
    try { var s = localStorage.getItem(ANA + yuva); if (!s) return false; ac(s); return true; } catch (e) { console.error(e); return false; }
  }
  function enYeni() {
    var a = var_('elle'), b = var_('oto');
    return a ? 'elle' : (b ? 'oto' : null);
  }
  function indir() {
    try {
      var blob = new Blob([paketle()], { type: 'application/json' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'kestanelik_kayit.json';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } catch (e) { alert('Kayıt indirilemedi.'); }
  }
  function dosyadanYukle(dosya, cb) {
    var r = new FileReader();
    r.onload = function () { try { ac(r.result); cb(true); } catch (e) { console.error(e); cb(false); } };
    r.readAsText(dosya);
  }
  return { paketle: paketle, ac: ac, kaydet: kaydet, yukle: yukle, var: var_, enYeni: enYeni, indir: indir, dosyadanYukle: dosyadanYukle };
})();
