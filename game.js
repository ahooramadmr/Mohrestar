const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// -------------------------
// تنظیم اندازه صفحه
// -------------------------

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

// -------------------------
// امتیاز
// -------------------------

let blueScore = 0;
let redScore = 0;

const goalHeight = 180;

// -------------------------
// نوبت بازی
// -------------------------

let currentTurn = "blue";
let moving = false;

// -------------------------
// توپ
// -------------------------

const ball = {
    x: 0,
    y: 0,
    r: 15,
    vx: 0,
    vy: 0
};

// -------------------------
// بازیکنان
// -------------------------

const players = [];

function createPlayers() {

    players.length = 0;

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    // تیم آبی
    for (let i = 0; i < 5; i++) {

        players.push({
            team: "blue",
            x: canvas.width * 0.25,
            y: 140 + i * 90,
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
            y: 140 + i * 90,
            r: 22,
            color: "crimson",
            vx: 0,
            vy: 0
        });

    }

}

createPlayers();

// -------------------------
// کنترل لمس
// -------------------------

let selected = null;

let startX = 0;
let startY = 0;

let currentX = 0;
let currentY = 0;

const MAX_POWER = 120;

canvas.addEventListener("pointerdown", function(e){

    const x = e.clientX;
    const y = e.clientY;

    for(let p of players){

        if(p.team !== currentTurn)
            continue;

        const dx = x - p.x;
        const dy = y - p.y;

        if(Math.sqrt(dx*dx + dy*dy) <= p.r){

            selected = p;

            startX = x;
            startY = y;

            currentX = x;
            currentY = y;

            break;

        }

    }

});

canvas.addEventListener("pointermove", function(e){

    if(selected){

        currentX = e.clientX;
        currentY = e.clientY;

    }

});

canvas.addEventListener("pointerup", function(e){

    if(selected){

        let dx = startX - e.clientX;
        let dy = startY - e.clientY;

        let power = Math.sqrt(dx*dx + dy*dy);

        if(power > MAX_POWER){

            let scale = MAX_POWER / power;

            dx *= scale;
            dy *= scale;

        }

        selected.vx = dx / 6;
        selected.vy = dy / 6;

        selected = null;

        moving = true;

    }
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

            ball.vx = Math.cos(angle) * 8;
            ball.vy = Math.sin(angle) * 8;

        }

    }

    // برخورد مهره‌ها با یکدیگر
    for (let i = 0; i < players.length; i++) {

        for (let j = i + 1; j < players.length; j++) {

            let p1 = players[i];
            let p2 = players[j];

            let dx = p2.x - p1.x;
            let dy = p2.y - p1.y;

            let dist = Math.sqrt(dx * dx + dy * dy);
            let minDist = p1.r + p2.r;

            if (dist < minDist) {

                let angle = Math.atan2(dy, dx);

                let overlap = minDist - dist;

                let moveX = Math.cos(angle) * overlap / 2;
                let moveY = Math.sin(angle) * overlap / 2;

                p1.x -= moveX;
                p1.y -= moveY;

                p2.x += moveX;
                p2.y += moveY;

                let tempVX = p1.vx;
                let tempVY = p1.vy;

                p1.vx = p2.vx;
                p1.vy = p2.vy;

                p2.vx = tempVX;
                p2.vy = tempVY;

            }

        }

    }

    // گل سمت چپ
    if (
        ball.x <= ball.r &&
        ball.y > canvas.height / 2 - goalHeight / 2 &&
        ball.y < canvas.height / 2 + goalHeight / 2
    ) {

        redScore++;

        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.vx = 0;
        ball.vy = 0;

    }

    // گل سمت راست
    if (
        ball.x >= canvas.width - ball.r &&
        ball.y > canvas.height / 2 - goalHeight / 2 &&
        ball.y < canvas.height / 2 + goalHeight / 2
    ) {

        blueScore++;

        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.vx = 0;
        ball.vy = 0;

    }

    // تغییر نوبت
    let stopped = true;

    for (let p of players) {

        if (Math.abs(p.vx) > 0.05 || Math.abs(p.vy) > 0.05)
            stopped = false;

    }

    if (Math.abs(ball.vx) > 0.05 || Math.abs(ball.vy) > 0.05)
        stopped = false;

    if (moving && stopped) {

        moving = false;

        currentTurn =
            currentTurn === "blue"
            ? "red"
            : "blue";

    }

            }
    

});
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

    // دروازه چپ
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(40, canvas.height / 2 - goalHeight / 2);
    ctx.lineTo(40, canvas.height / 2 + goalHeight / 2);
    ctx.stroke();

    // دروازه راست
    ctx.beginPath();
    ctx.moveTo(canvas.width - 40, canvas.height / 2 - goalHeight / 2);
    ctx.lineTo(canvas.width - 40, canvas.height / 2 + goalHeight / 2);
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

    // حلقه دور مهره انتخاب شده
    if (selected) {

        ctx.beginPath();
        ctx.arc(selected.x, selected.y, selected.r + 5, 0, Math.PI * 2);
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 3;
        ctx.stroke();

        // فلش قدرت
        ctx.beginPath();
        ctx.moveTo(selected.x, selected.y);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 4;
        ctx.stroke();

    }

    // نمایش امتیاز
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
        blueScore + " : " + redScore,
        canvas.width / 2,
        50
    );

    // نمایش نوبت
    ctx.font = "24px Arial";
    ctx.fillText(
        "Turn: " + currentTurn,
        canvas.width / 2,
        90
    );

    requestAnimationFrame(draw);

}

draw();
