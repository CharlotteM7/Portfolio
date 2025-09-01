       
       
       // Mobile menu toggle
const toggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('nav ul');
if (toggle && navList) {
  toggle.addEventListener('click', () => {
    navList.classList.toggle('active');
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
  });
}

       
       
       
// Smooth Scrolling for in-page anchors only
document.querySelectorAll('nav ul li a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');

    // external links (http, https, mailto, Portfolio/docs) should behave normally
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      
      // close mobile menu after clicking a link
      document.querySelector('nav ul')?.classList.remove('active');
      document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
    }
  });
});






        // Initialize AOS
        AOS.init();