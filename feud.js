// Family Feud — hỗ trợ cả:
// 1) Multi-slide (.feud-slide chứa nhiều .feud-cell)
// 2) Legacy board (#feud-board với nút onclick resetFeud/revealAllFeud)
(function () {
  function buildCellMarkup(rank, text, points, amount) {
    return `
      <div class="feud-inner" style="position:relative; width:100%; height:100%; transform-style:preserve-3d; transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);">
        <div class="feud-back" style="
          position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden;
          transform: rotateY(0deg);
          background: linear-gradient(135deg, var(--red) 0%, #a00d24 100%);
          color: var(--white); border: 3px solid var(--ink);
          display:flex; align-items:center; justify-content:space-between; padding: 0 50px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15), inset 0 0 40px rgba(0,0,0,0.1);
          border-radius: 4px;
        ">
          <div style="font-family: var(--font-serif); font-weight:900; font-size: 80px; line-height:1; color: var(--gold); text-shadow: 2px 2px 0 var(--ink);">${rank}</div>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 14px; letter-spacing: 0.3em; color: var(--gold); opacity: 0.8; font-weight:700;">REVEAL DATA</div>
          <div style="font-family: var(--font-serif); font-weight:900; font-size: 42px; color: var(--gold); text-shadow: 1px 1px 0 var(--ink);">+${points}</div>
        </div>
        <div class="feud-front" style="
          position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden;
          transform: rotateY(180deg);
          background: var(--white); border: 3px solid var(--ink);
          display: grid; grid-template-columns: 80px 1fr 110px; align-items:center;
          box-shadow: 0 15px 45px rgba(0,0,0,0.1);
          border-radius: 4px;
          overflow: hidden;
        ">
          <div style="background: var(--ink); color: var(--gold); font-family: var(--font-serif); font-weight:900; font-size: 52px; height:100%; display:flex; align-items:center; justify-content:center; border-right: 2px solid var(--line);">${rank}</div>
          <div style="padding: 0 24px; font-family: var(--font-sans); font-size: 30px; font-weight:700; color: var(--ink); line-height:1.15; letter-spacing: -0.01em; display: flex; align-items: center; height: 100%;">${text}</div>
          <div style="background: linear-gradient(to bottom, var(--gold), #e6be00); height:100%; display:flex; align-items:center; justify-content:center; font-family: var(--font-serif); font-weight:900; font-size: 42px; color: var(--ink); border-left: 2px solid var(--line); shadow: inset 2px 0 10px rgba(0,0,0,0.05);">${amount}</div>
        </div>
      </div>
    `;
  }

  function setCellRevealed(cell, revealed) {
    cell.dataset.revealed = String(revealed);
    const inner = cell.querySelector('.feud-inner');
    if (inner) inner.style.transform = revealed ? 'rotateY(180deg)' : 'rotateY(0deg)';
  }

  function wireCell(cell) {
    if (cell.dataset.feudWired === 'true') return;
    cell.dataset.feudWired = 'true';
    const rank = cell.dataset.rank;
    const text = cell.dataset.text || '';
    const points = cell.dataset.points || '0';
    const amount = cell.dataset.amount || '0';
    cell.innerHTML = buildCellMarkup(rank, text, points, amount);
    setCellRevealed(cell, false);

    cell.addEventListener('click', () => {
      const isRevealed = cell.dataset.revealed === 'true';
      setCellRevealed(cell, !isRevealed);
      if (!isRevealed) {
        cell.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(1.04)' }, { transform: 'scale(1)' }],
          { duration: 700, easing: 'cubic-bezier(0.2,0.7,0.2,1)' }
        );
      }
    });
  }

  function initSlide(slide) {
    const cells = slide.querySelectorAll('.feud-cell');
    if (cells.length === 0) return;
    cells.forEach(wireCell);

    const resetBtn = slide.querySelector('.feud-reset');
    if (resetBtn && resetBtn.dataset.feudWired !== 'true') {
      resetBtn.dataset.feudWired = 'true';
      resetBtn.addEventListener('click', () => cells.forEach((cell) => setCellRevealed(cell, false)));
    }

    const allBtn = slide.querySelector('.feud-all');
    if (allBtn && allBtn.dataset.feudWired !== 'true') {
      allBtn.dataset.feudWired = 'true';
      allBtn.addEventListener('click', () => cells.forEach((cell) => setCellRevealed(cell, true)));
    }
  }

  function initLegacyBoard() {
    const board = document.getElementById('feud-board');
    if (!board) return;

    const legacyAnswers = [
      { rank: 1, points: 30, text: 'Tiên phong' },
      { rank: 2, points: 20, text: 'Bản lĩnh' },
      { rank: 3, points: 10, text: 'Tử tế' },
      { rank: 4, points: 5, text: 'Kỷ luật' },
      { rank: 5, points: 6, text: 'Trách nhiệm' },
      { rank: 6, points: 4, text: 'Khiêm tốn' }
    ];

    board.innerHTML = legacyAnswers.map((ans) => `
      <div class="feud-cell"
           data-rank="${ans.rank}"
           data-points="${ans.points}"
           data-text="${ans.text}"
           style="cursor:pointer; height: 140px; perspective:1200px;"></div>
    `).join('');

    const cells = board.querySelectorAll('.feud-cell');
    cells.forEach(wireCell);

    window.resetFeud = () => cells.forEach((cell) => setCellRevealed(cell, false));
    window.revealAllFeud = () => cells.forEach((cell) => setCellRevealed(cell, true));
  }

  function initAllFeudSlides() {
    document.querySelectorAll('.feud-slide').forEach(initSlide);
  }

  function init() {
    initAllFeudSlides();
    initLegacyBoard();

    const stage = document.querySelector('deck-stage');
    if (stage && stage.dataset.feudWired !== 'true') {
      stage.dataset.feudWired = 'true';
      stage.addEventListener('slidechange', (e) => {
        const slide = e?.detail?.slide;
        if (slide && slide.classList && slide.classList.contains('feud-slide')) {
          initSlide(slide);
        }
      });
    }
  }

  window.addEventListener('i18n:loaded', () => {
    // Re-init everything to ensure translations are applied to wired cells
    document.querySelectorAll('.feud-cell').forEach(cell => {
      delete cell.dataset.feudWired;
    });
    init();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (window.i18nLoaded) init();
      else document.addEventListener('DOMContentLoaded', init); // Wait for content loader
    });
  } else {
    if (window.i18nLoaded) init();
  }
})();
