/* Food Smart website: accounts (same accounts as the app), synced favourites, my recipes, public profiles.
   Config comes from window.FS = {api, lang}; links from hidden anchors #fs-l-* (rewritten by flatten.py). */
(function () {
  var C = window.FS || {}, API = C.api, EN = C.lang === "en", KEY = "fs_token";
  var T = EN ? {
    login: "Sign in", reg: "Create account", forgot: "Forgot password?", email: "E-mail", pass: "Password", nick: "Nickname (3-24 characters)",
    google: "Continue with Google", or: "or", send_code: "Send code", code: "Code received by e-mail", new_pass: "New password", reset: "Set new password",
    code_sent: "If the e-mail is registered you will receive a 6-digit code.", hi: "Hi", logout: "Sign out", new_r: "+ New recipe", my_prof: "My public profile",
    favs: "My favourites", mine: "My recipes", none_f: "No favourites yet: tap ♡ on a recipe.", none_m: "You have not added any recipes yet.",
    edit: "Edit", del: "Delete", del_q: "Delete this recipe? It will also be removed from the app.", on_site: "On the website", private: "Only in the app",
    choose_nick: "Choose your public nickname", save: "Save", saving: "Saving…", err: "Something went wrong, please try again.",
    need_login: "Sign in to save favourites", title: "Title", desc: "Description", serv: "Servings", time: "Total time (min)", diff: "Difficulty",
    ings: "Ingredients", ing: "Ingredient", qty: "Quantity", add_ing: "+ Ingredient", steps: "Method", step: "Describe the step", add_step: "+ Step",
    photo: "Photo", pick: "Choose photo", dessert: "It is a dessert", kids: "Kid-friendly", pub: "Also publish on the website (recipe, photo and nickname visible to everyone)",
    saved: "Recipe saved.", ed_new: "New recipe", ed_edit: "Edit recipe", back: "← My account", recipes_of: "Recipes by", no_pub: "No recipes published on the website yet.",
    notfound: "Profile not found.", diffs: ["Easy", "Medium", "Hard"]
  } : {
    login: "Accedi", reg: "Registrati", forgot: "Password dimenticata?", email: "E-mail", pass: "Password", nick: "Nickname (3-24 caratteri)",
    google: "Continua con Google", or: "oppure", send_code: "Invia codice", code: "Codice ricevuto via e-mail", new_pass: "Nuova password", reset: "Imposta nuova password",
    code_sent: "Se l'e-mail è registrata riceverai un codice di 6 cifre.", hi: "Ciao", logout: "Esci", new_r: "+ Nuova ricetta", my_prof: "Il mio profilo pubblico",
    favs: "I miei preferiti", mine: "Le mie ricette", none_f: "Nessun preferito: tocca ♡ su una ricetta.", none_m: "Non hai ancora aggiunto ricette.",
    edit: "Modifica", del: "Elimina", del_q: "Eliminare questa ricetta? Verrà tolta anche dall'app.", on_site: "Sul sito", private: "Solo nell'app",
    choose_nick: "Scegli il tuo nickname pubblico", save: "Salva", saving: "Salvataggio…", err: "Qualcosa è andato storto, riprova.",
    need_login: "Accedi per salvare i preferiti", title: "Titolo", desc: "Descrizione", serv: "Porzioni", time: "Tempo totale (min)", diff: "Difficoltà",
    ings: "Ingredienti", ing: "Ingrediente", qty: "Quantità", add_ing: "+ Ingrediente", steps: "Procedimento", step: "Descrivi il passaggio", add_step: "+ Passaggio",
    photo: "Foto", pick: "Scegli foto", dessert: "È un dolce", kids: "Adatto ai bambini", pub: "Pubblica anche sul sito (ricetta, foto e nickname visibili a tutti)",
    saved: "Ricetta salvata.", ed_new: "Nuova ricetta", ed_edit: "Modifica ricetta", back: "← Il mio account", recipes_of: "Ricette di", no_pub: "Ancora nessuna ricetta pubblicata sul sito.",
    notfound: "Profilo non trovato.", diffs: ["Facile", "Media", "Difficile"]
  };
  var DIFF = ["Facile", "Media", "Difficile"];
  function L(id) { var a = document.getElementById("fs-l-" + id); return a ? a.href : "#"; }
  function tok() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setTok(t) { try { t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY); } catch (e) { /* private mode */ } }
  function api(path, o) {
    o = o || {}; var h = { "X-Lang": C.lang || "it" }; if (tok()) h.Authorization = "Bearer " + tok();
    if (o.body && !(o.body instanceof FormData)) { h["Content-Type"] = "application/json"; o.body = JSON.stringify(o.body); }
    return fetch(API + path, { method: o.method || "GET", headers: h, body: o.body }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (r.status === 401 && tok()) setTok(null);
        if (!r.ok) { var m = d && d.detail; throw new Error(typeof m === "string" ? m : T.err); } return d;
      });
    });
  }
  function el(tag, a, kids) {
    var e = document.createElement(tag); a = a || {};
    Object.keys(a).forEach(function (k) { if (k === "on") Object.keys(a.on).forEach(function (ev) { e.addEventListener(ev, a.on[ev]); });
      else if (k === "text") e.textContent = a.text; else if (a[k] !== null && a[k] !== undefined && a[k] !== false) e.setAttribute(k, a[k] === true ? "" : a[k]); });
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); }); return e;
  }
  function msg(box, text, ok) { box.textContent = text || ""; box.className = "nmsg" + (text ? (ok ? " ok" : " err") : ""); }
  var meP = null;
  function me() { if (!tok()) return Promise.resolve(null); return meP || (meP = api("/auth/me").catch(function () { return null; })); }

  // ---- header link
  function nav() {
    var a = document.getElementById("fs-nav"); if (!a) return;
    me().then(function (u) { if (u) { a.textContent = "👤 " + (u.nickname || T.hi); } });
  }

  // ---- favourites (hearts with class "fav" and data-id)
  var favIds = null;
  function favs() { return favIds || (favIds = tok() ? api("/favorites/ids").catch(function () { return []; }) : Promise.resolve([])); }
  function heart(b) {
    if (b.dataset.ready) return; b.dataset.ready = "1";
    favs().then(function (ids) { set(ids.indexOf(b.dataset.id) >= 0); });
    function set(on) { b.classList.toggle("on", on); b.textContent = on ? "♥" : "♡"; b.setAttribute("aria-pressed", on ? "true" : "false"); }
    b.addEventListener("click", function () {
      if (!tok()) { location.href = L("acc") + "?next=" + encodeURIComponent(location.href); return; }
      var on = !b.classList.contains("on"); set(on);
      api("/favorites/" + encodeURIComponent(b.dataset.id), { method: on ? "POST" : "DELETE" }).catch(function () { set(!on); });
    });
    b.title = tok() ? "" : T.need_login;
  }
  window.fsFav = function (root) { [].forEach.call((root || document).querySelectorAll(".fav[data-id]"), heart); };

  // ---- images of a recipe returned by the authenticated API
  function photo(r, img) {
    if (!r.image_path && !r.image_url) { img.src = L("logo"); img.className = "noimg"; return; }
    if (!r.author_id) { img.src = API + "/public/official/" + encodeURIComponent(r.id) + "/image"; return; }
    if (r.web_public) { img.src = API + "/public/recipes/" + encodeURIComponent(r.id) + "/image"; return; }
    fetch(API + "/files/" + r.image_path, { headers: { Authorization: "Bearer " + tok() } }).then(function (x) { return x.blob(); })
      .then(function (b) { img.src = URL.createObjectURL(b); }).catch(function () { img.src = L("logo"); });
  }
  function card(r, extra) {
    var href = !r.author_id ? L("orec") + "?id=" + encodeURIComponent(r.id) : r.web_public ? L("crec") + "?id=" + encodeURIComponent(r.id) : L("ed") + "?id=" + encodeURIComponent(r.id);
    var img = el("img", { alt: r.title, loading: "lazy" }); photo(r, img);
    var a = el("a", { "class": "card", href: href }, [img, el("span", { "class": "ct", text: (r.time_minutes ? r.time_minutes + " min" : "") }), el("b", { text: r.title })]);
    return extra ? el("div", { "class": "mycard" }, [a, extra]) : a;
  }

  // ---- account page
  function account(root) {
    var hash = new URLSearchParams(location.hash.slice(1)), sid = hash.get("session_id");
    if (sid) {
      history.replaceState(null, "", location.pathname + location.search);
      root.textContent = "…";
      api("/auth/session", { method: "POST", body: { session_id: sid } }).then(function (d) { setTok(d.session_token); meP = null; done(); })
        .catch(function (e) { setTok(null); auth(root, e.message); });
      return;
    }
    me().then(function (u) { u ? dash(root, u) : auth(root); });
    function done() { nav(); var n = new URLSearchParams(location.search).get("next"); if (n && n.indexOf(location.origin) === 0) location.href = n; else me().then(function (u) { dash(root, u); }); }
    function auth(root, err) {
      root.replaceChildren();
      var mode = "login", box = el("div"), m = el("p", { "class": "nmsg", role: "status" });
      var tabs = el("div", { "class": "chips" }, [["login", T.login], ["reg", T.reg], ["forgot", T.forgot]].map(function (x) {
        return el("button", { type: "button", "data-m": x[0], on: { click: function () { mode = x[0]; draw(); } }, text: x[1] });
      }));
      var g = el("button", { type: "button", "class": "play alt gbtn", on: { click: function () {
        location.href = "https://auth.emergentagent.com/?redirect=" + encodeURIComponent(location.href.split("#")[0]);
      } } , text: "G  " + T.google });
      root.append(el("h1", { text: T.login }), tabs, box, m, el("p", { "class": "count", text: T.or }), g);
      if (err) msg(m, err);
      function inp(type, ph, ac) { return el("input", { type: type, placeholder: ph, "aria-label": ph, autocomplete: ac, required: true }); }
      function draw() {
        [].forEach.call(tabs.children, function (b) { b.className = b.dataset.m === mode ? "on" : ""; }); msg(m, "");
        var e = inp("email", T.email, "email"), p = inp("password", mode === "forgot" ? T.new_pass : T.pass, mode === "login" ? "current-password" : "new-password"),
          n = inp("text", T.nick, "nickname"), c = inp("text", T.code, "one-time-code"), step2 = false;
        var b = el("button", { "class": "play", type: "submit", text: mode === "login" ? T.login : mode === "reg" ? T.reg : T.send_code });
        var f = el("form", { "class": "accf" }, mode === "login" ? [e, p, b] : mode === "reg" ? [e, n, p, b] : [e, b]);
        f.onsubmit = function (ev) {
          ev.preventDefault(); b.disabled = true; msg(m, "");
          var pr = mode === "login" ? api("/auth/login", { method: "POST", body: { email: e.value.trim(), password: p.value } })
            : mode === "reg" ? api("/auth/register", { method: "POST", body: { email: e.value.trim(), password: p.value, nickname: n.value.trim() } })
            : !step2 ? api("/auth/forgot", { method: "POST", body: { email: e.value.trim() } }).then(function () {
              step2 = true; msg(m, T.code_sent, true); f.insertBefore(c, b); f.insertBefore(p, b); b.textContent = T.reset; return null; })
            : api("/auth/reset", { method: "POST", body: { email: e.value.trim(), code: c.value.trim(), password: p.value } });
          pr.then(function (d) { if (d && d.session_token) { setTok(d.session_token); meP = null; done(); } })
            .catch(function (x) { msg(m, x.message); }).then(function () { b.disabled = false; });
        };
        box.replaceChildren(f);
      }
      draw();
    }
  }
  function dash(root, u) {
    root.replaceChildren();
    var m = el("p", { "class": "nmsg", role: "status" });
    root.append(el("h1", { text: T.hi + (u.nickname ? " " + u.nickname : "") + "!" }), el("p", { "class": "meta", text: u.email || "" }));
    if (!u.nickname) {
      var ni = el("input", { type: "text", placeholder: T.nick, "aria-label": T.nick }), nb = el("button", { "class": "play", type: "submit", text: T.save });
      var nf = el("form", { "class": "accf" }, [el("h2", { text: T.choose_nick }), ni, nb]);
      nf.onsubmit = function (ev) { ev.preventDefault(); api("/me/nickname", { method: "PUT", body: { nickname: ni.value.trim() } })
        .then(function () { meP = null; me().then(function (x) { dash(root, x); }); }).catch(function (x) { msg(m, x.message); }); };
      root.append(nf, m); return;
    }
    root.append(el("div", { "class": "btns" }, [el("a", { "class": "play", href: L("ed"), text: T.new_r }),
      el("a", { "class": "play alt", href: L("prof") + "?u=" + encodeURIComponent(u.nickname), text: T.my_prof }),
      el("button", { type: "button", "class": "play alt", on: { click: function () { api("/auth/logout", { method: "POST" }).catch(function () {}).then(function () { setTok(null); meP = null; location.reload(); }); } }, text: T.logout })]), m);
    var gf = el("div", { "class": "grid" }), gm = el("div", { "class": "grid" });
    root.append(el("h2", { text: T.favs }), gf, el("h2", { text: T.mine }), gm);
    api("/recipes?favorites=true").then(function (l) { if (!l.length) gf.append(el("p", { "class": "count", text: T.none_f })); l.forEach(function (r) { gf.append(card(r)); }); });
    api("/recipes?mine=true").then(function (l) {
      if (!l.length) gm.append(el("p", { "class": "count", text: T.none_m }));
      l.forEach(function (r) {
        var bar = el("div", { "class": "mybar" }, [el("span", { "class": "kid", text: r.web_public ? "🌐 " + T.on_site : T.private }),
          el("a", { href: L("ed") + "?id=" + encodeURIComponent(r.id), text: T.edit }),
          el("button", { type: "button", "class": "linkbtn", on: { click: function () { if (!confirm(T.del_q)) return;
            api("/recipes/" + encodeURIComponent(r.id), { method: "DELETE" }).then(function () { bar.parentNode.remove(); }).catch(function (x) { msg(m, x.message); }); } }, text: T.del })]);
        gm.append(card(r, bar));
      });
    });
  }

  // ---- recipe editor (create / edit own recipes, same data as the app)
  function editor(root) {
    var id = new URLSearchParams(location.search).get("id");
    me().then(function (u) {
      if (!u) { location.href = L("acc") + "?next=" + encodeURIComponent(location.href); return; }
      (id ? api("/recipes/" + encodeURIComponent(id) + "?original=true") : Promise.resolve({ ingredients: [{ name: "", quantity: "" }], steps: [""] }))
        .then(function (r) { form(r); }).catch(function (x) { root.textContent = x.message; });
    });
    function form(r) {
      var img = r.image_path || null, m = el("p", { "class": "nmsg", role: "status" });
      function f(type, val, ph, extra) { var i = el(type === "textarea" ? "textarea" : "input", Object.assign({ placeholder: ph, "aria-label": ph }, type === "textarea" ? {} : { type: type }, extra || {})); i.value = val == null ? "" : val; return i; }
      var ti = f("text", r.title, T.title, { maxlength: 120 }), de = f("textarea", r.description, T.desc), se = f("number", r.servings || 2, T.serv, { min: 1, max: 50 }),
        tm = f("number", r.time_minutes || 30, T.time, { min: 1, max: 2880 }), di = el("select", { "aria-label": T.diff }, DIFF.map(function (d, i) { return el("option", { value: d, text: T.diffs[i] }); }));
      di.value = r.difficulty || "Facile";
      var ib = el("div"), sb = el("div");
      function ing(x) { var row = el("div", { "class": "erow" }, [f("text", x.name, T.ing), f("text", x.quantity, T.qty), el("button", { type: "button", "class": "linkbtn", text: "✕", on: { click: function () { row.remove(); } } })]); ib.append(row); }
      function step(x) { var row = el("div", { "class": "erow" }, [f("textarea", x, T.step), el("button", { type: "button", "class": "linkbtn", text: "✕", on: { click: function () { row.remove(); } } })]); sb.append(row); }
      (r.ingredients || []).forEach(ing); (r.steps || []).forEach(step);
      function chk(label, on) { var c = el("input", { type: "checkbox" }); c.checked = !!on; return [c, el("label", { "class": "nc" }, [c, el("span", { text: label })])]; }
      var ds = chk(T.dessert, r.is_dessert), kd = chk(T.kids, r.kid_friendly), wp = chk(T.pub, r.web_public);
      var pv = el("img", { "class": "hero-img", alt: "" }); if (img) photo(r, pv); else pv.hidden = true;
      var file = el("input", { type: "file", accept: "image/jpeg,image/png,image/webp", hidden: true });
      file.onchange = function () { var fl = file.files[0]; if (!fl) return; var fd = new FormData(); fd.append("file", fl); msg(m, T.saving, true);
        api("/upload", { method: "POST", body: fd }).then(function (d) { img = d.path; pv.hidden = false; pv.src = URL.createObjectURL(fl); msg(m, ""); }).catch(function (x) { msg(m, x.message); }); };
      var save = el("button", { "class": "play big", type: "submit", text: T.save });
      var fm = el("form", { "class": "accf editor" }, [el("p", {}, [el("a", { href: L("acc"), text: T.back })]), el("h1", { text: id ? T.ed_edit : T.ed_new }),
        el("label", { text: T.title }), ti, el("label", { text: T.desc }), de, el("div", { "class": "erow3" }, [el("label", {}, [T.serv, se]), el("label", {}, [T.time, tm]), el("label", {}, [T.diff, di])]),
        el("h2", { text: T.photo }), pv, el("button", { type: "button", "class": "play alt", text: T.pick, on: { click: function () { file.click(); } } }), file,
        el("h2", { text: T.ings }), ib, el("button", { type: "button", "class": "linkbtn", text: T.add_ing, on: { click: function () { ing({}); } } }),
        el("h2", { text: T.steps }), sb, el("button", { type: "button", "class": "linkbtn", text: T.add_step, on: { click: function () { step(""); } } }),
        ds[1], kd[1], wp[1], save, m]);
      fm.onsubmit = function (ev) {
        ev.preventDefault();
        var ings = [].map.call(ib.children, function (row) { var i = row.querySelectorAll("input"); return { name: i[0].value.trim(), quantity: i[1].value.trim() }; }).filter(function (x) { return x.name; });
        var steps = [].map.call(sb.children, function (row) { return row.querySelector("textarea").value.trim(); }).filter(Boolean);
        var body = { title: ti.value.trim(), description: de.value.trim(), servings: +se.value || 2, time_minutes: +tm.value || 30, difficulty: di.value,
          image_path: img, ingredients: ings, steps: steps, is_dessert: ds[0].checked, kid_friendly: kd[0].checked, web_public: wp[0].checked,
          category: r.category || null, region: r.region || null, country: r.country || null, age_range: r.age_range || null };
        save.disabled = true; msg(m, T.saving, true);
        api(id ? "/recipes/" + encodeURIComponent(id) : "/recipes", { method: id ? "PUT" : "POST", body: body })
          .then(function (d) { msg(m, T.saved, true); if (!id) { id = d.id; history.replaceState(null, "", "?id=" + encodeURIComponent(d.id)); } })
          .catch(function (x) { msg(m, x.message); }).then(function () { save.disabled = false; });
      };
      root.replaceChildren(fm);
    }
  }

  // ---- public profile
  function profile(root) {
    var u = new URLSearchParams(location.search).get("u");
    if (!u) { root.textContent = T.notfound; return; }
    api("/public/users/" + encodeURIComponent(u) + "?lang=" + (C.lang || "it")).then(function (d) {
      document.title = d.nickname + " – Food Smart";
      var g = el("div", { "class": "grid" });
      root.replaceChildren(el("h1", { text: "👤 " + d.nickname }), el("p", { "class": "lead", text: T.recipes_of + " " + d.nickname }), g);
      if (!d.recipes.length) g.append(el("p", { "class": "count", text: T.no_pub }));
      d.recipes.forEach(function (r) { r.author_id = "x"; r.web_public = true; r.image_path = r.has_image ? "x" : null; g.append(card(r)); });
    }).catch(function () { root.textContent = T.notfound; });
  }

  nav(); window.fsFav();
  var a = document.getElementById("fs-account"), e = document.getElementById("fs-editor"), p = document.getElementById("fs-profile");
  if (a) account(a); if (e) editor(e); if (p) profile(p);
})();
