// ===========================================
// Soccer Stars HTML5
// game.js
// بخش ۱ از ۱۰
// ===========================================

"use strict";

// -------------------------------------------
// Canvas
// -------------------------------------------

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// -------------------------------------------
// اندازه صفحه
// -------------------------------------------

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

// -------------------------------------------
// تنظیمات بازی
// -------------------------------------------

const GAME = {

    diskRadius:22,

    ballRadius:14,

    friction:0.98,

    bounce:0.85,

    maxPower:120,

    goalHeight:180,

    winScore:5,

    fieldMargin:40

};

// -------------------------------------------
// وضعیت بازی
// -------------------------------------------

let blueScore = 0;

let redScore = 0;

let currentTurn = "blue";

let moving = false;

let gameOver = false;

// -------------------------------------------
// توپ
// -------------------------------------------

const ball = {

    x:0,

    y:0,

    vx:0,

    vy:0,

    r:GAME.ballRadius,

    color:"#ffffff"

};

// -------------------------------------------
// بازیکنان
// -------------------------------------------

const players = [];

// -------------------------------------------
// ساخت مهره
// -------------------------------------------

function createPlayer(team,x,y,color){

    return{

        team:team,

        x:x,

        y:y,

        vx:0,

        vy:0,

        r:GAME.diskRadius,

        color:color

    };

}

// -------------------------------------------
// ساخت زمین
// -------------------------------------------

function createPlayers(){

    players.length = 0;

    ball.x = canvas.width/2;
    ball.y = canvas.height/2;

    // تیم آبی

    for(let i=0;i<5;i++){

        players.push(

            createPlayer(

                "blue",

                canvas.width*0.25,

                140+i*90,

                "#2196F3"

            )

        );

    }

    // تیم قرمز

    for(let i=0;i<5;i++){

        players.push(

            createPlayer(

                "red",

                canvas.width*0.75,

                140+i*90,

                "#F44336"

            )

        );

    }

}

createPlayers();

// -------------------------------------------
// کنترل لمس
// -------------------------------------------

let selected = null;

let startX = 0;

let startY = 0;

let currentX = 0;

let currentY = 0;

// پایان بخش ۱ از ۱۰
// ===========================================
// Soccer Stars
// game.js
// بخش ۲ از ۱۰
// ===========================================

// -------------------------------------------
// کنترل لمس
// -------------------------------------------

let selected = null;

let startX = 0;
let startY = 0;

let currentX = 0;
let currentY = 0;

// -------------------------------------------
// انتخاب مهره
// -------------------------------------------

