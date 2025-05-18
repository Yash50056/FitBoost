let currentSlide = 0;

function handleTouchStart(event) {
  startX = event.touches[0].clientX;
}

function handleTouchMove(event) {
  endX = event.touches[0].clientX;
}

function handleTouchEnd() {
  const threshold = 50; // Adjust the swipe threshold as needed

  if (startX - endX > threshold) {
    nextSlide();
  } else if (endX - startX > threshold) {
    prevSlide();
  }
}

function prevSlide() {
  const carousel = document.getElementById('carousel');
  const dots = document.getElementById('carousel-dots');
  const slides = document.querySelectorAll('.carousel-slide');
  const slideWidth = slides[0].clientWidth;

  currentSlide = (currentSlide - 1 + slides.length) % slides.length;

  updateTransform(carousel, slideWidth);
  updateActiveDot(dots);
}

function nextSlide() {
  const carousel = document.getElementById('carousel');
  const dots = document.getElementById('carousel-dots');
  const slides = document.querySelectorAll('.carousel-slide');
  const slideWidth = slides[0].clientWidth;

  currentSlide = (currentSlide + 1) % slides.length;

  updateTransform(carousel, slideWidth);
  updateActiveDot(dots);
}

function autoSlide() {
  nextSlide();
}

function updateTransform(carousel, slideWidth) {
  const transitionDuration = 0.3; // Adjust the transition duration as needed
  const transformValue = `translateX(-${currentSlide * slideWidth}px)`;

  carousel.style.transition = `transform ${transitionDuration}s ease-in-out`;
  carousel.style.transform = transformValue;

  // Reset transition property after the transition ends
  setTimeout(() => {
    carousel.style.transition = 'none';
    if (currentSlide === slides.length - 1) {
      carousel.style.transform = 'translateX(0)';
      currentSlide = 0;
    }
  }, transitionDuration * 1000);
}

function updateActiveDot(dots) {
  const dotElements = dots.querySelectorAll('.dot');
  dotElements.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

function createDots() {
  const dots = document.getElementById('carousel-dots');
  const slides = document.querySelectorAll('.carousel-slide');

  slides.forEach(() => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dots.appendChild(dot);
  });

  updateActiveDot(dots);

  dots.addEventListener('click', (event) => {
    const clickedDot = event.target;
    if (clickedDot.classList.contains('dot')) {
      const dotIndex = Array.from(dots.children).indexOf(clickedDot);
      currentSlide = dotIndex;
      const carousel = document.getElementById('carousel');
      const slideWidth = slides[0].clientWidth;
      updateTransform(carousel, slideWidth);
      updateActiveDot(dots);
    }
  });
}

createDots();

const carouselContainer = document.querySelector('.carousel-container');
carouselContainer.addEventListener('touchstart', handleTouchStart, false);
carouselContainer.addEventListener('touchmove', handleTouchMove, false);
carouselContainer.addEventListener('touchend', handleTouchEnd, false);

// Set interval for automatic sliding (adjust the duration as needed)
setInterval(autoSlide, 5000); // 5000 milliseconds (5 seconds)