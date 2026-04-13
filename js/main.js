/* ============================================================
   iimono award - Main JavaScript
   Interactions: Navigation, Scroll, Filter, Form
============================================================ */

'use strict';

/* ---- DOM Ready ------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initScrollReveal();
  initBackToTop();
  initDirectoryFilter();
  initContactForm();
  initSmoothScroll();
});

/* ============================================================
   HEADER - Scroll Effect
============================================================ */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ============================================================
   MOBILE NAVIGATION
============================================================ */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const overlay   = document.getElementById('mobile-nav-overlay');
  if (!hamburger || !overlay) return;

  const toggle = () => {
    const isOpen = hamburger.classList.toggle('active');
    overlay.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const close = () => {
    hamburger.classList.remove('active');
    overlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', toggle);

  // Close on nav link click
  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on outside click
  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
}

/* ============================================================
   SCROLL REVEAL ANIMATION
============================================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   BACK TO TOP
============================================================ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   DIRECTORY FILTER
============================================================ */
function initDirectoryFilter() {
  const filterCategory = document.getElementById('filter-category');
  const filterRegion   = document.getElementById('filter-region');
  const filterYear     = document.getElementById('filter-year');
  const filterKeyword  = document.getElementById('filter-keyword');
  const grid           = document.getElementById('directory-grid');

  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.cert-card'));

  const applyFilters = () => {
    const category = filterCategory ? filterCategory.value : '';
    const region   = filterRegion   ? filterRegion.value   : '';
    const year     = filterYear     ? filterYear.value     : '';
    const keyword  = filterKeyword  ? filterKeyword.value.trim().toLowerCase() : '';

    let visibleCount = 0;

    cards.forEach(card => {
      const cardCategory = card.dataset.category || '';
      const cardRegion   = card.dataset.region   || '';
      const cardYear     = card.dataset.year     || '';
      const cardText     = card.textContent.toLowerCase();

      const matchCategory = !category || cardCategory === category;
      const matchRegion   = !region   || cardRegion   === region;
      const matchYear     = !year     || cardYear     === year;
      const matchKeyword  = !keyword  || cardText.includes(keyword);

      const visible = matchCategory && matchRegion && matchYear && matchKeyword;
      card.classList.toggle('hidden', !visible);
      if (visible) visibleCount++;
    });

    // Show/hide empty state
    let emptyMsg = grid.querySelector('.directory-empty');
    if (visibleCount === 0) {
      if (!emptyMsg) {
        emptyMsg = document.createElement('div');
        emptyMsg.className = 'directory-empty';
        emptyMsg.innerHTML = `
          <p>条件に一致する認証対象が見つかりませんでした。<br>
          絞り込み条件を変更してお試しください。</p>`;
        grid.appendChild(emptyMsg);
      }
      emptyMsg.style.display = 'block';
    } else {
      if (emptyMsg) emptyMsg.style.display = 'none';
    }
  };

  [filterCategory, filterRegion, filterYear].forEach(el => {
    if (el) el.addEventListener('change', applyFilters);
  });

  // Debounce keyword input
  let keywordTimer;
  if (filterKeyword) {
    filterKeyword.addEventListener('input', () => {
      clearTimeout(keywordTimer);
      keywordTimer = setTimeout(applyFilters, 300);
    });
  }
}

/* ============================================================
   CONTACT FORM
============================================================ */
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    form.querySelectorAll('.field-error').forEach(el => el.remove());
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    // Validate
    const errors = validateForm(form);
    if (errors.length > 0) {
      errors.forEach(({ field, message }) => {
        if (field) {
          field.classList.add('error');
          const err = document.createElement('span');
          err.className = 'field-error';
          err.textContent = message;
          field.parentNode.appendChild(err);
        }
      });
      // Focus first error
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    // Submit simulation
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Show success
    form.style.display = 'none';
    if (success) {
      success.style.display = 'block';
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

function validateForm(form) {
  const errors = [];

  const name    = form.querySelector('#contact-name');
  const email   = form.querySelector('#contact-email');
  const type    = form.querySelector('#contact-type');
  const message = form.querySelector('#contact-message');
  const agree   = form.querySelector('#contact-agree');

  if (name && !name.value.trim()) {
    errors.push({ field: name, message: 'お名前を入力してください。' });
  }

  if (email) {
    if (!email.value.trim()) {
      errors.push({ field: email, message: 'メールアドレスを入力してください。' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      errors.push({ field: email, message: '正しいメールアドレスを入力してください。' });
    }
  }

  if (type && !type.value) {
    errors.push({ field: type, message: 'お問い合わせ種別を選択してください。' });
  }

  if (message && !message.value.trim()) {
    errors.push({ field: message, message: 'お問い合わせ内容を入力してください。' });
  }

  if (agree && !agree.checked) {
    errors.push({ field: agree, message: 'プライバシーポリシーへの同意が必要です。' });
  }

  return errors;
}

/* ============================================================
   SMOOTH SCROLL (for anchor links)
============================================================ */
function initSmoothScroll() {
  const HEADER_HEIGHT = 80;

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   STYLE INJECTION (Dynamic CSS for form errors, empty state)
============================================================ */
(function injectDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Form error styles */
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
      border-color: #c0392b !important;
      background-color: #fff8f7 !important;
    }
    .field-error {
      display: block;
      font-size: 0.78rem;
      color: #c0392b;
      margin-top: 0.3rem;
    }

    /* Directory empty state */
    .directory-empty {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem 2rem;
      color: #9a9a9a;
      font-size: 0.9rem;
      line-height: 1.8;
      border: 1px dashed #e0dbd0;
    }
  `;
  document.head.appendChild(style);
})();
