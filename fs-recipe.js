/* Food Smart website: servings counter (same rules as the app, frontend/src/servings.ts) + "Condividi su WhatsApp"
   on every recipe page. Static pages: <article class="recipe" data-serv data-title data-url>; JS pages call window.fsRecipe(root). */
(function () {
  var NUM = /(\d+)\s*\/\s*(\d+)|(\d+(?:[.,]\d+)?)|½/g, WEIGHT = /^\s*(g|gr|ml)\b/i, BIG = /^\s*(kg|l|lt|litr[oi])\b/i, WORD = /^\s*[A-Za-zÀ-ÿ]+/;
  var PL = { pezzo: "pezzi", spicchio: "spicchi", uovo: "uova", tuorlo: "tuorli", albume: "albumi", foglia: "foglie", fetta: "fette",
    fettina: "fettine", cucchiaio: "cucchiai", cucchiaino: "cucchiaini", bicchiere: "bicchieri", mazzetto: "mazzetti", rametto: "rametti",
    filetto: "filetti", foglio: "fogli", tazza: "tazze", bacca: "bacche", pizzico: "pizzichi", bustina: "bustine", litro: "litri",
    confezione: "confezioni", scatola: "scatole", lattina: "lattine", vasetto: "vasetti", barattolo: "barattoli", media: "medie",
    medio: "medi", grande: "grandi", piccolo: "piccoli", piccola: "piccole", clove: "cloves", piece: "pieces", egg: "eggs",
    slice: "slices", leaf: "leaves", tablespoon: "tablespoons", teaspoon: "teaspoons", cup: "cups", pinch: "pinches",
    sprig: "sprigs", bunch: "bunches", yolk: "yolks" };
  var SG = {}; Object.keys(PL).forEach(function (k) { SG[PL[k]] = k; });
  function fmt(v, lang) { var s = v % 1 === 0 ? String(v) : v.toFixed(v < 10 ? 1 : 0).replace(/\.0$/, ""); return lang === "it" ? s.replace(".", ",") : s; }
  function rnd(v, after) {
    if (WEIGHT.test(after)) return v >= 100 ? Math.round(v / 5) * 5 : v >= 10 ? Math.round(v) : Math.max(1, Math.round(v));
    if (BIG.test(after)) return Math.round(v * 100) / 100;
    return Math.max(0.5, Math.round(v * 2) / 2);
  }
  function scale(q, f, lang) {
    if (!q || f === 1) return q;
    var out = "", last = 0, m; NUM.lastIndex = 0;
    while ((m = NUM.exec(q))) {
      var base = m[1] ? Number(m[1]) / Number(m[2]) : m[3] ? Number(m[3].replace(",", ".")) : 0.5;
      if (!base) continue;
      var after = q.slice(m.index + m[0].length), v = rnd(base * f, after);
      out += q.slice(last, m.index) + fmt(v, lang); last = m.index + m[0].length;
      var w = after.match(WORD);
      if (w) {
        var low = w[0].trim().toLowerCase(), rep = v > 1 ? PL[low] : SG[low];
        if (rep && rep !== low) { out += w[0].replace(/[A-Za-zÀ-ÿ]+/, rep); last += w[0].length; }
      }
    }
    return out + q.slice(last);
  }
  var TX = { it: { p: "Porzioni", wa: "Condividi su WhatsApp", ing: "Ingredienti per {n} persone:", less: "Meno porzioni", more: "Più porzioni" },
             en: { p: "Servings", wa: "Share on WhatsApp", ing: "Ingredients for {n} people:", less: "Fewer servings", more: "More servings" } };
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  window.fsScaleQty = scale;
  window.fsRecipe = function (root) {
    var base = +root.dataset.serv, ul = root.querySelector(".ing");
    if (!ul || root.dataset.fsr) return;
    root.dataset.fsr = "1";
    var lang = document.documentElement.lang === "en" ? "en" : "it", t = TX[lang], n = base;
    var bs = [].slice.call(ul.querySelectorAll("li b"));
    bs.forEach(function (b) { if (b.dataset.q == null) b.dataset.q = b.textContent; });
    var title = root.dataset.title || (root.querySelector("h1") || {}).textContent || "", url = root.dataset.url || location.href;
    var box = el("div", "serv"), minus = el("button", null, "−"), plus = el("button", null, "+"), out = el("output", null, String(n));
    minus.type = plus.type = "button"; minus.setAttribute("aria-label", t.less); plus.setAttribute("aria-label", t.more);
    var wa = el("a", "play wa", "💬 " + t.wa); wa.target = "_blank"; wa.rel = "noopener";
    function update() {
      out.textContent = n; minus.disabled = n <= 1; plus.disabled = n >= 20;
      bs.forEach(function (b) { b.textContent = scale(b.dataset.q, n / base, lang); });
      var lines = [].slice.call(ul.querySelectorAll("li")).map(function (li) {
        var s = li.querySelector("span"), b = li.querySelector("b");
        return "• " + (s ? s.textContent : "") + (b && b.textContent ? ": " + b.textContent : "");
      });
      wa.href = "https://wa.me/?text=" + encodeURIComponent(title + "\n\n" + t.ing.replace("{n}", n) + "\n" + lines.join("\n") + "\n\n" + url);
    }
    if (base) {
      minus.onclick = function () { if (n > 1) { n--; update(); } };
      plus.onclick = function () { if (n < 20) { n++; update(); } };
      box.appendChild(el("span", null, t.p)); box.appendChild(minus); box.appendChild(out); box.appendChild(plus);
      ul.parentNode.insertBefore(box, ul);
    }
    var row = el("p", "share"); row.appendChild(wa);
    var meta = root.querySelector(":scope > .tags") || root.querySelector(".lead") || root.querySelector(".meta");
    if (meta) meta.parentNode.insertBefore(row, meta.nextSibling); else root.appendChild(row);
    update();
  };
  function init() { [].forEach.call(document.querySelectorAll("article.recipe[data-serv]"), window.fsRecipe); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
