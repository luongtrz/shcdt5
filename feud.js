// Family Feud — hỗ trợ cả:
// 1) Multi-slide (.feud-slide chứa nhiều .feud-cell)
// 2) Legacy board (#feud-board với nút onclick resetFeud/revealAllFeud)
(function () {
  function buildCellMarkup(rank, text, points) {
    return `
      <div class="feud-inner" style="position:relative; width:100%; height:100%; transform-style:preserve-3d; transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);">
        <div class="feud-back" style="
          position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden;
          transform: rotateY(0deg);
          background: var(--red); color: var(--white); border: 2px solid var(--ink);
          display:flex; align-items:center; justify-content:space-between; padding: 0 40px;
        ">
          <div style="font-family: var(--font-serif); font-weight:900; font-size: 70px; line-height:1; color: var(--gold);">${rank}</div>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 14px; letter-spacing: 0.15em; color: var(--gold); opacity: 0.75;">CLICK ĐỂ LẬT</div>
          <div style="font-family: var(--font-serif); font-weight:900; font-size: 38px; color: var(--gold);">+${points}đ</div>
        </div>
        <div class="feud-front" style="
          position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden;
          transform: rotateY(180deg);
          background: var(--white); border: 2px solid var(--ink);
          display: grid; grid-template-columns: 90px 1fr 120px; align-items:center;
        ">
          <div style="background: var(--ink); color: var(--gold); font-family: var(--font-serif); font-weight:900; font-size: 56px; height:100%; display:flex; align-items:center; justify-content:center;">${rank}</div>
          <div style="padding: 0 20px; font-family: var(--font-sans); font-size: 24px; font-weight:600; color: var(--ink); line-height:1.2;">${text}</div>
          <div style="background: var(--gold); height:100%; display:flex; align-items:center; justify-content:center; font-family: var(--font-serif); font-weight:900; font-size: 30px; color: var(--ink);">+${points}đ</div>
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
    const points = cell.dataset.points;
    cell.innerHTML = buildCellMarkup(rank, text, points);
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
      { rank: 4, points: 8, text: 'Kỷ luật' },
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
