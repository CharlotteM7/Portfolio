// Mini Pong in the hero. Runs an attract-mode demo until clicked, then the
// player controls the left paddle with the mouse, touch or arrow keys.
(() => {
  const canvas = document.getElementById('pong');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const PW = 6;
  const PH = 36;
  const BALL = 6;
  const WIN = 5;
  const FONT = '"Press Start 2P", monospace';
  const COLORS = { ball: '#ffd23f', p1: '#3ef0ff', p2: '#ff4f8b', net: 'rgba(255,255,255,0.35)', text: '#ffffff' };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let mode = 'demo'; // demo | play | over
  let left = { y: H / 2 - PH / 2, score: 0 };
  let right = { y: H / 2 - PH / 2, score: 0 };
  let ball;
  let targetY = null;
  let keys = { up: false, down: false };
  let frame = 0;
  let running = false;
  let visible = true;
  let overTimer = 0;

  function serve(dir) {
    const angle = (Math.random() * 0.8 - 0.4);
    const speed = mode === 'play' ? 2.6 : 2.2;
    ball = {
      x: W / 2 - BALL / 2,
      y: H / 2 - BALL / 2,
      vx: Math.cos(angle) * speed * dir,
      vy: Math.sin(angle) * speed,
    };
  }

  function reset(newMode) {
    mode = newMode;
    left.score = 0;
    right.score = 0;
    left.y = right.y = H / 2 - PH / 2;
    serve(Math.random() < 0.5 ? -1 : 1);
  }

  function ai(paddle, speed, error) {
    const centre = paddle.y + PH / 2;
    const aim = ball.y + BALL / 2 + error;
    if (Math.abs(aim - centre) > 3) {
      paddle.y += Math.sign(aim - centre) * Math.min(speed, Math.abs(aim - centre));
    }
    paddle.y = Math.max(0, Math.min(H - PH, paddle.y));
  }

  function hit(paddle, x) {
    const rel = (ball.y + BALL / 2 - (paddle.y + PH / 2)) / (PH / 2);
    const speed = Math.min(Math.hypot(ball.vx, ball.vy) * 1.06, 5.5);
    const angle = rel * 0.9;
    const dir = x < W / 2 ? 1 : -1;
    ball.vx = Math.cos(angle) * speed * dir;
    ball.vy = Math.sin(angle) * speed;
  }

  function update() {
    frame++;

    if (mode === 'over') {
      if (--overTimer <= 0) reset('demo');
      return;
    }

    // Left paddle: player in play mode, AI in demo mode
    if (mode === 'play') {
      if (keys.up) left.y -= 4;
      if (keys.down) left.y += 4;
      if (targetY !== null) left.y += (targetY - PH / 2 - left.y) * 0.35;
      left.y = Math.max(0, Math.min(H - PH, left.y));
    } else {
      ai(left, 2.4, Math.sin(frame / 40) * 10);
    }
    ai(right, mode === 'play' ? 2.1 : 2.4, Math.cos(frame / 33) * 12);

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y <= 0 || ball.y + BALL >= H) {
      ball.vy *= -1;
      ball.y = Math.max(0, Math.min(H - BALL, ball.y));
    }

    const lx = 12;
    const rx = W - 12 - PW;
    if (ball.vx < 0 && ball.x <= lx + PW && ball.x >= lx - BALL &&
        ball.y + BALL >= left.y && ball.y <= left.y + PH) {
      ball.x = lx + PW;
      hit(left, lx);
    }
    if (ball.vx > 0 && ball.x + BALL >= rx && ball.x <= rx + PW &&
        ball.y + BALL >= right.y && ball.y <= right.y + PH) {
      ball.x = rx - BALL;
      hit(right, rx);
    }

    if (ball.x < -BALL) {
      right.score++;
      serve(1);
    } else if (ball.x > W) {
      left.score++;
      serve(-1);
    }

    if (left.score >= WIN || right.score >= WIN) {
      if (mode === 'play') {
        mode = 'over';
        overTimer = 180;
      } else {
        reset('demo');
      }
    }
  }

  function text(str, x, y, size, color, align = 'center') {
    ctx.font = `${size}px ${FONT}`;
    ctx.textAlign = align;
    ctx.fillStyle = color;
    ctx.fillText(str, x, y);
  }

  function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = COLORS.net;
    for (let y = 4; y < H; y += 12) ctx.fillRect(W / 2 - 1, y, 2, 6);

    text(String(left.score), W / 2 - 30, 28, 16, COLORS.text);
    text(String(right.score), W / 2 + 30, 28, 16, COLORS.text);

    ctx.fillStyle = COLORS.p1;
    ctx.fillRect(12, Math.round(left.y), PW, PH);
    ctx.fillStyle = COLORS.p2;
    ctx.fillRect(W - 12 - PW, Math.round(right.y), PW, PH);

    if (mode !== 'over') {
      ctx.fillStyle = COLORS.ball;
      ctx.fillRect(Math.round(ball.x), Math.round(ball.y), BALL, BALL);
    }

    if (mode === 'demo' && Math.floor(frame / 30) % 2 === 0) {
      text('PRESS START', W / 2, H / 2 + 50, 10, COLORS.ball);
    }
    if (mode === 'over') {
      const won = left.score > right.score;
      text(won ? 'YOU WIN!' : 'GAME OVER', W / 2, H / 2 - 4, 16, won ? COLORS.p1 : COLORS.p2);
      text('CLICK TO PLAY AGAIN', W / 2, H / 2 + 22, 8, COLORS.text);
    }
  }

  function loop() {
    if (!running) return;
    update();
    draw();
    requestAnimationFrame(loop);
  }

  function start() {
    if (running || !visible) return;
    running = true;
    requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
  }

  function play() {
    if (mode !== 'play') reset('play');
    start();
  }

  function pointerY(e) {
    const r = canvas.getBoundingClientRect();
    targetY = ((e.clientY - r.top) / r.height) * H;
  }

  canvas.addEventListener('click', () => {
    canvas.focus();
    play();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (mode === 'play') pointerY(e);
  });
  canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') {
      play();
      pointerY(e);
    }
  });
  canvas.addEventListener('pointerleave', () => {
    targetY = null;
  });

  canvas.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      play();
    }
    if (mode !== 'play') return;
    if (e.key === 'ArrowUp' || e.key === 'w') { keys.up = true; targetY = null; e.preventDefault(); }
    if (e.key === 'ArrowDown' || e.key === 's') { keys.down = true; targetY = null; e.preventDefault(); }
  });
  canvas.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w') keys.up = false;
    if (e.key === 'ArrowDown' || e.key === 's') keys.down = false;
  });

  // Only animate while the screen is on view
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) stop();
    else if (!reduceMotion || mode === 'play') start();
  }).observe(canvas);

  reset('demo');
  const firstDraw = () => draw();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(firstDraw);
  firstDraw();
  if (!reduceMotion) start();
})();
