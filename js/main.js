/* =========================================
   Mobile Wedding Invitation — Main JS
   규완 & 유안 — 2026. 06. 20
   ========================================= */

/* ===================
   CONFIG
   =================== */
const CONFIG = {
  weddingDate: new Date('2026-06-20T11:00:00+09:00'),
  venue: {
    name: '합정 웨딩시그니처',
    hall: '2층 트리니티홀',
    lat: 37.552578,
    lng: 126.917323,
  },
  kakao: {
    appKey: '', // 카카오 개발자 앱 JavaScript 키 입력
  },
  gallery: [
    // 사진 추가 시 아래 형식으로 추가
    // { src: 'assets/images/photo-01.jpg', alt: '웨딩 사진 1' },
    // { src: 'assets/images/photo-02.jpg', alt: '웨딩 사진 2' },
  ],
};

/* ===================
   INIT
   =================== */
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initNavDots();
  initCalendar();
  initDday();
  initGallery();
  initLightbox();
  initMap();
  initTransportTabs();
  initAccountToggle();
  initCopyButtons();
  initBGM();
  initShare();
});

/* ===================
   Scroll Fade-In (Staggered)
   =================== */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Set stagger delays on children before revealing
          const children = entry.target.querySelectorAll('.section-inner > *');
          children.forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.12}s`;
          });
          // Small RAF delay so transition-delay takes effect
          requestAnimationFrame(() => {
            entry.target.classList.add('visible');
          });
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
}

/* ===================
   Navigation Dots
   =================== */
function initNavDots() {
  const nav = document.getElementById('nav-dots');
  if (!nav) return;

  const sections = [
    { id: 'hero', label: '인트로' },
    { id: 'greeting', label: '인사말' },
    { id: 'calendar', label: '예식 안내' },
    { id: 'gallery', label: '갤러리' },
    { id: 'location', label: '오시는 길' },
    { id: 'account', label: '축의금' },
    { id: 'contact', label: '연락하기' },
  ];

  // Create dots
  sections.forEach((sec) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot';
    dot.dataset.target = sec.id;
    dot.setAttribute('aria-label', sec.label);
    dot.title = sec.label;
    dot.addEventListener('click', () => {
      document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
    });
    nav.appendChild(dot);
  });

  // Observe sections to update active dot
  const dots = nav.querySelectorAll('.nav-dot');
  let currentActive = 0;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = sections.findIndex((s) => s.id === entry.target.id);
          if (idx !== -1 && idx !== currentActive) {
            dots[currentActive]?.classList.remove('active');
            dots[idx]?.classList.add('active');
            currentActive = idx;
          }
        }
      });
    },
    { threshold: 0.3, rootMargin: '-10% 0px -10% 0px' }
  );

  sections.forEach((sec) => {
    const el = document.getElementById(sec.id);
    if (el) observer.observe(el);
  });

  // Set first dot active
  if (dots[0]) dots[0].classList.add('active');
}

/* ===================
   Calendar
   =================== */
function initCalendar() {
  const container = document.getElementById('calendar-grid');
  if (!container) return;

  const year = 2026;
  const month = 5; // June (0-indexed)
  const weddingDay = 20;

  const today = new Date();
  const todayDate =
    today.getFullYear() === year && today.getMonth() === month
      ? today.getDate()
      : -1;

  // Header
  const header = document.createElement('div');
  header.className = 'calendar-header';
  header.textContent = 'JUNE 2026';
  container.appendChild(header);

  // Weekday labels
  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const weekdayRow = document.createElement('div');
  weekdayRow.className = 'calendar-weekdays';
  weekdays.forEach((day, i) => {
    const el = document.createElement('div');
    el.className = 'calendar-weekday';
    if (i === 0) el.classList.add('sunday');
    if (i === 6) el.classList.add('saturday');
    el.textContent = day;
    weekdayRow.appendChild(el);
  });
  container.appendChild(weekdayRow);

  // Days
  const daysContainer = document.createElement('div');
  daysContainer.className = 'calendar-days';

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'calendar-day empty';
    daysContainer.appendChild(empty);
  }

  // Day cells
  for (let d = 1; d <= totalDays; d++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';

    const dayOfWeek = (firstDay + d - 1) % 7;
    if (dayOfWeek === 0) dayEl.classList.add('sunday');
    if (dayOfWeek === 6) dayEl.classList.add('saturday');
    if (d === todayDate) dayEl.classList.add('today');
    if (d === weddingDay) dayEl.classList.add('wedding');

    dayEl.textContent = d;
    daysContainer.appendChild(dayEl);
  }

  container.appendChild(daysContainer);
}

/* ===================
   D-Day Counter
   =================== */
function initDday() {
  const ddayEl = document.getElementById('dday');
  if (!ddayEl) return;

  function update() {
    const now = new Date();
    const diff = CONFIG.weddingDate - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      ddayEl.textContent = `D - ${days}`;
    } else if (days === 0) {
      ddayEl.textContent = 'D - DAY';
    } else {
      ddayEl.textContent = '';
    }
  }

  update();
  // Update daily
  setInterval(update, 1000 * 60 * 60);
}

/* ===================
   Gallery
   =================== */
function initGallery() {
  const grid = document.getElementById('gallery-grid');
  const placeholder = document.getElementById('gallery-placeholder');
  if (!grid) return;

  if (CONFIG.gallery.length === 0) {
    grid.style.display = 'none';
    if (placeholder) placeholder.style.display = 'block';
    return;
  }

  if (placeholder) placeholder.style.display = 'none';
  grid.style.display = 'grid';

  CONFIG.gallery.forEach((photo, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.index = index;

    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.alt || `사진 ${index + 1}`;
    img.loading = 'lazy';

    item.appendChild(img);
    grid.appendChild(item);
  });
}

/* ===================
   Lightbox
   =================== */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const closeBtn = lightbox?.querySelector('.lightbox-close');
  const prevBtn = lightbox?.querySelector('.lightbox-prev');
  const nextBtn = lightbox?.querySelector('.lightbox-next');
  const backdrop = lightbox?.querySelector('.lightbox-backdrop');

  if (!lightbox || CONFIG.gallery.length === 0) return;

  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  function open(index) {
    currentIndex = index;
    show();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function show() {
    lightboxImg.src = CONFIG.gallery[currentIndex].src;
    lightboxImg.alt = CONFIG.gallery[currentIndex].alt || '';
    lightboxCounter.textContent = `${currentIndex + 1} / ${CONFIG.gallery.length}`;
  }

  function prev() {
    currentIndex = (currentIndex - 1 + CONFIG.gallery.length) % CONFIG.gallery.length;
    show();
  }

  function next() {
    currentIndex = (currentIndex + 1) % CONFIG.gallery.length;
    show();
  }

  // Click on gallery items
  document.getElementById('gallery-grid')?.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (item) open(parseInt(item.dataset.index));
  });

  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Swipe
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  }, { passive: true });
}

/* ===================
   Map
   =================== */
function initMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  // 카카오맵 API 로드 확인
  if (typeof kakao !== 'undefined' && kakao.maps) {
    const map = new kakao.maps.Map(mapContainer, {
      center: new kakao.maps.LatLng(CONFIG.venue.lat, CONFIG.venue.lng),
      level: 3,
    });

    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(CONFIG.venue.lat, CONFIG.venue.lng),
    });
    marker.setMap(map);

    const infowindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:4px 8px;font-size:12px;font-weight:500;">${CONFIG.venue.name}</div>`,
    });
    infowindow.open(map, marker);

    mapContainer.classList.add('loaded');
  } else {
    // API 없을 시 정적 맵 링크 표시
    mapContainer.innerHTML = `
      <a href="https://map.kakao.com/link/map/${CONFIG.venue.name},${CONFIG.venue.lat},${CONFIG.venue.lng}"
         target="_blank" rel="noopener"
         style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;
                color:#6B6B6B;font-size:0.82rem;text-decoration:none;flex-direction:column;gap:8px;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A08B6E" stroke-width="1.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        지도 보기
      </a>
    `;
    mapContainer.classList.add('loaded');
  }
}

