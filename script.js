const canvas = document.getElementById("signalCanvas");
const ctx = canvas.getContext("2d");

const colors = ["#0f766e", "#e85d4f", "#f6b73c", "#265fba", "#15161a"];
let points = [];
let animationFrame;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  points = Array.from({ length: 38 }, (_, index) => ({
    x: 40 + Math.random() * Math.max(260, rect.width - 80),
    y: 36 + Math.random() * Math.max(220, rect.height - 210),
    radius: 3 + Math.random() * 6,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    color: colors[index % colors.length],
  }));
}

function draw() {
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);

  points.forEach((point, index) => {
    point.x += point.vx;
    point.y += point.vy;

    if (point.x < 28 || point.x > rect.width - 28) point.vx *= -1;
    if (point.y < 28 || point.y > rect.height - 190) point.vy *= -1;

    for (let nextIndex = index + 1; nextIndex < points.length; nextIndex += 1) {
      const next = points[nextIndex];
      const distance = Math.hypot(point.x - next.x, point.y - next.y);
      if (distance < 145) {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(next.x, next.y);
        ctx.strokeStyle = `rgba(21, 22, 26, ${0.17 - distance / 1000})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    ctx.beginPath();
    ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
    ctx.fillStyle = point.color;
    ctx.fill();
  });

  drawLabels(rect.width, rect.height);
  animationFrame = requestAnimationFrame(draw);
}

function drawLabels(width, height) {
  const labels = [
    { text: "React", x: width * 0.12, y: 76, color: "#265fba" },
    { text: "Node", x: width * 0.62, y: 118, color: "#0f766e" },
    { text: "ML", x: width * 0.3, y: height * 0.34, color: "#e85d4f" },
    { text: "IoT", x: width * 0.72, y: height * 0.42, color: "#15161a" },
  ];

  ctx.font = "700 15px Inter, Arial, sans-serif";
  labels.forEach((label) => {
    const paddingX = 12;
    const textWidth = ctx.measureText(label.text).width;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = label.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(label.x, label.y, textWidth + paddingX * 2, 34, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = label.color;
    ctx.fillText(label.text, label.x + paddingX, label.y + 22);
  });
}

window.addEventListener("resize", () => {
  cancelAnimationFrame(animationFrame);
  resizeCanvas();
  draw();
});

resizeCanvas();
draw();