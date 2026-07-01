/* SouthPay shared interactions - network background + FAQ accordion */
(function () {
  // ============ INTERACTIVE NETWORK BACKGROUND (crypto/fintech vibe) ============
  const bg = document.getElementById('hexBg');
  const svg = document.getElementById('hexSvg');
  if (bg && svg) {
    const SVG_NS = 'http://www.w3.org/2000/svg';
    let width = window.innerWidth;
    let height = window.innerHeight;
    const spacing = 96;
    const jitter = 22;
    const linkDist = spacing * 1.55;
    let nodes = [];
    let links = [];

    function seedRand(x, y) {
      const v = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return v - Math.floor(v);
    }

    function buildGrid() {
      svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
      svg.innerHTML = '';
      nodes = [];
      links = [];

      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;

      for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
          const jx = (seedRand(c, r) - 0.5) * jitter * 2;
          const jy = (seedRand(c + 7.3, r - 3.1) - 0.5) * jitter * 2;
          const cx = c * spacing + jx;
          const cy = r * spacing + jy;
          nodes.push({ cx: cx, cy: cy, el: null, col: c, row: r });
        }
      }

      const linkFrag = document.createDocumentFragment();
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          if (Math.abs(b.col - a.col) > 1 || Math.abs(b.row - a.row) > 1) continue;
          const dx = b.cx - a.cx;
          const dy = b.cy - a.cy;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < linkDist) {
            const line = document.createElementNS(SVG_NS, 'line');
            line.setAttribute('x1', a.cx.toFixed(1));
            line.setAttribute('y1', a.cy.toFixed(1));
            line.setAttribute('x2', b.cx.toFixed(1));
            line.setAttribute('y2', b.cy.toFixed(1));
            line.setAttribute('class', 'net-link');
            linkFrag.appendChild(line);
            links.push({ el: line, ax: a.cx, ay: a.cy, bx: b.cx, by: b.cy, mx: (a.cx + b.cx) / 2, my: (a.cy + b.cy) / 2 });
          }
        }
      }
      svg.appendChild(linkFrag);

      const nodeFrag = document.createDocumentFragment();
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const circle = document.createElementNS(SVG_NS, 'circle');
        circle.setAttribute('cx', n.cx.toFixed(1));
        circle.setAttribute('cy', n.cy.toFixed(1));
        circle.setAttribute('r', '1.6');
        circle.setAttribute('class', 'net-node');
        nodeFrag.appendChild(circle);
        n.el = circle;
      }
      svg.appendChild(nodeFrag);
    }

    let mx = -9999, my = -9999;
    let targetMx = mx, targetMy = my;
    let raf = null;
    let lastActiveNodes = [];
    let lastActiveLinks = [];

    function onMove(e) {
      const isTouch = e.touches && e.touches[0];
      targetMx = isTouch ? e.touches[0].clientX : e.clientX;
      targetMy = isTouch ? e.touches[0].clientY : e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
    }

    function update() {
      mx += (targetMx - mx) * 0.16;
      my += (targetMy - my) * 0.16;

      bg.style.setProperty('--mx', mx + 'px');
      bg.style.setProperty('--my', my + 'px');

      const radius = 220;
      const radiusSq = radius * radius;
      const newNodes = [];
      const newLinks = [];

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const dx = n.cx - mx;
        const dy = n.cy - my;
        const dSq = dx * dx + dy * dy;
        if (dSq < radiusSq) {
          const t = 1 - dSq / radiusSq;
          const eased = t * t;
          n.el.style.fill = 'rgba(55, 75, 236, ' + (0.08 + eased * 0.45).toFixed(3) + ')';
          n.el.setAttribute('r', (1.6 + eased * 1.6).toFixed(2));
          newNodes.push(n);
        }
      }

      for (let i = 0; i < links.length; i++) {
        const l = links[i];
        const dx = l.mx - mx;
        const dy = l.my - my;
        const dSq = dx * dx + dy * dy;
        if (dSq < radiusSq) {
          const t = 1 - dSq / radiusSq;
          const eased = t * t;
          l.el.style.stroke = 'rgba(55, 75, 236, ' + (0.04 + eased * 0.18).toFixed(3) + ')';
          newLinks.push(l);
        }
      }

      for (let i = 0; i < lastActiveNodes.length; i++) {
        if (newNodes.indexOf(lastActiveNodes[i]) === -1) {
          lastActiveNodes[i].el.style.fill = '';
          lastActiveNodes[i].el.setAttribute('r', '1.6');
        }
      }
      for (let i = 0; i < lastActiveLinks.length; i++) {
        if (newLinks.indexOf(lastActiveLinks[i]) === -1) {
          lastActiveLinks[i].el.style.stroke = '';
        }
      }
      lastActiveNodes = newNodes;
      lastActiveLinks = newLinks;

      if (Math.abs(targetMx - mx) > 0.5 || Math.abs(targetMy - my) > 0.5) {
        raf = requestAnimationFrame(update);
      } else {
        raf = null;
      }
    }

    function onResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      buildGrid();
      lastActiveNodes = [];
      lastActiveLinks = [];
    }

    buildGrid();
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('resize', function () {
      clearTimeout(window._hexResize);
      window._hexResize = setTimeout(onResize, 150);
    });
  }

  // ============ FAQ ACCORDION ============
  document.querySelectorAll('.faq-item').forEach(function (item) {
    item.addEventListener('click', function () {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ============ SCROLL-REVEAL ============
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const SELECTOR = [
      'section .section-tag',
      'section > .container > h2',
      'section > .container > h3',
      'section .section-intro',
      'section .solution-copy',
      '.problem-card',
      '.feature',
      '.step',
      '.value-card',
      '.founder-card',
      '.stat-card',
      '.testimonial-card',
      '.faq-item',
      '.pricing-card',
      '.product-mockup-frame',
      '.product-mockup-head',
      '.integrations-inner',
      '.final-cta-wrap',
      '.checkout-showpiece',
      '.invoice-showpiece',
      '.solution-hero > div:last-child',
      '.pricing-teaser-card',
      '.compare-table-wrap',
      '.code-snippet'
    ].join(', ');

    const STAGGER_CLASSES = ['problem-card','feature','step','value-card','founder-card','stat-card','testimonial-card','faq-item','pricing-card'];
    const els = document.querySelectorAll(SELECTOR);

    els.forEach(function (el) {
      if (el.closest('.hero')) return;
      el.classList.add('scroll-reveal');
      const staggerClass = STAGGER_CLASSES.find(function (c) { return el.classList.contains(c); });
      if (staggerClass && el.parentElement) {
        const sibs = Array.prototype.filter.call(el.parentElement.children, function (s) {
          return s.classList && s.classList.contains(staggerClass);
        });
        const idx = sibs.indexOf(el);
        if (idx > 0) el.style.transitionDelay = (idx * 70) + 'ms';
      }
    });

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });

    document.querySelectorAll('.scroll-reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.scroll-reveal').forEach(function (el) {
      el.classList.add('in-view');
    });
  }

  // ============ MOBILE NAV (hamburger + accordion panel) ============
  const navInner = document.querySelector('nav.site-nav .nav-inner');
  const navLinks = document.querySelector('nav.site-nav .nav-links');
  if (navInner && navLinks) {
    const burger = document.createElement('button');
    burger.className = 'nav-burger';
    burger.setAttribute('aria-label', 'Menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<span class="nav-burger-lines"><span></span><span></span><span></span></span>';
    navInner.appendChild(burger);

    const panel = document.createElement('div');
    panel.className = 'nav-mobile-panel';
    panel.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('div');
    inner.className = 'nav-mobile-inner';
    panel.appendChild(inner);

    // Top bar - logo + close X
    const topbar = document.createElement('div');
    topbar.className = 'nav-mobile-topbar';
    const logoLink = document.createElement('a');
    logoLink.href = '/';
    logoLink.className = 'nav-mobile-logo';
    const existingLogo = navInner.querySelector('a.logo');
    if (existingLogo) logoLink.innerHTML = existingLogo.innerHTML;
    const closeBtn = document.createElement('button');
    closeBtn.className = 'nav-mobile-close';
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    topbar.appendChild(logoLink);
    topbar.appendChild(closeBtn);
    inner.appendChild(topbar);

    // Get Started CTA at top
    const ctaSrc = navLinks.querySelector('.nav-cta');
    if (ctaSrc) {
      const cta = document.createElement('a');
      cta.href = ctaSrc.getAttribute('href');
      cta.className = 'nav-mobile-cta';
      cta.innerHTML = 'Get started <span class="arrow">→</span>';
      inner.appendChild(cta);
    }

    function makeAccordion(title) {
      const sec = document.createElement('div');
      sec.className = 'nav-mobile-accordion';
      const trigger = document.createElement('button');
      trigger.className = 'nav-mobile-accordion-trigger';
      trigger.setAttribute('aria-expanded', 'false');
      trigger.innerHTML = '<span>' + title + '</span><svg class="chev" viewBox="0 0 12 12" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 4l4 4 4-4"/></svg>';
      const content = document.createElement('div');
      content.className = 'nav-mobile-accordion-content';
      sec.appendChild(trigger);
      sec.appendChild(content);
      trigger.addEventListener('click', function () {
        const wasOpen = sec.classList.contains('is-expanded');
        document.querySelectorAll('.nav-mobile-accordion').forEach(function (s) {
          s.classList.remove('is-expanded');
          const t = s.querySelector('.nav-mobile-accordion-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          sec.classList.add('is-expanded');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
      return { sec: sec, content: content };
    }

    // Products accordion
    const productItems = navLinks.querySelectorAll('.nav-products-menu .nav-product-item');
    if (productItems.length) {
      const acc = makeAccordion('Products');
      productItems.forEach(function (it) {
        const a = document.createElement('a');
        a.href = it.getAttribute('href');
        const name = it.querySelector('.nav-product-name');
        const desc = it.querySelector('.nav-product-desc');
        const nameTxt = name ? name.textContent.trim() : it.textContent.trim();
        const descTxt = desc ? desc.textContent.trim() : '';
        a.innerHTML = '<span class="item-name">' + nameTxt + '</span>' + (descTxt ? '<span class="item-desc">' + descTxt + '</span>' : '');
        acc.content.appendChild(a);
      });
      inner.appendChild(acc.sec);
    }

    // Industries accordion
    const industryItems = navLinks.querySelectorAll('.nav-industries-menu .nav-industry-item');
    if (industryItems.length) {
      const acc = makeAccordion('Industries');
      const allA = document.createElement('a');
      allA.href = '/industries';
      allA.className = 'industries-all';
      allA.textContent = 'All industries →';
      acc.content.appendChild(allA);
      const grid = document.createElement('div');
      grid.className = 'industries-grid-2';
      industryItems.forEach(function (it) {
        const a = document.createElement('a');
        a.href = it.getAttribute('href');
        const name = it.querySelector('.nav-industry-name');
        a.textContent = name ? name.textContent.trim() : it.textContent.trim();
        grid.appendChild(a);
      });
      acc.content.appendChild(grid);
      inner.appendChild(acc.sec);
    }

    // Plain links (About, Docs etc.)
    const otherLinks = Array.from(navLinks.children).filter(function (c) {
      return c.tagName === 'A' && !c.classList.contains('nav-cta');
    });
    if (otherLinks.length) {
      const simple = document.createElement('div');
      simple.className = 'nav-mobile-simple';
      otherLinks.forEach(function (l) {
        const a = document.createElement('a');
        a.href = l.getAttribute('href');
        a.textContent = l.textContent.trim();
        simple.appendChild(a);
      });
      inner.appendChild(simple);
    }

    document.body.appendChild(panel);

    function setOpen(open) {
      panel.classList.toggle('is-open', open);
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.classList.toggle('nav-locked', open);
      if (!open) {
        document.querySelectorAll('.nav-mobile-accordion.is-expanded').forEach(function (s) {
          s.classList.remove('is-expanded');
          const t = s.querySelector('.nav-mobile-accordion-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      }
    }

    burger.addEventListener('click', function () {
      setOpen(!panel.classList.contains('is-open'));
    });
    closeBtn.addEventListener('click', function () { setOpen(false); });
    panel.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) setOpen(false);
    });
  }
})();