/* ===================
   Transport Tabs
   =================== */
function initTransportTabs() {
  const tabs = document.querySelectorAll('.transport-tab');
  const panels = document.querySelectorAll('.transport-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach((t) => t.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(`panel-${target}`)?.classList.add('active');
    });
  });
}

/* ===================
   Account Toggle
   =================== */
function initAccountToggle() {
  document.querySelectorAll('.account-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const detail = toggle.nextElementSibling;
      const isOpen = detail.classList.contains('open');

      // Close all
      document.querySelectorAll('.account-detail').forEach((d) => d.classList.remove('open'));
      document.querySelectorAll('.account-toggle').forEach((t) => t.setAttribute('aria-expanded', 'false'));

      if (!isOpen) {
        detail.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ===================
   Copy Buttons
   =================== */
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        showToast('계좌번호가 복사되었습니다.');
      }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('계좌번호가 복사되었습니다.');
      });
    });
  });
}

/* ===================
   BGM
   =================== */
function initBGM() {
  const toggle = document.getElementById('bgm-toggle');
  const audio = document.getElementById('bgm');
  if (!toggle || !audio) return;

  let isPlaying = false;

  toggle.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      toggle.classList.remove('playing');
    } else {
      audio.play().then(() => {
        toggle.classList.add('playing');
      }).catch(() => {
        // 오디오 파일 없거나 재생 불가
      });
    }
    isPlaying = !isPlaying;
  });
}

/* ===================
   Share
   =================== */
function initShare() {
  // 카카오톡 공유
  const kakaoBtn = document.getElementById('kakao-share');
  if (kakaoBtn) {
    kakaoBtn.addEventListener('click', () => {
      if (typeof Kakao !== 'undefined' && CONFIG.kakao.appKey) {
        if (!Kakao.isInitialized()) {
          Kakao.init(CONFIG.kakao.appKey);
        }
        Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: '김규완 ♥ 최유안 결혼합니다',
            description: '2026년 6월 20일 토요일 오전 11시\n합정 웨딩시그니처 2층 트리니티홀',
            imageUrl: 'https://kkw5240.github.io/wedding/assets/og-image.jpg',
            link: {
              mobileWebUrl: 'https://kkw5240.github.io/wedding/',
              webUrl: 'https://kkw5240.github.io/wedding/',
            },
          },
          buttons: [
            {
              title: '청첩장 보기',
              link: {
                mobileWebUrl: 'https://kkw5240.github.io/wedding/',
                webUrl: 'https://kkw5240.github.io/wedding/',
              },
            },
          ],
        });
      } else {
        // 카카오 SDK 미설정 시 URL 공유로 대체
        shareURL();
      }
    });
  }

  // 링크 복사
  const linkBtn = document.getElementById('link-copy');
  if (linkBtn) {
    linkBtn.addEventListener('click', shareURL);
  }
}

function shareURL() {
  const url = 'https://kkw5240.github.io/wedding/';
  navigator.clipboard.writeText(url).then(() => {
    showToast('링크가 복사되었습니다.');
  }).catch(() => {
    showToast('링크 복사에 실패했습니다.');
  });
}

/* ===================
   Toast
   =================== */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}
