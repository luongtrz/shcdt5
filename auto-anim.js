// Auto-animate: inject staggered entrance on direct children of slide-pad
// when slide becomes active. Skips slides that have explicit .anim-* on header content.
(function () {
  const stage = document.querySelector('deck-stage');
  if (!stage) return;

  const skipLabels = new Set([
    '01 Cover',
    '16 HD1 Game Board'
  ]);

  function animateSlide(slide) {
    const label = slide.getAttribute('data-screen-label');
    if (skipLabels.has(label)) return;

    const pad = slide.querySelector('.slide-pad');
    const root = pad || slide;
    const children = Array.from(root.children).filter(el => {
      const tag = el.tagName;
      return tag !== 'SCRIPT' && tag !== 'STYLE' && !el.classList.contains('step-hint');
    });

    children.forEach((el, i) => {
      el.classList.add('auto-anim-item');
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = `a-fade-up 0.95s cubic-bezier(0.2, 0.7, 0.2, 1) ${0.08 * i + 0.1}s both`;
    });

    // Chrome corners
    slide.querySelectorAll('.chrome-corner').forEach((el, i) => {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = `a-fade 0.6s ease ${0.05 * i}s both`;
    });

    // Decorative bars at top/bottom edges
    slide.querySelectorAll('[style*="height:24px"][style*="width:100%"], [style*="height: 24px"][style*="width: 100%"]').forEach((el) => {
      el.style.transformOrigin = 'left center';
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = `a-slide-bar 0.95s cubic-bezier(0.7, 0, 0.3, 1) 0.05s both`;
    });

    // Vertical side bars
    slide.querySelectorAll('[style*="width:24px"][style*="height:100%"], [style*="width: 24px"][style*="height: 100%"]').forEach((el) => {
      el.style.transformOrigin = 'top center';
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = `a-slide-bar-y 0.95s cubic-bezier(0.7, 0, 0.3, 1) 0.05s both`;
    });
  }

  function go() {
    const active = stage.querySelector('[data-deck-active]');
    if (active) animateSlide(active);
  }

  const obs = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.attributeName === 'data-deck-active') {
        const t = m.target;
        if (t.hasAttribute('data-deck-active')) animateSlide(t);
      }
    }
  });

  function bind() {
    stage.querySelectorAll('section').forEach(s => obs.observe(s, { attributes: true }));
    go();
  }

  if (document.readyState === 'complete') bind();
  else window.addEventListener('load', bind);

  window.replayAutoAnim = animateSlide;
})();