canvas.addEventListener("pointerdown", function(e){

    if(gameOver) return;

    if(moving) return;

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

// -------------------------------------------
// حرکت انگشت
// -------------------------------------------

canvas.addEventListener("pointermove", function(e){

    if(!selected)
        return;

    currentX = e.clientX;
    currentY = e.clientY;

});

// -------------------------------------------
// رها کردن مهره
// -------------------------------------------

canvas.addEventListener("pointerup", function(e){

    if(!selected)
        return;

    let dx = startX - e.clientX;
    let dy = startY - e.clientY;

    let power = Math.sqrt(dx*dx + dy*dy);

    // محدود کردن قدرت شلیک

    if(power > GAME.maxPower){

        const scale = GAME.maxPower / power;

        dx *= scale;
        dy *= scale;

    }

    selected.vx = dx / 6;
    selected.vy = dy / 6;

    moving = true;

    selected = null;

});

// -------------------------------------------
// شروع موتور بازی
// -------------------------------------------

function update(){

    if(gameOver)
        return;

    // حرکت مهره‌ها

    for(let p of players){

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= GAME.friction;
        p.vy *= GAME.friction;

        if(Math.abs(p.vx) < 0.02)
            p.vx = 0;

        if(Math.abs(p.vy) < 0.02)
            p.vy = 0;

    }

    // حرکت توپ

    ball.x += ball.vx;
    ball.y += ball.vy;

    ball.vx *= GAME.friction;
    ball.vy *= GAME.friction;

    if(Math.abs(ball.vx) < 0.02)
        ball.vx = 0;

    if(Math.abs(ball.vy) < 0.02)
        ball.vy = 0;

}
// ===========================================
// Soccer Stars
// game.js
// بخش ۳ از ۱۰
// ===========================================

// -------------------------------------------
// برخورد با دیواره
// -------------------------------------------

function wallCollision(obj){

    if(obj.x < obj.r){

        obj.x = obj.r;
        obj.vx *= -GAME.bounce;

    }

    if(obj.x > canvas.width - obj.r){

        obj.x = canvas.width - obj.r;
        obj.vx *= -GAME.bounce;

    }

    if(obj.y < obj.r){

        obj.y = obj.r;
        obj.vy *= -GAME.bounce;

    }

    if(obj.y > canvas.height - obj.r){

        obj.y = canvas.height - obj.r;
        obj.vy *= -GAME.bounce;

    }

}

// -------------------------------------------
// برخورد توپ با مهره
// -------------------------------------------

function ballCollision(player){

    const dx = ball.x - player.x;
    const dy = ball.y - player.y;

    const dist = Math.sqrt(dx*dx + dy*dy);

    const minDist = ball.r + player.r;

    if(dist < minDist){

        const angle = Math.atan2(dy,dx);

        const force = 8;

        ball.vx = Math.cos(angle) * force;
        ball.vy = Math.sin(angle) * force;

    }

}

// -------------------------------------------
// برخورد مهره‌ها
// -------------------------------------------

function playerCollision(a,b){

    const dx = b.x - a.x;
    const dy = b.y - a.y;

    const dist = Math.sqrt(dx*dx + dy*dy);

    const minDist = a.r + b.r;

    if(dist < minDist){

        const angle = Math.atan2(dy,dx);

        const overlap = minDist - dist;

        const mx = Math.cos(angle) * overlap / 2;
        const my = Math.sin(angle) * overlap / 2;

        a.x -= mx;
        a.y -= my;

        b.x += mx;
        b.y += my;

        const tempVX = a.vx;
        const tempVY = a.vy;

        a.vx = b.vx;
        a.vy = b.vy;

        b.vx = tempVX;
        b.vy = tempVY;

    }

}

// -------------------------------------------
// موتور فیزیک
// -------------------------------------------

function physics(){

    wallCollision(ball);

    for(let p of players){

        wallCollision(p);

        ballCollision(p);

    }

    for(let i=0;i<players.length;i++){

        for(let j=i+1;j<players.length;j++){

            playerCollision(
                players[i],
                players[j]
            );

        }

    }

            }
// ===========================================
// Soccer Stars
// game.js
// بخش ۴ از ۱۰
// ===========================================

// -------------------------------------------
// ریست زمین
// -------------------------------------------

function resetPositions(){

    createPlayers();

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    ball.vx = 0;
    ball.vy = 0;

    moving = false;

}

// -------------------------------------------
// بررسی گل
// -------------------------------------------

function checkGoal(){

    const top =
        canvas.height / 2 - GAME.goalHeight / 2;

    const bottom =
        canvas.height / 2 + GAME.goalHeight / 2;

    // گل سمت چپ

    if(
        ball.x <= ball.r &&
        ball.y > top &&
        ball.y < bottom
    ){

        redScore++;

        resetPositions();

    }

    // گل سمت راست

    if(
        ball.x >= canvas.width - ball.r &&
        ball.y > top &&
        ball.y < bottom
    ){

        blueScore++;

        resetPositions();

    }

    // پایان بازی

    if(
        blueScore >= GAME.winScore ||
        redScore >= GAME.winScore
    ){

        gameOver = true;

    }

}

// -------------------------------------------
// تغییر نوبت
// -------------------------------------------

function checkTurn(){

    let stopped = true;

    for(let p of players){

        if(
            Math.abs(p.vx) > 0.05 ||
            Math.abs(p.vy) > 0.05
        ){

            stopped = false;

        }

    }

    if(
        Math.abs(ball.vx) > 0.05 ||
        Math.abs(ball.vy) > 0.05
    ){

        stopped = false;

    }

    if(stopped && moving){

        moving = false;

        currentTurn =
            currentTurn === "blue"
            ? "red"
            : "blue";

    }

}
// ===========================================
// Soccer Stars
// game.js
// بخش ۵ از ۱۰
// ===========================================

// -------------------------------------------
// رسم زمین
// -------------------------------------------

function drawField(){

    ctx.fillStyle = "#2e8b57";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;

    // کادر زمین

    ctx.strokeRect(
        GAME.fieldMargin,
        GAME.fieldMargin,
        canvas.width - GAME.fieldMargin * 2,
        canvas.height - GAME.fieldMargin * 2
    );

    // خط وسط

    ctx.beginPath();

    ctx.moveTo(
        canvas.width/2,
        GAME.fieldMargin
    );

    ctx.lineTo(
        canvas.width/2,
        canvas.height-GAME.fieldMargin
    );

    ctx.stroke();

    // دایره وسط

    ctx.beginPath();

    ctx.arc(
        canvas.width/2,
        canvas.height/2,
        90,
        0,
        Math.PI*2
    );

    ctx.stroke();

    // دروازه چپ

    ctx.lineWidth = 8;

    ctx.beginPath();

    ctx.moveTo(
        GAME.fieldMargin,
        canvas.height/2-GAME.goalHeight/2
    );

    ctx.lineTo(
        GAME.fieldMargin,
        canvas.height/2+GAME.goalHeight/2
    );

    ctx.stroke();

    // دروازه راست

    ctx.beginPath();

    ctx.moveTo(
        canvas.width-GAME.fieldMargin,
        canvas.height/2-GAME.goalHeight/2
    );

    ctx.lineTo(
        canvas.width-GAME.fieldMargin,
        canvas.height/2+GAME.goalHeight/2
    );

    ctx.stroke();

}

// -------------------------------------------
// رسم دایره
// -------------------------------------------

function drawCircle(x,y,r,color){

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        r,
        0,
        Math.PI*2
    );

    ctx.fillStyle = color;

    ctx.fill();

}

// -------------------------------------------
// رسم بازیکنان
// -------------------------------------------

function drawPlayers(){

    for(let p of players){

        drawCircle(
            p.x,
            p.y,
            p.r,
            p.color
        );

    }

}

// -------------------------------------------
// رسم توپ
// -------------------------------------------

function drawBall(){

    drawCircle(
        ball.x,
        ball.y,
        ball.r,
        ball.color
    );

}

// -------------------------------------------
// فلش قدرت
// -------------------------------------------

function drawAim(){

    if(!selected)
        return;

    ctx.beginPath();

    ctx.arc(
        selected.x,
        selected.y,
        selected.r+5,
        0,
        Math.PI*2
    );

    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
        selected.x,
        selected.y
    );

    ctx.lineTo(
        currentX,
        currentY
    );

    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 4;
    ctx.stroke();

}
// ===========================================
// Soccer Stars
// game.js
// بخش ۶ از ۱۰
// ===========================================

