// Mode gelap/terang
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Simpan preferensi tema di localStorage
if (localStorage.getItem('theme') === 'light') {
  html.setAttribute('data-theme', 'light');
  themeToggle.textContent = '🌞';
}

// Preferensi sistem untuk tema awal
if (!localStorage.getItem('theme')) {
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    html.setAttribute('data-theme', 'light');
    themeToggle.textContent = '🌞';
  }
}

themeToggle.addEventListener('click', () => {
  if (html.getAttribute('data-theme') === 'light') {
    html.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
    localStorage.setItem('theme', 'dark');
  } else {
    html.setAttribute('data-theme', 'light');
    themeToggle.textContent = '🌞';
    localStorage.setItem('theme', 'light');
  }
});

// Fade-in animasi scroll
const faders = document.querySelectorAll('.fade-in');

const appearOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px"
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => appearOnScroll.observe(fader));

// Smooth scroll untuk anchor link
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Typing effect pada hero
const typedText = document.getElementById('typed-text');
if (typedText) {
  const roles = [
    "Informatics Student",
    "Web Developer",
    "Data Enthusiast",
    "Machine Learning Enthusiast",
  ];
  let roleIdx = 0, charIdx = 0, isDeleting = false;

  function type() {
    let current = roles[roleIdx];
    if (isDeleting) {
      typedText.textContent = current.substring(0, charIdx--);
      if (charIdx < 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(type, 600);
      } else {
        setTimeout(type, 40);
      }
    } else {
      typedText.textContent = current.substring(0, charIdx++);
      if (charIdx > current.length) {
        isDeleting = true;
        setTimeout(type, 1000);
      } else {
        setTimeout(type, 80);
      }
    }
  }
  type();
}

window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (hero) {
    const offset = window.scrollY * 0.3;
    hero.style.backgroundPosition = `center ${offset}px`;
  }
});

// Back to top button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.style.display = 'block';
  } else {
    backToTop.style.display = 'none';
  }
});
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Progress bar scroll
window.addEventListener('scroll', () => {
  const scrollProgress = document.getElementById('scrollProgress');
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (scrollTop / docHeight) * 100;
  if (scrollProgress) scrollProgress.style.width = scrolled + "%";
});

// Form kontak validasi & notifikasi
// filepath: c:\Users\ikmal\Downloads\Portofolio\script.js
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    const status = document.getElementById('formStatus');
    status.textContent = "Sending...";
    status.style.color = "var(--accent)";
  });
}