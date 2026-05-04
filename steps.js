// Step-trigger + slide animation orchestrator
// SPACE/ENTER/ArrowDown: reveal next .step on current slide (intercept BEFORE deck nav)
// R: reset current slide steps & replay anims
// Auto-resets on slide change + replays auto entrance.
(function () {
  const stage = document.querySelector('deck-stage');
  if (!stage) return;

  function getActiveSlide() { return stage.querySelector('[data-deck-active]'); }
  function getSteps(slide) { return Array.from(slide.querySelectorAll('.step, .step-pop, .step-left, .step-right, .step-scale, .step-bar, .step-highlight')); }
  function getRevealed(slide) { return slide.querySelectorAll('.step-shown').length; }

  function showNextStep() {
    const slide = getActiveSlide();
    if (!slide) return false;
    const steps = getSteps(slide);
    const revealed = getRevealed(slide);
    if (revealed < steps.length) {
      const el = steps[revealed];
      el.classList.add('step-shown');
      // Trigger custom callback if set
      if (el.dataset.stepCallback && window[el.dataset.stepCallback]) {
        window[el.dataset.stepCallback](el);
      }
      updateHint();
      return true;
    }
    return false;
  }

  function resetSteps(slide) {
    if (!slide) return;
    getSteps(slide).forEach(s => s.classList.remove('step-shown'));
  }

  function updateHint() {
    const slide = getActiveSlide();
    if (!slide) return;
    const hint = slide.querySelector('.step-hint-counter');
    if (!hint) return;
    const total = getSteps(slide).length;
    const revealed = getRevealed(slide);
    hint.textContent = `${revealed} / ${total}`;
    // Update dots
    const dots = slide.querySelectorAll('.step-hint .dot');
    dots.forEach((d, i) => d.classList.toggle('on', i < revealed));
  }

  function ensureHint(slide) {
    if (slide.querySelector('.step-hint')) return;
    const total = getSteps(slide).length;
    if (total === 0) return;
    const hint = document.createElement('div');
    hint.className = 'step-hint';
    let dots = '';
    for (let i = 0; i < total; i++) dots += '<span class="dot"></span>';
    hint.innerHTML = `${dots}<span class="step-hint-counter pulse">0 / ${total}</span><span class="arrow">▸</span><span>SPACE</span>`;
    slide.appendChild(hint);
  }

  function init() {
    stage.querySelectorAll('section').forEach(sec => {
      ensureHint(sec);
      observer.observe(sec, { attributes: true });
    });
    updateHint();
  }

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === 'data-deck-active') {
        const target = m.target;
        if (!target.hasAttribute('data-deck-active')) {
          resetSteps(target);
        } else {
          ensureHint(target);
          updateHint();
        }
      }
    }
  });

  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);

  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowDown') {
      const slide = getActiveSlide();
      if (!slide) return;
      const steps = getSteps(slide);
      if (steps.length === 0) return;
      const revealed = getRevealed(slide);
      if (revealed < steps.length) {
        e.preventDefault();
        e.stopPropagation();
        showNextStep();
      }
    }
    if (e.key === 'r' || e.key === 'R') {
      const slide = getActiveSlide();
      if (slide) {
        resetSteps(slide);
        // Replay auto-anim
        if (window.replayAutoAnim) window.replayAutoAnim(slide);
        updateHint();
      }
    }
  }, true);

  window.showNextStep = showNextStep;
})();
