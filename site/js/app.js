/* 핏썹 FIT'SUP — 체험용 사이트 스크립트
   화면: #main #build #cart #checkout #my-designs #login (해시로 이동) */
(function () {
  'use strict';

  // ---------- 데이터 ----------
  var STYLES = [
    { id: 'surf', name: '서프 스케이트', short: '땅 위에서 서핑하듯 몸을 크게 흔들어(펌핑) 앞으로 나가요.', bias: 1,
      why: '몸을 크게 흔들어도 안정적이도록 한 단계 길게' },
    { id: 'carving', name: '카빙', short: '몸을 좌우로 기울여 S자 커브를 부드럽게 그려요.', bias: 1,
      why: '긴 커브를 편하게 그리도록 한 단계 길게' },
    { id: 'sidewinder', name: '사이드와인더', short: '트럭(바퀴를 잡아 주는 부품)이 더 깊게 꺾여 좁은 곳에서도 짧게 돌아요.', bias: 0,
      why: '짧은 회전에 맞게 기본 길이 그대로' },
    { id: 'cruiser', name: '크루저', short: '동네, 캠퍼스, 역까지 가볍게 밀고 다니고 들고 다니기도 편해요.', bias: -1,
      why: '들고 다니기 편하게 한 단계 짧게' }
  ];
  var LENGTHS = [
    { v: 22, title: '가볍게 들고 다니는 짧은 이동용', desc: '작고 가벼워요. 초보자는 균형에 주의해요.' },
    { v: 27, title: '이동과 재미를 함께 원한다면', desc: '휴대성과 안정성이 균형 잡힌 일상용이에요.' },
    { v: 32, title: '처음 배우거나 안정감이 중요하다면', desc: '발판이 넓어 편안하고 속도를 내기 좋아요. 휴대성은 낮아요.' }
  ];
  var COLORS = {
    deck: [['mint','민트','#8FE3C8'],['white','화이트','#F7F7F2'],['coral','코랄','#FF7A6B'],['blue','블루','#3D6BFF'],['gray','그레이','#9AA0A8'],['black','블랙','#23252A']],
    wheel: [['white','화이트','#F7F7F2'],['mint','민트','#8FE3C8'],['coral','코랄','#FF7A6B'],['yellow','옐로','#FFD84D'],['blue','블루','#3D6BFF'],['black','블랙','#23252A']],
    truck: [['silver','실버','#C9CDD2'],['black','블랙','#23252A'],['gold','골드','#D9B44A'],['coral','코랄','#FF7A6B'],['blue','블루','#3D6BFF'],['mint','민트','#8FE3C8']]
  };
  var PARTS = [
    { id: 'deck', name: '덱', help: '<b>덱</b>은 발을 올리는 판이에요. 보드에서 가장 넓게 보이는 부분이라 분위기를 정해요.' },
    { id: 'wheel', name: '바퀴', help: '<b>바퀴</b>는 땅에 닿아 굴러가는 부분이에요. 크루저 바퀴는 말랑해서 울퉁불퉁한 길도 부드럽게 지나가요.' },
    { id: 'truck', name: '트럭', help: '<b>트럭</b>은 덱 아래에서 바퀴를 잡아 주고, 몸을 기울이면 방향을 틀어 주는 부품이에요.' }
  ];
  var PATTERNS = [['plain','무지'],['stripe','스트라이프'],['checker','체커'],['wave','웨이브']];
  var SHOES = []; for (var s = 220; s <= 300; s += 5) SHOES.push(s);

  function colorOf(part, id) { var l = COLORS[part]; for (var i = 0; i < l.length; i++) if (l[i][0] === id) return l[i]; return l[0]; }
  function styleOf(id) { for (var i = 0; i < STYLES.length; i++) if (STYLES[i].id === id) return STYLES[i]; return null; }
  function patternName(id) { for (var i = 0; i < PATTERNS.length; i++) if (PATTERNS[i][0] === id) return PATTERNS[i][1]; return '무지'; }
  function isDark(hex) { var n = parseInt(hex.slice(1), 16); var r = n >> 16, g = (n >> 8) & 255, b = n & 255; return (0.299 * r + 0.587 * g + 0.114 * b) < 140; }
  function jong(w) { var c = w.charCodeAt(w.length - 1) - 0xAC00; return c >= 0 && c <= 11171 ? c % 28 : 0; }
  function euro(w) { var j = jong(w); return w + (j === 0 || j === 8 ? '로' : '으로'); }
  function eunNeun(w) { return w + (jong(w) ? '은' : '는'); }
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  // ---------- 저장 (이 브라우저에만, 실패해도 동작) ----------
  var KEY = 'fitsup.v1';
  var mem = null;
  function load() {
    if (mem) return mem;
    var d = null;
    try { d = JSON.parse(localStorage.getItem(KEY)); } catch (e) { d = null; }
    mem = d || {};
    mem.cart = mem.cart || [];
    mem.saved = mem.saved || [];
    mem.loggedIn = !!mem.loggedIn;
    mem.design = mem.design || null;
    return mem;
  }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* 저장 안 돼도 화면은 그대로 */ } }

  function defaultDesign() { return { style: '', length: 0, deck: 'mint', wheel: 'white', truck: 'silver', pattern: 'plain', text: '' }; }
  var st = load();
  var D = st.design || defaultDesign();
  var activePart = 'deck';
  var recommended = 0;

  // ---------- 보드 그림 ----------
  var uid = 0;
  function patternDef(id, kind, deckHex) {
    var c = isDark(deckHex) ? 'rgba(255,255,255,.28)' : 'rgba(21,23,28,.22)';
    if (kind === 'stripe') return '<pattern id="' + id + '" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="12" height="28" fill="' + c + '"/></pattern>';
    if (kind === 'checker') return '<pattern id="' + id + '" width="32" height="32" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="' + c + '"/><rect x="16" y="16" width="16" height="16" fill="' + c + '"/></pattern>';
    if (kind === 'wave') return '<pattern id="' + id + '" width="60" height="26" patternUnits="userSpaceOnUse"><path d="M0 13 Q15 1 30 13 T60 13" fill="none" stroke="' + c + '" stroke-width="6"/></pattern>';
    return '';
  }
  function geom(len) {
    var w = { 22: 440, 27: 540, 32: 640 }[len] || 540;
    var h = { 22: 116, 27: 128, 32: 138 }[len] || 128;
    return { w: w, h: h, x: (720 - w) / 2 };
  }
  function topSVG(d, label) {
    var g = geom(d.length || 27), deck = colorOf('deck', d.deck)[2], wheel = colorOf('wheel', d.wheel)[2];
    var y = (210 - g.h) / 2, pid = 'p' + (++uid), cid = 'c' + uid;
    var dark = isDark(deck);
    var wx = [g.x + g.w * 0.19, g.x + g.w * 0.81];
    var s = '<svg viewBox="0 0 720 210" role="img" aria-label="' + esc(label || describe(d)) + '" xmlns="http://www.w3.org/2000/svg">';
    s += '<defs>' + patternDef(pid, d.pattern, deck) + '<clipPath id="' + cid + '"><rect x="' + g.x + '" y="' + y + '" width="' + g.w + '" height="' + g.h + '" rx="' + (g.h / 2) + '"/></clipPath></defs>';
    wx.forEach(function (x) {
      s += '<rect x="' + (x - 22) + '" y="' + (y - 16) + '" width="44" height="30" rx="8" fill="' + wheel + '" stroke="#15171C" stroke-width="3"/>';
      s += '<rect x="' + (x - 22) + '" y="' + (y + g.h - 14) + '" width="44" height="30" rx="8" fill="' + wheel + '" stroke="#15171C" stroke-width="3"/>';
    });
    s += '<rect x="' + g.x + '" y="' + y + '" width="' + g.w + '" height="' + g.h + '" rx="' + (g.h / 2) + '" fill="' + deck + '"/>';
    if (d.pattern && d.pattern !== 'plain') s += '<rect x="' + g.x + '" y="' + y + '" width="' + g.w + '" height="' + g.h + '" fill="url(#' + pid + ')" clip-path="url(#' + cid + ')"/>';
    wx.forEach(function (x) {
      [[-12, -14], [12, -14], [-12, 14], [12, 14]].forEach(function (o) {
        s += '<circle cx="' + (x + o[0]) + '" cy="' + (105 + o[1]) + '" r="4" fill="' + (dark ? '#ffffff' : '#15171C') + '" opacity=".55"/>';
      });
    });
    if (d.text) {
      var fs = Math.min(g.h * 0.36, (g.w * 0.5) / Math.max(3, d.text.length) * 1.7);
      s += '<text x="360" y="105" text-anchor="middle" dominant-baseline="central" font-family="Black Han Sans, Noto Sans KR, sans-serif" font-size="' + fs.toFixed(1) + '" fill="' + (dark ? '#FFFFFF' : '#15171C') + '" stroke="' + (dark ? '#15171C' : '#FFFFFF') + '" stroke-width="3" paint-order="stroke">' + esc(d.text) + '</text>';
    }
    s += '<rect x="' + g.x + '" y="' + y + '" width="' + g.w + '" height="' + g.h + '" rx="' + (g.h / 2) + '" fill="none" stroke="#15171C" stroke-width="4"/>';
    return s + '</svg>';
  }
  function sideSVG(d) {
    var g = geom(d.length || 27), deck = colorOf('deck', d.deck)[2], wheel = colorOf('wheel', d.wheel)[2], truck = colorOf('truck', d.truck)[2];
    var x0 = g.x, x1 = g.x + g.w;
    var s = '<svg viewBox="0 0 720 150" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">';
    s += '<line x1="40" y1="140" x2="680" y2="140" stroke="#CFD1CA" stroke-width="3" stroke-linecap="round"/>';
    [x0 + g.w * 0.19, x0 + g.w * 0.81].forEach(function (x) {
      s += '<path d="M' + (x - 26) + ' 56 L' + (x + 26) + ' 56 L' + (x + 12) + ' 74 L' + (x + 34) + ' 84 L' + (x - 34) + ' 84 L' + (x - 12) + ' 74 Z" fill="' + truck + '" stroke="#15171C" stroke-width="3" stroke-linejoin="round"/>';
      s += '<circle cx="' + x + '" cy="108" r="30" fill="' + wheel + '" stroke="#15171C" stroke-width="3"/><circle cx="' + x + '" cy="108" r="8" fill="#15171C" opacity=".35"/>';
    });
    s += '<path d="M' + (x0 + 26) + ' 42 L' + (x1 - 70) + ' 42 Q' + (x1 - 24) + ' 42 ' + x1 + ' 24 L' + (x1 + 4) + ' 34 Q' + (x1 - 22) + ' 56 ' + (x1 - 70) + ' 56 L' + (x0 + 26) + ' 56 Q' + x0 + ' 56 ' + x0 + ' 49 Q' + x0 + ' 42 ' + (x0 + 26) + ' 42 Z" fill="' + deck + '" stroke="#15171C" stroke-width="3" stroke-linejoin="round"/>';
    return s + '</svg>';
  }
  function describe(d) {
    var parts = [];
    var sty = styleOf(d.style);
    if (sty) parts.push(sty.name);
    parts.push((d.length || 27) + '인치');
    parts.push(colorOf('deck', d.deck)[1] + ' 덱');
    parts.push(colorOf('wheel', d.wheel)[1] + ' 바퀴');
    parts.push(colorOf('truck', d.truck)[1] + ' 트럭');
    parts.push(patternName(d.pattern));
    parts.push(d.text ? '문구 “' + d.text + '”' : '문구 없음');
    return parts.join(' · ');
  }
  function boardName(d) {
    var sty = styleOf(d.style);
    return colorOf('deck', d.deck)[1] + ' ' + (sty ? sty.name : '크루저') + ' 보드 · ' + (d.length || 27) + '인치';
  }

  // ---------- 공통 ----------
  var $ = function (id) { return document.getElementById(id); };
  var toastTimer;
  function toast(html) {
    var t = $('toast'); t.innerHTML = html; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 6000);
  }
  function save() { st.design = D; persist(); }
  function updateHeader() {
    var n = st.cart.length;
    var b = $('cart-count'); b.textContent = n; b.setAttribute('aria-label', '담은 보드 ' + n + '개');
    $('login-link').textContent = st.loggedIn ? '로그아웃' : '로그인';
  }

  // ---------- 라우팅 ----------
  var VIEWS = ['main', 'build', 'cart', 'checkout', 'my-designs', 'login'];
  function route() {
    var h = (location.hash || '').replace('#', '');
    if (h === 'step1' || h === 'step2') return; // 페이지 안 이동
    var v = VIEWS.indexOf(h) >= 0 ? h : 'main';
    VIEWS.forEach(function (name) { $('view-' + name).hidden = name !== v; });
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    var view = $('view-' + v);
    document.title = view.getAttribute('data-title');
    if (v === 'build') renderBuild();
    if (v === 'cart') renderCart();
    if (v === 'checkout') renderCheckout();
    if (v === 'my-designs') renderMy();
    if (v === 'login') renderLogin();
    window.scrollTo(0, 0);
    var h1 = view.querySelector('h1');
    if (h1 && route.started) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
    route.started = true;
  }

  // ---------- 메인 ----------
  var STYLE_ART = {
    surf: '<path d="M20 90 Q60 40 100 90 T180 90" fill="none" stroke="#15171C" stroke-width="6" stroke-linecap="round"/><path d="M20 112 Q60 62 100 112 T180 112" fill="none" stroke="#15171C" stroke-width="3" stroke-linecap="round" opacity=".4"/>',
    carving: '<path d="M30 130 C 70 130, 70 70, 110 70 S 150 20, 175 20" fill="none" stroke="#15171C" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 14"/><circle cx="175" cy="20" r="9" fill="#15171C"/>',
    sidewinder: '<path d="M40 120 L80 60 L120 120 L160 60" fill="none" stroke="#15171C" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="160" cy="60" r="9" fill="#15171C"/>',
    cruiser: '<line x1="20" y1="100" x2="180" y2="100" stroke="#15171C" stroke-width="6" stroke-linecap="round"/><line x1="30" y1="76" x2="80" y2="76" stroke="#15171C" stroke-width="4" stroke-linecap="round" opacity=".4"/><line x1="40" y1="124" x2="110" y2="124" stroke="#15171C" stroke-width="4" stroke-linecap="round" opacity=".4"/><polygon points="168,88 192,100 168,112" fill="#15171C"/>'
  };
  function renderMain() {
    $('hero-svg').innerHTML = topSVG({ style: 'cruiser', length: 27, deck: 'coral', wheel: 'mint', truck: 'silver', pattern: 'checker', text: "WHAT'S UP" }, '예시 보드') +
      sideSVG({ length: 27, deck: 'coral', wheel: 'mint', truck: 'silver' });
    $('main-styles').innerHTML = STYLES.map(function (s) {
      return '<li class="style-card"><div class="style-art"><svg viewBox="0 0 200 150" width="70%" aria-hidden="true">' + STYLE_ART[s.id] + '</svg></div>' +
        '<div class="style-body"><h3>' + s.name + '</h3><p>' + s.short + '</p><a href="#build" data-start-style="' + s.id + '" data-id="B01-2">' + euro(s.name) + ' 시작하기 →</a></div></li>';
    }).join('');
  }

  // ---------- 보드 만들기 ----------
  function radio(name, value, checked, inner, cls) {
    var id = name + '-' + value;
    return '<label class="choice ' + (cls || '') + '" for="' + id + '"><input type="radio" id="' + id + '" name="' + name + '" value="' + value + '"' + (checked ? ' checked' : '') + '><span class="box">' + inner + '</span><span class="check" aria-hidden="true">✓</span></label>';
  }
  function renderBuild() {
    // 스타일
    $('style-choices').innerHTML = STYLES.map(function (s) {
      return radio('style', s.id, D.style === s.id, '<strong>' + s.name + '</strong><span>' + s.short + '</span>');
    }).join('');
    // 신발
    var sel = $('in-shoe');
    if (sel.options.length < 2) SHOES.forEach(function (v) { var o = document.createElement('option'); o.value = v; o.textContent = v + 'mm'; sel.appendChild(o); });
    renderLengths();
    renderDesign();
  }
  function renderLengths() {
    $('len-cards').innerHTML = LENGTHS.map(function (l) {
      var mini = { length: l.v, deck: D.deck, wheel: D.wheel, truck: D.truck, pattern: D.pattern, text: '' };
      return radio('length', l.v, D.length === l.v,
        (recommended === l.v ? '<span class="rec-badge">추천</span>' : '') +
        '<strong class="len-name">' + l.v + '인치</strong><span class="len-art">' + topSVG(mini, l.v + '인치 보드') + '</span>' +
        '<strong>' + l.title + '</strong><span>' + l.desc + '</span>');
    }).join('');
  }
  function renderDesign() {
    $('seg-len').innerHTML = LENGTHS.map(function (l) {
      var id = 'seglen-' + l.v;
      return '<label for="' + id + '"><input type="radio" id="' + id + '" name="seglen" value="' + l.v + '"' + ((D.length || 27) === l.v ? ' checked' : '') + '><span>' + l.v + '인치</span></label>';
    }).join('');
    $('part-tabs').innerHTML = PARTS.map(function (p) {
      return '<button type="button" role="tab" id="tab-' + p.id + '" aria-selected="' + (p.id === activePart) + '" tabindex="' + (p.id === activePart ? 0 : -1) + '" data-part="' + p.id + '">' + p.name + '</button>';
    }).join('');
    var part = PARTS.filter(function (p) { return p.id === activePart; })[0];
    $('part-help').innerHTML = part.help;
    $('color-legend').textContent = part.name + ' 색상';
    $('swatches').innerHTML = COLORS[activePart].map(function (c) {
      return radio('color', c[0], D[activePart] === c[0], '<span class="dot" style="background:' + c[2] + '"></span><span>' + c[1] + '</span>', 'swatch');
    }).join('');
    $('patterns').innerHTML = PATTERNS.map(function (p) {
      var mini = { length: 22, deck: D.deck, wheel: D.wheel, truck: D.truck, pattern: p[0], text: '' };
      return radio('pattern', p[0], D.pattern === p[0], topSVG(mini, p[1] + ' 무늬') + '<span>' + p[1] + '</span>', 'pattern');
    }).join('');
    var ti = $('in-text'); if (document.activeElement !== ti) ti.value = D.text || '';
    $('text-count').textContent = (D.text || '').length;
    renderPreview();
  }
  function renderPreview() {
    if (!D.length) D.length = recommended || 27;
    $('pv-top').innerHTML = topSVG(D);
    $('pv-side').innerHTML = sideSVG(D);
    var txt = '선택한 보드 · ' + describe(D);
    $('combo').textContent = txt;
    $('price-combo').textContent = describe(D);
    save();
  }
  function recommend(h, shoe, styleId) {
    // 예시 규칙 (추후 결정): 키·신발로 기본 길이 → 스타일로 한 단계 조정
    var base = 1;
    if (h < 160 || shoe <= 235) base = 0;
    if (h >= 180 || shoe >= 275) base = 2;
    var sty = styleOf(styleId);
    var idx = Math.max(0, Math.min(2, base + (sty ? sty.bias : 0)));
    return { base: [22, 27, 32][base], len: [22, 27, 32][idx], sty: sty };
  }
  function setErr(input, errId, msg) {
    $(errId).textContent = msg || '';
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  }
  function onRecommend(e) {
    e.preventDefault();
    var hi = $('in-height'), si = $('in-shoe');
    var h = parseInt(hi.value, 10), shoe = parseInt(si.value, 10);
    var ok = true;
    if (!h || h < 120 || h > 210) { setErr(hi, 'err-height', '키를 120~210 사이 숫자로 입력해 주세요. 예: 170'); ok = false; } else setErr(hi, 'err-height');
    if (!shoe) { setErr(si, 'err-shoe', '신발 사이즈를 골라 주세요.'); ok = false; } else setErr(si, 'err-shoe');
    if (!D.style) { $('rec-result').innerHTML = '타는 스타일을 먼저 골라 주세요. 스타일에 따라 맞는 길이가 달라져요.'; ok = false; }
    if (!ok) { var first = document.querySelector('#rec-form [aria-invalid="true"]') || $('style-choices').querySelector('input'); if (first) first.focus(); return; }
    var r = recommend(h, shoe, D.style);
    recommended = r.len; D.length = r.len;
    var line = '키 ' + h + 'cm · 신발 ' + shoe + 'mm 기준으로는 ' + r.base + '인치예요.';
    if (r.len !== r.base) line += ' ' + eunNeun(r.sty.name) + ' ' + r.sty.why + ' 추천했어요.';
    $('rec-result').innerHTML = '<strong>' + r.len + '인치를 추천해요!</strong><br>' + esc(line) + '<br><span class="small muted">추천은 확인용 예시 규칙이에요. 아래에서 다른 길이를 골라도 돼요.</span>';
    renderLengths(); renderDesign();
  }

  function addToCart() {
    st.cart.push({ id: Date.now(), d: JSON.parse(JSON.stringify(D)) });
    persist(); updateHeader();
    toast('장바구니에 담았어요. <a href="#cart" data-id="B02-7">장바구니 보기</a> <button type="button" data-close-toast data-id="B02-8">계속 꾸미기</button>');
  }
  function doSaveDesign() {
    st.saved.unshift({ id: Date.now(), d: JSON.parse(JSON.stringify(D)) });
    persist();
    toast('디자인을 저장했어요. <a href="#my-designs" data-id="B02-9">내 디자인 보기</a>');
  }
  function doSaveImage() {
    var svgText = topSVG(D).replace('<svg ', '<svg width="1440" height="420" ');
    var img = new Image();
    img.onload = function () {
      var c = document.createElement('canvas'); c.width = 1440; c.height = 560;
      var x = c.getContext('2d');
      x.fillStyle = '#EFEFEA'; x.fillRect(0, 0, c.width, c.height);
      x.drawImage(img, 0, 20);
      x.fillStyle = '#15171C'; x.font = '900 30px "Noto Sans KR", sans-serif'; x.fillText("핏썹 FIT'SUP", 60, 480);
      x.font = '500 22px "Noto Sans KR", sans-serif'; x.fillText(describe(D), 60, 520);
      var url = c.toDataURL('image/png');
      $('img-out').src = url; $('img-out').alt = '미리보기 이미지: ' + describe(D);
      $('img-dl').href = url;
      $('img-modal').hidden = false; $('img-close').focus();
    };
    img.onerror = function () { toast('이미지를 만들지 못했어요. 다시 시도해 주세요.'); };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
  }
  function needLogin(action) {
    if (st.loggedIn) return false;
    st.pending = action; persist();
    location.hash = '#login';
    return true;
  }

  // ---------- 장바구니 ----------
  function itemHTML(it, withRemove) {
    return '<li class="item"><div class="item-thumb">' + topSVG(it.d, boardName(it.d)) + '</div>' +
      '<div><h3>' + esc(boardName(it.d)) + ' · 수량 1개</h3><p>' + esc(describe(it.d)) + '</p></div>' +
      '<p><strong>가격 미정</strong></p>' +
      (withRemove ? '<button type="button" class="btn btn-sub" data-remove="' + it.id + '" data-id="B03-1" aria-label="' + esc(boardName(it.d)) + ' 삭제">삭제</button>' : '<span></span>') + '</li>';
  }
  function renderCart() {
    var n = st.cart.length;
    $('cart-n').textContent = n;
    $('cart-list').innerHTML = n ? st.cart.map(function (it) { return itemHTML(it, true); }).join('') :
      '<li class="empty">아직 담은 보드가 없어요. <a href="#build">보드 만들기</a>에서 첫 보드를 만들어 보세요.</li>';
    $('cart-sum-text').textContent = '주문 예정 보드 ' + n + '개 · 상품 금액은 가격 확정 후 표시돼요. 배송비를 포함한 최종 금액은 주문 단계에서 확인해 주세요.';
    var go = $('go-checkout');
    if (n) go.removeAttribute('aria-disabled'); else go.setAttribute('aria-disabled', 'true');
  }

  // ---------- 주문·결제 ----------
  function renderCheckout() {
    var n = st.cart.length;
    $('order-done').hidden = true; $('checkout-form-wrap').hidden = false;
    $('order-list').innerHTML = n ? st.cart.map(function (it) { return itemHTML(it, false); }).join('') :
      '<li class="empty">주문할 보드가 없어요. <a href="#build">보드 만들기</a>로 가서 담아 주세요.</li>';
    $('pay-sum').textContent = '주문 상품 ' + n + '개 · 상품 금액과 배송비는 판매 정책 확정 후 표시돼요.';
  }
  function onPay(e) {
    e.preventDefault();
    if (!st.cart.length) { toast('주문할 보드가 없어요. 먼저 장바구니에 담아 주세요.'); return; }
    var name = $('in-name'), phone = $('in-phone'), addr = $('in-addr'), ok = true;
    if (!name.value.trim()) { setErr(name, 'err-name', '받는 분 이름을 입력해 주세요.'); ok = false; } else setErr(name, 'err-name');
    if (!/^0\d{1,2}-?\d{3,4}-?\d{4}$/.test(phone.value.trim())) { setErr(phone, 'err-phone', '연락처를 숫자로 입력해 주세요. 예: 010-1234-5678'); ok = false; } else setErr(phone, 'err-phone');
    if (addr.value.trim().length < 5) { setErr(addr, 'err-addr', '주소를 입력해 주세요. 우편번호와 상세주소까지 적어 주세요.'); ok = false; } else setErr(addr, 'err-addr');
    if (!ok) { document.querySelector('#pay-form [aria-invalid="true"]').focus(); return; }
    var n = st.cart.length;
    st.cart = []; persist(); updateHeader();
    $('pay-form').reset();
    $('checkout-form-wrap').hidden = true; $('order-done').hidden = false;
    $('done-text').textContent = '선택한 보드 ' + n + '개의 주문 흐름을 끝까지 체험했어요. 실제 결제·상품 제작·배송은 진행되지 않아요.';
    $('h-done').focus();
  }

  // ---------- 내 디자인 ----------
  function renderMy() {
    if (!st.loggedIn) {
      $('my-gate').innerHTML = '<p class="notice">내 디자인은 로그인한 뒤 볼 수 있어요.</p><div class="actions"><a class="btn btn-core" href="#login" data-id="B05-3">로그인하기</a></div>';
      $('my-list').innerHTML = ''; return;
    }
    $('my-gate').innerHTML = '';
    $('my-list').innerHTML = st.saved.length ? st.saved.map(function (it) {
      return '<li class="card"><div class="item-thumb">' + topSVG(it.d, boardName(it.d)) + '</div><h3>' + esc(boardName(it.d)) + '</h3><p class="small muted">' + esc(describe(it.d)) + '</p>' +
        '<div class="actions"><button type="button" class="btn btn-sub" data-reedit="' + it.id + '" data-id="B05-1">다시 꾸미기</button><button type="button" class="btn btn-core" data-addsaved="' + it.id + '" data-id="B05-2">장바구니 담기</button></div></li>';
    }).join('') : '<li class="empty">저장한 디자인이 아직 없어요. <a href="#build">보드 만들기</a>에서 디자인을 저장해 보세요.</li>';
  }
  function findSaved(id) { for (var i = 0; i < st.saved.length; i++) if (String(st.saved[i].id) === String(id)) return st.saved[i]; return null; }

  // ---------- 로그인 ----------
  function renderLogin() {
    var p = $('login-pending');
    if (st.pending && !st.loggedIn) { p.hidden = false; p.textContent = '로그인하면 하던 ' + (st.pending === 'image' ? '이미지 저장' : '디자인 저장') + '을 이어서 해 드릴게요. 만들던 디자인은 그대로 남아 있어요.'; }
    else p.hidden = true;
    $('do-login').hidden = st.loggedIn;
    $('logged-in-box').hidden = !st.loggedIn;
  }
  function onLogin() {
    st.loggedIn = true; persist(); updateHeader();
    var pending = st.pending; st.pending = null; persist();
    if (pending) {
      location.hash = '#build';
      setTimeout(function () { if (pending === 'image') doSaveImage(); else doSaveDesign(); document.getElementById('step2').scrollIntoView(); }, 50);
    } else {
      toast('로그인했어요. <a href="#my-designs">내 디자인 보기</a>');
      renderLogin();
    }
  }

  // ---------- 이벤트 ----------
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.name === 'style') { D.style = t.value; save(); if (recommended && $('in-height').value && $('in-shoe').value) onRecommend(new Event('submit')); else renderDesign(); }
    if (t.name === 'length' || t.name === 'seglen') { D.length = parseInt(t.value, 10); renderLengths(); renderDesign(); }
    if (t.name === 'color') { D[activePart] = t.value; renderDesign(); renderLengths(); }
    if (t.name === 'pattern') { D.pattern = t.value; renderDesign(); renderLengths(); }
  });
  document.addEventListener('input', function (e) {
    if (e.target.id === 'in-text') { D.text = e.target.value.slice(0, 12); $('text-count').textContent = D.text.length; renderPreview(); }
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest('button, a');
    if (!t) return;
    if (t.hasAttribute('data-start-style')) { D.style = t.getAttribute('data-start-style'); save(); }
    if (t.hasAttribute('data-part')) { activePart = t.getAttribute('data-part'); renderDesign(); $('tab-' + activePart).focus(); }
    if (t.hasAttribute('data-jump')) { e.preventDefault(); var to = t.getAttribute('data-jump'); document.getElementById(to).scrollIntoView(); setStepper(to); }
    if (t.hasAttribute('data-remove')) { var id = t.getAttribute('data-remove'); st.cart = st.cart.filter(function (it) { return String(it.id) !== id; }); persist(); updateHeader(); renderCart(); toast('장바구니에서 뺐어요.'); }
    if (t.hasAttribute('data-reedit')) { var s1 = findSaved(t.getAttribute('data-reedit')); if (s1) { D = JSON.parse(JSON.stringify(s1.d)); save(); location.hash = '#build'; setTimeout(function () { document.getElementById('step2').scrollIntoView(); }, 30); } }
    if (t.hasAttribute('data-addsaved')) { var s2 = findSaved(t.getAttribute('data-addsaved')); if (s2) { st.cart.push({ id: Date.now(), d: JSON.parse(JSON.stringify(s2.d)) }); persist(); updateHeader(); toast('장바구니에 담았어요. <a href="#cart">장바구니 보기</a>'); } }
    if (t.hasAttribute('data-close-toast')) { $('toast').hidden = true; }
    if (t.id === 'login-link' && st.loggedIn) { e.preventDefault(); st.loggedIn = false; persist(); updateHeader(); toast('로그아웃했어요.'); route(); }
  });
  $('part-tabs').addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var i = PARTS.findIndex(function (p) { return p.id === activePart; });
    i = (i + (e.key === 'ArrowRight' ? 1 : PARTS.length - 1)) % PARTS.length;
    activePart = PARTS[i].id; renderDesign(); $('tab-' + activePart).focus();
  });
  function setStepper(step) {
    $('stepper-1').toggleAttribute('aria-current', step === 'step1'); if (step === 'step1') $('stepper-1').setAttribute('aria-current', 'step');
    $('stepper-2').toggleAttribute('aria-current', step === 'step2'); if (step === 'step2') $('stepper-2').setAttribute('aria-current', 'step');
  }
  $('rec-form').addEventListener('submit', onRecommend);
  $('skip-rec').addEventListener('click', function () { $('rec-result').innerHTML = '추천 없이 아래 길이 카드에서 직접 골라 주세요.'; var c = $('len-cards').querySelector('input'); if (c) c.focus(); });
  $('go-step2').addEventListener('click', function () {
    if (!D.length) { D.length = 27; renderLengths(); }
    document.getElementById('step2').scrollIntoView(); setStepper('step2'); $('h-step2').setAttribute('tabindex', '-1'); $('h-step2').focus({ preventScroll: true });
  });
  $('add-cart').addEventListener('click', addToCart);
  $('save-design').addEventListener('click', function () { if (!needLogin('design')) doSaveDesign(); });
  $('save-image').addEventListener('click', function () { if (!needLogin('image')) doSaveImage(); });
  $('img-close').addEventListener('click', function () { $('img-modal').hidden = true; $('save-image').focus(); });
  $('img-modal').addEventListener('keydown', function (e) { if (e.key === 'Escape') { $('img-modal').hidden = true; $('save-image').focus(); } });
  $('pay-form').addEventListener('submit', onPay);
  $('do-login').addEventListener('click', onLogin);
  $('do-logout').addEventListener('click', function () { st.loggedIn = false; persist(); updateHeader(); renderLogin(); toast('로그아웃했어요.'); });
  $('done-build').addEventListener('click', function () { D = defaultDesign(); recommended = 0; save(); });
  window.addEventListener('hashchange', route);

  renderMain();
  updateHeader();
  route();
})();
