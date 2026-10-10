/* Site behaviour: menu, basket, collection filters, gallery, variant picker,
   Racket Finder, search and forms. No dependencies. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var gbp = function (n) { return '£' + Number(n).toFixed(2); };
  var escH = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  };
  var isNum = function (v) { return v !== '' && v !== null && !isNaN(Number(v)); };

  var dataPromise;
  function getData() {
    if (!dataPromise) dataPromise = fetch('/data/products.json').then(function (r) { return r.json(); });
    return dataPromise;
  }

  /* ---------- Menu ---------- */
  var menuBtn = $('.menu-btn');
  function setMenu(open) {
    document.body.classList.toggle('nav-open', open);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(true); });
  $$('.menu-close').forEach(function (b) { b.addEventListener('click', function () { setMenu(false); }); });
  $$('.sub-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      var m = document.getElementById(b.getAttribute('aria-controls'));
      var open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open));
      m.classList.toggle('open', open);
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    setMenu(false);
    var nav = $('.nav');
    if (nav && nav.contains(document.activeElement)) {
      document.activeElement.blur();
      nav.classList.add('js-mega-closed');
    }
  });
  var navEl = $('.nav');
  if (navEl) navEl.addEventListener('mousemove', function () { navEl.classList.remove('js-mega-closed'); });

  /* ---------- Basket (localStorage) ---------- */
  var KEY = 'basket.v1';
  function readCart() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function writeCart(lines) {
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch (e) { /* storage blocked */ }
    renderCount();
  }
  function renderCount() {
    var n = readCart().reduce(function (s, l) { return s + l.qty; }, 0);
    $$('[data-cart-count]').forEach(function (el) {
      el.textContent = n;
      if (n) el.removeAttribute('data-zero'); else el.setAttribute('data-zero', '');
    });
  }
  renderCount();

  /* ---------- Product page ---------- */
  var form = $('[data-add-form]');
  if (form) {
    var stockText = $('[data-stock-text]', form);
    var submit = $('button[type=submit]', form);
    var updateStock = function () {
      var v = $('input[name=variant]:checked', form);
      var n = v ? Number(v.getAttribute('data-stock')) : 0;
      stockText.className = 'pdp-stock stock stock-' + (n <= 0 ? 'out' : n <= 3 ? 'low' : 'in');
      stockText.textContent = n <= 0 ? 'Out of stock' : n <= 3 ? 'Low stock: ' + n + ' left' : 'In stock';
    };
    $$('input[name=variant]', form).forEach(function (r) { r.addEventListener('change', updateStock); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('input[name=variant]:checked', form);
      if (!v) return;
      var qty = Number($('[name=qty]', form).value) || 1;
      var max = Number(v.getAttribute('data-stock'));
      var string = $('[name=string]', form);
      var tension = $('[name=tension]', form);
      var strung = string && string.value;
      var addon = form.getAttribute('data-addon');
      var price = Number(form.getAttribute('data-price')) + (strung && isNum(addon) ? Number(addon) : 0);
      var opts = [v.value];
      if (strung) opts.push('Strung: ' + string.value + ' at ' + tension.value);
      var id = form.getAttribute('data-slug') + '|' + opts.join('|');
      var lines = readCart();
      var line = lines.filter(function (l) { return l.id === id; })[0];
      if (line) line.qty = Math.min(line.qty + qty, max);
      else lines.push({
        id: id, slug: form.getAttribute('data-slug'), name: form.getAttribute('data-name'),
        options: opts, price: price, qty: Math.min(qty, max), max: max,
        img: form.getAttribute('data-img'), addonPending: !!(strung && !isNum(addon)),
      });
      writeCart(lines);
      var msg = $('[data-added]', form);
      msg.hidden = false;
      msg.innerHTML = 'Added to your basket. <a href="/cart/">View basket</a>';
    });
    if (submit && !$('input[name=variant]:checked', form)) submit.disabled = true;
  }

  /* ---------- Gallery ---------- */
  $$('[data-gallery]').forEach(function (g) {
    var slides = $$('.gallery-main > [data-idx]', g);
    var btns = $$('[data-show]', g);
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var i = b.getAttribute('data-show');
        slides.forEach(function (s) { s.classList.toggle('active', s.getAttribute('data-idx') === i); });
        btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      });
    });
  });

  /* ---------- Collection filters ---------- */
  var coll = $('[data-collection]');
  if (coll) {
    var fform = $('#filters');
    var grid = $('.grid', coll);
    var cards = $$('.card', grid);
    var original = cards.slice();
    var sortSel = $('#sort');
    var activeBox = $('[data-active]', coll);
    var emptyMsg = $('[data-empty]', coll);
    var params = new URLSearchParams(location.search);

    // Apply URL params (from mega menu links) to the form.
    params.forEach(function (val, key) {
      if (key === 'sort') { sortSel.value = val; return; }
      if (key === 'min' || key === 'max') { var inp = fform.elements[key]; if (inp) inp.value = val; return; }
      $$('input[name="' + key + '"]', fform).forEach(function (c) { if (c.value === val) c.checked = true; });
    });
    if (!params.get('sort')) sortSel.value = coll.getAttribute('data-default-sort') || 'featured';

    var checked = function (name) { return $$('input[name="' + name + '"]:checked', fform).map(function (c) { return c.value; }); };

    var apply = function (push) {
      var f = {
        cat: checked('cat'), brand: checked('brand'), type: checked('type'), weight: checked('weight'),
        balance: checked('balance'), level: checked('level'), stock: checked('stock').length > 0,
      };
      var min = Number(fform.elements.min.value) || 0;
      var max = Number(fform.elements.max.value) || Infinity;
      var shown = 0;
      cards.forEach(function (c) {
        var d = c.dataset;
        var ok =
          (!f.cat.length || f.cat.indexOf(d.cat) > -1) &&
          (!f.brand.length || f.brand.indexOf(d.brand) > -1) &&
          (!f.type.length || f.type.indexOf(d.type) > -1) &&
          (!f.weight.length || f.weight.indexOf(d.weight) > -1) &&
          (!f.balance.length || f.balance.indexOf(d.balance) > -1) &&
          (!f.level.length || d.level.split(' ').some(function (l) { return f.level.indexOf(l) > -1; })) &&
          (!f.stock || d.stock === '1') &&
          Number(d.price) >= min && Number(d.price) <= max;
        c.hidden = !ok;
        if (ok) shown++;
      });

      var s = sortSel.value;
      var sorted = original.slice();
      var cmp = {
        'price-asc': function (a, b) { return a.dataset.price - b.dataset.price; },
        'price-desc': function (a, b) { return b.dataset.price - a.dataset.price; },
        'new': function (a, b) { return b.dataset.added.localeCompare(a.dataset.added); },
        'best': function (a, b) { return a.dataset.best - b.dataset.best; },
        'name': function (a, b) { return a.dataset.name.localeCompare(b.dataset.name); },
      }[s];
      if (cmp) sorted.sort(cmp);
      sorted.forEach(function (c) { grid.appendChild(c); });

      $$('[data-count]').forEach(function (el) { el.textContent = shown; });
      emptyMsg.hidden = shown > 0;

      // Active filter chips
      activeBox.innerHTML = '';
      $$('input[type=checkbox]:checked', fform).forEach(function (c) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = c.parentNode.childNodes[1].textContent.trim() + ' ×';
        b.setAttribute('aria-label', 'Remove filter ' + b.textContent.slice(0, -2));
        b.addEventListener('click', function () { c.checked = false; apply(true); });
        activeBox.appendChild(b);
      });

      if (push) {
        var q = new URLSearchParams();
        ['cat', 'brand', 'type', 'weight', 'balance', 'level'].forEach(function (k) { f[k].forEach(function (v) { q.append(k, v); }); });
        if (f.stock) q.set('stock', '1');
        if (fform.elements.min.value) q.set('min', fform.elements.min.value);
        if (fform.elements.max.value) q.set('max', fform.elements.max.value);
        if (s !== (coll.getAttribute('data-default-sort') || 'featured')) q.set('sort', s);
        var qs = q.toString();
        history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
      }
    };
    fform.addEventListener('change', function () { apply(true); });
    fform.addEventListener('input', function (e) { if (e.target.type === 'number') apply(true); });
    fform.addEventListener('submit', function (e) { e.preventDefault(); });
    fform.addEventListener('reset', function () { setTimeout(function () { apply(true); }, 0); });
    sortSel.addEventListener('change', function () { apply(true); });
    $$('.js-clear', coll).forEach(function (b) { b.addEventListener('click', function () { fform.reset(); }); });
    $$('.js-filters-open').forEach(function (b) {
      b.addEventListener('click', function () { fform.classList.add('open'); document.body.style.overflow = 'hidden'; });
    });
    $$('.js-filters-close').forEach(function (b) {
      b.addEventListener('click', function () { fform.classList.remove('open'); document.body.style.overflow = ''; });
    });
    apply(false);
  }

  /* ---------- Shared card renderer (search, finder) ---------- */
  function card(p) {
    var meta = p.cat === 'rackets' ? [p.weight, p.balance, p.flex].filter(Boolean).join(' · ') : p.type;
    var st = p.stock <= 0 ? ['out', 'Out of stock'] : p.stock <= 3 ? ['low', 'Low stock: ' + p.stock + ' left'] : ['in', 'In stock'];
    var img = p.img
      ? '<img class="photo" src="' + p.img + '" alt="' + escH(p.name) + '" style="aspect-ratio:1/1" loading="lazy">'
      : '<div class="ph" style="aspect-ratio:1/1" role="img" aria-label="' + escH(p.name) + '"><span>Photo: ' + escH(p.name) + '</span></div>';
    return '<article class="card"><a class="card-img" href="/products/' + p.slug + '/" tabindex="-1" aria-hidden="true">' + img +
      '</a><div class="card-body"><p class="label">' + escH(p.brand) + '</p><h3 class="card-title"><a href="/products/' + p.slug + '/">' +
      escH(p.name) + '</a></h3>' + (meta ? '<p class="card-meta">' + escH(meta) + '</p>' : '') +
      '<p class="card-price">£' + p.price + '</p><p class="stock stock-' + st[0] + '">' + st[1] + '</p></div></article>';
  }

  /* ---------- Search ---------- */
  var results = $('[data-search-results]');
  if (results) {
    var q = (new URLSearchParams(location.search).get('q') || '').trim();
    $('#sq').value = q;
    $('#q').value = q;
    var countEl = $('[data-search-count]');
    if (!q) countEl.textContent = 'Type a product name, brand or category.';
    else getData().then(function (d) {
      var terms = q.toLowerCase().split(/\s+/);
      var hits = d.products.filter(function (p) {
        var hay = [p.name, p.brand, p.catLabel, p.type, p.balance, p.weight, (p.level || []).join(' ')].join(' ').toLowerCase();
        return terms.every(function (t) { return hay.indexOf(t) > -1; });
      });
      countEl.textContent = hits.length + ' result' + (hits.length === 1 ? '' : 's') + ' for “' + q + '”';
      results.innerHTML = hits.map(card).join('');
    });
  }

  /* ---------- Racket Finder ---------- */
  var quiz = $('#quiz');
  if (quiz) {
    quiz.addEventListener('submit', function (e) {
      e.preventDefault();
      var a = {};
      new FormData(quiz).forEach(function (v, k) { a[k] = v; });
      var level = a.level === 'returning' ? 'intermediate' : a.level;
      var balance =
        a.want === 'power' ? 'Head heavy' :
        a.want === 'speed' ? 'Head light' :
        a.game === 'singles' || a.game === 'back' ? 'Head heavy' :
        a.game === 'front' ? 'Head light' : 'Even balance';
      var flexOk = {
        slow: ['Flexible', 'Medium'],
        medium: ['Medium', 'Stiff'],
        fast: ['Stiff', 'Extra stiff'],
      }[a.swing];
      if (level === 'beginner') flexOk = ['Flexible', 'Medium'];
      var weight = level === 'beginner' || a.swing === 'slow' ? '4U or 5U' : a.game === 'singles' && a.swing === 'fast' ? '3U or 4U' : '4U';
      var budget = Number(a.budget);
      var minPrice = budget === 160 ? 75 : budget === 999 ? 160 : 0;

      getData().then(function (d) {
        var rackets = d.products.filter(function (p) { return p.cat === 'rackets' && p.type !== 'Junior'; });
        var scored = rackets.map(function (p) {
          var s = 0;
          if (p.level.indexOf(level) > -1) s += 3;
          if (p.balance === balance) s += 2;
          if (flexOk.indexOf(p.flex) > -1) s += 2;
          if (p.price <= budget && p.price >= minPrice) s += 3;
          else if (p.price > budget) s -= 10;
          if (p.stock <= 0) s -= 2;
          return { p: p, s: s };
        }).filter(function (x) { return x.s > 0; })
          .sort(function (x, y) { return y.s - x.s || x.p.price - y.p.price; })
          .slice(0, 4);

        var box = $('#quiz-result');
        box.innerHTML =
          '<div class="result-box"><p class="label">Our suggestion</p><h2>' + escH(balance) + ', ' + escH(flexOk.join(' or ').toLowerCase()) +
          ' shaft, ' + weight + '</h2><p>' +
          (balance === 'Head heavy' ? 'Head-heavy frames add power to smashes and clears from the back of the court. ' :
            balance === 'Head light' ? 'Head-light frames are quicker to bring round for drives, blocks and net play. ' :
            'Even balance gives a bit of power and a bit of speed, which suits players who cover the whole court. ') +
          (flexOk[0] === 'Flexible' ? 'A more flexible shaft helps you get length without a fast swing.' :
            flexOk[1] === 'Extra stiff' ? 'A stiff shaft rewards a fast, well-timed swing with control and a quick response.' :
            'A medium to stiff shaft balances help with length against control.') +
          '</p><p style="margin:0"><a href="/rackets/?balance=' + balance.toLowerCase().replace(/ /g, '-') + '&level=' + level +
          '">See all ' + escH(balance.toLowerCase()) + ' rackets for ' + level + ' players</a></p></div>' +
          (scored.length
            ? '<div class="sec-head"><h2>Rackets that match</h2></div><div class="grid">' + scored.map(function (x) { return card(x.p); }).join('') + '</div>'
            : '<p class="note">Nothing in stock matches all of those answers. Try a wider budget, or <a href="/contact/">ask us</a>.</p>');
        box.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ---------- Basket page ---------- */
  var cartPage = $('[data-cart-page]');
  if (cartPage) {
    var linesEl = $('[data-cart-lines]');
    var render = function () {
      getData().then(function (d) {
        var lines = readCart();
        $('[data-cart-empty]').hidden = lines.length > 0;
        linesEl.innerHTML = lines.map(function (l, i) {
          var qopts = '';
          for (var q = 1; q <= Math.max(l.max || 10, l.qty); q++) qopts += '<option' + (q === l.qty ? ' selected' : '') + '>' + q + '</option>';
          return '<li class="cart-line"><a href="/products/' + l.slug + '/">' +
            (l.img ? '<img class="photo" src="' + l.img + '" alt="" style="aspect-ratio:1/1">' : '<div class="ph" style="aspect-ratio:1/1"><span>Photo</span></div>') +
            '</a><div><h3><a href="/products/' + l.slug + '/">' + escH(l.name) + '</a></h3><p>' + l.options.map(escH).join('<br>') +
            (l.addonPending ? '<br>Stringing charge added at checkout' : '') + '</p>' +
            '<label class="vh" for="lq' + i + '">Quantity</label><select class="qty" id="lq' + i + '" data-line="' + i + '">' + qopts + '</select> ' +
            '<button class="link-btn" type="button" data-remove="' + i + '">Remove</button></div>' +
            '<p style="font-weight:800;color:var(--ink)">' + gbp(l.price * l.qty) + '</p></li>';
        }).join('');
        var sub = lines.reduce(function (s, l) { return s + l.price * l.qty; }, 0);
        var shop = d.shop;
        var del = null;
        var freeMsg = '';
        if (isNum(shop.freeOver) && isNum(shop.delivery)) {
          del = sub >= Number(shop.freeOver) || sub === 0 ? 0 : Number(shop.delivery);
          if (sub > 0 && sub < Number(shop.freeOver)) freeMsg = 'Spend ' + gbp(Number(shop.freeOver) - sub) + ' more for free UK delivery.';
        } else {
          freeMsg = 'Free UK delivery over ' + shop.freeOverLabel + '. Standard delivery ' + shop.deliveryLabel + '.';
        }
        $('[data-subtotal]').textContent = gbp(sub);
        $('[data-delivery]').textContent = del === null ? 'Calculated at checkout' : del === 0 ? (sub ? 'Free' : '£0.00') : gbp(del);
        $('[data-total]').textContent = gbp(sub + (del || 0));
        $('[data-free-msg]').textContent = freeMsg;
        var co = $('[data-checkout]');
        if (co) co.hidden = !lines.length;
      });
    };
    linesEl.addEventListener('change', function (e) {
      var i = e.target.getAttribute('data-line');
      if (i === null) return;
      var lines = readCart();
      lines[i].qty = Number(e.target.value);
      writeCart(lines);
      render();
    });
    linesEl.addEventListener('click', function (e) {
      var i = e.target.getAttribute('data-remove');
      if (i === null) return;
      var lines = readCart();
      lines.splice(Number(i), 1);
      writeCart(lines);
      render();
    });
    render();
  }

  /* ---------- Forms not yet connected ---------- */
  $$('form[data-unconnected]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var old = $('.form-msg', f);
      if (old) old.remove();
      var m = document.createElement('p');
      m.className = 'form-msg';
      m.setAttribute('role', 'status');
      m.textContent = 'This form is not connected yet. Please email or call us instead.';
      f.appendChild(m);
    });
  });
})();
