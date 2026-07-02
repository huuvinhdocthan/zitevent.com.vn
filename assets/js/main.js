/* ==========================================================
   ZIT Event - Main Javascript
   Tương tác cho menu, lọc, bảng giá, form và nút quay lên
   ========================================================== */

// Khởi tạo hiệu ứng và các chức năng chung khi DOM sẵn sàng.
document.addEventListener('DOMContentLoaded', function () {
  // Cập nhật năm bản quyền.
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Xử lý sticky header khi cuộn.
  const header = document.querySelector('.navbar');
  const toggleStickyHeader = () => {
    if (window.scrollY > 30) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
  };
  toggleStickyHeader();
  window.addEventListener('scroll', toggleStickyHeader);

  // Hiển thị nút quay lên đầu trang.
  const backToTopButton = document.querySelector('.back-to-top');
  const toggleBackToTop = () => {
    if (window.scrollY > 500) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  };
  toggleBackToTop();
  window.addEventListener('scroll', toggleBackToTop);

  // Khởi tạo AOS.
  if (window.AOS) {
    AOS.init({
      duration: 800,
      once: true,
      offset: 120
    });
  }

  // Đánh dấu mục menu đang active dựa trên đường dẫn hiện tại.
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPath)) {
      link.classList.add('active');
    }
  });

  // Lọc thiết bị cho thuê theo tên và danh mục.
  const equipmentCards = Array.from(document.querySelectorAll('.equipment-card'));
  const searchInput = document.getElementById('equipment-search');
  const categoryFilter = document.getElementById('category-filter');
  const equipmentEmptyState = document.getElementById('equipment-empty');

  if (searchInput && categoryFilter && equipmentCards.length) {
    const applyEquipmentFilter = () => {
      const query = searchInput.value.trim().toLowerCase();
      const selectedCategory = categoryFilter.value.toLowerCase();
      let visibleCount = 0;

      equipmentCards.forEach(function (card) {
        const title = card.dataset.name || '';
        const category = card.dataset.category || '';
        const matchesSearch = title.includes(query) || category.includes(query);
        const matchesCategory = !selectedCategory || category === selectedCategory;
        const isVisible = matchesSearch && matchesCategory;

        card.style.display = isVisible ? '' : 'none';
        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (equipmentEmptyState) {
        equipmentEmptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    };

    searchInput.addEventListener('input', applyEquipmentFilter);
    categoryFilter.addEventListener('change', applyEquipmentFilter);
  }

  // Sắp xếp bảng giá.
  const pricingTable = document.getElementById('pricing-table');
  const sortSelect = document.getElementById('pricing-sort');
  if (pricingTable && sortSelect) {
    const rows = Array.from(pricingTable.querySelectorAll('tbody tr'));

    sortSelect.addEventListener('change', function () {
      const method = this.value;
      const sortedRows = rows.slice().sort(function (a, b) {
        const firstValue = a.dataset[method] || '';
        const secondValue = b.dataset[method] || '';
        if (method === 'price') {
          return Number(firstValue) - Number(secondValue);
        }
        return firstValue.localeCompare(secondValue);
      });

      const tbody = pricingTable.querySelector('tbody');
      tbody.innerHTML = '';
      sortedRows.forEach(function (row) {
        tbody.appendChild(row);
      });
    });
  }

  // Lọc portfolio theo loại sự kiện.
  const projectFilters = document.querySelectorAll('.filter-chip');
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  if (projectFilters.length && projectCards.length) {
    projectFilters.forEach(function (button) {
      button.addEventListener('click', function () {
        projectFilters.forEach(function (item) {
          item.classList.remove('active');
        });
        button.classList.add('active');

        const selectedCategory = button.dataset.filter || 'all';
        projectCards.forEach(function (card) {
          const category = card.dataset.category || 'all';
          const isVisible = selectedCategory === 'all' || category === selectedCategory;
          card.style.display = isVisible ? '' : 'none';
        });
      });
    });
  }

  // Validate form liên hệ.
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const name = document.getElementById('name')?.value.trim() || '';
      const phone = document.getElementById('phone')?.value.trim() || '';
      const email = document.getElementById('email')?.value.trim() || '';
      const message = document.getElementById('message')?.value.trim() || '';
      const errorBox = document.getElementById('form-error');

      let errors = [];
      if (name.length < 2) errors.push('Vui lòng nhập họ tên hợp lệ.');
      if (!/^0\d{9,10}$/.test(phone)) errors.push('Số điện thoại phải bắt đầu bằng 0 và có 10-11 số.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Email không đúng định dạng.');
      if (message.length < 10) errors.push('Vui lòng nhập nội dung tối thiểu 10 ký tự.');

      if (errorBox) {
        errorBox.innerHTML = errors.length ? errors.map(function (item) {
          return '<div>' + item + '</div>';
        }).join('') : '<div class="text-success">Thông tin hợp lệ. Chúng tôi sẽ liên hệ lại sớm.</div>';
      }
    });
  }

  // Smooth scroll cho link nội bộ.
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Nút quay lên đầu trình duyệt.
  const scrollTop = document.querySelector('.back-to-top');
  if (scrollTop) {
    scrollTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
