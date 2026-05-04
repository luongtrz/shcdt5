// Đồng hồ đếm ngược cho các slide tọa đàm
(function () {
  function fmt(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  function initTimer(card) {
    const duration = parseInt(card.dataset.duration, 10);
    const display = card.querySelector('.timer-display');
    const startBtn = card.querySelector('.timer-start');
    const pauseBtn = card.querySelector('.timer-pause');
    const resetBtn = card.querySelector('.timer-reset');
    const progressRing = card.querySelector('.timer-progress');
    const circumference = progressRing ? 1068 : 0;

    let remaining = duration;
    let intervalId = null;
    let running = false;

    function setDisplay() {
      display.textContent = fmt(remaining);
      if (progressRing) {
        const offset = circumference - (remaining / duration) * circumference;
        progressRing.style.strokeDashoffset = offset;
      }
    }
    setDisplay();

    function tick() {
      remaining -= 0.1;
      if (remaining <= 0) {
        remaining = 0;
        setDisplay();
        stop();
        // alert flash
        display.animate(
          [
            { color: getComputedStyle(display).color, transform: 'scale(1)' },
            { color: '#FFD200', transform: 'scale(1.05)' },
            { color: getComputedStyle(display).color, transform: 'scale(1)' }
          ],
          { duration: 800, iterations: 3 }
        );
        return;
      }
      // Urgency: shake + red pulse in last 5 seconds
      if (remaining <= 5 && remaining > 0) {
        const intensity = (5 - remaining) / 5;
        display.style.transform = `translateX(${(Math.random() - 0.5) * intensity * 8}px)`;
        if (Math.floor(remaining * 2) % 2 === 0) {
          display.style.textShadow = '0 0 24px rgba(200, 16, 46, 0.6)';
          if (progressRing) progressRing.style.stroke = 'var(--red)';
        } else {
          display.style.textShadow = 'none';
          if (progressRing) progressRing.style.stroke = 'var(--gold)';
        }
      } else {
        display.style.transform = '';
        display.style.textShadow = '';
      }
      setDisplay();
    }

    function start() {
      if (running) return;
      if (remaining <= 0) remaining = duration;
      running = true;
      intervalId = setInterval(tick, 100);
      startBtn.style.opacity = '0.5';
    }
    function stop() {
      running = false;
      if (intervalId) clearInterval(intervalId);
      intervalId = null;
      startBtn.style.opacity = '1';
    }
    function reset() {
      stop();
      remaining = duration;
      setDisplay();
    }

    startBtn.addEventListener('click', start);
    pauseBtn.addEventListener('click', stop);
    resetBtn.addEventListener('click', reset);
  }

  function init() {
    document.querySelectorAll('.timer-card').forEach(initTimer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
