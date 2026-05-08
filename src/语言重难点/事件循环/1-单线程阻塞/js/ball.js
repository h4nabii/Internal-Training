// ---------- 动画及 UI 元素 ----------
const size = 60;
const speed = 130; // 像素/秒
let timeStart = Date.now();

// 创建小球
const ball = document.createElement("div");
ball.classList.add("ball");
ball.style.width = `${size}px`;
ball.style.height = `${size}px`;
ball.style.backgroundColor = "#ef4444";
ball.style.position = "absolute";
document.body.appendChild(ball);

let x = window.innerWidth / 2 - size / 2;
let y = window.innerHeight / 2 - size / 2;
let directionX = 1.4;
let directionY = 1.1;

const timeSpan = document.querySelector(".time-val");
function updateTimeDisplay() {
  const elapsed = (Date.now() - timeStart) / 1000;
  timeSpan.textContent = elapsed.toFixed(2);
}

// 动画循环 (requestAnimationFrame)
let lastTimestamp = 0;
function animate(now) {
  if (!lastTimestamp) lastTimestamp = now;
  let delta = Math.min(0.033, (now - lastTimestamp) / 1000);
  lastTimestamp = now;

  // 移动小球
  x += directionX * speed * delta;
  y += directionY * speed * delta;
  const maxX = window.innerWidth - size;
  const maxY = window.innerHeight - size;

  if (x <= 0) {
    x = 0;
    directionX = Math.abs(directionX);
  }
  if (x >= maxX) {
    x = maxX;
    directionX = -Math.abs(directionX);
  }
  if (y <= 0) {
    y = 0;
    directionY = Math.abs(directionY);
  }
  if (y >= maxY) {
    y = maxY;
    directionY = -Math.abs(directionY);
  }

  ball.style.left = `${x}px`;
  ball.style.top = `${y}px`;

  updateTimeDisplay();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// 窗口大小改变时，避免小球超出边界
window.addEventListener("resize", () => {
  const maxX = window.innerWidth - size;
  const maxY = window.innerHeight - size;
  x = Math.min(maxX, Math.max(0, x));
  y = Math.min(maxY, Math.max(0, y));
});
