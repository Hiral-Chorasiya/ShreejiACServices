/**
 * SHREEJI AC SERVICE - JAVASCRIPT
 * Features: Preloader, Navbar scroll, Particles, Slider, Counter, AOS, Form
 */

$(document).ready(function () {

  /* ===========================
     PRELOADER
  =========================== */
  setTimeout(function () {
    $('#preloader').addClass('hidden');
    setTimeout(function () { $('#preloader').remove(); }, 600);
  }, 2200);

  /* ===========================
     NAVBAR SCROLL
  =========================== */
  $(window).on('scroll', function () {
    var scrollTop = $(this).scrollTop();

    // Sticky navbar style
    if (scrollTop > 60) {
      $('#mainNavbar').addClass('scrolled');
    } else {
      $('#mainNavbar').removeClass('scrolled');
    }

    // Scroll-to-top button
    if (scrollTop > 400) {
      $('#scrollTop').addClass('show');
    } else {
      $('#scrollTop').removeClass('show');
    }

    // Active nav link highlighting
    $('section[id]').each(function () {
      var sectionTop = $(this).offset().top - 100;
      var sectionBottom = sectionTop + $(this).outerHeight();
      var id = $(this).attr('id');

      if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
        $('.nav-link').removeClass('active');
        $('.nav-link[href="#' + id + '"]').addClass('active');
      }
    });

    // AOS (scroll animations)
    triggerAOS();
  });

  // Scroll to Top
  $('#scrollTop').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 600);
  });

  // Smooth scroll for nav links
  $('a[href^="#"]').on('click', function (e) {
    var target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: target.offset().top - 70 }, 700);
      // Close mobile menu
      $('#navMenu').collapse('hide');
    }
  });

  /* ===========================
     PARTICLE CANVAS (Hero)
  =========================== */
  var canvas = document.getElementById('heroCanvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 70;

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.6,
        dy: (Math.random() - 0.5) * 0.6,
        opacity: Math.random() * 0.6 + 0.1,
        color: Math.random() > 0.5 ? '57,208,232' : '51,60,129'
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color + ',' + p.opacity + ')';
        ctx.fill();

        // Move
        p.x += p.dx;
        p.y += p.dy;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      // Draw connections
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(57,208,232,' + (0.12 * (1 - dist / 120)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawParticles);
    }

    drawParticles();

    // Mouse interaction
    var mouse = { x: -999, y: -999 };
    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;

      particles.forEach(function (p) {
        var dx = mouse.x - p.x;
        var dy = mouse.y - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          p.dx -= dx * 0.002;
          p.dy -= dy * 0.002;
        }
      });
    });
  }

  /* ===========================
     TESTIMONIALS SLIDER
  =========================== */
  var currentSlide = 0;
  var totalCards = $('.testimonial-card').length;
  var visibleCards = getVisibleCards();
  var totalSlides = Math.ceil(totalCards / visibleCards);
  var autoSlideInterval;

  function getVisibleCards() {
    var w = $(window).width();
    if (w >= 992) return 3;
    if (w >= 576) return 2;
    return 1;
  }

  // Build dots
  function buildDots() {
    var dotsHtml = '';
    var slides = Math.ceil(totalCards - (visibleCards - 1));
    slides = Math.max(1, totalCards - visibleCards + 1);
    totalSlides = slides;
    for (var i = 0; i < slides; i++) {
      dotsHtml += '<div class="slider-dot' + (i === 0 ? ' active' : '') + '" data-index="' + i + '"></div>';
    }
    $('#sliderDots').html(dotsHtml);
  }

  function goToSlide(index) {
    var maxSlide = totalCards - visibleCards;
    if (index < 0) index = maxSlide;
    if (index > maxSlide) index = 0;
    currentSlide = index;

    var cardWidth = $('.testimonial-card').outerWidth(true);
    var offset = -currentSlide * cardWidth;
    $('#testimonialTrack').css('transform', 'translateX(' + offset + 'px)');

    // Update dots
    $('.slider-dot').removeClass('active');
    $('.slider-dot[data-index="' + currentSlide + '"]').addClass('active');
  }

  buildDots();

  $('#sliderNext').on('click', function () { goToSlide(currentSlide + 1); });
  $('#sliderPrev').on('click', function () { goToSlide(currentSlide - 1); });

  $(document).on('click', '.slider-dot', function () {
    goToSlide(parseInt($(this).data('index')));
  });

  // Auto-slide
  function startAutoSlide() {
    autoSlideInterval = setInterval(function () {
      goToSlide(currentSlide + 1);
    }, 4000);
  }
  startAutoSlide();

  // Pause on hover
  $('#testimonialSlider').on('mouseenter', function () { clearInterval(autoSlideInterval); })
    .on('mouseleave', function () { startAutoSlide(); });

  // Touch swipe
  var touchStartX = 0;
  var touchEndX = 0;
  document.getElementById('testimonialSlider') && document.getElementById('testimonialSlider').addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  });
  document.getElementById('testimonialSlider') && document.getElementById('testimonialSlider').addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) goToSlide(currentSlide + 1);
    if (touchEndX - touchStartX > 50) goToSlide(currentSlide - 1);
  });

  // Rebuild on resize
  $(window).on('resize', function () {
    visibleCards = getVisibleCards();
    buildDots();
    goToSlide(0);
  });

  /* ===========================
     ANIMATED COUNTERS
  =========================== */
  var countersStarted = false;
  function startCounters() {
    if (countersStarted) return;
    countersStarted = true;
    $('.counter').each(function () {
      var $el = $(this);
      var target = parseInt($el.data('target'));
      var duration = 2000;
      var start = 0;
      var increment = target / (duration / 16);
      var timer = setInterval(function () {
        start += increment;
        if (start >= target) {
          $el.text(target);
          clearInterval(timer);
        } else {
          $el.text(Math.floor(start));
        }
      }, 16);
    });
  }

  // Check if stats section is in view
  function checkStatsVisible() {
    var statsSection = $('#stats');
    if (statsSection.length) {
      var sectionTop = statsSection.offset().top;
      var windowBottom = $(window).scrollTop() + $(window).height();
      if (windowBottom > sectionTop + 100) {
        startCounters();
      }
    }
  }
  $(window).on('scroll', checkStatsVisible);

  /* ===========================
     AOS (Animate On Scroll)
  =========================== */
  function triggerAOS() {
    $('[data-aos]').each(function () {
      var el = $(this);
      var elTop = el.offset().top;
      var windowBottom = $(window).scrollTop() + $(window).height();
      var delay = el.data('aos-delay') || 0;

      if (windowBottom > elTop + 80 && !el.hasClass('aos-animate')) {
        setTimeout(function () {
          el.addClass('aos-animate');
        }, delay);
      }
    });
  }

  // Initial trigger after preloader
  setTimeout(function () {
    triggerAOS();
    checkStatsVisible();
  }, 2400);

  /* ===========================
     CONTACT FORM
  =========================== */
  $('#contactForm').on('submit', function (e) {
    e.preventDefault();
    var name = $('#name').val().trim();
    var phone = $('#phone').val().trim();

    if (!name || !phone) {
      alert('Please fill in your name and phone number.');
      return;
    }

    // Simulate form submission
    var $btn = $(this).find('button[type="submit"]');
    $btn.html('<i class="fas fa-spinner fa-spin me-2"></i> Sending...').prop('disabled', true);

    setTimeout(function () {
      $btn.html('<i class="fas fa-paper-plane me-2"></i> Send Booking Request').prop('disabled', false);
      $('#formSuccess').fadeIn(400);
      $('#contactForm')[0].reset();
      setTimeout(function () { $('#formSuccess').fadeOut(400); }, 5000);
    }, 1500);
  });

  /* ===========================
     SERVICE CARD 3D TILT EFFECT
  =========================== */
  $(document).on('mousemove', '.service-card', function (e) {
    var $card = $(this);
    var cardOffset = $card.offset();
    var cardWidth = $card.outerWidth();
    var cardHeight = $card.outerHeight();
    var mouseX = e.pageX - cardOffset.left;
    var mouseY = e.pageY - cardOffset.top;
    var rotX = ((mouseY / cardHeight) - 0.5) * 10;
    var rotY = ((mouseX / cardWidth) - 0.5) * -10;

    $card.css('transform', 'translateY(-12px) scale(1.02) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)');
  });

  $(document).on('mouseleave', '.service-card', function () {
    $(this).css('transform', '');
  });

  /* ===========================
     PARALLAX EFFECT (Hero)
  =========================== */
  $(window).on('scroll', function () {
    var scrollTop = $(this).scrollTop();
    var $floatIcons = $('.float-icon');
    $floatIcons.css('transform', 'translateY(' + (scrollTop * 0.2) + 'px)');
  });

  /* ===========================
     HERO BADGE TOOLTIP-STYLE GLOW
  =========================== */
  $('.hero-badge').on('mouseenter', function () {
    $(this).css('box-shadow', '0 0 20px rgba(57,208,232,0.6)');
  }).on('mouseleave', function () {
    $(this).css('box-shadow', '');
  });

  /* ===========================
     PRICING CARD HOVER SOUND FEEL
     (visual glow pulse on hover)
  =========================== */
  $('.pricing-card').on('mouseenter', function () {
    $(this).find('.pricing-icon').addClass('pulse-anim');
  }).on('mouseleave', function () {
    $(this).find('.pricing-icon').removeClass('pulse-anim');
  });

  /* ===========================
     AREA ITEMS STAGGER ANIMATION
  =========================== */
  function animateAreas() {
    var areasVisible = false;
    var $areasSection = $('#areas');
    if (!$areasSection.length) return;

    // Mark items as hidden via CLASS (not inline style) so CSS can override
    $('.area-item').addClass('area-hidden');

    function revealAreas() {
      if (areasVisible) return;
      var sectionTop = $areasSection.offset().top;
      var windowBottom = $(window).scrollTop() + $(window).height();
      if (windowBottom > sectionTop + 80) {
        areasVisible = true;
        $('.area-item').each(function (i) {
          var $el = $(this);
          setTimeout(function () {
            $el.removeClass('area-hidden').addClass('area-visible');
          }, i * 80);
        });
      }
    }

    $(window).on('scroll', revealAreas);
    // Also check on initial load (in case section is already in viewport)
    setTimeout(revealAreas, 2500);
  }
  animateAreas();

  /* ===========================
     NAVBAR ACTIVE ON LOAD
  =========================== */
  triggerAOS();

}); // End document ready
