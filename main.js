const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const dropdown = document.querySelector('.dropdown');
const dropdownTrigger = document.querySelector('.dropdown > .nav-link');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

if (dropdown && dropdownTrigger) {
  // Desktop: keep the main Pathways link as a scroll link.
  // Mobile/touch: first tap opens the dropdown, second tap scrolls to Pathways.
  dropdownTrigger.addEventListener('click', (event) => {
    if (window.matchMedia('(max-width: 820px)').matches && !dropdown.classList.contains('open')) {
      event.preventDefault();
      dropdown.classList.add('open');
    }
  });

  dropdown.querySelectorAll('.dropdown-menu a').forEach(item => {
    item.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  });

  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target)) dropdown.classList.remove('open');
  });
}

const navLinks = document.querySelectorAll('.nav-link[data-section]');
const sections = document.querySelectorAll('.section-observe');

function setActive(id) {
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === id);
  });
}

if (sections.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (link.closest('.dropdown') && window.matchMedia('(max-width: 820px)').matches) return;
    if (nav) nav.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    if (dropdown) dropdown.classList.remove('open');
  });
});

const accordionHeaders = document.querySelectorAll('.accordion-header');
accordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const item = header.closest('.accordion-item');
    const accordion = header.closest('.accordion');

    accordion.querySelectorAll('.accordion-item').forEach(other => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
      }
    });

    item.classList.add('open');
    header.setAttribute('aria-expanded', 'true');
  });
});


// Home image slideshow
const slides = Array.from(document.querySelectorAll('.home-slider .slide'));
const sliderDots = Array.from(document.querySelectorAll('.home-slider .slider-dot'));
const previousSlideButton = document.querySelector('.home-slider .slider-prev');
const nextSlideButton = document.querySelector('.home-slider .slider-next');
const homeSlider = document.querySelector('.home-slider');

let currentSlide = 0;
let slideTimer = null;
const SLIDE_DELAY = 5000;

function showSlide(index) {
  if (!slides.length) return;

  currentSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle('active', slideIndex === currentSlide);
    slide.setAttribute('aria-hidden', slideIndex === currentSlide ? 'false' : 'true');
  });

  sliderDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === currentSlide;
    dot.classList.toggle('active', isActive);
    dot.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function previousSlide() {
  showSlide(currentSlide - 1);
}

function stopSlideshow() {
  if (slideTimer) {
    clearInterval(slideTimer);
    slideTimer = null;
  }
}

function startSlideshow() {
  stopSlideshow();

  if (slides.length > 1) {
    slideTimer = setInterval(nextSlide, SLIDE_DELAY);
  }
}

function resetSlideshow() {
  startSlideshow();
}

if (previousSlideButton) {
  previousSlideButton.addEventListener('click', () => {
    previousSlide();
    resetSlideshow();
  });
}

if (nextSlideButton) {
  nextSlideButton.addEventListener('click', () => {
    nextSlide();
    resetSlideshow();
  });
}

sliderDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    showSlide(index);
    resetSlideshow();
  });
});

// Pause while the user points at or focuses on the slideshow.
if (homeSlider) {
  homeSlider.addEventListener('mouseenter', stopSlideshow);
  homeSlider.addEventListener('mouseleave', startSlideshow);
  homeSlider.addEventListener('focusin', stopSlideshow);
  homeSlider.addEventListener('focusout', startSlideshow);
}

// Save resources when the browser tab is hidden.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopSlideshow();
  } else {
    startSlideshow();
  }
});

showSlide(0);
startSlideshow();

// Mailing list form -> Google Sheets through Google Apps Script.
// After you deploy the Apps Script, paste the Web App URL below.
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbziHv89KRMqNd6sibd8pn68q4IJynbZqUyrcc3Y9JHZdt5QUIeyYyHyp3ecnXrRnyI7XQ/exec';
const mailingForm = document.querySelector('#mailing-form');
const formStatus = document.querySelector('#form-status');

if (mailingForm) {
  mailingForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('PASTE_YOUR')) {
      formStatus.textContent = 'Form is ready, but the Google Sheets link has not been connected yet.';
      return;
    }

    const submitButton = mailingForm.querySelector('button[type="submit"]');
    const formData = new FormData(mailingForm);

    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    formStatus.textContent = '';

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });

      mailingForm.reset();
      formStatus.textContent = 'Thank you for joining our mailing list!';
    } catch (error) {
      formStatus.textContent = 'Something went wrong. Please try again.';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit';
    }
  });
}

// Interactive Youth-Led Master Plan timeline
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineYear = document.querySelector('#timeline-year');
const timelineTitle = document.querySelector('#timeline-title');
const timelineCopy = document.querySelector('#timeline-copy');

timelineItems.forEach(item => {
  item.addEventListener('click', () => {
    timelineItems.forEach(button => button.classList.remove('active'));
    item.classList.add('active');
    if (timelineYear) timelineYear.textContent = item.dataset.year;
    if (timelineTitle) timelineTitle.textContent = item.dataset.title;
    if (timelineCopy) timelineCopy.textContent = item.dataset.copy;
  });
});
