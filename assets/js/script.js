document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.header__burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const body = document.body;

  // Toggle mobile menu
  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    burger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    body.classList.toggle('no-scroll', isOpen);
  });

  // Close menu helper
  function closeMenu() {
    burger.classList.remove('active');
    mobileMenu.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    body.classList.remove('no-scroll');
  }

  // Submenu toggle
  const submenuToggles = mobileMenu.querySelectorAll('.mobile-menu__link--toggle');
  submenuToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const parent = toggle.closest('.mobile-menu__item--has-submenu');
      const isOpen = parent.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  });

  // Close menu on nav link click
  const menuLinks = mobileMenu.querySelectorAll('a[href^="#"]');
  menuLinks.forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  // Language switch
  const langBtns = mobileMenu.querySelectorAll('.mobile-menu__lang-btn');
  const headerSelect = document.getElementById('language-select');

  langBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      langBtns.forEach((b) => b.classList.remove('mobile-menu__lang-btn--active'));
      btn.classList.add('mobile-menu__lang-btn--active');

      // Sync with header select
      if (headerSelect) {
        headerSelect.value = btn.dataset.lang;
      }
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // ===== Credit calculators (universal — works for all on the page) =====
  function initCalculator(sliderId, inputId) {
    const slider = document.getElementById(sliderId);
    const input = document.getElementById(inputId);
    if (!slider || !input) return;

    const MIN = Number(slider.min);
    const MAX = Number(slider.max);
    const STEP = Number(slider.step);

    function formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    function updateFill() {
      const val = Number(slider.value);
      const percent = ((val - MIN) / (MAX - MIN)) * 100;
      slider.style.background = `linear-gradient(to right, #783999 ${percent}%, #E9D6F3 ${percent}%)`;
    }

    function syncInput() {
      input.value = formatNumber(Number(slider.value)) + ' грн';
      updateFill();
    }

    slider.addEventListener('input', syncInput);
    syncInput();
  }

  // Init both calculators
  initCalculator('credit-range', 'credit-amount');
  initCalculator('loan-credit-range', 'loan-credit-amount');

  // ===== Tabs (loan-application) =====
  const loanSection = document.querySelector('.loan-application__bottom');
  if (loanSection) {
    const tabs = loanSection.querySelectorAll('.loan-application__bottom-left-tab');
    const leftPanels = loanSection.querySelectorAll('.loan-application__bottom-left-content > .loan-application__bottom-left-list');
    const rightPanels = loanSection.querySelectorAll('.loan-application__bottom-right > .loan-application__bottom-right-content');

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        // Tabs
        tabs.forEach((t) => {
          t.classList.remove('loan-application__bottom-left-tab--active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('loan-application__bottom-left-tab--active');
        tab.setAttribute('aria-selected', 'true');

        // Left panels
        leftPanels.forEach((panel, i) => {
          panel.classList.toggle('loan-application__bottom-left-list--active', i === index);
        });

        // Right panels
        rightPanels.forEach((panel, i) => {
          panel.classList.toggle('loan-application__bottom-right-content--active', i === index);
        });
      });
    });

    // Init: activate first panels
    if (leftPanels[0]) leftPanels[0].classList.add('loan-application__bottom-left-list--active');
    if (rightPanels[0]) rightPanels[0].classList.add('loan-application__bottom-right-content--active');
  }

  // ===== Accordion (loan-application) =====
  const accordions = document.querySelectorAll('.loan-application__bottom-right-accordion');
  accordions.forEach((accordion) => {
    const title = accordion.querySelector('.h4');
    if (!title) return;

    title.style.cursor = 'pointer';
    title.addEventListener('click', () => {
      // Don't close if it's already the only open one
      if (accordion.classList.contains('open')) return;

      // Close others within the same parent
      const parent = accordion.closest('.loan-application__bottom-right-content');
      if (parent) {
        parent.querySelectorAll('.loan-application__bottom-right-accordion').forEach((item) => {
          item.classList.remove('open');
        });
      }
      accordion.classList.add('open');
    });
  });

  // Open the first accordion in each panel by default
  document.querySelectorAll('.loan-application__bottom-right-content').forEach((panel) => {
    const first = panel.querySelector('.loan-application__bottom-right-accordion');
    if (first) first.classList.add('open');
  });

  // ===== FAQ Accordion =====
  const faqItems = document.querySelectorAll('.faq-right__item');
  faqItems.forEach((item) => {
    const title = item.querySelector('.faq-right__item-title');
    if (!title) return;

    title.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other FAQ items
      faqItems.forEach((other) => other.classList.remove('open'));

      // Toggle current (close if was open, open if was closed)
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // Open first FAQ item by default
  if (faqItems[0]) faqItems[0].classList.add('open');

  // ===== Modal =====
  const modal = document.getElementById('details-modal');
  const modalOverlay = modal ? modal.querySelector('.modal__overlay') : null;
  const modalClose = modal ? modal.querySelector('.modal__close') : null;

  function openModal() {
    if (!modal) return;
    modal.classList.add('active');
    body.classList.add('no-scroll');
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    body.classList.remove('no-scroll');
  }

  // Open modal on all .hero__calculate-btn--details clicks
  document.querySelectorAll('.hero__calculate-btn--details').forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal();
    });
  });

  // Close modal
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // ===== Reviews Swiper =====
  if (typeof Swiper !== 'undefined') {
    const reviewsSwiper = new Swiper('.reviews__slider', {
      slidesPerView: 'auto',
      spaceBetween: 16,
      loop: true,
      navigation: {
        prevEl: '.reviews__nav-btn--prev',
        nextEl: '.reviews__nav-btn--next',
      },
    });

    // ===== News Swiper =====
    const newsSwiper = new Swiper('.news-slider', {
      slidesPerView: 1,
      spaceBetween: 16,
      loop: true,
      pagination: {
        el: '.news-slider-pagination',
        clickable: true,
      },
      navigation: {
        prevEl: '.news__nav-btn--prev',
        nextEl: '.news__nav-btn--next',
      },
      breakpoints: {
        576: {
          slidesPerView: 2,
          spaceBetween: 16,
        },
        1280: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
      },
    });
  }

  // ===== Blog Filter & Load More =====
  const blogSection = document.querySelector('.blog-section');
  if (blogSection) {
    const tabs = blogSection.querySelectorAll('.blog-section-tab');
    const articles = blogSection.querySelectorAll('.blog-article');
    const loadMoreBtn = blogSection.querySelector('.blog-section-load-more');
    const VISIBLE_COUNT = 6;
    let currentCategory = 'all';

    function getFiltered() {
      return [...articles].filter((article) => {
        if (currentCategory === 'all') return true;
        return article.dataset.category === currentCategory;
      });
    }

    function renderArticles() {
      const filtered = getFiltered();
      let visibleCount = 0;

      articles.forEach((article) => {
        article.style.display = 'none';
        article.classList.remove('blog-article--visible');
      });

      filtered.forEach((article, i) => {
        if (i < VISIBLE_COUNT) {
          article.style.display = '';
          article.classList.add('blog-article--visible');
          visibleCount++;
        }
      });

      // Show/hide load more button
      if (loadMoreBtn) {
        loadMoreBtn.style.display = filtered.length > visibleCount ? '' : 'none';
      }
    }

    function loadMore() {
      const filtered = getFiltered();
      const currentlyVisible = filtered.filter((a) => a.classList.contains('blog-article--visible')).length;
      let shown = 0;

      filtered.forEach((article, i) => {
        if (i >= currentlyVisible && shown < VISIBLE_COUNT) {
          article.style.display = '';
          article.classList.add('blog-article--visible');
          shown++;
        }
      });

      const totalVisible = currentlyVisible + shown;
      if (loadMoreBtn) {
        loadMoreBtn.style.display = filtered.length > totalVisible ? '' : 'none';
      }
    }

    // Tab click
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('blog-section-tab--active'));
        tab.classList.add('blog-section-tab--active');
        currentCategory = tab.dataset.category;
        renderArticles();
      });
    });

    // Load more click
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', loadMore);
    }

    // Init
    renderArticles();
  }

  // ===== Scroll to Top =====
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    });

    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
