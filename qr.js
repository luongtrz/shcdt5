// Render placeholder QR code as inline SVG (deterministic pattern, no network)
(function () {
  const host = document.getElementById('qr-target');
  if (!host) return;

  // 25x25 QR-style placeholder grid generated deterministically
  const N = 25;
  const cell = 480 / N;
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '480');
  svg.setAttribute('height', '480');
  svg.setAttribute('viewBox', `0 0 480 480`);
  svg.style.background = 'white';

  function isFinder(x, y) {
    const inBox = (x0, y0) =>
      x >= x0 && x < x0 + 7 && y >= y0 && y < y0 + 7;
    return inBox(0, 0) || inBox(N - 7, 0) || inBox(0, N - 7);
  }
  function finderPixel(x, y) {
    let pos;
    if (x < 7 && y < 7) { pos = [x, y]; }
    else if (x >= N - 7 && y < 7) { pos = [x - (N - 7), y]; }
    else if (x < 7 && y >= N - 7) { pos = [x, y - (N - 7)]; }
    if (!pos) return false;
    const [a, b] = pos;
    if (a === 0 || a === 6 || b === 0 || b === 6) return true;
    if (a >= 2 && a <= 4 && b >= 2 && b <= 4) return true;
    return false;
  }

  // Pseudo-random but stable
  function hash(x, y) {
    return Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
  }

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      let on = false;
      if (isFinder(x, y)) {
        on = finderPixel(x, y);
      } else {
        on = hash(x, y) > 0.5;
      }
      if (on) {
        const r = document.createElementNS(svgNS, 'rect');
        r.setAttribute('x', x * cell);
        r.setAttribute('y', y * cell);
        r.setAttribute('width', cell);
        r.setAttribute('height', cell);
        r.setAttribute('fill', '#1A1A1A');
        svg.appendChild(r);
      }
    }
  }

  // Centered logo dot
  const cx = 240, cy = 240;
  const bg = document.createElementNS(svgNS, 'rect');
  bg.setAttribute('x', cx - 40);
  bg.setAttribute('y', cy - 40);
  bg.setAttribute('width', 80);
  bg.setAttribute('height', 80);
  bg.setAttribute('fill', 'white');
  svg.appendChild(bg);
  const star = document.createElementNS(svgNS, 'polygon');
  star.setAttribute('points', '240,210 248,232 270,232 252,246 260,268 240,256 220,268 228,246 210,232 232,232');
  star.setAttribute('fill', '#C8102E');
  svg.appendChild(star);

  host.appendChild(svg);
})();
