/**
 * Café Lumière — Premium 3D Cafe Website
 * jQuery + Vanilla JS Interactions
 */

$(function () {

  /* ══════════════════════════════════════════
     1. NAVBAR — Scroll Behaviour
  ══════════════════════════════════════════ */
  const $nav = $('#mainNav');

  $(window).on('scroll.nav', function () {
    if ($(this).scrollTop() > 60) {
      $nav.addClass('scrolled');
    } else {
      $nav.removeClass('scrolled');
    }
  });

  // Smooth scroll on nav links
  $('a.nav-link, a[href^="#"]').on('click', function (e) {
    const target = $(this).attr('href');
    if (target && target.startsWith('#') && $(target).length) {
      e.preventDefault();
      const offset = $(target).offset().top - 70;
      $('html, body').animate({ scrollTop: offset }, 700, 'swing');
      // Close mobile menu if open
      $('#navMenu').collapse('hide');
    }
  });


  /* ══════════════════════════════════════════
     2. SCROLL REVEAL — IntersectionObserver
  ══════════════════════════════════════════ */
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          $(entry.target).addClass('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ══════════════════════════════════════════
     3. PARALLAX SCROLLING
  ══════════════════════════════════════════ */
  function updateParallax() {
    const scrollY = $(window).scrollTop();

    // Hero beans move at different speeds
    $('.bean-1').css('transform', `translateY(${scrollY * 0.15}px) rotate(${scrollY * 0.05}deg)`);
    $('.bean-2').css('transform', `translateY(${scrollY * -0.1}px) rotate(${scrollY * -0.04}deg)`);
    $('.bean-3').css('transform', `translateY(${scrollY * 0.2}px) rotate(${scrollY * 0.06}deg)`);
    $('.bean-4').css('transform', `translateY(${scrollY * -0.12}px) rotate(${scrollY * 0.03}deg)`);
    $('.bean-5').css('transform', `translateY(${scrollY * 0.08}px) rotate(${scrollY * -0.05}deg)`);

    // About image parallax
    const aboutOffset = $('#about').offset();
    if (aboutOffset) {
      const relY = (scrollY - aboutOffset.top + $(window).height()) * 0.08;
      $('.about-img-inner').css('transform', `translateY(${Math.min(relY, 30)}px)`);
    }

    // Experience section parallax background
    const expOffset = $('#experience').offset();
    if (expOffset) {
      const expRelY = (scrollY - expOffset.top) * 0.3;
      $('#experience').css('background-position', `center ${50 + expRelY * 0.05}%`);
    }
  }

  $(window).on('scroll.parallax', function () {
    requestAnimationFrame(updateParallax);
  });


  /* ══════════════════════════════════════════
     4. 3D MOUSE TILT on Menu Cards
  ══════════════════════════════════════════ */
  function applyTilt($card, e) {
    const rect  = $card[0].getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const mx    = e.clientX - cx;
    const my    = e.clientY - cy;
    const rotX  = -(my / cy) * 10;
    const rotY  =  (mx / cx) * 10;

    $card.css({
      transform: `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-10px) scale(1.03)`,
      transition: 'transform 0.1s ease'
    });
  }

  function resetTilt($card) {
    $card.css({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)',
      transition: 'transform 0.5s cubic-bezier(0.25,0.8,0.25,1)'
    });
  }

  $(document).on('mousemove', '.tilt-card', function (e) {
    applyTilt($(this), e);
  });
  $(document).on('mouseleave', '.tilt-card', function () {
    resetTilt($(this));
  });


  /* ══════════════════════════════════════════
     5. HERO CUP — Mouse Parallax
  ══════════════════════════════════════════ */
  const $cup = $('#coffeeCup');

  $(document).on('mousemove.hero', function (e) {
    if ($(window).scrollTop() > $(window).height()) return;
    const cx  = $(window).width()  / 2;
    const cy  = $(window).height() / 2;
    const dx  = (e.clientX - cx) / cx;
    const dy  = (e.clientY - cy) / cy;

    $cup.css({
      transform: `perspective(800px) rotateY(${dx * 15}deg) rotateX(${-dy * 8}deg) translateZ(20px)`,
      transition: 'transform 0.15s ease'
    });
  });


  /* ══════════════════════════════════════════
     6. MENU CATEGORY FILTER
  ══════════════════════════════════════════ */
  let filterActive = false;

  $('.tab-btn').on('click', function () {
    if (filterActive) return;
    filterActive = true;

    const category = $(this).data('category');
    $('.tab-btn').removeClass('active');
    $(this).addClass('active');

    const $cards = $('.menu-card');

    // Fade all out
    $cards.animate({ opacity: 0 }, 250, function () {
      // Hide non-matching, show matching
      $cards.each(function () {
        const cardCat = $(this).data('category');
        if (cardCat === category) {
          $(this).css({ display: 'block' }).animate({ opacity: 1 }, 300);
        } else {
          $(this).css({ display: 'none' });
        }
      });
      filterActive = false;
    });
  });

  // Keyboard shortcut — press 1/2/3 for categories
  $(document).on('keydown', function (e) {
    const keys = { '1': 'coffee', '2': 'desserts', '3': 'snacks' };
    const cat = keys[e.key];
    if (cat) $(`.tab-btn[data-category="${cat}"]`).trigger('click');
  });


  /* ══════════════════════════════════════════
     7. ADD TO CART ANIMATION
  ══════════════════════════════════════════ */
  $(document).on('click', '.add-btn', function (e) {
    e.stopPropagation();
    const $btn = $(this);

    // Quick spin + color flash
    $btn.css({ background: 'var(--highlight)', color: 'var(--primary)' });
    $btn.animate({ borderSpacing: 360 }, 400, function () {
      setTimeout(function () {
        $btn.css({ background: 'transparent', color: 'var(--highlight)' });
      }, 600);
    });

    // Create floating +1 ripple
    const $ripple = $('<span class="cart-ripple">+1 ☕</span>').css({
      position: 'fixed',
      left: e.clientX,
      top: e.clientY,
      color: 'var(--highlight)',
      fontWeight: '700',
      fontSize: '1rem',
      fontFamily: 'var(--font-serif)',
      pointerEvents: 'none',
      zIndex: 9999,
      opacity: 1,
      userSelect: 'none'
    });
    $('body').append($ripple);
    $ripple.animate({ top: e.clientY - 60, opacity: 0 }, 800, function () {
      $(this).remove();
    });
  });


  /* ══════════════════════════════════════════
     8. TESTIMONIALS — Auto-Scroll Carousel
  ══════════════════════════════════════════ */
  const $track = $('#testimonialTrack');
  let trackPos  = 0;
  const speed   = 0.6; // px per frame
  let isPaused  = false;

  function autoScrollTestimonials() {
    if (!isPaused && $track.length) {
      trackPos += speed;
      const totalWidth = $track[0].scrollWidth / 2; // half because of duplicated items
      if (trackPos >= totalWidth) trackPos = 0;
      $track.css('transform', `translateX(-${trackPos}px)`);
    }
    requestAnimationFrame(autoScrollTestimonials);
  }

  // Pause on hover
  $track.closest('.testimonial-track-wrapper').on('mouseenter', function () {
    isPaused = true;
  }).on('mouseleave', function () {
    isPaused = false;
  });

  autoScrollTestimonials();


  /* ══════════════════════════════════════════
     9. SIGNATURE CARDS — Glow on Hover
  ══════════════════════════════════════════ */
  $(document).on('mousemove', '.sig-card', function (e) {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    $(this).find('.sig-glow').css({
      background: `radial-gradient(circle at ${x}% ${y}%, rgba(212,163,115,0.18) 0%, transparent 65%)`
    });
  });


  /* ══════════════════════════════════════════
     10. HERO FLOATING PARTICLES (Canvas)
  ══════════════════════════════════════════ */
  const canvas  = document.getElementById('heroParticles');
  if (canvas) {
    const ctx    = canvas.getContext('2d');
    let W, H, particles;
    const PARTICLE_COUNT = 55;

    function resizeCanvas() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function createParticle() {
      return {
        x:   Math.random() * W,
        y:   Math.random() * H,
        r:   Math.random() * 2.5 + 0.5,
        vx:  (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.5 + 0.2),
        o:   Math.random() * 0.5 + 0.1
      };
    }

    function initParticles() {
      resizeCanvas();
      particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
    }

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,163,115,${p.o})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.o -= 0.001;

        // Reset particle when it fades or goes off-screen
        if (p.y < -10 || p.o <= 0 || p.x < -10 || p.x > W + 10) {
          Object.assign(p, createParticle(), { y: H + 5 });
        }
      });
      requestAnimationFrame(drawParticles);
    }

    $(window).on('resize', initParticles);
    initParticles();
    drawParticles();

    // Style the canvas
    $(canvas).css({
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1
    });
  }


  /* ══════════════════════════════════════════
     11. GALLERY ITEM — Keyboard accessibility
  ══════════════════════════════════════════ */
  $('.gallery-item').attr('tabindex', 0).on('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      $(this).find('.gallery-overlay').toggleClass('force-show');
    }
  });


  /* ══════════════════════════════════════════
     12. ACTIVE NAV LINK — Highlight on Scroll
  ══════════════════════════════════════════ */
  const sections = $('section[id]');
  $(window).on('scroll.nav-active', function () {
    const scrollMid = $(this).scrollTop() + $(this).height() / 2;
    sections.each(function () {
      const top    = $(this).offset().top;
      const bottom = top + $(this).outerHeight();
      const id     = $(this).attr('id');
      if (scrollMid >= top && scrollMid < bottom) {
        $('.nav-link').removeClass('active');
        $(`.nav-link[href="#${id}"]`).addClass('active');
      }
    });
  });


  /* ══════════════════════════════════════════
     13. NEWSLETTER FORM
  ══════════════════════════════════════════ */
  $('.newsletter-btn').on('click', function () {
    const $input = $('.newsletter-input');
    const email  = $input.val().trim();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      $input.css({ borderColor: '#e57373', animation: 'shake .3s ease' });
      setTimeout(function () {
        $input.css({ borderColor: '', animation: '' });
      }, 600);
      return;
    }

    const $btn = $(this);
    $btn.html('<i class="fa fa-check"></i>');
    $btn.css({ background: 'linear-gradient(135deg,#4caf50,#388e3c)' });
    $input.val('Thank you! ☕').prop('disabled', true);

    setTimeout(function () {
      $btn.html('<i class="fa fa-paper-plane"></i>');
      $btn.css({ background: '' });
      $input.val('').prop('disabled', false);
    }, 3000);
  });


  /* ══════════════════════════════════════════
     14. BUTTON GLOW RIPPLE EFFECT
  ══════════════════════════════════════════ */
  $(document).on('click', '.btn-glow, .btn-outline-glow', function (e) {
    const $btn = $(this);
    const offset = $btn.offset();
    const x = e.pageX - offset.left;
    const y = e.pageY - offset.top;

    const $ripple = $('<span></span>').css({
      position: 'absolute',
      left: x - 15,
      top: y - 15,
      width: 30,
      height: 30,
      background: 'rgba(255,255,255,0.3)',
      borderRadius: '50%',
      transform: 'scale(0)',
      pointerEvents: 'none',
      zIndex: 0
    });

    $btn.css('position', 'relative').css('overflow', 'hidden').append($ripple);
    $ripple.animate({ width: 200, height: 200, opacity: 0, top: y - 100, left: x - 100 }, 600, function () {
      $(this).remove();
    });
  });


  /* ══════════════════════════════════════════
     15. STAT NUMBER COUNTER ANIMATION
  ══════════════════════════════════════════ */
  let statsAnimated = false;
  const statsObserver = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;

      $('.stat-number').each(function () {
        const $el  = $(this);
        const text = $el.text().trim();
        const num  = parseInt(text.replace(/\D/g, ''), 10);
        const suf  = text.replace(/[0-9]/g, '');

        $({ count: 0 }).animate({ count: num }, {
          duration: 1800,
          easing: 'swing',
          step: function () {
            $el.text(Math.floor(this.count) + suf);
          },
          complete: function () {
            $el.text(num + suf);
          }
        });
      });
    }
  }, { threshold: 0.5 });

  const $aboutSection = document.querySelector('.about-stats');
  if ($aboutSection) statsObserver.observe($aboutSection);


  /* ══════════════════════════════════════════
     16. PRICING CARD HOVER EDGE GLOW
  ══════════════════════════════════════════ */
  $(document).on('mousemove', '.price-card', function (e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    $(this).css('--gx', x + 'px').css('--gy', y + 'px');
  });


  /* ══════════════════════════════════════════
     17. STICKY CTA TOAST ON SCROLL
  ══════════════════════════════════════════ */
  let toastShown = false;
  $(window).on('scroll.toast', function () {
    if (toastShown) return;
    if ($(this).scrollTop() > 900) {
      toastShown = true;

      const $toast = $(`
        <div id="cafeToast" style="
          position:fixed; bottom:30px; right:30px; z-index:9999;
          background:linear-gradient(135deg,#3E2723,#1a0f0a);
          border:1px solid rgba(212,163,115,0.35);
          border-radius:16px; padding:1rem 1.5rem;
          box-shadow:0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(212,163,115,0.15);
          display:flex; align-items:center; gap:1rem;
          transform:translateX(120%); opacity:0;
          font-family:'Jost',sans-serif; max-width:280px;
        ">
          <span style="font-size:1.8rem;">☕</span>
          <div>
            <div style="color:#F5E6CA;font-weight:600;font-size:.9rem;margin-bottom:.2rem;">Reserve your table</div>
            <div style="color:#A1887F;font-size:.78rem;">Experience Café Lumière today</div>
          </div>
          <a href="#contact" id="toastCta" style="
            background:linear-gradient(135deg,#D4A373,#A1887F);
            color:#3E2723; font-weight:700; font-size:.8rem;
            padding:.4rem 1rem; border-radius:50px;
            white-space:nowrap; flex-shrink:0;
          ">Book</a>
          <span id="toastClose" style="
            color:#A1887F; cursor:pointer; font-size:1.1rem;
            line-height:1; flex-shrink:0;
          ">✕</span>
        </div>
      `);

      $('body').append($toast);
      $toast.animate({ opacity: 1 }, 300, function () {
        $toast.css('transform', 'translateX(0)');
      });

      $('#toastClose').on('click', function () {
        $toast.animate({ opacity: 0 }, 300, function () {
          $toast.remove();
        });
      });

      $('#toastCta').on('click', function () {
        $toast.animate({ opacity: 0 }, 300, function () { $toast.remove(); });
      });

      setTimeout(function () {
        $toast.animate({ opacity: 0 }, 300, function () { $toast.remove(); });
      }, 8000);
    }
  });


  /* ══════════════════════════════════════════
     18. INIT — Trigger scroll on load
  ══════════════════════════════════════════ */
  $(window).trigger('scroll');

}); // end document.ready
