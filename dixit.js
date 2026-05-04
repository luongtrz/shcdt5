// Hidden DIXIT — game board with flip cards + scoring (correct barem)
// K1=30, K2=25, K3=20, K4=15, K5=10
(function () {
  const board = document.getElementById('card-board');
  if (!board) return;

  const POINTS = [30, 25, 20, 15, 10];

  // Profile mẫu — người dẫn có thể thay (theo tài liệu HD1: K1 nhận xét chung, K2 ưu, K3 nhược, K4 ẩn ưu/khác, K5 ẩn nhược)
  let rounds = [];
  let currentRound = 0;
  const scores = { a: 0, b: 0, c: 0 };

  function render() {
    if (!rounds.length) return;
    const r = rounds[currentRound];
    document.getElementById('round-num').textContent = currentRound + 1;
    const revealArea = document.getElementById('character-reveal');
    if (revealArea) revealArea.style.display = 'none';
    board.innerHTML = '';
    r.keywords.forEach((kw, i) => {
      const points = POINTS[i];
      const card = document.createElement('div');
      card.className = 'flip-card';
      card.style.cssText = `height: 380px; perspective: 1500px; cursor: pointer;`;
      card.innerHTML = `
        <div class="flip-inner" style="
          position: relative; width: 100%; height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        ">
          <!-- Back (closed) -->
          <div class="flip-back" style="
            position: absolute; inset: 0;
            backface-visibility: hidden;
            background: var(--red); color: var(--white);
            border: 2px solid var(--ink);
            display:flex; flex-direction:column; align-items:center; justify-content:center;
            overflow: hidden;
          ">
            <div style="position:absolute; top:0; left:0; right:0; height:8px; background: var(--gold);"></div>
            <div style="position:absolute; bottom:0; left:0; right:0; height:8px; background: var(--gold);"></div>
            <div style="font-family: var(--font-serif); font-weight:900; font-size: 140px; line-height:1; color: var(--gold);">K${i+1}</div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 14px; letter-spacing: 0.2em; color: var(--gold); margin-top: 12px; opacity: 0.85;">+${points} ĐIỂM</div>
          </div>
          <!-- Front (open) -->
          <div class="flip-front" style="
            position: absolute; inset: 0;
            backface-visibility: hidden;
            transform: rotateY(180deg);
            background: var(--white); border: 2px solid var(--ink);
            padding: 24px;
            display:flex; flex-direction:column;
          ">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 16px; letter-spacing: 0.15em; color: var(--red); font-weight:700;">${kw.type.toUpperCase()}</div>
              <div style="font-family: var(--font-serif); font-weight:900; font-size: 32px; color: var(--gold); background: var(--ink); padding: 4px 12px;">+${points}</div>
            </div>
            <div style="flex:1; display:flex; align-items:center; padding: 16px 0; font-family: var(--font-serif); font-style: italic; font-size: 38px; line-height: 1.2; color: var(--ink);">${kw.text}</div>
            <div style="display:flex; justify-content:flex-end; padding-top: 12px; border-top: 1px solid var(--line);">
              <div style="font-family: var(--font-serif); font-weight:900; font-size: 42px; color: var(--red);">${i+1}</div>
            </div>
          </div>
        </div>
      `;
      const inner = card.querySelector('.flip-inner');
      let flipped = false;
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) ${i * 0.08}s`;
      requestAnimationFrame(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
      card.addEventListener('click', () => {
        flipped = !flipped;
        inner.style.transform = flipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
        if (flipped) {
          card.animate(
            [
              { boxShadow: '0 0 0 0 rgba(255, 210, 0, 0)' },
              { boxShadow: '0 0 80px 8px rgba(255, 210, 0, 0.55)' },
              { boxShadow: '0 0 0 0 rgba(255, 210, 0, 0)' }
            ],
            { duration: 900, easing: 'ease-out' }
          );
        }
      });
      board.appendChild(card);
    });
  }

  window.cycleRound = () => {
    if (!rounds.length) return;
    currentRound = (currentRound + 1) % rounds.length;
    render();
  };
  window.resetCards = () => {
    render();
  };
  window.revealCharacter = () => {
    if (!rounds.length) return;
    const r = rounds[currentRound];
    const revealArea = document.getElementById('character-reveal');
    const nameEl = document.getElementById('character-name');
    if (revealArea && nameEl && r.character) {
      nameEl.textContent = r.character;
      revealArea.style.display = 'block';
      revealArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  window.changeScore = (team, delta) => {
    if (window.ScoreManager) {
      window.ScoreManager.addPoints(team, delta);
    } else {
      scores[team] = scores[team] + delta;
      document.getElementById('score-' + team).textContent = scores[team];
    }
  };

  function init() {
    const data = window.i18nTexts;
    if (data && data.dixit) {
      rounds = data.dixit.rounds;
      render();
    }
  }

  if (window.i18nLoaded) {
    init();
  } else {
    window.addEventListener('i18n:loaded', init);
  }
})();
