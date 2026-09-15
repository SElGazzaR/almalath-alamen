/* ==========================================================================
   الملاذ الآمن | ALMALATH ALAMEN — main.js
   ==========================================================================
   كل تفاعلات الموقع في ملف واحد، جافاسكربت عادي (Vanilla JS) بدون أي
   مكتبات خارجية عشان الموقع يفضل خفيف وسريع التحميل.

   الأقسام بالترتيب:
   1) الوضع الفاتح/الغامق        7) الفقاعات الزخرفية
   2) تبديل اللغة عربي/إنجليزي   8) أكورديون الوصفات
   3) قائمة الموبايل             9) فلاتر المنتجات
   4) ثبات الهيدر + زر لأعلى     10) فاليديشن نموذج التواصل
   5) الظهور عند السكرول         11) الرابط النشط في القائمة
   6) عدادات الأرقام             12) الخط الزمني  13) الجاليري  14) الفيديو  15) الغوص

   لإضافة تفاعل جديد لاحقًا: ضيفه في آخر الملف بنفس النمط.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const root = document.documentElement;

  /* ------------------------------------------------------------------
     1) تبديل الوضع الفاتح/الغامق
     ------------------------------------------------------------------ */
  const savedTheme = localStorage.getItem('ala-theme');
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.setAttribute('data-theme', 'dark');
  }

  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('ala-theme', next);
    });
  });

  /* ------------------------------------------------------------------
     2) تبديل اللغة عربي/إنجليزي
     أي نص في الموقع مكتوب مرتين على نفس العنصر:
       - نص عادي:      data-ar="..."       data-en="..."
       - نص فيه HTML:  data-ar-html="..."  data-en-html="..."
       - حقول الإدخال: data-ar-placeholder / data-en-placeholder
     ------------------------------------------------------------------ */
  const langButtons = document.querySelectorAll('[data-lang-toggle]');
  const savedLang = localStorage.getItem('ala-lang') || 'ar';

  function applyLanguage(lang) {
    // مهم: لازم نجيب كمان العناصر اللي عندها data-*-html بس من غير data-ar/data-en
    const nodes = document.querySelectorAll('[data-ar], [data-en], [data-ar-html], [data-en-html]');
    nodes.forEach(el => {
      const html = lang === 'ar' ? el.getAttribute('data-ar-html') : el.getAttribute('data-en-html');
      const text = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
      if (html !== null) el.innerHTML = html;
      else if (text !== null) el.textContent = text;
      // لو مفيش ترجمة للعنصر ده، نسيبه زي ما هو (مش بنفضيه)
    });

    document.querySelectorAll('[data-ar-placeholder], [data-en-placeholder]').forEach(el => {
      const val = lang === 'ar' ? el.getAttribute('data-ar-placeholder') : el.getAttribute('data-en-placeholder');
      if (val !== null) el.setAttribute('placeholder', val);
    });

    document.querySelectorAll('[data-ar-title], [data-en-title]').forEach(el => {
      const val = lang === 'ar' ? el.getAttribute('data-ar-title') : el.getAttribute('data-en-title');
      if (val !== null) el.setAttribute('title', val);
    });

    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    langButtons.forEach(btn => { btn.textContent = lang === 'ar' ? 'EN' : 'AR'; });
    localStorage.setItem('ala-lang', lang);
  }

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      applyLanguage(root.getAttribute('lang') === 'en' ? 'ar' : 'en');
    });
  });

  applyLanguage(savedLang);

  /* ------------------------------------------------------------------
     3) قائمة الموبايل
     ------------------------------------------------------------------ */
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    const closeNav = () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    };
    mobileNavClose?.addEventListener('click', closeNav);
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  }

  /* ------------------------------------------------------------------
     4) ثبات الهيدر عند السكرول + زر الرجوع لأعلى
     الهيدر بيثبت بالـCSS (position:sticky)، والكلاس ده بس عشان الظل
     وتحويل شريط التابات لعرض كامل لما نكون نازلين.
     ------------------------------------------------------------------ */
  const header = document.querySelector('.site-header');
  const backTop = document.querySelector('.fab-top');

  function onScroll() {
    const topRow = header?.querySelector('.header-top');
    const limit = topRow ? topRow.offsetHeight - 4 : 40;
    header?.classList.toggle('is-stuck', window.scrollY > limit);
    if (backTop) backTop.classList.toggle('show', window.scrollY > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ------------------------------------------------------------------
     5) أنيميشن الظهور عند السكرول (Scroll Reveal)
     ------------------------------------------------------------------ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ------------------------------------------------------------------
     6) عدادات الأرقام المتحركة
     العنصر لازم يكون عليه data-count="الرقم المطلوب".
     العدّاد بيبدأ من صفر كل مرة العنصر يدخل الشاشة، عشان دايمًا تشوف
     الأرقام وهي بتعد مش واصلة لقيمتها على طول.
     ------------------------------------------------------------------ */
  const counters = document.querySelectorAll('[data-count]');

  function runCounter(el) {
    if (el.dataset.counting === '1') return;
    el.dataset.counting = '1';

    const raw = el.getAttribute('data-count') || '0';
    const target = parseFloat(raw) || 0;
    // عدد الخانات العشرية ياخده تلقائيًا من الرقم المكتوب (مثلاً "2.7" = خانة عشرية واحدة)
    const decimals = (raw.split('.')[1] || '').length;
    const duration = 1800; // مدة العد بالملي ثانية — غيّرها لو عايز أسرع/أبطأ
    const start = performance.now();

    function fmt(n) {
      return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    }

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // يبدأ سريع ويهدّي في الآخر
      const value = decimals > 0 ? eased * target : Math.floor(eased * target);
      el.textContent = fmt(value);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = fmt(target);
        el.dataset.counting = '0';
      }
    }
    requestAnimationFrame(tick);
  }

  if (counters.length) {
    counters.forEach(el => { el.textContent = '0'; });

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
        } else {
          // خرج من الشاشة: نرجّعه صفر عشان يعد من أول وجديد لما نرجعله
          entry.target.dataset.counting = '0';
          entry.target.textContent = '0';
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

    counters.forEach(el => counterObserver.observe(el));
  }

  /* ------------------------------------------------------------------
     7) فقاعات مياه زخرفية
     ------------------------------------------------------------------ */
  document.querySelectorAll('.bubbles').forEach(container => {
    for (let i = 0; i < 16; i++) {
      const b = document.createElement('span');
      b.className = 'bubble';
      const size = 6 + Math.random() * 20;
      b.style.width = `${size}px`;
      b.style.height = `${size}px`;
      b.style.insetInlineStart = `${5 + Math.random() * 90}%`;
      b.style.animationDuration = `${7 + Math.random() * 10}s`;
      b.style.animationDelay = `${Math.random() * 10}s`;
      container.appendChild(b);
    }
  });

  /* ------------------------------------------------------------------
     8) أكورديون الوصفات
     ------------------------------------------------------------------ */
  document.querySelectorAll('.recipe-head').forEach(head => {
    head.addEventListener('click', () => {
      const card = head.closest('.recipe-card');
      const wasOpen = card.classList.contains('open');
      document.querySelectorAll('.recipe-card.open').forEach(c => c.classList.remove('open'));
      if (!wasOpen) card.classList.add('open');
    });
  });

  /* فتح الوصفة تلقائيًا لو وصلنا لينك فيه #recipe-N (من تيزر الوصفات في الرئيسية) */
  function openRecipeFromHash() {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target || !target.classList.contains('recipe-card')) return;
    document.querySelectorAll('.recipe-card.open').forEach(c => c.classList.remove('open'));
    target.classList.add('open');
    setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }
  if (document.querySelector('.recipe-card')) {
    openRecipeFromHash();
    window.addEventListener('hashchange', openRecipeFromHash);
  }

  /* ------------------------------------------------------------------
     9) فلاتر صفحة المنتجات
     ------------------------------------------------------------------ */
  const filterButtons = document.querySelectorAll('.product-filter .filter-btn');
  const productItems = document.querySelectorAll('.product-item');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      productItems.forEach(item => {
        item.classList.toggle('show', filter === 'all' || item.getAttribute('data-category') === filter);
      });
    });
  });

  /* ------------------------------------------------------------------
     10) فاليديشن نموذج التواصل
     ------------------------------------------------------------------ */
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    const successBox = contactForm.querySelector('.form-success');

    // بعد ما الرسالة تتبعت، الخدمة بترجّعنا للصفحة بعلامة ?sent=1
    if (new URLSearchParams(window.location.search).get('sent') === '1') {
      successBox?.classList.add('show');
      successBox?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    contactForm.addEventListener('submit', (e) => {
      let valid = true;

      contactForm.querySelectorAll('[required]').forEach(field => {
        const group = field.closest('.form-group');
        let ok = field.value.trim().length > 0;
        if (field.type === 'email' && ok) ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        if (field.type === 'tel' && ok) ok = /^[0-9+\s-]{7,}$/.test(field.value.trim());
        group?.classList.toggle('invalid', !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        e.preventDefault();            // فيه خطأ: مش هنبعت
        successBox?.classList.remove('show');
        return;
      }

      // البيانات سليمة: نرجّع المستخدم لنفس الصفحة بعد الإرسال
      const next = contactForm.querySelector('[name="_next"]');
      if (next) next.value = window.location.href.split('?')[0] + '?sent=1';
      // ونسيب المتصفح يكمّل الإرسال عادي للخدمة
    });
  }

  /* ------------------------------------------------------------------
     11) تفعيل الرابط النشط في القائمة حسب الصفحة الحالية
     ------------------------------------------------------------------ */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.split('/').pop() === currentPage) link.classList.add('active');
  });

  /* ------------------------------------------------------------------
     12) الخط الزمني التفاعلي (رحلة السمكة)
     ------------------------------------------------------------------ */
  document.querySelectorAll('.js-timeline').forEach(track => {
    const fill = track.querySelector('.timeline-fill');
    const steps = track.querySelectorAll('.journey-step');

    function updateTimeline() {
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      const scrolled = Math.min(Math.max(vh * 0.6 - rect.top, 0), total);
      if (fill) fill.style.height = `${total > 0 ? Math.min((scrolled / total) * 100, 100) : 0}%`;
      steps.forEach(step => {
        if (step.getBoundingClientRect().top < vh * 0.62) step.classList.add('timeline-active');
      });
    }

    updateTimeline();
    window.addEventListener('scroll', updateTimeline, { passive: true });
    window.addEventListener('resize', updateTimeline);
  });

  /* ------------------------------------------------------------------
     12.ب) تابات عامة (Tabs) — تستخدم في صفحة الوصفات وأي مكان تاني فيه تابات
     الهيكل: عنصر أب عليه [data-tabs]، وجواه أزرار [data-tab-target="اسم"]
     وعناصر محتوى [data-tab-panel="نفس الاسم"]. لإضافة تاب جديد: زرار جديد
     بنفس الشكل + عنصر محتوى جديد بنفس القيمة في data-tab-panel.
     ------------------------------------------------------------------ */
  document.querySelectorAll('[data-tabs]').forEach(group => {
    const buttons = group.querySelectorAll('[data-tab-target]');
    const panels = group.querySelectorAll('[data-tab-panel]');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab-target');
        buttons.forEach(b => b.classList.toggle('active', b === btn));
        panels.forEach(p => { p.hidden = p.getAttribute('data-tab-panel') !== target; });
      });
    });
  });

  /* ------------------------------------------------------------------
     13) جاليري صور المزرعة — فلترة + عرض مكبّر (Lightbox)
     ------------------------------------------------------------------ */
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        item.classList.toggle('show', filter === 'all' || item.getAttribute('data-category') === filter);
      });
    });
  });

  /* نافذة الألبوم: كل كارت في الجاليري بيفتح مجموعة صور، مش صورة واحدة.
     صور الألبوم مكتوبة في خاصية data-images على الكارت، مفصولة بعلامة | */
  const lightbox = document.querySelector('.gallery-lightbox');
  if (lightbox && galleryItems.length) {
    const stageImg = lightbox.querySelector('.lightbox-stage img');
    const thumbsBox = lightbox.querySelector('.lightbox-thumbs');
    const capTitle = lightbox.querySelector('.lightbox-caption strong');
    const capCount = lightbox.querySelector('.lightbox-caption span');
    let album = [], index = 0, albumTitle = { ar: '', en: '' };

    function renderAlbum() {
      if (!album.length) return;
      index = (index + album.length) % album.length;
      stageImg.src = album[index];
      const lang = root.getAttribute('lang') === 'en' ? 'en' : 'ar';
      stageImg.alt = albumTitle[lang];
      capTitle.textContent = albumTitle[lang];
      capCount.textContent = lang === 'ar'
        ? `صورة ${index + 1} من ${album.length}`
        : `Photo ${index + 1} of ${album.length}`;
      thumbsBox.querySelectorAll('img').forEach((t, i) => t.classList.toggle('active', i === index));
    }

    function openAlbum(item) {
      album = (item.getAttribute('data-images') || '').split('|').map(s => s.trim()).filter(Boolean);
      if (!album.length) {
        const img = item.querySelector('img');
        if (img) album = [img.src];
      }
      albumTitle = {
        ar: item.getAttribute('data-album-ar') || '',
        en: item.getAttribute('data-album-en') || ''
      };
      index = 0;
      thumbsBox.innerHTML = '';
      album.forEach((src, i) => {
        const t = document.createElement('img');
        t.src = src; t.alt = ''; t.loading = 'lazy';
        t.addEventListener('click', () => { index = i; renderAlbum(); });
        thumbsBox.appendChild(t);
      });
      thumbsBox.style.display = album.length > 1 ? 'flex' : 'none';
      lightbox.querySelectorAll('.lightbox-nav').forEach(b => {
        b.style.display = album.length > 1 ? 'flex' : 'none';
      });
      renderAlbum();
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    galleryItems.forEach(item => {
      item.addEventListener('click', (e) => { e.preventDefault(); openAlbum(item); });
    });

    lightbox.querySelector('.lightbox-prev')?.addEventListener('click', (e) => {
      e.stopPropagation(); index--; renderAlbum();
    });
    lightbox.querySelector('.lightbox-next')?.addEventListener('click', (e) => {
      e.stopPropagation(); index++; renderAlbum();
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.closest('.gallery-lightbox-close')) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') { index++; renderAlbum(); }
      if (e.key === 'ArrowLeft') { index--; renderAlbum(); }
    });
  }

  /* ------------------------------------------------------------------
     14) الفيديو التعريفي — تشغيل/إيقاف وكتم الصوت
     ------------------------------------------------------------------ */
  document.querySelectorAll('.promo-video').forEach(box => {
    const video = box.querySelector('video');
    const muteBtn = box.querySelector('.promo-mute');
    if (!video) return;

    box.addEventListener('click', (e) => {
      if (e.target.closest('.promo-mute')) return;
      if (box.hasAttribute('data-video-pending')) return; /* الفيديو الحقيقي لسه هيتضاف، مفيش تشغيل دلوقتي */
      if (video.paused) { video.play(); box.classList.add('playing'); }
      else { video.pause(); box.classList.remove('playing'); }
    });

    muteBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      muteBtn.innerHTML = video.muted
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M23 9 17 15M17 9l6 6"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5.5a9 9 0 0 1 0 13"/></svg>';
    });
  });

  /* ------------------------------------------------------------------
     15) تأثير "الغوص" تحت الماء داخل قسم رحلة السمكة
     ------------------------------------------------------------------ */
  document.querySelectorAll('.dive-zone').forEach(zone => {
    const overlay = zone.querySelector('.dive-overlay');
    if (!overlay) return;

    function updateDive() {
      const rect = zone.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(Math.max((vh - rect.top) / (rect.height + vh), 0), 1);
      const depth = Math.sin(progress * Math.PI); // يزيد لحد النص ثم يقل
      overlay.style.opacity = String(Math.min(depth * 1.3, 0.5));
      overlay.style.background = `radial-gradient(circle at 50% 0%, rgba(47,164,214,${0.12 * depth}) 0%, rgba(3,14,22,${0.45 * depth}) 100%)`;
    }

    updateDive();
    window.addEventListener('scroll', updateDive, { passive: true });
    window.addEventListener('resize', updateDive);
  });

});
