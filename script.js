// Subtle tilt on project cards. Skipped for touch screens and reduced motion.
const canTilt =
  window.matchMedia('(hover: hover)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canTilt) {
  document.querySelectorAll('.thumb').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--ry', `${x * 6}deg`);
      card.style.setProperty('--rx', `${-y * 6}deg`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--ry');
      card.style.removeProperty('--rx');
    });
  });
}
