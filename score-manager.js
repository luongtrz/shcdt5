(function () {
  const TEAMS = ['a', 'b', 'c'];
  const INITIAL_SCORES = { a: 0, b: 0, c: 0 };

  function loadScores() {
    const saved = localStorage.getItem('shcd_scores');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return { ...INITIAL_SCORES };
      }
    }
    return { ...INITIAL_SCORES };
  }

  function saveScores(scores) {
    localStorage.setItem('shcd_scores', JSON.stringify(scores));
  }

  function updateScoreDisplay(team, value) {
    const el = document.getElementById(`score-val-${team}`);
    if (el) {
      // Animation effect
      el.style.transform = 'scale(1.2)';
      el.style.color = 'var(--white)';
      el.textContent = value;
      setTimeout(() => {
        el.style.transform = 'scale(1)';
        el.style.color = 'var(--gold)';
      }, 300);
    }
  }

  function initUI() {
    const scores = loadScores();

    // Injected Styles
    const style = document.createElement('style');
    style.textContent = `
      .score-dashboard {
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 12px;
        font-family: var(--font-sans);
      }
      .score-toggle {
        background: var(--red);
        color: var(--gold);
        border: 2px solid var(--gold);
        padding: 12px 24px;
        border-radius: 40px;
        cursor: pointer;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-size: 14px;
        box-shadow: 0 10px 20px rgba(200, 16, 46, 0.3);
        display: flex;
        align-items: center;
        gap: 12px;
        transition: all 0.3s;
      }
      .score-toggle:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 30px rgba(0,0,0,0.3);
      }
      .score-panel {
        display: none;
        position: absolute;
        top: calc(100% + 12px);
        right: 0;
        width: 440px;
        padding: 32px;
        border-radius: 20px;
        background: var(--red);
        color: var(--gold);
        border: 2px solid var(--gold);
        box-shadow: 0 30px 60px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,210,0,0.1);
        flex-direction: column;
        gap: 24px;
        z-index: 10001;
        transform-origin: top right;
      }
      .score-panel.active {
        display: flex;
        animation: panelSlideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      @keyframes panelSlideDown {
        from { opacity: 0; transform: translateY(-10px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      .team-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(255, 210, 0, 0.2);
      }
      .team-info {
        display: flex;
        flex-direction: column;
      }
      .team-name {
        font-weight: 800;
        font-size: 18px;
        color: var(--gold);
        text-transform: uppercase;
      }
      .team-score {
        font-family: 'JetBrains Mono', monospace;
        font-weight: 800;
        font-size: 42px;
        line-height: 1;
        color: var(--gold);
        transition: all 0.3s;
      }
      .score-btns {
        display: flex;
        gap: 8px;
      }
      .btn-score {
        width: 60px;
        height: 50px;
        border: 2px solid var(--gold);
        background: var(--red);
        color: var(--gold);
        font-family: 'JetBrains Mono', monospace;
        font-weight: 800;
        font-size: 16px;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.1s;
      }
      .btn-score:hover {
        background: var(--gold);
        color: var(--red);
      }
      .btn-score:active {
        transform: translateY(2px);
      }
      .btn-score.plus { color: var(--gold); }
      .btn-score.minus { color: var(--gold); opacity: 0.8; }
      
      .score-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      .score-panel-title {
        font-weight: 900;
        font-size: 20px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }
      .btn-reset-scores {
        background: transparent;
        border: 1px solid var(--gold);
        color: var(--gold);
        font-size: 10px;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        opacity: 0.6;
      }
      .btn-reset-scores:hover { opacity: 1; }
    `;
    document.head.appendChild(style);

    // HTML Structure
    const dashboard = document.createElement('div');
    dashboard.className = 'score-dashboard';
    
    dashboard.innerHTML = `
      <button class="score-toggle" id="score-toggle-btn" title="Click để quản lý điểm số">
        <span style="display:flex; gap: 12px; align-items:center;">
          <span style="font-size: 18px; margin-right: 4px">🏆</span>
          <span>A: <span id="summary-a">${scores.a}</span></span>
          <span style="opacity: 0.4">|</span>
          <span>B: <span id="summary-b">${scores.b}</span></span>
          <span style="opacity: 0.4">|</span>
          <span>C: <span id="summary-c">${scores.c}</span></span>
        </span>
      </button>
      <div class="score-panel" id="score-panel-box">
        <div class="score-panel-header">
          <div class="score-panel-title">Bảng Tổng Điểm</div>
          <button class="btn-reset-scores" id="btn-reset-all">Reset</button>
        </div>
        ${TEAMS.map(team => `
          <div class="team-row">
            <div class="team-info">
              <div class="team-name">Đội ${team.toUpperCase()}</div>
              <div class="team-score" id="score-val-${team}">${scores[team]}</div>
            </div>
            <div class="score-btns">
              <button class="btn-score plus" data-team="${team}" data-val="10">+10</button>
              <button class="btn-score plus" data-team="${team}" data-val="5">+5</button>
              <button class="btn-score minus" data-team="${team}" data-val="-5">-5</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    document.body.appendChild(dashboard);

    // Event Listeners
    const panel = document.getElementById('score-panel-box');
    const toggleBtn = document.getElementById('score-toggle-btn');
    
    function togglePanel(show) {
      if (show === undefined) show = panel.style.display !== 'flex';
      panel.style.display = show ? 'flex' : 'none';
      if (show) panel.classList.add('active');
    }

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePanel();
    });

    // Close panel when clicking outside
    document.addEventListener('mousedown', (e) => {
      if (!dashboard.contains(e.target)) {
        panel.style.display = 'none';
        panel.classList.remove('active');
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        panel.style.display = 'none';
        panel.classList.remove('active');
      }
      if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        togglePanel(true);
      }
    });

    const currentScores = { ...scores };

    dashboard.querySelectorAll('.btn-score').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const team = btn.dataset.team;
        const val = parseInt(btn.dataset.val);
        currentScores[team] += val;
        
        saveScores(currentScores);
        updateScoreDisplay(team, currentScores[team]);
        document.getElementById(`summary-${team}`).textContent = currentScores[team];
        
        // Sync with any other elements on page that might display scores (legacy)
        const legacyScore = document.getElementById('score-' + team);
        if (legacyScore) legacyScore.textContent = currentScores[team];
      });
    });

    document.getElementById('btn-reset-all').addEventListener('click', () => {
      if (confirm('Bạn có chắc muốn reset toàn bộ điểm số về 0?')) {
        TEAMS.forEach(team => {
          currentScores[team] = 0;
          updateScoreDisplay(team, 0);
          document.getElementById(`summary-${team}`).textContent = 0;
          const legacyScore = document.getElementById('score-' + team);
          if (legacyScore) legacyScore.textContent = 0;
        });
        saveScores(currentScores);
      }
    });

    // Sync legacy score displays (if any)
    TEAMS.forEach(team => {
      const legacyScore = document.getElementById('score-' + team);
      if (legacyScore) legacyScore.textContent = currentScores[team];
    });

    // Public API
    window.ScoreManager = {
      addPoints: (team, val) => {
        const t = team.toLowerCase();
        if (TEAMS.includes(t)) {
          currentScores[t] += val;
          saveScores(currentScores);
          updateScoreDisplay(t, currentScores[t]);
          document.getElementById(`summary-${t}`).textContent = currentScores[t];
          const legacyScore = document.getElementById('score-' + t);
          if (legacyScore) legacyScore.textContent = currentScores[t];
        }
      },
      getScores: () => ({ ...currentScores })
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
  } else {
    initUI();
  }
})();
