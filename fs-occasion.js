/* Food Smart website – temporary section («Il Natale di Food Smart»). Same rules as the app: everything comes from the
   production API, which answers only inside the dates set in the admin panel. Outside them the Home banner is not drawn and
   the page says the section is closed. Two entry points:
   - #fso-banner (Home): festive banner, as chosen in the panel (graphic / recipe photos / uploaded image);
   - #fso (section page): hash router -> home · #regioni · #regione/<name> · #ricette · #ricetta/<id> · #menu */
(function () {
  "use strict";
  var EN = document.documentElement.lang === "en", A = document.getElementById("fs-l-acc"), O = window.FSO || {}, KEY = O.key || "natale";
  // window.FS is written at the end of the page: this file is loaded with "defer", so it is already there
  var API = (window.FS || {}).api, PUB = API + "/public/occasions/" + KEY;
  O.home = (document.getElementById("fso-home") || {}).href; O.dl = (document.getElementById("fso-dl") || {}).href; O.logo = (document.getElementById("fso-logo") || {}).href;
  var IT = {
    closed: "Questa sezione non è disponibile in questo periodo.", back: "← Indietro", home: "Torna alla Home", loading: "Caricamento…",
    a1: "Le tradizioni regionali", a1d: "Scopri i menu delle feste delle 20 regioni italiane.", a2: "Le ricette di Natale", a2d: "Tutte le ricette, per portata, occasione e alimentazione.",
    a3d: "Persone, budget, preferenze e vini: il tuo menu su misura.", n1: "1 ricetta", nn: "{n} ricette", in_: "Natale in {r}", soon: "Le ricette di questa regione sono in arrivo.",
    none: "Nessuna ricetta con questi filtri.", verified: "Mostriamo solo le ricette che Food Smart ha verificato per questa alimentazione.",
    course: { antipasto: "Antipasto", primo: "Primo", secondo: "Secondo", contorno: "Contorno", dolce: "Dolce" },
    moment: { vigilia: "Cena della Vigilia", pranzo: "Pranzo di Natale" },
    diet: { vegetariano: "Vegetariano", vegano: "Vegano", senza_glutine: "Senza glutine", senza_lattosio: "Senza lattosio" },
    ing: "Ingredienti", steps: "Preparazione", story: "La tradizione", serv: "persone", alg: "Allergeni", algp: "Può contenere", noalg: "Nessuno dei 14 allergeni",
    app: "Dosi modificabili, valori nutrizionali, lista della spesa e preferiti: apri la ricetta nell'app Food Smart.", get: "Scarica l'app",
    persons: "Persone", budget: "Budget per il cibo (€)", occ: "Occasione", any: "Qualsiasi", where: "Provenienza", italy: "Tutta Italia", mix: "Completa con altre regioni se manca un piatto adatto",
    courses: "Portate (almeno tre)", prefs: "Preferenze alimentari", allergies: "Allergie e intolleranze", exclude: "Escludi ingredienti (separati da virgola)", style: "Stile", time: "Tempo di preparazione",
    prefsL: { onnivoro: "Onnivoro", carne: "Carne", pesce: "Pesce", vegetariano: "Vegetariano", vegano: "Vegano", vegetale: "Vegetale", senza_glutine: "Senza glutine", senza_lattosio: "Senza lattosio", misto: "Misto" },
    styleL: { tradizionale: "Tradizionale", moderno: "Moderno", economico: "Economico", equilibrato: "Equilibrato qualità/prezzo", ricercato: "Ricercato" },
    timeL: { veloce: "Veloce", medio: "Medio", elaborato: "Elaborato" },
    algL: { glutine: "Glutine", crostacei: "Crostacei", uova: "Uova", pesce: "Pesce", arachidi: "Arachidi", soia: "Soia", latte: "Latte", frutta_a_guscio: "Frutta a guscio", sedano: "Sedano", senape: "Senape", sesamo: "Sesamo", solfiti: "Solfiti", lupini: "Lupini", molluschi: "Molluschi" },
    algNote: "Sono vincoli obbligatori: usiamo solo ricette con allergeni verificati che non contengono, nemmeno in tracce possibili, quelli che escludi. Controlla sempre le etichette.",
    budNote: "Il budget è confrontato con la spesa da fare davvero (confezioni intere). I vini sono una voce a parte.",
    go: "Crea il menu", again: "Rigenera il menu", wait: "Sto componendo il menu…", err: "Operazione non riuscita. Riprova tra poco.",
    within: "✓ Nel budget di {b}", over: "⚠ Supera il budget di {b} di {o}", buy: "Spesa da fare (confezioni intere)", pp: "Spesa a persona", used: "Costo delle quantità usate nei piatti",
    staples: "Prodotti di base (olio, sale, spezie), fuori dal budget", drinks: "Bevande · {n} bottiglie (indicativo)", nop: "prezzo non disponibile", inc: "Conta le bevande nel budget",
    est: "Prezzi stimati, non rilevati in negozio.", ver: "{v} prezzi verificati, {e} stimati.", reduce: "Riduci il costo del menu",
    missing: "Non ci sono ricette compatibili con le tue scelte per questa portata. Non proponiamo alternative non conformi: prova a cambiare regione, tempo o preferenze.",
    change: "Cambia", cheaper: "Più economico", fish: "Di pesce", meat: "Di carne", veg: "Vegetariano", vegan: "Vegano", alt: "In alternativa", soft: "Analcolico", nopair: "Abbinamento non ancora disponibile.",
    wines: "Vini e bevande", wm: { course: "Un vino per portata", single: "Un solo vino", none: "Senza vino" }, covers: "Accompagna bene {a} portate su {b}.",
    plan: "Programma la preparazione", before: "Il giorno prima", same: "Il giorno stesso, in quest'ordine", wa: "Invia su WhatsApp", shop: "Spesa stimata", person: "persona",
    appMenu: "Per salvare il menu, creare la lista della spesa e confrontare due menu usa l'app Food Smart.", cardB: "Scarica il cartoncino (PDF)"
  };
  var ENT = {
    closed: "This section is not available at this time of year.", back: "← Back", home: "Back to Home", loading: "Loading…",
    a1: "Regional traditions", a1d: "Discover the festive menus of Italy's 20 regions.", a2: "Christmas recipes", a2d: "Every recipe, by course, occasion and diet.",
    a3d: "Guests, budget, preferences and wines: your tailor-made menu.", n1: "1 recipe", nn: "{n} recipes", in_: "Christmas in {r}", soon: "Recipes for this region are coming soon.",
    none: "No recipes with these filters.", verified: "Only recipes verified by Food Smart for this diet are shown.",
    course: { antipasto: "Starter", primo: "First course", secondo: "Main course", contorno: "Side dish", dolce: "Dessert" },
    moment: { vigilia: "Christmas Eve dinner", pranzo: "Christmas lunch" },
    diet: { vegetariano: "Vegetarian", vegano: "Vegan", senza_glutine: "Gluten-free", senza_lattosio: "Lactose-free" },
    ing: "Ingredients", steps: "Method", story: "The tradition", serv: "servings", alg: "Allergens", algp: "May contain", noalg: "None of the 14 allergens",
    app: "Adjustable servings, nutrition, shopping list and favourites: open the recipe in the Food Smart app.", get: "Get the app",
    persons: "Guests", budget: "Food budget (€)", occ: "Occasion", any: "Any", where: "Origin", italy: "All of Italy", mix: "Complete with other regions when a suitable dish is missing",
    courses: "Courses (at least three)", prefs: "Dietary preferences", allergies: "Allergies and intolerances", exclude: "Exclude ingredients (comma separated)", style: "Style", time: "Preparation time",
    prefsL: { onnivoro: "Omnivore", carne: "Meat", pesce: "Fish", vegetariano: "Vegetarian", vegano: "Vegan", vegetale: "Plant-based", senza_glutine: "Gluten-free", senza_lattosio: "Lactose-free", misto: "Mixed" },
    styleL: { tradizionale: "Traditional", moderno: "Modern", economico: "Budget", equilibrato: "Balanced quality/price", ricercato: "Refined" },
    timeL: { veloce: "Quick", medio: "Medium", elaborato: "Elaborate" },
    algL: { glutine: "Gluten", crostacei: "Crustaceans", uova: "Eggs", pesce: "Fish", arachidi: "Peanuts", soia: "Soy", latte: "Milk", frutta_a_guscio: "Tree nuts", sedano: "Celery", senape: "Mustard", sesamo: "Sesame", solfiti: "Sulphites", lupini: "Lupin", molluschi: "Molluscs" },
    algNote: "These are mandatory: we only use recipes with verified allergens that do not contain, even as possible traces, the ones you exclude. Always check the labels.",
    budNote: "The budget is compared with what you really have to buy (whole packs). Wines are a separate item.",
    go: "Build the menu", again: "Regenerate the menu", wait: "Building your menu…", err: "Something went wrong. Please try again shortly.",
    within: "✓ Within the {b} budget", over: "⚠ Over the {b} budget by {o}", buy: "Shopping to do (whole packs)", pp: "Shopping per person", used: "Cost of the quantities used in the dishes",
    staples: "Basics (oil, salt, spices), outside the budget", drinks: "Drinks · {n} bottles (indicative)", nop: "price not available", inc: "Count drinks in the budget",
    est: "Estimated prices, not checked in store.", ver: "{v} verified prices, {e} estimated.", reduce: "Reduce the menu cost",
    missing: "There are no recipes compatible with your choices for this course. We never suggest non-compliant alternatives: try changing region, time or preferences.",
    change: "Change", cheaper: "Cheaper", fish: "Fish", meat: "Meat", veg: "Vegetarian", vegan: "Vegan", alt: "Alternatively", soft: "Alcohol-free", nopair: "Pairing not yet available.",
    wines: "Wines and drinks", wm: { course: "A wine per course", single: "One wine", none: "No wine" }, covers: "Goes well with {a} of {b} courses.",
    plan: "Plan the preparation", before: "The day before", same: "On the day, in this order", wa: "Send on WhatsApp", shop: "Estimated shopping", person: "person",
    appMenu: "To save the menu, create the shopping list and compare two menus use the Food Smart app.", cardB: "Download the menu card (PDF)"
  };
  var T = EN ? ENT : IT, COURSES = ["antipasto", "primo", "secondo", "contorno", "dolce"];
  function f(s, v) { return s.replace(/\{(\w+)\}/g, function (_, k) { return v[k]; }); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function put(p, c) { p.appendChild(c); return c; }  // returns the CHILD (add returns the parent)
  function add(p) { for (var i = 1; i < arguments.length; i++) if (arguments[i]) p.appendChild(arguments[i]); return p; }
  function eur(n) { return n == null ? "—" : new Intl.NumberFormat(EN ? "en-GB" : "it-IT", { style: "currency", currency: "EUR" }).format(n); }
  function mins(n) { return n >= 60 ? Math.floor(n / 60) + " h" + (n % 60 ? " " + (n % 60) + " min" : "") : n + " min"; }
  function call(url, body) {
    return fetch(url, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json", "X-Lang": EN ? "en" : "it" }, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) { var e = new Error(typeof d.detail === "string" ? d.detail : T.err); e.status = r.status; throw e; } return d; }); });
  }
  var lang = "lang=" + (EN ? "en" : "it");
  // texts written in the admin panel: English version when the page is English and the text has been translated
  function tx(o, k, fallback) { return EN ? (o.en && o.en[k]) || fallback || o[k] || "" : o[k] || ""; }
  function tr(it, en) { return EN && en ? en : it; }

  // ------------------------------------------------------------ Home banner
  var slot = document.getElementById("fso-banner");
  if (slot) call(API + "/occasions/active").then(function (list) {
    list.forEach(function (o) {
      var a = el("a", "xmas"), photos = o.banner_mode === "ricette" ? (o.banner_recipe_ids || []).map(function (id) { return API + "/public/occasions/" + o.key + "/recipes/" + encodeURIComponent(id) + "/image"; })
        : o.banner_mode === "immagine" && o.image_path ? [API + "/public/occasions/" + o.key + "/image"] : [];
      a.href = (document.getElementById("fso-link") || {}).href; a.setAttribute("data-testid", "xmas-banner");
      if (photos.length) { a.className += " photo"; a.style.backgroundImage = "url('" + photos[0] + "')"; var i = 0; if (photos.length > 1) setInterval(function () { i = (i + 1) % photos.length; a.style.backgroundImage = "url('" + photos[i] + "')"; }, 4500); }
      else add(a, el("span", "tree", "🎄"));
      var b = add(el("div", "xmas-t"), el("b", null, tx(o, "title", "Food Smart Christmas")), el("span", null, tx(o, "subtitle", "A journey through the flavours of Italy's 20 regions: traditions, recipes and your perfect holiday menu.")),
        el("em", null, (tx(o, "cta", "Discover Christmas") || "Scopri") + " →"));
      add(slot, add(a, b)); slot.hidden = false;
    });
  }).catch(function () {});

  // ------------------------------------------------------------ Section page
  var R = document.getElementById("fso");
  if (!R) return;
  var HOME = null, MENU = null, FORM = null;
  function img(src, alt) { var i = el("img"); i.loading = "lazy"; i.alt = alt || ""; i.src = src; return i; }
  function rimg(d) { var i = img(d.has_image ? PUB + "/recipes/" + encodeURIComponent(d.id) + "/image" : O.logo, d.title); if (!d.has_image) i.className = "noimg"; return i; }
  function head(title, back) { R.innerHTML = ""; var b = el("a", "occ-back", back === "" ? T.home : T.back); b.href = back === "" ? O.home : "#" + back; add(R, b, el("h1", null, title)); window.scrollTo(0, 0); }
  function closed(e) { if (e && e.status !== 404) { if (window.console) console.error(e); R.innerHTML = ""; add(R, el("p", "lead", T.err)); return; } R.innerHTML = ""; var a = el("a", "play", T.home); a.href = O.home; add(R, el("p", "lead", T.closed), a); }
  function card(d, showRegion) {
    var a = el("a", "card"); a.href = "#ricetta/" + encodeURIComponent(d.id); a.setAttribute("data-testid", "occ-card");
    return add(a, rimg(d), el("span", "occ-k", [T.course[d.course], showRegion ? d.region : null].filter(Boolean).join(" · ")), el("b", null, d.title),
      el("span", "meta", [d.time_minutes ? d.time_minutes + " min" : null, d.diets.indexOf("vegano") >= 0 ? T.diet.vegano : d.diets.indexOf("vegetariano") >= 0 ? T.diet.vegetariano : null].filter(Boolean).join(" · ")));
  }
  function chips(opts, cur, on, name) {
    var box = el("div", "chips");
    Object.keys(opts).forEach(function (k) { var b = el("button", cur === k ? "on" : null, opts[k]); b.type = "button"; b.setAttribute("data-testid", name + "-" + k); b.onclick = function () { on(cur === k ? null : k); }; add(box, b); });
    return box;
  }
  var V = {
    "": function () {
      head(tx(HOME, "title", "Food Smart Christmas"), "");
      add(R, el("p", "lead", tx(HOME, "subtitle", "A journey through the flavours of Italy's 20 regions. Discover the traditions, cook your favourite dishes and build the perfect menu for your holidays.")));
      var g = el("div", "occ-areas");
      [["regioni", "🗺️", T.a1, T.a1d], ["ricette", "📖", T.a2, T.a2d], ["menu", "⭐", tx(HOME, "generator_title", "My Christmas table") || "Crea il tuo menu", T.a3d]].forEach(function (x) {
        var a = el("a", "occ-area"); a.href = "#" + x[0]; a.setAttribute("data-testid", "occ-area-" + x[0]); add(g, add(a, el("span", "ic", x[1]), add(el("div"), el("b", null, x[2]), el("span", null, x[3]))));
      });
      add(R, g);
    },
    regioni: function () {
      head(T.a1, ""); R.firstChild.href = "#";
      var g = el("div", "grid");
      HOME.regions.forEach(function (r) {
        var a = el("a", "occ-reg"); a.href = "#regione/" + encodeURIComponent(r.name); a.setAttribute("data-testid", "occ-region");
        if (r.image_path) a.style.backgroundImage = "linear-gradient(transparent,rgba(26,24,21,.8)),url('" + PUB + "/image?region=" + encodeURIComponent(r.name) + "')";
        add(g, add(a, el("b", null, r.name), el("span", null, r.count === 1 ? T.n1 : f(T.nn, { n: r.count }))));
      });
      add(R, g);
    },
    regione: function (name) {
      var r = HOME.regions.filter(function (x) { return x.name === name; })[0];
      if (!r) return V.regioni();
      head(f(T.in_, { r: name }), "regioni");
      if (r.image_path) { var ri = img(PUB + "/image?region=" + encodeURIComponent(name), name); ri.className = "hero-img"; add(R, ri); }
      if (r.intro) add(R, el("p", "lead", tr(r.intro, r.intro_en)));
      var g = put(R, el("div", "grid"));
      call(PUB + "/recipes?" + lang + "&region=" + encodeURIComponent(name)).then(function (list) {
        if (!list.length) return add(R, el("p", "count", T.soon));
        list.forEach(function (d) { add(g, card(d)); });
      }).catch(closed);
    },
    ricette: function () {
      head(T.a2, ""); R.firstChild.href = "#";
      var F = { course: null, moment: null, diet: null }, bar = put(R, el("div")), note = put(R, el("p", "note")), g = put(R, el("div", "grid")), msg = put(R, el("p", "count"));
      function draw() {
        bar.innerHTML = "";
        add(bar, chips(T.course, F.course, function (v) { F.course = v; draw(); }, "occ-f-course"), chips(T.moment, F.moment, function (v) { F.moment = v; draw(); }, "occ-f-moment"), chips(T.diet, F.diet, function (v) { F.diet = v; draw(); }, "occ-f-diet"));
        note.textContent = F.diet ? T.verified : ""; msg.textContent = T.loading; g.innerHTML = "";
        var q = Object.keys(F).filter(function (k) { return F[k]; }).map(function (k) { return k + "=" + F[k]; }).join("&");
        call(PUB + "/recipes?" + lang + (q ? "&" + q : "")).then(function (list) { msg.textContent = list.length ? "" : T.none; list.forEach(function (d) { add(g, card(d, true)); }); }).catch(closed);
      }
      draw();
    },
    ricetta: function (id) {
      head("", ""); R.firstChild.href = "javascript:history.back()"; R.firstChild.textContent = T.back;
      var art = put(R, el("article", "recipe")); art.textContent = T.loading;
      call(PUB + "/recipes/" + encodeURIComponent(id) + "?" + lang).then(function (d) {
        art.innerHTML = ""; var h0 = R.querySelector("h1"); if (h0 && h0.parentNode === R) R.removeChild(h0); document.title = d.title + " – Food Smart";
        if (d.has_image) { var hi = rimg(d); hi.className = "hero-img"; add(art, hi); }
        add(art, el("span", "occ-k", [T.course[d.course], d.region].filter(Boolean).join(" · ")), el("h1", null, d.title),
          el("p", "meta", [d.servings ? d.servings + " " + T.serv : null, d.time_minutes ? d.time_minutes + " min" : null].concat(d.diets.map(function (k) { return T.diet[k]; })).filter(Boolean).join(" · ")));
        // *_html: text formatted in the admin panel, already escaped and turned into safe HTML by the server
        if (d.description) { var ld = put(art, el("p", "lead", d.description)); if (d.description_html) ld.innerHTML = d.description_html; }
        if (d.story) { var st = put(art, add(el("section", "occ-story"), el("h2", null, T.story))); if (d.story_html) st.insertAdjacentHTML("beforeend", d.story_html); else add(st, el("p", null, d.story)); }
        var cols = el("div", "cols"), s1 = el("section"), s2 = el("section"), ul = el("ul", "ing"), ol = el("ol", "steps");
        function secAt(list, n) { for (var i = 0; i < (list || []).length; i++) if (list[i].at === n) return list[i].title; return null; }
        (d.ingredients || []).forEach(function (x, n) { var hd = secAt(d.ing_sections, n); if (hd) add(ul, add(el("li", "ing-h"), el("span", null, hd))); add(ul, add(el("li"), el("span", null, x.name), el("b", null, x.quantity || ""))); });
        add(s2, el("h2", null, T.steps), ol);
        (d.steps || []).forEach(function (x, n) { var hd = secAt(d.step_sections, n); if (hd) { ol = el("ol", "steps"); ol.start = n + 1; add(s2, el("h3", "step-h", hd), ol); }
          var li = put(ol, el("li", null, x)); if (d.steps_html && d.steps_html[n]) li.innerHTML = d.steps_html[n]; });
        add(art, add(cols, add(s1, el("h2", null, T.ing), ul), s2));
        if (d.allergens) add(art, el("p", "note", T.alg + ": " + (d.allergens.length ? d.allergens.map(function (k) { return T.algL[k] || k; }).join(", ") : T.noalg) +
          (d.allergens_possible.length ? " · " + T.algp + ": " + d.allergens_possible.map(function (k) { return T.algL[k] || k; }).join(", ") : "")));
        var dl = el("a", "play", T.get); dl.href = O.dl; dl.rel = "noopener";
        add(art, add(el("div", "cta"), el("p", null, T.app), add(el("div", "btns"), dl)));
      }).catch(closed);
    },
    menu: function (region) {
      head(tx(HOME, "generator_title", "My Christmas table") || "Crea il tuo menu", ""); R.firstChild.href = "#";
      var S = FORM || (FORM = { persons: 6, budget: 100, region: null, mix: true, moment: null, style: "tradizionale", time: "elaborato", courses: COURSES.slice(), diets: [], allergens: [], exclude: "" });
      if (region) S.region = region;
      var form = put(R, el("form", "genf")), msg = put(R, el("p", "nmsg")), out = put(R, el("div"));
      form.setAttribute("novalidate", ""); msg.setAttribute("role", "status");
      function sel(label, opts, cur, on, first) {
        var s = el("select"); if (first != null) put(s, el("option", null, first)).value = "";
        Object.keys(opts).forEach(function (k) { var o = put(s, el("option", null, opts[k])); o.value = k; if (String(cur) === k) o.selected = true; });
        s.onchange = function () { on(s.value || null); }; return add(el("label", null, label), s);
      }
      function cks(legend, opts, arr, name) {
        var fs = add(el("fieldset"), el("legend", null, legend));
        Object.keys(opts).forEach(function (k) {
          var c = el("input"); c.type = "checkbox"; c.checked = arr.indexOf(k) >= 0; c.setAttribute("data-testid", name + "-" + k);
          c.onchange = function () { var i = arr.indexOf(k); if (c.checked && i < 0) arr.push(k); if (!c.checked && i >= 0) arr.splice(i, 1); };
          var l = el("label", "ck"); add(l, c); l.appendChild(document.createTextNode(" " + opts[k])); add(fs, l);
        });
        return fs;
      }
      var pn = {}; for (var i = 2; i <= 20; i++) pn[i] = String(i);
      var bud = el("input"); bud.type = "number"; bud.min = 5; bud.max = 5000; bud.step = 1; bud.value = S.budget; bud.setAttribute("list", "fso-b"); bud.setAttribute("data-testid", "occ-budget"); bud.oninput = function () { S.budget = +bud.value; };
      var dlst = el("datalist"); dlst.id = "fso-b"; [30, 50, 80, 100, 150].forEach(function (v) { put(dlst, el("option")).value = v; });
      var regs = {}; HOME.regions.forEach(function (r) { if (r.count) regs[r.name] = r.name; });
      var mix = el("input"); mix.type = "checkbox"; mix.checked = S.mix; mix.onchange = function () { S.mix = mix.checked; };
      var mixl = el("label", "ck"); add(mixl, mix); mixl.appendChild(document.createTextNode(" " + T.mix));
      var exc = el("input"); exc.type = "text"; exc.value = S.exclude; exc.maxLength = 200; exc.className = "occ-in"; exc.oninput = function () { S.exclude = exc.value; };
      var go = el("button", "play big", MENU ? T.again : T.go); go.type = "submit"; go.setAttribute("data-testid", "occ-go");
      add(form, add(el("div", "row"), sel(T.persons, pn, S.persons, function (v) { S.persons = +v; }), add(el("label", null, T.budget), bud, dlst),
        sel(T.occ, T.moment, S.moment, function (v) { S.moment = v; }, T.any), sel(T.where, regs, S.region, function (v) { S.region = v; }, T.italy)),
        el("p", "note", T.budNote), mixl, add(el("div", "row"), sel(T.style, T.styleL, S.style, function (v) { S.style = v; }), sel(T.time, T.timeL, S.time, function (v) { S.time = v; })),
        cks(T.courses, T.course, S.courses, "occ-c"), cks(T.prefs, T.prefsL, S.diets, "occ-d"), cks(T.allergies, T.algL, S.allergens, "occ-a"), el("p", "note", T.algNote),
        add(el("label", null, T.exclude), exc), go);
      function fail(e) { msg.className = "nmsg err"; msg.textContent = e.message || T.err; }
      function act(path, body) { msg.className = "nmsg"; msg.textContent = T.wait; return call(API + "/public/occasions/menus/" + MENU.id + path, body || {}).then(function (m) { MENU = m; msg.textContent = ""; draw(); }).catch(fail); }
      function drink(icon, d) { return add(el("div", "occ-drink"), el("b", null, icon + " " + d.name), el("span", null, [d.type && tr(d.type, d.en && d.en.type), d.region].filter(Boolean).join(" · ")), d.traits ? el("span", null, tr(d.traits, d.en && d.en.traits)) : null, d.reason ? el("span", null, tr(d.reason, d.en && d.en.reason)) : null); }
      function row(l, v, strong) { return add(el("div", "occ-row" + (strong ? " strong" : "")), el("span", null, l), el("b", null, v)); }
      function draw() {
        out.innerHTML = ""; go.textContent = T.again;
        var m = MENU, t = m.totals, P = m.pairing, tot = el("div", "occ-box" + (t.within_budget ? "" : " over"));
        add(out, el("h2", null, tr(m.title, m.title_en)), el("p", "meta", tr(m.description, m.description_en)));
        add(tot, el("b", t.within_budget ? "ok" : "bad", f(t.within_budget ? T.within : T.over, { b: eur(t.budget), o: eur(t.over_eur) })), row(T.buy, eur(t.packs_eur), true), row(T.pp, eur(t.per_person_eur)), row(T.used, eur(t.dish_eur)));
        tot.setAttribute("data-testid", "occ-totals");
        if (t.staples_eur > 0) add(tot, row(T.staples, eur(t.staples_eur)));
        if (P.mode !== "none" && P.bottles) add(tot, row(f(T.drinks, { n: P.bottles }), t.drinks_eur != null ? eur(t.drinks_eur) : T.nop));
        if (t.drinks_eur != null) { var ic = el("input"); ic.type = "checkbox"; ic.checked = t.include_drinks; ic.onchange = function () { act("/options", { include_drinks: ic.checked }); }; var il = el("label", "ck"); add(il, ic); il.appendChild(document.createTextNode(" " + T.inc)); add(tot, il); }
        add(tot, el("p", "note", t.verified_prices ? f(T.ver, { v: t.verified_prices, e: t.estimated_prices }) : T.est));
        if (!t.within_budget) { var rb = el("button", "play alt", T.reduce); rb.type = "button"; rb.onclick = function () { act("/reduce"); }; add(tot, rb); }
        add(out, tot);
        m.missing.forEach(function (x) { var mb = add(el("div", "occ-box over"), el("span", "occ-k", T.course[x.course]), el("p", null, T.missing)); mb.setAttribute("data-testid", "occ-missing"); add(out, mb); });
        m.slots.forEach(function (s) {
          var box = el("div", "occ-box"), a = el("a", "gdish"), pr = P.courses[s.course] || {}, t0 = EN && s.title_en ? s.title_en : s.title;
          box.setAttribute("data-testid", "occ-slot-" + s.course); a.href = "#ricetta/" + encodeURIComponent(s.id);
          add(a, rimg({ id: s.id, title: t0, has_image: !!s.image_path }), add(el("span"), el("span", "occ-k", T.course[s.course] + (s.region ? " · " + s.region : "")), el("b", null, t0), el("span", "meta", eur(s.dish_eur) + (s.minutes ? " · " + mins(s.minutes) : ""))));
          add(box, a);
          if (P.mode === "course") add(box, pr.wine ? drink("🍷", pr.wine) : el("p", "note", T.nopair), pr.wine && pr.alternative ? el("p", "note", T.alt + ": " + pr.alternative.name) : null);
          if (pr.soft) add(box, el("p", "note", "🥤 " + T.soft + ": " + pr.soft.name + (pr.soft.type ? " (" + tr(pr.soft.type, pr.soft.en && pr.soft.en.type) + ")" : "")));
          var hints = [["any", "↻ " + T.change], ["cheaper", T.cheaper]].concat(s.course === "primo" || s.course === "secondo" ? [["pesce", T.fish], ["carne", T.meat], ["vegetariano", T.veg]] : [["vegano", T.vegan]]), hb = el("div", "chips");
          hints.forEach(function (h) { var b = el("button", null, h[1]); b.type = "button"; b.setAttribute("data-testid", "occ-swap-" + s.course + "-" + h[0]); b.onclick = function () { act("/swap", { course: s.course, hint: h[0] }); }; add(hb, b); });
          add(out, add(box, hb));
        });
        var w = add(el("div", "occ-box"), el("h3", null, T.wines), chips(T.wm, P.mode, function (v) { if (v) act("/options", { wine_mode: v }); }, "occ-wine"));
        if (P.mode === "single") add(w, P.single ? drink("🍷", P.single) : el("p", "note", T.nopair), P.single ? el("p", "note", f(T.covers, { a: P.single.covers.length, b: P.single.total })) : null);
        if (P.mode !== "none" && m.responsible_note) add(w, el("p", "note", tr(m.responsible_note, m.responsible_note_en || "Drink responsibly. Alcohol is forbidden under 18 and not advised during pregnancy or when driving: every course also has an alcohol-free suggestion.")));
        var det = add(el("details", "occ-box"), el("summary", null, T.plan)), sc = m.schedule;
        function steps(title, list, total) { if (!list.length) return; var ol = el("ol"); list.forEach(function (x) { add(ol, el("li", null, (EN && x.title_en ? x.title_en : x.title) + (x.minutes ? " (" + mins(x.minutes) + ")" : "") + (x.text ? ": " + tr(x.text, x.text_en) : ""))); }); add(det, el("span", "occ-k", title + " · " + mins(total)), ol); }
        steps(T.before, sc.day_before, sc.day_before_minutes); steps(T.same, sc.same_day, sc.same_day_minutes);
        var wa = el("a", "play", T.wa), dl = el("a", "play alt", T.get); dl.href = O.dl; dl.rel = "noopener"; wa.target = "_blank"; wa.rel = "noopener"; wa.setAttribute("data-testid", "occ-wa");
        wa.href = "https://wa.me/?text=" + encodeURIComponent("🎄 *" + tr(m.title, m.title_en) + "*\n\n" + m.slots.map(function (s) { return "• " + T.course[s.course] + ": " + (EN && s.title_en ? s.title_en : s.title) + (P.courses[s.course] && P.courses[s.course].wine ? " (🍷 " + P.courses[s.course].wine.name + ")" : ""); }).join("\n") +
          (P.single ? "\n\n🍷 " + P.single.name : "") + "\n\n" + T.shop + ": " + eur(t.packs_eur) + " (" + eur(t.per_person_eur) + " / " + T.person + ")\n\nwww.food-smart.it");
        var cd = el("a", "play alt", T.cardB); cd.target = "_blank"; cd.rel = "noopener"; cd.setAttribute("data-testid", "occ-card-pdf");
        cd.href = API + "/public/occasions/menus/" + m.id + "/card.pdf?" + lang;
        add(out, w, det, add(el("div", "btns"), wa, cd, dl), el("p", "note", T.appMenu));
      }
      form.onsubmit = function (e) {
        e.preventDefault();
        if (S.courses.length < 3) { msg.className = "nmsg err"; msg.textContent = T.courses; return; }
        go.disabled = true; msg.className = "nmsg"; msg.textContent = T.wait;
        call(PUB + "/generate", { persons: S.persons, budget: Math.min(5000, Math.max(5, S.budget || 5)), region: S.region, mix: S.mix, moment: S.moment, style: S.style, time: S.time, courses: S.courses, diets: S.diets, allergens: S.allergens,
          exclude: S.exclude.split(",").map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 15), wine_mode: MENU ? MENU.params.wine_mode : "course", include_drinks: MENU ? MENU.params.include_drinks : false })
          .then(function (m) { MENU = m; msg.textContent = ""; draw(); out.scrollIntoView({ behavior: "smooth" }); }).catch(fail).then(function () { go.disabled = false; });
      };
      if (MENU) draw();
    }
  };
  function route() {
    var h = decodeURIComponent(location.hash.replace(/^#/, "")), i = h.indexOf("/"), name = i < 0 ? h : h.slice(0, i), arg = i < 0 ? null : h.slice(i + 1);
    (V[name] || V[""])(arg);
  }
  R.textContent = T.loading;
  call(PUB).then(function (d) { HOME = d; window.addEventListener("hashchange", route); route(); }).catch(closed);
})();
