const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// تنظیم اندازه صفحه
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// توپ
const ball = {
    x: 0,
    y: 0,
    r: 15,
    vx: 0,
    vy: 0
};

// بازیکنان
const players = [];

// ساخت بازیکنان
function createPlayers() {

    players.length = 0;

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    // تیم آبی
    for (let i = 0; i < 5; i++) {

        players.push({
            team: "blue",
            x: canvas.width * 0.25,
            y: 150 + i * 90,
            r: 22,
            color: "dodgerblue",
            vx: 0,
            vy: 0
        });

    }

    // تیم قرمز
    for (let i = 0; i < 5; i++) {

        players.push({
            team: "red",
            x: canvas.width * 0.75,
            y: 150 + i * 90,
            r: 22,
            color: "crimson",
            vx: 0,
            vy: 0
        });

    }

}

createPlayers();

// کنترل لمس
let selected = null;
let startX = 0;
let startY = 0;

canvas.addEventListener("pointerdown", function(e){

    const x = e.clientX;
    const y = e.clientY;

    for(let p of players){

        const dx = x - p.x;
        const dy = y - p.y;

        if(Math.sqrt(dx*dx + dy*dy) <= p.r){

            selected = p;
            startX = x;
            startY = y;

            break;
        }

    }

});

canvas.addEventListener("pointerup", function(e){

    if(selected){

        const dx = startX - e.clientX;
        const dy = startY - e.clientY;

        selected.vx = dx / 6;
        selected.vy = dy / 6;

        selected = null;

    }
    

});
// -------------------------
// بروزرسانی بازی
// -------------------------

function update() {

    // حرکت مهره‌ها
    for (let p of players) {

        p.x += p.vx;
        p.y += p.vy;

        // اصطکاک
        p.vx *= 0.97;
        p.vy *= 0.97;

        // توقف کامل
        if (Math.abs(p.vx) < 0.02) p.vx = 0;
        if (Math.abs(p.vy) < 0.02) p.vy = 0;

        // برخورد با دیواره‌ها
        if (p.x < p.r) {
            p.x = p.r;
            p.vx *= -0.8;
        }

        if (p.x > canvas.width - p.r) {
            p.x = canvas.width - p.r;
            p.vx *= -0.8;
        }

        if (p.y < p.r) {
            p.y = p.r;
            p.vy *= -0.8;
        }

        if (p.y > canvas.height - p.r) {
            p.y = canvas.height - p.r;
            p.vy *= -0.8;
        }

    }

    // حرکت توپ
    ball.x += ball.vx;
    ball.y += ball.vy;

    ball.vx *= 0.99;
    ball.vy *= 0.99;

    if (Math.abs(ball.vx) < 0.02) ball.vx = 0;
    if (Math.abs(ball.vy) < 0.02) ball.vy = 0;

    // برخورد توپ با دیواره‌ها
    if (ball.x < ball.r) {
        ball.x = ball.r;
        ball.vx *= -0.8;
    }

    if (ball.x > canvas.width - ball.r) {
        ball.x = canvas.width - ball.r;
        ball.vx *= -0.8;
    }

    if (ball.y < ball.r) {
        ball.y = ball.r;
        ball.vy *= -0.8;
    }

    if (ball.y > canvas.height - ball.r) {
        ball.y = canvas.height - ball.r;
        ball.vy *= -0.8;
    }

    // برخورد مهره با توپ
    for (let p of players) {

        let dx = ball.x - p.x;
        let dy = ball.y - p.y;

        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < p.r + ball.r) {

            let angle = Math.atan2(dy, dx);

            let force = 8;

            ball.vx = Math.cos(angle) * force;
            ball.vy = Math.sin(angle) * force;

        }

    }

        }
// -------------------------
// رسم زمین
// -------------------------

function drawField() {

    ctx.fillStyle = "#2e8b57";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;

    // کادر زمین
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // خط وسط
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 40);
    ctx.lineTo(canvas.width / 2, canvas.height - 40);
    ctx.stroke();

    // دایره وسط
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 90, 0, Math.PI * 2);
    ctx.stroke();

}

// -------------------------
// رسم دایره
// -------------------------

function drawCircle(x, y, r, color) {

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

}

// -------------------------
// حلقه اصلی بازی
// -------------------------

function draw() {

    update();

    drawField();

    // بازیکنان
    for (let p of players) {
        drawCircle(p.x, p.y, p.r, p.color);
    }

    // توپ
    drawCircle(ball.x, ball.y, ball.r, "white");

    // نمایش خط نشانه‌گیری
    if (selected) {

        ctx.beginPath();
        ctx.moveTo(selected.x, selected.y);
        ctx.lineTo(startX, startY);

        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 3;
        ctx.stroke();

    }

    requestAnimationFrame(draw);

}

draw();
