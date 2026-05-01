class MangaViewer {
  constructor() {
    this.container = document.getElementById('mangaContainer');
    this.slides = document.querySelectorAll('.manga-slide');
    this.currentPage = 0;
    this.totalPages = this.slides.length;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    // Set total pages
    document.getElementById('totalPages').textContent = this.totalPages;

    // Button listeners
    document.getElementById('prevBtn').addEventListener('click', () => this.prevPage());
    document.getElementById('nextBtn').addEventListener('click', () => this.nextPage());
    document.getElementById('prev10Btn').addEventListener('click', () => this.prevPage(10));
    document.getElementById('next10Btn').addEventListener('click', () => this.nextPage(10));

    // Image zoom listeners
    this.setupImageZoom();

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevPage();
      if (e.key === 'ArrowRight') this.nextPage();
    });

    // Touch/Swipe support
    this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), false);
    this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e), false);

    // Initialize
    this.showPage(0);
  }

  setupImageZoom() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.getElementById('modalClose');

    // Add click listeners to all images
    const images = document.querySelectorAll('.manga-slide img');
    images.forEach((img) => {
      img.addEventListener('click', (e) => {
        modal.classList.add('active');
        modalImg.src = img.src;
        document.body.style.overflow = 'hidden';
      });
    });

    // Close modal on close button click
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });

    // Close modal on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left -> next page
        this.nextPage();
      } else {
        // Swiped right -> prev page
        this.prevPage();
      }
    }
  }

  showPage(pageIndex) {
    // Clamp page index
    if (pageIndex < 0) pageIndex = 0;
    if (pageIndex >= this.totalPages) pageIndex = this.totalPages - 1;

    // Remove active class from all slides
    this.slides.forEach((slide) => slide.classList.remove('active'));

    // Add active class to current slide
    this.slides[pageIndex].classList.add('active');

    // Update page number
    document.getElementById('pageNumber').textContent = pageIndex + 1;

    // Update progress bar
    const progress = ((pageIndex + 1) / this.totalPages) * 100;
    document.getElementById('progressFill').style.width = progress + '%';

    // Update button states
    document.getElementById('prevBtn').disabled = pageIndex === 0;
    document.getElementById('nextBtn').disabled = pageIndex === this.totalPages - 1;
    document.getElementById('prev10Btn').disabled = pageIndex < 10;
    document.getElementById('next10Btn').disabled = pageIndex > this.totalPages - 11;

    this.currentPage = pageIndex;

    // Save to localStorage
    localStorage.setItem('mangaPage', pageIndex);
  }

  nextPage(pages = 1) {
    this.showPage(this.currentPage + pages);
  }

  prevPage(pages = 1) {
    this.showPage(this.currentPage - pages);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const viewer = new MangaViewer();

  // Restore last viewed page
  const savedPage = localStorage.getItem('mangaPage');
  if (savedPage) {
    viewer.showPage(parseInt(savedPage));
  }
});
