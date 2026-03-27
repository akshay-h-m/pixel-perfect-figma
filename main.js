// ========================================
// HAMBURGER MENU TOGGLE
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileNavOverlay');

  function toggleMenu() {
    const isOpen = mobileNav.classList.contains('active');
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      closeMenu();
    }
  });

  // ========================================
  // IMAGE GALLERY
  // ========================================
  const slides = document.querySelectorAll('.gallery-slide');
  const dots = document.querySelectorAll('.gallery-dot');
  const thumbs = document.querySelectorAll('.gallery-thumb');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  let currentSlide = 0;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    thumbs[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    thumbs[currentSlide].classList.add('active');
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.index, 10));
    });
  });

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      goToSlide(parseInt(thumb.dataset.index, 10));
    });
  });

  // ========================================
  // SUBSCRIPTION TOGGLE (Expandable)
  // ========================================
  const subscriptionHeaders = document.querySelectorAll('.subscription-header');
  const subscriptionOptions = document.querySelectorAll('.subscription-option');

  subscriptionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const targetType = header.dataset.toggle;
      const radio = header.querySelector('input[type="radio"]');

      // Select the radio
      radio.checked = true;

      // Toggle active class
      subscriptionOptions.forEach(opt => {
        if (opt.dataset.type === targetType) {
          opt.classList.add('active');
        } else {
          opt.classList.remove('active');
        }
      });

      updateCartLink();
    });
  });

  // ========================================
  // DYNAMIC ADD TO CART LINK
  // ========================================
  // Dummy cart URLs: 9 combinations (3 fragrances × 3 subscription types)
  // Since design shows 2 sub types with fragrance selection, we create links for all
  const cartLinks = {
    'single-original': 'https://example.com/cart/single-original',
    'single-lily':     'https://example.com/cart/single-lily',
    'single-rose':     'https://example.com/cart/single-rose',
    'double-original-original': 'https://example.com/cart/double-original-original',
    'double-original-lily':     'https://example.com/cart/double-original-lily',
    'double-original-rose':     'https://example.com/cart/double-original-rose',
    'double-lily-original':     'https://example.com/cart/double-lily-original',
    'double-lily-lily':         'https://example.com/cart/double-lily-lily',
    'double-lily-rose':         'https://example.com/cart/double-lily-rose',
    'double-rose-original':     'https://example.com/cart/double-rose-original',
    'double-rose-lily':         'https://example.com/cart/double-rose-lily',
    'double-rose-rose':         'https://example.com/cart/double-rose-rose',
  };

  const addToCartBtn = document.getElementById('addToCartBtn');

  function updateCartLink() {
    const subscription = document.querySelector('input[name="subscription"]:checked');
    if (!subscription) return;

    const subType = subscription.value;
    let key = '';

    if (subType === 'single') {
      const fragrance = document.querySelector('input[name="fragrance-single"]:checked');
      key = 'single-' + (fragrance ? fragrance.value : 'original');
    } else if (subType === 'double') {
      const frag1 = document.querySelector('input[name="fragrance-double-1"]:checked');
      const frag2 = document.querySelector('input[name="fragrance-double-2"]:checked');
      key = 'double-' + (frag1 ? frag1.value : 'original') + '-' + (frag2 ? frag2.value : 'original');
    }

    if (addToCartBtn && cartLinks[key]) {
      addToCartBtn.href = cartLinks[key];
    }
  }

  // Listen for fragrance radio changes
  document.querySelectorAll('input[name="fragrance-single"], input[name="fragrance-double-1"], input[name="fragrance-double-2"]').forEach(radio => {
    radio.addEventListener('change', updateCartLink);
  });

  // Initialize cart link
  updateCartLink();

  // ========================================
  // COLLECTION ACCORDION
  // ========================================
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close all items
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
      });

      // Open clicked item if it wasn't already open
      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ========================================
  // STATS COUNTER ANIMATION
  // ========================================
  const statsNumbers = document.querySelectorAll('.stats-bar-number[data-target]');
  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    statsAnimated = true;

    statsNumbers.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1500;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out curve
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = current + '%';

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    });
  }

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsBar);
  }
});
