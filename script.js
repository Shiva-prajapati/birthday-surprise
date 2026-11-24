/**
 * ROMANTIC CINEMATIC BIRTHDAY EXPERIENCE
 * Script logic: Cinema Controller, Audio Manager, Animations, Touch Swipes
 */

document.addEventListener('DOMContentLoaded', () => {
  // 10 Curated Memories with 10 Distinct Cinematic Animations & Wishes
  const memories = [
    {
      src: 'assets/images/photo_1.webp',
      badge: 'Moment 01 · First Spark',
      wish: '“From the moment you walked into my life, every ordinary day turned into poetry.”',
      anim: 'anim-bloom'
    },
    {
      src: 'assets/images/photo_2.webp',
      badge: 'Moment 02 · Pure Magic',
      wish: '“Your smile is my favorite view in this entire world—effortless, warm, and radiant.”',
      anim: 'anim-zoom'
    },
    {
      src: 'assets/images/photo_3.webp',
      badge: 'Moment 03 · Sanctuary',
      wish: '“In your eyes and in your embrace, I found the home my heart had always been searching for.”',
      anim: 'anim-slide'
    },
    {
      src: 'assets/images/photo_4.webp',
      badge: 'Moment 04 · Endless Laughter',
      wish: '“Every laugh shared with you is a treasure I hold close to my heart, today and forever.”',
      anim: 'anim-tilt'
    },
    {
      src: 'assets/images/photo_5.webp',
      badge: 'Moment 05 · Serenity',
      wish: '“You have an extraordinary gift for bringing calm, light, and peace to my craziest days.”',
      anim: 'anim-float'
    },
    {
      src: 'assets/images/photo_6.webp',
      badge: 'Moment 06 · Sweetest Love',
      wish: '“Loving you has been the easiest, sweetest, and most beautiful adventure of my life.”',
      anim: 'anim-shimmer'
    },
    {
      src: 'assets/images/photo_7.webp',
      badge: 'Moment 07 · Golden Moments',
      wish: '“With you, the simplest little moments become memories that sparkle forever.”',
      anim: 'anim-shutter'
    },
    {
      src: 'assets/images/photo_8.webp',
      badge: 'Moment 08 · My Dream',
      wish: '“You are my today, my tomorrow, and every single one of my favorite dreams come true.”',
      anim: 'anim-swirl'
    },
    {
      src: 'assets/images/photo_9.webp',
      badge: 'Moment 09 · Hand in Hand',
      wish: '“No matter where the road leads, knowing your hand is in mine makes everything right.”',
      anim: 'anim-mirage'
    },
    {
      src: 'assets/images/photo_10.webp',
      badge: 'Moment 10 · The One & Only',
      wish: '“Happy Birthday to the most gorgeous, kind, and precious soul in my universe.”',
      anim: 'anim-crescendo'
    }
  ];

  // DOM Elements
  const welcomeScreen = document.getElementById('welcomeScreen');
  const cinemaScreen = document.getElementById('cinemaScreen');
  const finaleScreen = document.getElementById('finaleScreen');

  const btnMoreWishes = document.getElementById('btnMoreWishes');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnAutoplay = document.getElementById('btnAutoplay');
  const btnReplay = document.getElementById('btnReplay');
  const btnRewatch = document.getElementById('btnRewatch');

  const heroPhoto = document.getElementById('heroPhoto');
  const photoWrapper = document.getElementById('photoWrapper');
  const ambientBg = document.getElementById('ambientBg');
  const memoryBadge = document.getElementById('memoryBadge');
  const cinemaCaption = document.getElementById('cinemaCaption');
  const progressContainer = document.getElementById('progressContainer');

  // Music Elements
  const audio = document.getElementById('bgAudio');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const soundBars = document.getElementById('soundBars');
  const musicBtnText = document.getElementById('musicBtnText');

  // State Variables
  let currentIndex = 0;
  let isAutoPlaying = true;
  let autoPlayTimer = null;
  let progressAnimationId = null;
  let slideStartTime = 0;
  const SLIDE_DURATION = 6500; // 6.5 seconds per slide
  let isAudioPlaying = false;

  // Initialize Progress Segments
  function initProgressSegments() {
    progressContainer.innerHTML = '';
    memories.forEach((_, idx) => {
      const segment = document.createElement('div');
      segment.className = 'progress-segment';
      segment.innerHTML = '<div class="progress-segment-fill"></div>';
      segment.addEventListener('click', () => {
        goToSlide(idx);
      });
      progressContainer.appendChild(segment);
    });
  }

  // Update Progress Segments UI
  function updateProgressSegments(fraction = 0) {
    const segments = progressContainer.querySelectorAll('.progress-segment');
    segments.forEach((seg, i) => {
      const fill = seg.querySelector('.progress-segment-fill');
      if (i < currentIndex) {
        seg.classList.add('completed');
        fill.style.width = '100%';
      } else if (i === currentIndex) {
        seg.classList.remove('completed');
        fill.style.width = `${Math.min(100, Math.max(0, fraction * 100))}%`;
      } else {
        seg.classList.remove('completed');
        fill.style.width = '0%';
      }
    });
  }

  // Display Slide with Unique Animation
  function displaySlide(index) {
    const item = memories[index];

    // Remove any previous animation classes
    memories.forEach(m => photoWrapper.classList.remove(m.anim));

    // Update Ambient Blurred Background
    ambientBg.style.backgroundImage = `url('${item.src}')`;

    // Reset and apply new image
    heroPhoto.src = item.src;
    heroPhoto.alt = item.badge;

    // Trigger reflow to restart CSS animation
    void photoWrapper.offsetWidth;
    photoWrapper.classList.add(item.anim);

    // Update Badge and Caption with smooth fade
    cinemaCaption.style.opacity = '0';
    cinemaCaption.style.transform = 'translateY(8px)';
    
    setTimeout(() => {
      memoryBadge.innerHTML = `<span class="sparkle">✦</span> ${item.badge} <span class="sparkle">✦</span>`;
      cinemaCaption.textContent = item.wish;
      cinemaCaption.style.opacity = '1';
      cinemaCaption.style.transform = 'translateY(0)';
    }, 150);

    // Update Nav Buttons
    btnPrev.disabled = (index === 0);
    if (index === memories.length - 1) {
      btnNext.innerHTML = 'Special Finale ✨';
      btnNext.classList.add('btn-nav-primary');
    } else {
      btnNext.innerHTML = 'Next ❯';
      btnNext.classList.remove('btn-nav-primary');
    }

    // Reset and start auto-advance timer if enabled
    startSlideTimer();
  }

  // Go to specific slide
  function goToSlide(index) {
    if (index < 0) return;
    if (index >= memories.length) {
      showFinale();
      return;
    }
    currentIndex = index;
    displaySlide(currentIndex);
    burstHearts(3);
  }

  // Timer & Progress Animation Loop
  function startSlideTimer() {
    cancelSlideTimer();
    if (!isAutoPlaying) {
      updateProgressSegments(0);
      return;
    }

    slideStartTime = performance.now();

    function step(now) {
      const elapsed = now - slideStartTime;
      const progress = Math.min(1, elapsed / SLIDE_DURATION);
      updateProgressSegments(progress);

      if (progress < 1) {
        progressAnimationId = requestAnimationFrame(step);
      } else {
        // Time to advance!
        if (currentIndex < memories.length - 1) {
          goToSlide(currentIndex + 1);
        } else {
          showFinale();
        }
      }
    }

    progressAnimationId = requestAnimationFrame(step);
  }

  function cancelSlideTimer() {
    if (progressAnimationId) {
      cancelAnimationFrame(progressAnimationId);
      progressAnimationId = null;
    }
    if (autoPlayTimer) {
      clearTimeout(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  // Screen Transitions
  function showCinema() {
    welcomeScreen.classList.remove('active');
    finaleScreen.classList.remove('active');
    cinemaScreen.classList.add('active');

    currentIndex = 0;
    displaySlide(0);
    burstHearts(16);
    startMusic();
  }

  function showFinale() {
    cancelSlideTimer();
    cinemaScreen.classList.remove('active');
    welcomeScreen.classList.remove('active');
    finaleScreen.classList.add('active');
    burstHearts(30);
  }

  function showWelcome() {
    cancelSlideTimer();
    cinemaScreen.classList.remove('active');
    finaleScreen.classList.remove('active');
    welcomeScreen.classList.add('active');
  }

  // Audio Playback Handling
  async function startMusic() {
    try {
      if (audio.paused) {
        // As requested and configured in original file, starts around 50s for the chorus/melody
        if (audio.currentTime < 1) {
          audio.currentTime = 50;
        }
        await audio.play();
        isAudioPlaying = true;
        updateAudioUI();
      }
    } catch (err) {
      console.log('Audio autoplay prevented, user can click to unmute:', err);
      isAudioPlaying = false;
      updateAudioUI();
    }
  }

  function toggleMusic() {
    if (audio.paused) {
      audio.play().then(() => {
        isAudioPlaying = true;
        updateAudioUI();
      }).catch(e => {
        console.error('Play error', e);
      });
    } else {
      audio.pause();
      isAudioPlaying = false;
      updateAudioUI();
    }
  }

  function updateAudioUI() {
    if (isAudioPlaying) {
      soundBars.classList.add('playing');
      musicBtnText.textContent = 'Music On';
      musicToggleBtn.setAttribute('aria-label', 'Pause background music');
    } else {
      soundBars.classList.remove('playing');
      musicBtnText.textContent = 'Music Off';
      musicToggleBtn.setAttribute('aria-label', 'Play background music');
    }
  }

  // Audio event listeners
  audio.addEventListener('play', () => { isAudioPlaying = true; updateAudioUI(); });
  audio.addEventListener('pause', () => { isAudioPlaying = false; updateAudioUI(); });
  audio.addEventListener('ended', () => {
    audio.currentTime = 50;
    audio.play();
  });

  // Navigation Button Events
  btnMoreWishes.addEventListener('click', () => {
    showCinema();
  });

  btnPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  });

  btnNext.addEventListener('click', () => {
    if (currentIndex < memories.length - 1) {
      goToSlide(currentIndex + 1);
    } else {
      showFinale();
    }
  });

  btnAutoplay.addEventListener('click', () => {
    isAutoPlaying = !isAutoPlaying;
    btnAutoplay.classList.toggle('active', isAutoPlaying);
    btnAutoplay.innerHTML = isAutoPlaying ? '<span>⏸</span> Pause Auto' : '<span>▶</span> Play Auto';
    if (isAutoPlaying) {
      startSlideTimer();
    } else {
      cancelSlideTimer();
      updateProgressSegments(0);
    }
  });

  btnReplay.addEventListener('click', () => {
    showCinema();
  });

  btnRewatch.addEventListener('click', () => {
    showCinema();
  });

  musicToggleBtn.addEventListener('click', toggleMusic);

  // Keyboard Navigation (Desktop Arrow Keys)
  window.addEventListener('keydown', (e) => {
    if (!cinemaScreen.classList.contains('active')) return;
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      btnNext.click();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      btnPrev.click();
    }
  });

  // Touch Swipe Support for Mobile Phones
  let touchStartX = 0;
  let touchStartY = 0;
  const viewport = document.getElementById('cinemaViewport');

  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Check if horizontal swipe is dominant
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        // Swiped Left -> Next
        btnNext.click();
      } else {
        // Swiped Right -> Prev
        btnPrev.click();
      }
    }
  }, { passive: true });

  // Floating Hearts Burst Effect
  function burstHearts(count = 12) {
    const symbols = ['♡', '♥', '✦', '✧', '💖'];
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      heart.style.left = `${Math.random() * 95}vw`;
      heart.style.bottom = '-30px';
      heart.style.fontSize = `${16 + Math.random() * 22}px`;
      heart.style.animationDuration = `${3.2 + Math.random() * 2.2}s`;
      heart.style.animationDelay = `${Math.random() * 0.8}s`;
      heart.style.color = Math.random() > 0.4 ? 'var(--blush-base)' : 'var(--gold-warm)';
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 5500);
    }
  }

  // Interactive tap on heart on finale screen
  const finaleHeart = document.getElementById('finaleHeart');
  if (finaleHeart) {
    finaleHeart.addEventListener('click', () => {
      burstHearts(24);
    });
  }

  // Background Ambient Bokeh Particles Canvas
  const canvas = document.getElementById('ambientCanvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  const particles = [];
  const PARTICLE_COUNT = 38;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class AmbientParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = 1 + Math.random() * 3.5;
      this.speedY = -0.2 - Math.random() * 0.4;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = 0.1 + Math.random() * 0.5;
      this.color = Math.random() > 0.5 ? '247, 213, 140' : '248, 180, 203'; // Gold or Pink
      this.pulseSpeed = 0.01 + Math.random() * 0.02;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.opacity += Math.sin(Date.now() * this.pulseSpeed) * 0.005;
      if (this.y < -10) this.y = height + 10;
      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${Math.max(0.05, Math.min(0.7, this.opacity))})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(${this.color}, 0.6)`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new AmbientParticle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // Initialize
  initProgressSegments();
});