// -------------------------------------------
// نمایش امتیاز
// -------------------------------------------

function drawScore(){

    ctx.fillStyle = "white";

    ctx.font = "40px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        blueScore + " : " + redScore,
        canvas.width / 2,
        50
    );

}

// -------------------------------------------
// نمایش نوبت
// -------------------------------------------

function drawTurn(){

    ctx.fillStyle = "white";

    ctx.font = "24px Arial";

    ctx.fillText(
        "Turn : " + currentTurn,
        canvas.width / 2,
        90
    );

}

// -------------------------------------------
// پایان بازی
// -------------------------------------------

function drawGameOver(){

    if(!gameOver)
        return;

    ctx.fillStyle = "rgba(0,0,0,0.6)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "yellow";

    ctx.font = "60px Arial";

    ctx.textAlign = "center";

    const winner =
        blueScore > redScore
        ? "BLUE WINS!"
        : "RED WINS!";

    ctx.fillText(
        winner,
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.font = "28px Arial";

    ctx.fillText(
        "Refresh Page To Play Again",
        canvas.width / 2,
        canvas.height / 2 + 60
    );

}

// -------------------------------------------
// حلقه اصلی بازی
// -------------------------------------------

function draw(){

    update();

    drawField();

    drawPlayers();

    drawBall();

    drawAim();

    drawScore();

    drawTurn();

    drawGameOver();

    requestAnimationFrame(draw);

}

// -------------------------------------------
// شروع بازی
// -------------------------------------------

draw();
// ===========================================
// Soccer Stars
// game.js
// بخش ۷ از ۱۰
// ===========================================

// -------------------------------------------
// شدت برخورد توپ
// -------------------------------------------

function ballCollision(player){

    const dx = ball.x - player.x;
    const dy = ball.y - player.y;

    const dist = Math.sqrt(dx*dx + dy*dy);

    const minDist = ball.r + player.r;

    if(dist < minDist){

        const angle = Math.atan2(dy, dx);

        const speed = Math.sqrt(
            player.vx * player.vx +
            player.vy * player.vy
        );

        const force = Math.max(6, speed + 5);

        ball.vx = Math.cos(angle) * force;
        ball.vy = Math.sin(angle) * force;

        // جلوگیری از فرو رفتن توپ

        const overlap = minDist - dist;

        ball.x += Math.cos(angle) * overlap;
        ball.y += Math.sin(angle) * overlap;

    }

}

// -------------------------------------------
// سایه مهره
// -------------------------------------------

function drawDiskShadow(player){

    ctx.beginPath();

    ctx.arc(
        player.x + 3,
        player.y + 4,
        player.r,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "rgba(0,0,0,0.25)";

    ctx.fill();

}

// -------------------------------------------
// رسم مهره حرفه‌ای
// -------------------------------------------

function drawPlayers(){

    for(let p of players){

        drawDiskShadow(p);

        drawCircle(
            p.x,
            p.y,
            p.r,
            p.color
        );

        // حاشیه سفید

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.r,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();

    }

}

// -------------------------------------------
// رسم توپ حرفه‌ای
// -------------------------------------------

function drawBall(){

    drawCircle(
        ball.x,
        ball.y,
        ball.r,
        "#ffffff"
    );

    ctx.beginPath();

    ctx.arc(
        ball.x,
        ball.y,
        ball.r,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 2;
    ctx.stroke();

}
// ===========================================
// Soccer Stars
// game.js
// بخش ۸ از ۱۰
// ===========================================

// -------------------------------------------
// هوش مصنوعی
// -------------------------------------------

const AI = {

    enabled: true,

    team: "red"

};

// -------------------------------------------
// پیدا کردن نزدیک‌ترین مهره
// -------------------------------------------

function getClosestPlayer(){

    let best = null;

    let bestDist = Infinity;

    for(let p of players){

        if(p.team !== AI.team)
            continue;

        const dx = ball.x - p.x;
        const dy = ball.y - p.y;

        const dist = Math.sqrt(dx*dx + dy*dy);

        if(dist < bestDist){

            bestDist = dist;

            best = p;

        }

    }

    return best;

}

// -------------------------------------------
// حرکت ربات
// -------------------------------------------

function aiMove(){

    if(!AI.enabled)
        return;

    if(gameOver)
        return;

    if(currentTurn !== AI.team)
        return;

    if(moving)
        return;

    const player = getClosestPlayer();

    if(player == null)
        return;

    const dx = ball.x - player.x;
    const dy = ball.y - player.y;

    const dist = Math.sqrt(dx*dx + dy*dy);

    const power = Math.min(
        GAME.maxPower,
        dist
    );

    player.vx = (dx / dist) * power / 6;
    player.vy = (dy / dist) * power / 6;

    moving = true;

}
// ===========================================
// Soccer Stars
// game.js
// بخش ۹ از ۱۰
// ===========================================

// -------------------------------------------
// افکت ذرات
// -------------------------------------------

const particles = [];

// ساخت ذره

function createParticles(x, y, color) {

    for (let i = 0; i < 20; i++) {

        particles.push({

            x: x,

            y: y,

            vx: (Math.random() - 0.5) * 8,

            vy: (Math.random() - 0.5) * 8,

            life: 40,

            color: color

        });

    }

}

// بروزرسانی ذرات

function updateParticles() {

    for (let i = particles.length - 1; i >= 0; i--) {

        let p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.95;
        p.vy *= 0.95;

        p.life--;

        if (p.life <= 0) {

            particles.splice(i, 1);

        }

    }

}

// رسم ذرات

function drawParticles() {

    for (let p of particles) {

        ctx.globalAlpha = p.life / 40;

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            3,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = p.color;

        ctx.fill();

    }

    ctx.globalAlpha = 1;

}

// -------------------------------------------
// لرزش صفحه
// -------------------------------------------

function shakeScreen() {

    if (navigator.vibrate) {

        navigator.vibrate(120);

    }

}

// -------------------------------------------
// افکت گل
// -------------------------------------------

function goalEffect(team) {

    if (team === "blue") {

        createParticles(
            canvas.width / 2,
            canvas.height / 2,
            "#2196F3"
        );

    } else {

        createParticles(
            canvas.width / 2,
            canvas.height / 2,
            "#F44336"
        );

    }

    shakeScreen();

}
// ===========================================
// Soccer Stars
// game.js
// بخش ۱۰ از ۱۰
// ===========================================

// -------------------------
// شروع دوباره بازی
// -------------------------

function restartGame(){

    blueScore = 0;
    redScore = 0;

    currentTurn = "blue";

    moving = false;

    gameOver = false;

    particles.length = 0;

    createPlayers();

}

// -------------------------
// کلیک برای شروع دوباره
// -------------------------

canvas.addEventListener("click",function(){

    if(gameOver){

        restartGame();

    }

});

// -------------------------
// نمایش پیام راهنما
// -------------------------

function drawHint(){

    if(gameOver){

        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            "Click To Restart",
            canvas.width/2,
            canvas.height/2 + 90
        );

        return;

    }

    ctx.fillStyle = "white";

    ctx.font = "20px Arial";

    ctx.textAlign = "left";

    ctx.fillText(
        "Blue Turn : Blue",
        20,
        30
    );

    ctx.textAlign = "right";

    ctx.fillText(
        "First To " + GAME.winScore + " Goals",
        canvas.width-20,
        30
    );

}

// -------------------------
// حلقه اصلی نهایی
// -------------------------

function gameLoop(){

    update();

    drawField();

    drawPlayers();

    drawBall();

    drawParticles();

    drawAim();

    drawScore();

    drawTurn();

    drawHint();

    drawGameOver();

    requestAnimationFrame(gameLoop);

}

// -------------------------
// شروع بازی
// -------------------------

restartGame();

gameLoop();
