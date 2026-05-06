/* ─── CUSTOM CURSOR ─── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
});

function animateRing() {
  rx += (mx - rx - 18) * 0.12;
  ry += (my - ry - 18) * 0.12;
  ring.style.transform = `translate(${rx}px, ${ry}px)`;
  requestAnimationFrame(animateRing);
}
animateRing();

/* ─── NAVBAR SCROLL ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ─── BACK TO TOP ─── */
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => {
  btt.classList.toggle('show', window.scrollY > 400);
});

/* ─── INTERSECTION OBSERVER — reveal on scroll ─── */
const reveals = document.querySelectorAll('.tl-item, .project-card');
const obs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => obs.observe(el));

/* ─── COUNTER ANIMATION ─── */
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1500;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(num => {
        const val = parseInt(num.textContent);
        const suffix = num.textContent.includes('+') ? '+' : '';
        animateCounter(num, val, suffix);
      });
      statsObs.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) statsObs.observe(statsSection);

/* ─── ACTIVE NAV LINK ON SCROLL ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link-custom');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}`
      ? 'var(--accent)'
      : '';
  });
});

/* ─── CONTACT FORM VALIDATION ─── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const inputs = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    subject: document.getElementById('subject'),
    message: document.getElementById('message')
  };

  // Real-time validation
  Object.keys(inputs).forEach(key => {
    inputs[key].addEventListener('blur', () => validateField(key));
    inputs[key].addEventListener('input', () => {
      if (document.getElementById(`${key}Error`).textContent) {
        validateField(key);
      }
    });
  });

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm()) {
      submitForm();
    }
  });
}

function validateField(fieldName) {
  const field = document.getElementById(fieldName);
  const error = document.getElementById(`${fieldName}Error`);
  let isValid = true;
  let message = '';

  if (fieldName === 'name') {
    if (!field.value.trim()) {
      isValid = false;
      message = 'Name is required';
    } else if (field.value.trim().length < 2) {
      isValid = false;
      message = 'Name must be at least 2 characters';
    }
  }
  if (fieldName === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!field.value.trim()) {
      isValid = false;
      message = 'Email is required';
    } else if (!emailRegex.test(field.value)) {
      isValid = false;
      message = 'Please enter a valid email';
    }
  }
  if (fieldName === 'subject') {
    if (!field.value.trim()) {
      isValid = false;
      message = 'Subject is required';
    } else if (field.value.trim().length < 3) {
      isValid = false;
      message = 'Subject must be at least 3 characters';
    }
  }
  if (fieldName === 'message') {
    if (!field.value.trim()) {
      isValid = false;
      message = 'Message is required';
    } else if (field.value.trim().length < 10) {
      isValid = false;
      message = 'Message must be at least 10 characters';
    }
  }

  error.textContent = message;
  field.classList.toggle('is-invalid', !isValid);
  field.classList.toggle('is-valid', isValid && field.value);
  return isValid;
}

function validateForm() {
  return ['name', 'email', 'subject', 'message'].every(field => validateField(field));
}

function submitForm() {
  const btn = document.querySelector('.btn-form-submit');
  const status = document.getElementById('formStatus');
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value
  };

  btn.disabled = true;
  btn.textContent = 'Sending...';
  status.textContent = '';

  // Simulate sending (replace with your backend API)
  setTimeout(() => {
    console.log('Form Data:', formData);
    
    // Show success message
    status.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
    status.classList.remove('error');
    status.classList.add('success');

    // Reset form
    contactForm.reset();
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
      el.classList.remove('is-valid', 'is-invalid');
    });

    // Reset button
    btn.disabled = false;
    btn.innerHTML = 'Send Message <i class="bi bi-arrow-right"></i>';

    // Clear message after 5 seconds
    setTimeout(() => {
      status.textContent = '';
      status.classList.remove('success');
    }, 5000);

  }, 1500);
}