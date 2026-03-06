const toggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('nav ul');

if (toggle && navList) {
  toggle.addEventListener('click', () => {
    navList.classList.toggle('active');
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
  });
}

document.querySelectorAll('nav ul li a').forEach((anchor) => {
  anchor.addEventListener('click', function onClick(e) {
    const href = this.getAttribute('href') || '';

    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      navList?.classList.remove('active');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

if (window.AOS && typeof window.AOS.init === 'function') {
  window.AOS.init();
}
