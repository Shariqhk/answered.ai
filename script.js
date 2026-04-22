/* answered.ai — script.js */

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
// Close menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- SCROLL ANIMATIONS (custom AOS) ----
const aosElements = document.querySelectorAll('[data-aos]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('aos-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

aosElements.forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  observer.observe(el);
});

// ---- REAL AUDIO PLAYER ----
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const timeLabels = document.querySelector('.time-labels');
const progressBar = document.querySelector('.progress-bar');

const demoAudio = new Audio('demo.mp3');

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

if (playBtn) {
  demoAudio.addEventListener('loadedmetadata', () => {
    if (timeLabels && timeLabels.lastElementChild) {
       timeLabels.lastElementChild.textContent = formatTime(demoAudio.duration);
    }
  });

  playBtn.addEventListener('click', () => {
    if (demoAudio.paused) {
      demoAudio.play().then(() => {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
      }).catch(err => {
        alert("To hear the call, please place an audio file named 'demo.mp3' in your website folder!");
      });
    } else {
      demoAudio.pause();
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    }
  });

  demoAudio.addEventListener('timeupdate', () => {
    const pct = (demoAudio.currentTime / demoAudio.duration) * 100;
    progressFill.style.width = pct + '%';
    currentTimeEl.textContent = formatTime(demoAudio.currentTime);
  });

  demoAudio.addEventListener('ended', () => {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    progressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
  });
  
  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      if (isNaN(demoAudio.duration)) return;
      const rect = progressBar.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      demoAudio.currentTime = pct * demoAudio.duration;
    });
  }
}

// ---- CONTACT FORM ----
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Booking...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    // Simulate submission delay
    setTimeout(() => {
      contactForm.style.display = 'none';
      formSuccess.style.display = 'block';
      formSuccess.style.animation = 'bubbleIn 0.5s ease both';
    }, 1500);
  });
}

// ---- ANIMATED COUNTER for metrics ----
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

const metricsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.metric-val').forEach(el => {
        const val = parseInt(el.textContent);
        animateCounter(el, val);
      });
      metricsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const metricsCard = document.querySelector('.metrics-card');
if (metricsCard) metricsObserver.observe(metricsCard);

// ---- ANIMATE STAT BIG NUMBER ----
const statBig = document.querySelector('.stat-big');
if (statBig) {
  const statObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      let count = 0;
      const timer = setInterval(() => {
        count += 2;
        if (count >= 62) { statBig.textContent = '62%'; clearInterval(timer); }
        else { statBig.textContent = count + '%'; }
      }, 25);
      statObs.disconnect();
    }
  }, { threshold: 0.5 });
  statObs.observe(statBig);
}

// ---- STAGGER CHAT BUBBLES animation on hero load ----
const bubbles = document.querySelectorAll('.bubble');
bubbles.forEach((bubble, i) => {
  bubble.style.opacity = '0';
  bubble.style.animationDelay = `${i * 0.8 + 0.6}s`;
  bubble.style.animationFillMode = 'both';
  bubble.style.animationName = 'bubbleIn';
  bubble.style.animationDuration = '0.5s';
});

// ---- PROGRESS BAR CLICK ----
// (Audio seeking logic now integrated with real audio object above)

// ---- NAV ACTIVE STATE ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.pageYOffset >= sectionTop) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--blue-600)' : '';
  });
}, { passive: true });
