// Animations Module - Scroll animations and typewriter effect

export function initAnimations() {
  initScrollAnimations();
  initTypewriter();
}

// Scroll reveal animations using Intersection Observer
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  const staggerContainers = document.querySelectorAll('[data-animate-stagger]');

  if (!animatedElements.length && !staggerContainers.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
  staggerContainers.forEach(el => observer.observe(el));
}

// Typewriter effect
function initTypewriter() {
  const typewriterElement = document.querySelector('.typewriter');
  if (!typewriterElement) return;

  const texts = typewriterElement.dataset.texts;
  if (!texts) return;

  const textArray = texts.split(',').map(t => t.trim());
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isWaiting = false;

  const typeSpeed = 80;
  const deleteSpeed = 50;
  const waitTime = 2000;

  function type() {
    const currentText = textArray[textIndex];

    if (isWaiting) {
      setTimeout(() => {
        isWaiting = false;
        isDeleting = true;
        type();
      }, waitTime);
      return;
    }

    if (isDeleting) {
      typewriterElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
      }

      setTimeout(type, deleteSpeed);
    } else {
      typewriterElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentText.length) {
        isWaiting = true;
      }

      setTimeout(type, isWaiting ? 0 : typeSpeed);
    }
  }

  // Start typing
  setTimeout(type, 500);
}

// Counter animation for stats
export function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Parallax effect (optional, for hero background)
export function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (!parallaxElements.length) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      const yPos = -(scrolled * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  });
}
