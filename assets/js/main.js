/* =========================================================
   ATHAR — Scent & Style · storefront script (vanilla JS)
   ========================================================= */
(() => {
  'use strict';

  // ---------- config (عدّل هنا) ----------
  const CONFIG = {
    whatsapp: '900000000000',   // رقم واتساب بالصيغة الدولية بدون + أو أصفار
    currency: '$',
    freeShipping: 200,
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const img = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;
  const money = n => `${n}${CONFIG.currency}`;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };
  const waLink = text => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

  // ---------- products ----------
  const SIZES = ['S', 'M', 'L', 'XL'];
  const ML = ['50 ml', '100 ml'];
  const PRODUCTS = [
    { id: 'c1', name: 'عباية سَحَر', type: 'clothing', cats: ['abaya', 'women'], cat: 'عبايات', price: 149, img: '1671708279314-b35752992e48', tag: 'جديد', isNew: 1, rank: 2,
      desc: 'عباية كريب ياباني سوداء بنقشة فضية ناعمة على الأطراف. خفيفة، فخمة، وتنسدل بنعومة.' },
    { id: 'c2', name: 'عباية ليالي المطرّزة', type: 'clothing', cats: ['abaya', 'women'], cat: 'عبايات', price: 189, img: '1791598638960-7931c1f83290', tag: 'الأكثر مبيعاً', tagCls: 'gold', rank: 1,
      desc: 'عباية داكنة مطرّزة يدوياً بخيوط ذهبية بنقوش زهرية. قطعة للمناسبات تبقى في الذاكرة.' },
    { id: 'c3', name: 'فستان مدى الدانتيل', type: 'clothing', cats: ['women'], cat: 'نسائي', price: 165, img: '1668619322867-9654664e6a63', rank: 6,
      desc: 'فستان طويل من الدانتيل الناعم بقصّة منسدلة حتى الكاحل، مع بطانة كاملة. للمناسبات والزيارات.' },
    { id: 'c4', name: 'عباية سهرة نجوم', type: 'clothing', cats: ['abaya', 'women'], cat: 'عبايات', price: 175, old: 210, img: '1639155288437-a54c2c55fcad', tag: 'خصم', tagCls: 'oud', rank: 4,
      desc: 'عباية سهرة سوداء مشغولة بالترتر الفضي اللامع. تلمع بهدوء تحت الأضواء.' },
    { id: 'c5', name: 'قفطان نسيم', type: 'clothing', cats: ['abaya', 'women'], cat: 'قفاطين', price: 139, img: '1753192108753-81be0db2f7fe', isNew: 1, rank: 9,
      desc: 'قفطان واسع من الحرير الصناعي بنقشة هندسية وحواف بلون النعناع. خفيف ومريح للبيت والسفر.' },
    { id: 'c6', name: 'قمصان رمل الكتّانية', type: 'clothing', cats: ['women'], cat: 'نسائي', price: 119, img: '1524275461690-a79bfeaf1f3a', tag: 'جديد', isNew: 1, rank: 5,
      desc: 'قمصان طويلة واسعة من الكتان الطبيعي بألوان الأبيض والرمادي. خفيفة ومريحة لأيام الصيف.' },
    { id: 'c7', name: 'معطف تويد خريف', type: 'clothing', cats: ['women'], cat: 'نسائي', price: 210, img: '1722858958066-97deb3471c89', rank: 8,
      desc: 'معطف تويد منسوج بالأبيض والرمادي بقصّة واسعة وطول متوسط. القطعة الأساسية لكل شتاء.' },
    { id: 'c8', name: 'معطف كاميل الرجالي', type: 'clothing', cats: ['men'], cat: 'رجالي', price: 230, img: '1619603364937-8d7af41ef206', rank: 3,
      desc: 'معطف رجالي من الصوف الإيطالي بلون الجمل، بأزرار مخفية وبطانة حريرية.' },
    { id: 'c9', name: 'كنزة ثلج', type: 'clothing', cats: ['men'], cat: 'رجالي', price: 75, img: '1622192613646-1c1b077dbb9b', rank: 10,
      desc: 'كنزة بياقة عالية من القطن الناعم المحبوك. تُلبس وحدها أو تحت المعطف.' },
    { id: 'c10', name: 'قميص ليل', type: 'clothing', cats: ['men'], cat: 'رجالي', price: 69, img: '1744551358303-46edae8b374b', isNew: 1, rank: 11,
      desc: 'قميص أسود من الكتان الثقيل بقصّة مريحة وأكمام قابلة للطي.' },
    { id: 'c11', name: 'جاكيت غيم', type: 'clothing', cats: ['men'], cat: 'رجالي', price: 135, img: '1621343342490-b0ab42b7fcdb', rank: 13,
      desc: 'جاكيت شتوي مبطّن بلون رمادي فاتح، دافئ وخفيف الوزن.' },
    { id: 'p1', name: 'ليل العود', type: 'perfume', cats: ['oriental'], cat: 'عطر شرقي', price: 95, img: '1716857591457-7d7fa45199c6', tag: 'الأكثر مبيعاً', tagCls: 'gold', rank: 1,
      notes: { top: 'هيل، فلفل وردي', heart: 'بخور، جلد', base: 'عود كمبودي، باتشولي' }, profile: { time: 'night', mood: 'warm', power: 'strong' },
      desc: 'عطر ليلي عميق للرجال والنساء. عود داكن يلتف حوله البخور بثبات استثنائي.' },
    { id: 'p2', name: 'ذهب أثَر', type: 'perfume', cats: ['oriental'], cat: 'عطر التوقيع', price: 120, img: '1588405748880-12d1d2a59f75', tag: 'عطر التوقيع', tagCls: 'oud', rank: 0,
      notes: { top: 'زعفران، برغموت', heart: 'ورد طائفي، ياسمين', base: 'عود، عنبر، مسك' }, profile: { time: 'night', mood: 'warm', power: 'medium' },
      desc: 'عطرنا الأشهر. توازن مثالي بين دفء الشرق ونعومة الورد — للمناسبات والأمسيات.' },
    { id: 'p3', name: 'حرير', type: 'perfume', cats: ['floral'], cat: 'عطر فرنسي', price: 85, img: '1733660227163-01bc46e0d7d7', isNew: 1, rank: 7,
      notes: { top: 'كمثرى، ليتشي', heart: 'فاوانيا، زهر البرتقال', base: 'مسك أبيض، خشب الكشمير' }, profile: { time: 'day', mood: 'soft', power: 'light' },
      desc: 'ناعم كالحرير على الجلد. عطر زهري فاكهي يومي يناسب العمل واللقاءات.' },
    { id: 'p4', name: 'عنبر', type: 'perfume', cats: ['oriental'], cat: 'عطر شرقي', price: 78, img: '1638295916768-459f6cf440bc', rank: 8,
      notes: { top: 'قرفة، يوسفي', heart: 'لابدانوم، فانيلا', base: 'عنبر، صندل' }, profile: { time: 'any', mood: 'warm', power: 'medium' },
      desc: 'دفء العنبر والفانيلا في عطر مريح يرافقك من الصباح حتى المساء.' },
    { id: 'p5', name: 'مسك الورد', type: 'perfume', cats: ['floral', 'oriental'], cat: 'عطر زهري', price: 89, img: '1617839400561-d55457a29da2', rank: 4,
      notes: { top: 'توت أحمر', heart: 'ورد بلغاري، مسك الورد', base: 'مسك أبيض، عنبر خفيف' }, profile: { time: 'any', mood: 'soft', power: 'medium' },
      desc: 'باقة ورد غنية ممزوجة بالمسك النظيف. أنثوي، دافئ، ولا يُنسى.' },
    { id: 'p6', name: 'ضوء', type: 'perfume', cats: ['floral'], cat: 'عطر منعش', price: 65, img: '1622618991746-fe6004db3a47', isNew: 1, rank: 12,
      notes: { top: 'ليمون أمالفي، نعناع', heart: 'شاي أبيض، نيرولي', base: 'أرز، مسك' }, profile: { time: 'day', mood: 'fresh', power: 'light' },
      desc: 'انتعاش مشرق كضوء الصباح. حمضيات وشاي أبيض لأيام الصيف الطويلة.' },
    { id: 'p7', name: 'زهر', type: 'perfume', cats: ['floral'], cat: 'عطر فرنسي', price: 72, img: '1613521076081-2820f9746a2d', rank: 9,
      notes: { top: 'برغموت، جريب فروت وردي', heart: 'ياسمين سامباك، زنبق', base: 'مسك، أمبروكسان' }, profile: { time: 'day', mood: 'fresh', power: 'medium' },
      desc: 'زهور بيضاء نقية بلمسة حمضية — عطر نظيف يمنحك حضوراً هادئاً.' },
  ];
  const byId = id => PRODUCTS.find(p => p.id === id);

  // ---------- loader / ready ----------
  const loader = $('#loader');
  const ready = () => {
    document.body.classList.add('ready');
    loader.classList.add('done');
    setTimeout(() => loader.classList.add('gone'), 1200);
  };
  window.addEventListener('load', () => setTimeout(ready, 900));
  setTimeout(ready, 3500); // safety

  // ---------- header ----------
  const header = $('#header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const burger = $('#burger'), nav = $('#nav');
  const toggleMenu = open => {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.classList.toggle('menu-open', open);
    document.body.classList.toggle('lock', open);
  };
  burger.addEventListener('click', () => toggleMenu(!nav.classList.contains('open')));
  $$('#nav a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  // search
  const searchbar = $('#searchbar'), searchInput = $('#searchInput');
  $('#searchBtn').addEventListener('click', () => {
    searchbar.classList.toggle('open');
    if (searchbar.classList.contains('open')) setTimeout(() => searchInput.focus(), 250);
  });
  let searchT;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchT);
    searchT = setTimeout(() => {
      state.q = searchInput.value.trim();
      renderGrid();
      if (state.q) $('#shop').scrollIntoView({ behavior: 'smooth' });
    }, 300);
  });

  // ---------- reveal on scroll ----------
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  // ---------- counters ----------
  const cio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0;
      const t0 = performance.now(), dur = 1800;
      const tick = t => {
        const k = Math.min(1, (t - t0) / dur), v = end * (1 - Math.pow(1 - k, 4));
        el.textContent = dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US');
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$('[data-count]').forEach(el => cio.observe(el));

  // ---------- collections accordion ----------
  const COLLECTIONS = [
    { n: '01', title: 'العبايات', filter: 'abaya', count: '4 تصاميم', img: '1791598638960-7931c1f83290', desc: 'كريب ياباني وتطريز يدوي بخيوط الذهب، وقفاطين واسعة لكل يوم ولكل مناسبة.', tags: ['سَحَر', 'ليالي', 'نجوم', 'نسيم'] },
    { n: '02', title: 'الأزياء النسائية', filter: 'women', count: '3 قطع', img: '1668619322867-9654664e6a63', desc: 'فساتين طويلة وقمصان كتان ومعاطف تويد بألوان هادئة.', tags: ['رمل', 'خريف', 'مدى'] },
    { n: '03', title: 'الأزياء الرجالية', filter: 'men', count: '4 قطع', img: '1617137977259-bb83e191f377', desc: 'قطع أساسية بخامات فاخرة تُبنى عليها خزانة كاملة.', tags: ['كاميل', 'ثلج', 'ليل', 'غيم'] },
    { n: '04', title: 'العطور الشرقية', filter: 'oriental', count: '4 عطور', img: '1716857591457-7d7fa45199c6', desc: 'عود وعنبر وزعفران وبخور — تركيبات دافئة بثبات طويل.', tags: ['ذهب أثر', 'ليل العود', 'عنبر'] },
    { n: '05', title: 'الزهرية والفرنسية', filter: 'floral', count: '4 عطور', img: '1608721279136-cd41b752fa41', desc: 'ورد ومسك وحمضيات بلمسة فرنسية خفيفة للنهار.', tags: ['حرير', 'زهر', 'ضوء', 'مسك الورد'] },
  ];
  const acc = $('#accordion');
  acc.innerHTML = COLLECTIONS.map((c, i) => `
    <button class="acc${i === 0 ? ' is-open' : ''}" data-filter="${c.filter}" aria-label="${c.title}">
      <img src="${img(c.img, 1100)}" alt="" loading="lazy">
      <span class="acc__num">${c.n}</span>
      <span class="acc__vert">${c.title}</span>
      <span class="acc__go"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 7 7 17M8 7h9v9"/></svg></span>
      <span class="acc__body">
        <span class="acc__count">${c.count}</span>
        <span class="acc__title" style="display:block">${c.title}</span>
        <span class="acc__desc" style="display:block">${c.desc}</span>
        <span class="acc__tags">${c.tags.map(t => `<span>${t}</span>`).join('')}</span>
      </span>
    </button>`).join('');
  const openAcc = el => $$('.acc', acc).forEach(a => a.classList.toggle('is-open', a === el));
  $$('.acc', acc).forEach(a => {
    a.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover)').matches) openAcc(a); });
    a.addEventListener('click', () => {
      if (!a.classList.contains('is-open')) { openAcc(a); return; }
      setFilter(a.dataset.filter, true);
    });
  });

  // ---------- shop ----------
  const state = { filter: 'all', sort: 'featured', q: '' };
  let favs = store.get('athar-favs', []);
  const grid = $('#grid');

  const matches = p => {
    const f = state.filter;
    const okF = f === 'all' || p.type === f || p.cats.includes(f);
    const q = state.q.toLowerCase();
    const okQ = !q || (p.name + p.cat + p.desc + (p.notes ? Object.values(p.notes).join(' ') : '')).toLowerCase().includes(q)
      || (q.includes('عطر') && p.type === 'perfume') || (q.includes('عباي') && p.cats.includes('abaya'));
    return okF && okQ;
  };
  const sorters = {
    featured: (a, b) => a.rank - b.rank,
    new: (a, b) => (b.isNew || 0) - (a.isNew || 0) || a.rank - b.rank,
    low: (a, b) => a.price - b.price,
    high: (a, b) => b.price - a.price,
  };
  const heart = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>';

  function renderGrid() {
    const list = PRODUCTS.filter(matches).sort(sorters[state.sort]);
    grid.innerHTML = list.map((p, i) => `
      <article class="card" style="animation-delay:${Math.min(i, 8) * 60}ms">
        <div class="card__media" data-open="${p.id}">
          <img src="${img(p.img, 640)}" alt="${p.name}" loading="lazy">
          ${p.tag ? `<span class="card__tag${p.tagCls ? ' card__tag--' + p.tagCls : ''}">${p.tag}</span>` : ''}
          <button class="card__fav${favs.includes(p.id) ? ' on' : ''}" data-fav="${p.id}" aria-label="أضف للمفضلة">${heart}</button>
          <button class="card__add" data-quickadd="${p.id}">+ أضف للسلة</button>
        </div>
        <div class="card__info">
          <div><p class="card__cat">${p.cat}</p><h3 class="card__name" data-open="${p.id}">${p.name}</h3></div>
          <span class="card__price">${money(p.price)}${p.old ? `<s>${money(p.old)}</s>` : ''}</span>
        </div>
      </article>`).join('');
    $('#empty').hidden = list.length > 0;
    $('#shopCount').textContent = `${list.length} منتج`;
  }

  function setFilter(f, scroll) {
    state.filter = f;
    $$('#filters .chip').forEach(c => c.classList.toggle('is-active', c.dataset.filter === f));
    renderGrid();
    if (scroll) $('#shop').scrollIntoView({ behavior: 'smooth' });
  }
  $('#filters').addEventListener('click', e => { const c = e.target.closest('.chip'); if (c) setFilter(c.dataset.filter); });
  $('#sortSel').addEventListener('change', e => { state.sort = e.target.value; renderGrid(); });
  // links anywhere with data-filter
  $$('a[data-filter]').forEach(a => a.addEventListener('click', () => setFilter(a.dataset.filter)));

  grid.addEventListener('click', e => {
    const fav = e.target.closest('[data-fav]');
    if (fav) {
      e.stopPropagation();
      const id = fav.dataset.fav;
      favs = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id];
      store.set('athar-favs', favs);
      fav.classList.toggle('on');
      toast(favs.includes(id) ? 'أُضيف إلى المفضّلة' : 'أُزيل من المفضّلة');
      return;
    }
    const qa = e.target.closest('[data-quickadd]');
    if (qa) { e.stopPropagation(); openModal(qa.dataset.quickadd); return; }
    const op = e.target.closest('[data-open]');
    if (op) openModal(op.dataset.open);
  });
  renderGrid();

  // ---------- modal ----------
  const modal = $('#modal'), modalBox = $('#modalBox');
  let lastFocus = null;
  function openModal(id) {
    const p = byId(id); if (!p) return;
    lastFocus = document.activeElement;
    const variants = p.type === 'perfume' ? ML : SIZES;
    let variant = variants[p.type === 'perfume' ? 0 : 1], qty = 1;
    const priceFor = v => (p.type === 'perfume' && v === '100 ml') ? Math.round(p.price * 1.55) : p.price;
    modalBox.innerHTML = `
      <button class="icon-btn modal__close" data-close aria-label="إغلاق"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      <img class="modal__img" src="${img(p.img, 900)}" alt="${p.name}">
      <div class="modal__body">
        <p class="modal__cat">${p.cat}</p>
        <h3 class="modal__name">${p.name}</h3>
        <div class="modal__price" id="mPrice">${money(priceFor(variant))}</div>
        <p class="modal__desc">${p.desc}</p>
        ${p.notes ? `<div class="modal__notes"><div><b>المقدّمة:</b> ${p.notes.top}</div><div><b>القلب:</b> ${p.notes.heart}</div><div><b>القاعدة:</b> ${p.notes.base}</div></div>` : ''}
        <div class="modal__label">${p.type === 'perfume' ? 'الحجم' : 'المقاس'}</div>
        <div class="opts" id="mOpts">${variants.map(v => `<button class="${v === variant ? 'is-active' : ''}" data-v="${v}">${v}</button>`).join('')}</div>
        <div class="modal__row">
          <div class="qty"><button data-q="1" aria-label="زيادة">+</button><span id="mQty">1</span><button data-q="-1" aria-label="إنقاص">−</button></div>
          <button class="btn btn--dark" id="mAdd">أضف إلى السلة</button>
        </div>
        <div class="modal__perks"><span>✦ شحن مجاني فوق ${money(CONFIG.freeShipping)}</span><span>✦ استبدال 14 يوماً</span><span>✦ تغليف هدايا</span></div>
      </div>`;
    $('#mOpts', modalBox).addEventListener('click', e => {
      const b = e.target.closest('[data-v]'); if (!b) return;
      variant = b.dataset.v;
      $$('#mOpts button', modalBox).forEach(x => x.classList.toggle('is-active', x === b));
      $('#mPrice', modalBox).textContent = money(priceFor(variant));
    });
    $$('[data-q]', modalBox).forEach(b => b.addEventListener('click', () => {
      qty = Math.max(1, Math.min(9, qty + +b.dataset.q)); $('#mQty', modalBox).textContent = qty;
    }));
    $('#mAdd', modalBox).addEventListener('click', () => {
      addToCart(p.id, variant, qty, priceFor(variant));
      closeModal();
      openDrawer();
    });
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    setTimeout(() => $('#mAdd', modalBox).focus({ preventScroll: true }), 50);
  }
  function closeModal() {
    modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true');
    if (!drawer.classList.contains('open')) document.body.classList.remove('lock');
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('[data-close]')) closeModal(); });
  $$('[data-quick]').forEach(b => b.addEventListener('click', () => openModal(b.dataset.quick)));

  // ---------- cart ----------
  let cart = store.get('athar-cart', []);
  const drawer = $('#drawer'), overlay = $('#overlay');
  const cartTotal = () => cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartQty = () => cart.reduce((s, i) => s + i.qty, 0);

  function addToCart(id, variant, qty, price) {
    const ex = cart.find(i => i.id === id && i.variant === variant);
    if (ex) ex.qty = Math.min(9, ex.qty + qty); else cart.push({ id, variant, qty, price });
    saveCart();
    toast(`أُضيف «${byId(id).name}» إلى السلة`);
    const c = $('#cartCount'); c.classList.add('bump'); setTimeout(() => c.classList.remove('bump'), 400);
  }
  function saveCart() { store.set('athar-cart', cart); renderCart(); }

  function renderCart() {
    const n = cartQty(), total = cartTotal();
    $('#cartCount').textContent = n;
    $('#drawerCount').textContent = n ? `(${n})` : '';
    const left = CONFIG.freeShipping - total;
    $('#shipText').innerHTML = left > 0 ? `أضف <b>${money(left)}</b> للحصول على شحن مجاني` : '🎉 مبروك! طلبك يستحق <b>شحناً مجانياً</b>';
    $('#shipBar').style.width = Math.min(100, (total / CONFIG.freeShipping) * 100) + '%';
    $('#subtotal').textContent = money(total);
    $('#drawerFoot').style.display = n ? '' : 'none';
    const items = $('#drawerItems');
    if (!n) {
      items.innerHTML = `<div class="drawer__empty"><svg><use href="#mark"/></svg><p>سلّتك فارغة حالياً</p><a href="#shop" class="btn btn--dark" data-close-drawer>ابدأ التسوّق</a></div>`;
      return;
    }
    items.innerHTML = cart.map((i, k) => {
      const p = byId(i.id);
      return `<div class="citem">
        <img src="${img(p.img, 200)}" alt="">
        <div><div class="citem__name">${p.name}</div><div class="citem__var">${p.type === 'perfume' ? 'الحجم' : 'المقاس'}: ${i.variant}</div>
          <div class="qty"><button data-ci="${k}" data-d="1" aria-label="زيادة">+</button><span>${i.qty}</span><button data-ci="${k}" data-d="-1" aria-label="إنقاص">−</button></div></div>
        <div class="citem__side"><span class="citem__price">${money(i.price * i.qty)}</span><button class="citem__rm" data-rm="${k}">إزالة</button></div>
      </div>`;
    }).join('');
  }
  $('#drawerItems').addEventListener('click', e => {
    const d = e.target.closest('[data-d]'), rm = e.target.closest('[data-rm]');
    if (d) { const it = cart[+d.dataset.ci]; it.qty += +d.dataset.d; if (it.qty < 1) cart.splice(+d.dataset.ci, 1); else it.qty = Math.min(9, it.qty); saveCart(); }
    if (rm) { cart.splice(+rm.dataset.rm, 1); saveCart(); }
    if (e.target.closest('[data-close-drawer]')) closeDrawer();
  });

  function openDrawer() {
    drawer.classList.add('open'); overlay.classList.add('show'); drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
  }
  function closeDrawer() {
    drawer.classList.remove('open'); overlay.classList.remove('show'); drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
  }
  $('#cartBtn').addEventListener('click', openDrawer);
  $('#drawerClose').addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (modal.classList.contains('open')) closeModal(); else if (drawer.classList.contains('open')) closeDrawer();
    if (nav.classList.contains('open')) toggleMenu(false);
  });

  $('#checkout').addEventListener('click', () => {
    if (!cart.length) return;
    const name = $('#coName').value.trim(), city = $('#coCity').value.trim();
    const lines = cart.map(i => `• ${byId(i.id).name} (${i.variant}) × ${i.qty} = ${money(i.price * i.qty)}`);
    const msg = `مرحباً أثَر 👋\nأرغب بإتمام الطلب التالي:\n\n${lines.join('\n')}\n\nالمجموع: ${money(cartTotal())}${cartTotal() >= CONFIG.freeShipping ? ' (شحن مجاني)' : ''}\n${name ? `\nالاسم: ${name}` : ''}${city ? `\nالمدينة: ${city}` : ''}`;
    window.open(waLink(msg), '_blank', 'noopener');
  });
  renderCart();

  // ---------- signature hotspots ----------
  const NOTES = {
    top: { k: 'المقدّمة', v: 'زعفران · برغموت · هيل — أول 15 دقيقة' },
    heart: { k: 'القلب', v: 'ورد طائفي · ياسمين · بخور — حتى 4 ساعات' },
    base: { k: 'القاعدة', v: 'عود · عنبر · مسك أبيض — يدوم +14 ساعة' },
  };
  const tip = $('#spotTip');
  function showNote(key, spotEl) {
    $$('.pyramid__row').forEach(r => r.classList.toggle('is-active', r.dataset.note === key));
    $$('.spot').forEach(s => s.classList.toggle('is-active', s.dataset.note === key));
    const s = spotEl || $(`.spot[data-note="${key}"]`);
    const box = s.parentElement.getBoundingClientRect(), r = s.getBoundingClientRect();
    tip.innerHTML = `<strong>${NOTES[key].k}</strong>${NOTES[key].v}`;
    const tipW = 230;
    tip.style.right = Math.max(8, Math.min(box.width - tipW - 8, box.right - r.right - tipW / 2 + r.width / 2)) + 'px';
    tip.style.top = (r.bottom - box.top + 10) + 'px';
    tip.classList.add('show');
  }
  $$('.spot').forEach(s => {
    s.addEventListener('mouseenter', () => showNote(s.dataset.note, s));
    s.addEventListener('click', () => showNote(s.dataset.note, s));
    s.addEventListener('mouseleave', () => tip.classList.remove('show'));
  });
  $$('.pyramid__row').forEach(r => {
    r.addEventListener('mouseenter', () => showNote(r.dataset.note));
    r.addEventListener('click', () => showNote(r.dataset.note));
  });
  $('#pyramid').addEventListener('mouseleave', () => tip.classList.remove('show'));

  // ---------- scent finder ----------
  const QUIZ = [
    { key: 'time', q: 'متى تتعطّر غالباً؟', opts: [
      { v: 'day', ic: '☀️', t: 'في النهار', s: 'عمل، جامعة، مشاوير' },
      { v: 'night', ic: '🌙', t: 'في المساء', s: 'سهرات ومناسبات' },
      { v: 'any', ic: '✦', t: 'كل الأوقات', s: 'عطر واحد يرافقني دائماً' } ] },
    { key: 'mood', q: 'أي أجواء تشبهك أكثر؟', opts: [
      { v: 'warm', ic: '🔥', t: 'دافئ وشرقي', s: 'عود، عنبر، بخور' },
      { v: 'fresh', ic: '🍋', t: 'منعش ونظيف', s: 'حمضيات، شاي، نسيم' },
      { v: 'soft', ic: '🌸', t: 'زهري وناعم', s: 'ورد، مسك، فاكهة' } ] },
    { key: 'power', q: 'كم تحب أن يكون عطرك فوّاحاً؟', opts: [
      { v: 'light', ic: '·', t: 'هادئ وقريب', s: 'يشمّه من يقترب منك فقط' },
      { v: 'medium', ic: '··', t: 'متوازن', s: 'حضور لطيف بدون مبالغة' },
      { v: 'strong', ic: '···', t: 'قوي وفوّاح', s: 'يسبقك ويبقى بعدك' } ] },
  ];
  const quiz = $('#quiz'), steps = $$('#finderSteps span');
  let answers = {};
  function renderQ(i) {
    steps.forEach((s, k) => { s.classList.toggle('is-active', k === i); s.classList.toggle('is-done', k < i); });
    if (i >= QUIZ.length) return renderResult();
    const Q = QUIZ[i];
    quiz.innerHTML = `<div class="quiz__q"><span class="quiz__n">السؤال ${i + 1} من ${QUIZ.length}</span><h3 class="quiz__title">${Q.q}</h3>
      <div class="quiz__opts">${Q.opts.map(o => `<button class="opt" data-v="${o.v}"><span class="opt__ic">${o.ic}</span><span><strong>${o.t}</strong><small>${o.s}</small></span></button>`).join('')}</div></div>`;
    $$('.opt', quiz).forEach(b => b.addEventListener('click', () => { answers[Q.key] = b.dataset.v; renderQ(i + 1); }));
  }
  function renderResult() {
    const perfumes = PRODUCTS.filter(p => p.type === 'perfume');
    const score = p => (p.profile.time === answers.time || p.profile.time === 'any' ? 2 : 0) + (p.profile.mood === answers.mood ? 3 : 0) + (p.profile.power === answers.power ? 1.5 : 0) - p.rank * 0.01;
    const best = perfumes.sort((a, b) => score(b) - score(a))[0];
    quiz.innerHTML = `<div class="quiz__result">
      <img src="${img(best.img, 400)}" alt="${best.name}">
      <div><span class="quiz__n">عطرك المثالي</span><h3>${best.name}</h3>
        <p>${best.desc}<br><span style="color:var(--gold-2)">${best.notes.top} · ${best.notes.heart} · ${best.notes.base}</span></p>
        <div class="quiz__actions"><button class="btn btn--gold" data-quick="${best.id}">أضف للسلة · ${money(best.price)}</button><button class="link-btn" id="quizAgain">أعد الاختبار</button></div></div></div>`;
    $('[data-quick]', quiz).addEventListener('click', () => openModal(best.id));
    $('#quizAgain').addEventListener('click', () => { answers = {}; renderQ(0); });
  }
  renderQ(0);

  // ---------- lookbook ----------
  const LOOKS = [
    { img: '1753192108606-b4a2bc9e5661', t: 'قفطان أزرق', s: 'قفاطين', f: 'abaya' },
    { img: '1769107805465-bfd41863f1a0', t: 'ركن الأبيض', s: 'نسائي', f: 'women' },
    { img: '1617137977259-bb83e191f377', t: 'أسود كلاسيكي', s: 'رجالي', f: 'men' },
    { img: '1712425718855-5169714b3632', t: 'أبيض ناعم', s: 'رجالي', f: 'men' },
    { img: '1604882767135-b41fac508fff', t: 'معاطف الموسم', s: 'الأزياء', f: 'clothing' },
    { img: '1445205170230-053b83016050', t: 'خزانة الشتاء', s: 'الأزياء', f: 'clothing' },
  ];
  const track = $('#lbTrack');
  track.innerHTML = LOOKS.map((l, i) => `<div class="lb-item"><div class="lb-item__img"><img src="${img(l.img, 800)}" alt="${l.t}" loading="lazy" draggable="false"><a href="#shop" class="lb-item__shop" data-lf="${l.f}">تسوّق الإطلالة</a></div><div class="lb-item__meta"><strong>${l.t}</strong><span>${String(i + 1).padStart(2, '0')} · ${l.s}</span></div></div>`).join('');
  $$('[data-lf]', track).forEach(a => a.addEventListener('click', () => setFilter(a.dataset.lf)));
  const itemW = () => { const it = $('.lb-item', track); return it ? it.getBoundingClientRect().width + 22 : 300; };
  $('#lbNext').addEventListener('click', () => track.scrollBy({ left: -itemW(), behavior: 'smooth' }));
  $('#lbPrev').addEventListener('click', () => track.scrollBy({ left: itemW(), behavior: 'smooth' }));
  const lbUpdate = () => {
    const max = track.scrollWidth - track.clientWidth;
    const k = max > 0 ? Math.abs(track.scrollLeft) / max : 0;
    $('#lbBar').style.width = (16 + k * 84) + '%';
    const idx = Math.min(LOOKS.length, Math.round(k * (LOOKS.length - 1)) + 1);
    $('#lbCount').textContent = `${String(idx).padStart(2, '0')} / ${String(LOOKS.length).padStart(2, '0')}`;
  };
  track.addEventListener('scroll', lbUpdate, { passive: true });
  // drag to scroll (mouse)
  let down = false, sx = 0, sl = 0, moved = false;
  track.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; track.classList.add('drag'); });
  window.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; track.scrollLeft = sl - dx; });
  window.addEventListener('pointerup', () => { down = false; track.classList.remove('drag'); });
  track.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

  // ---------- gift box opens when seen on touch devices ----------
  const gb = $('#giftbox');
  if (!matchMedia('(hover:hover)').matches) {
    new IntersectionObserver(([e]) => gb.classList.toggle('open', e.isIntersecting), { threshold: 0.6 }).observe(gb);
    $('.gift__hint').textContent = 'هديّتك جاهزة ✦';
  }

  // ---------- contact + whatsapp ----------
  $$('[data-wa]').forEach(a => { a.href = waLink('مرحباً أثَر، لدي استفسار 🌿'); a.target = '_blank'; a.rel = 'noopener'; });
  $$('#topicPills .pill').forEach(p => p.addEventListener('click', () => {
    $$('#topicPills .pill').forEach(x => x.classList.toggle('is-active', x === p));
  }));
  $('#contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target; let ok = true;
    ['name', 'msg'].forEach(n => { const el = f.elements[n]; const bad = !el.value.trim(); el.closest('.field').classList.toggle('err', bad); if (bad) ok = false; });
    if (!ok) { toast('من فضلك أكمل الاسم والرسالة'); return; }
    const topic = $('#topicPills .is-active').textContent;
    const msg = `مرحباً أثَر 👋\nالموضوع: ${topic}\nالاسم: ${f.elements.name.value.trim()}${f.elements.city.value.trim() ? `\nالمدينة: ${f.elements.city.value.trim()}` : ''}\n\n${f.elements.msg.value.trim()}`;
    window.open(waLink(msg), '_blank', 'noopener');
  });
  $('#newsletter').addEventListener('submit', e => {
    e.preventDefault();
    const em = $('#nlEmail');
    if (!em.checkValidity()) { toast('بريد إلكتروني غير صالح'); return; }
    em.value = ''; toast('شكراً لاشتراكك! سيصلك الجديد أولاً');
  });

  // ---------- toast ----------
  let toastT;
  function toast(text) {
    const t = $('#toast'); t.textContent = text; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2400);
  }
})();
