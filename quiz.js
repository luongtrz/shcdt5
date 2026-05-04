// Khởi động — quiz 4 đáp án (multi-slide)
// Mỗi slide quiz có thẻ .quiz-slide, chứa data-correct (A/B/C/D) và 4 .quiz-opt
(function () {
  function spawnConfetti(target, slide) {
    if (!slide) return;
    const colors = ['#FFD200', '#C8102E', '#FFE566', '#FFFFFF'];
    const rect = target.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    const cx = rect.left - slideRect.left + rect.width / 2;
    const cy = rect.top - slideRect.top + rect.height / 2;
    const layer = document.createElement('div');
    layer.style.cssText = 'position:absolute; inset:0; pointer-events:none; z-index:100; overflow:hidden;';
    slide.appendChild(layer);
    for (let k = 0; k < 60; k++) {
      const piece = document.createElement('div');
      const size = 8 + Math.random() * 12;
      piece.style.cssText = `
        position:absolute;
        left:${cx}px; top:${cy}px;
        width:${size}px; height:${size * 0.4}px;
        background:${colors[k % colors.length]};
        opacity: 0;
        transform: translate(-50%, -50%);
      `;
      layer.appendChild(piece);
      const angle = Math.random() * Math.PI * 2;
      const dist = 200 + Math.random() * 600;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 100;
      const rot = (Math.random() - 0.5) * 720;
      piece.animate(
        [
          { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rot}deg)`, opacity: 0 }
        ],
        { duration: 1400 + Math.random() * 800, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fill: 'forwards' }
      );
    }
    setTimeout(() => layer.remove(), 2400);
  }

  function initSlide(slide) {
    const correct = slide.dataset.correct; // "A"|"B"|"C"|"D"
    const opts = slide.querySelectorAll('.quiz-opt');
    opts.forEach((el) => {
      el.addEventListener('click', () => reveal(slide, el, correct, opts));
      el.addEventListener('mouseenter', () => {
        if (!el.classList.contains('revealed')) el.style.transform = 'translateY(-4px)';
      });
      el.addEventListener('mouseleave', () => {
        if (!el.classList.contains('revealed')) el.style.transform = 'translateY(0)';
      });
    });
    // Reset button
    const resetBtn = slide.querySelector('.quiz-reset');
    if (resetBtn) resetBtn.addEventListener('click', () => resetSlide(slide));
  }

  function reveal(slide, el, correct, all) {
    if (el.classList.contains('revealed')) return;
    const label = el.dataset.label;
    const isCorrect = label === correct;
    el.classList.add('revealed');

    const icon = el.querySelector('.qicon');
    const badge = el.querySelector('.qbadge');
    const body = el.querySelector('.qbody');

    if (isCorrect) {
      el.style.background = 'var(--gold)';
      el.style.borderColor = 'var(--ink)';
      el.style.transform = 'scale(1.03)';
      el.style.boxShadow = '0 0 0 6px rgba(255,210,0,0.4), 0 0 80px 20px rgba(255,210,0,0.5)';
      el.style.animation = 'pulse 0.6s ease';
      badge.style.background = 'var(--red)';
      badge.style.color = 'var(--white)';
      icon.textContent = '✓';
      icon.style.color = 'var(--red)';
      icon.style.opacity = '1';
      icon.style.fontWeight = '900';
      setTimeout(() => {
        all.forEach((other) => {
          if (other !== el && !other.classList.contains('revealed')) {
            other.style.opacity = '0.35';
          }
        });
      }, 300);
      spawnConfetti(el, slide);
    } else {
      el.style.background = 'var(--ink)';
      el.style.color = 'rgba(255,255,255,0.4)';
      el.style.transform = 'none';
      el.style.animation = 'shake 0.4s ease';
      badge.style.background = 'var(--red)';
      badge.style.color = 'var(--white)';
      body.style.textDecoration = 'line-through';
      body.style.opacity = '0.6';
      icon.textContent = '✕';
      icon.style.color = 'var(--red)';
      icon.style.opacity = '1';
      icon.style.fontWeight = '900';
    }
  }

  function resetSlide(slide) {
    slide.querySelectorAll('.quiz-opt').forEach((el) => {
      el.classList.remove('revealed');
      el.style.background = '';
      el.style.color = '';
      el.style.transform = 'none';
      el.style.boxShadow = '';
      el.style.animation = '';
      el.style.opacity = '';
      el.style.borderColor = '';
      const badge = el.querySelector('.qbadge');
      const body = el.querySelector('.qbody');
      const icon = el.querySelector('.qicon');
      badge.style.background = '';
      badge.style.color = '';
      body.style.textDecoration = '';
      body.style.opacity = '';
      icon.textContent = '';
      icon.style.opacity = '0';
    });
  }

  // Khởi tạo các slide tĩnh hiện có (nếu có)
  document.querySelectorAll('.quiz-slide').forEach(initSlide);

  // Hàm tạo slide động từ JSON
  function createSlideFromData(data, index, total) {
    const section = document.createElement('section');
    const screenLabel = (index + 3).toString().padStart(2, '0') + ` Q${index} ${data.title.replace(/["']/g, '')}`;
    section.setAttribute('data-screen-label', screenLabel);
    section.className = 'quiz-slide';
    section.setAttribute('data-correct', data.correct);

    const qNum = index.toString().padStart(2, '0');
    const totalStr = total.toString().padStart(2, '0');

    // Chuyển cụm trong ngoặc kép thành italic đỏ (như code gốc)
    const formattedQuestion = data.question.replace(/(".*?")/g, '<em style="color:var(--red); font-style:italic;">$1</em>');

    section.innerHTML = `
      <div class="chrome-corner tl">KHỞI ĐỘNG · CÂU ${qNum}/${totalStr}</div>

      <div style="position:absolute; top:0; left:0; width:120px; height:24px; background: var(--red);"></div>
      <div style="position:absolute; top:0; left:120px; width:80px; height:24px; background: var(--gold);"></div>

      <div class="slide-pad" style="padding: 80px 96px;">
        <div style="display:flex; flex-direction:column; gap: 40px; flex:1; justify-content:center; max-width:1740px; width:100%; margin:0 auto;">
          <div>
            <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">
              <div style="width:28px; height:28px; background:var(--red); clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);"></div>
              <div class="mono-tag" style="color: var(--red); font-weight:700;">Câu ${qNum} · ${data.title}</div>
            </div>
            <h2 class="title-md" style="margin:0 0 24px; font-size:52px; line-height:1.15;">
              ${formattedQuestion}
            </h2>
            <p class="body" style="opacity:0.65; margin:0; font-size:28px;">${data.note}</p>
          </div>
          <div class="quiz-grid">
            ${['A', 'B', 'C', 'D'].map(opt => `
              <button class="quiz-opt" data-label="${opt}">
                <div class="qbadge">${opt}</div>
                <div class="qbody">${data.options[opt]}</div>
                <div class="qicon"></div>
              </button>
            `).join('')}
          </div>
        </div>
        <div style="margin-top:24px; display:flex; justify-content:flex-end;">
          <button class="quiz-reset" style="padding: 10px 20px; border:2px solid var(--ink); background:transparent; font-family: var(--font-sans); font-weight:600; cursor:pointer; letter-spacing:0.1em; text-transform:uppercase; font-size:14px;">Reset</button>
        </div>
      </div>
    `;
    return section;
  }

  // Fetch JSON và chèn slide
  fetch('uploads/khoidong.json')
    .then(res => res.json())
    .then(questions => {
      const deck = document.querySelector('deck-stage');
      const targetAnchor = document.getElementById('khoidong-tongket');
      
      if (deck && targetAnchor) {
        questions.forEach((q, idx) => {
          const slide = createSlideFromData(q, idx + 1, questions.length);
          deck.insertBefore(slide, targetAnchor);
          initSlide(slide);
        });
      } else {
        console.error('Không tìm thấy deck-stage hoặc slide mục tiêu (#khoidong-tongket) để chèn.');
      }
    })
    .catch(err => {
      console.error('Lỗi khi tải khoidong.json (nếu bạn đang mở file trực tiếp trên trình duyệt, hãy dùng Local Server để tránh lỗi CORS):', err);
      alert('Không thể tải dữ liệu câu hỏi từ uploads/khoidong.json. Nếu bạn đang mở file trực tiếp (file://), trình duyệt sẽ chặn tải file JSON. Vui lòng sử dụng một Local Server (như Live Server trên VSCode) để chạy trang web.');
    });
})();
