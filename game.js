// ======================================
// Soccer Stars - Game.js
// بخش ۱ از ۵
// ======================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ------------------------------
// اندازه صفحه
// ------------------------------

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

// ------------------------------
// تنظیمات بازی
// ------------------------------

const GAME = {

    friction: 0.98,

    bounce: 0.85,

    diskRadius: 22,

    ballRadius: 14,

    maxPower: 120,

    goalHeight: 180

};

// ------------------------------
// امتیاز
// ------------------------------

let blueScore = 0;
let redScore = 0;

// ------------------------------
// نوبت
// ------------------------------

let currentTurn = "blue";

let moving = false;

// ------------------------------
// توپ
// ------------------------------

const ball = {

    x: 0,

    y: 0,

    vx: 0,

    vy: 0,

    r: GAME.ballRadius,

    color: "#ffffff"

};

// ------------------------------
// بازیکنان
// ------------------------------

const players = [];

// ------------------------------
// ساخت مهره ها
// ------------------------------

function createPlayers() {

    players.length = 0;

    ball.x = canvas.width / 2;

    ball.y = canvas.height / 2;

    // تیم آبی

    for(let i=0;i<5;i++){

        players.push({

            team:"blue",

            color:"#2196F3",

            x:canvas.width*0.25,

            y:140+i*90,

            vx:0,

            vy:0,

            r:GAME.diskRadius

        });

    }

    // تیم قرمز

    for(let i=0;i<5;i++){

        players.push({

            team:"red",

            color:"#F44336",

            x:canvas.width*0.75,

            y:140+i*90,

            vx:0,

            vy:0,

            r:GAME.diskRadius

        });

    }

}

createPlayers();

// ------------------------------
// کنترل لمس
// ------------------------------

let selected=null;

let startX=0;

let startY=0;

let currentX=0;

let currentY=0;
// ======================================
// Soccer Stars - Game.js
// بخش ۲ از ۵
// ======================================

// ------------------------------
// لمس مهره
// ------------------------------

canvas.addEventListener("pointerdown", function (e) {

    const x = e.clientX;
    const y = e.clientY;

    if (moving)
        return;

    for (let p of players) {

        if (p.team !== currentTurn)
            continue;

        const dx = x - p.x;
        const dy = y - p.y;

        if (Math.sqrt(dx * dx + dy * dy) <= p.r) {

            selected = p;

            startX = x;
            startY = y;

            currentX = x;
            currentY = y;

            break;

        }

    }

});

// ------------------------------
// حرکت انگشت
// ------------------------------

canvas.addEventListener("pointermove", function (e) {

    if (!selected)
        return;

    currentX = e.clientX;
    currentY = e.clientY;

});

// ------------------------------
// رها کردن مهره
// ------------------------------

canvas.addEventListener("pointerup", function (e) {

    if (!selected)
        return;

    let dx = startX - e.clientX;
    let dy = startY - e.clientY;

    let power = Math.sqrt(dx * dx + dy * dy);

    if (power > GAME.maxPower) {

        const scale = GAME.maxPower / power;

        dx *= scale;
        dy *= scale;

    }

    selected.vx = dx / 6;
    selected.vy = dy / 6;

    moving = true;

    selected = null;

});

// ------------------------------
// بروزرسانی بازی
// ------------------------------

function update() {

    // حرکت مهره‌ها

    for (let p of players) {

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= GAME.friction;
        p.vy *= GAME.friction;

        if (Math.abs(p.vx) < 0.02)
            p.vx = 0;

        if (Math.abs(p.vy) < 0.02)
            p.vy = 0;

    }

    // حرکت توپ

    ball.x += ball.vx;
    ball.y += ball.vy;

    ball.vx *= GAME.friction;
    ball.vy *= GAME.friction;

    if (Math.abs(ball.vx) < 0.02)
        ball.vx = 0;

    if (Math.abs(ball.vy) < 0.02)
        ball.vy = 0;

}
// ======================================
// Soccer Stars - Game.js
// بخش ۳ از ۵
// ======================================

// ------------------------------
// برخورد با دیواره
// ------------------------------

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

// ------------------------------
// برخورد مهره با توپ
// ------------------------------

function ballCollision(player){

    let dx = ball.x - player.x;
    let dy = ball.y - player.y;

    let dist = Math.sqrt(dx*dx + dy*dy);

    let minDist = ball.r + player.r;

    if(dist < minDist){

        let angle = Math.atan2(dy,dx);

        ball.vx = Math.cos(angle) * 8;
        ball.vy = Math.sin(angle) * 8;

    }

}

// ------------------------------
// برخورد مهره‌ها
// ------------------------------

function playerCollision(a,b){

    let dx = b.x - a.x;
    let dy = b.y - a.y;

    let dist = Math.sqrt(dx*dx + dy*dy);

    let minDist = a.r + b.r;

    if(dist < minDist){

        let angle = Math.atan2(dy,dx);

        let overlap = minDist - dist;

        let mx = Math.cos(angle) * overlap / 2;
        let my = Math.sin(angle) * overlap / 2;

        a.x -= mx;
        a.y -= my;

        b.x += mx;
        b.y += my;

        let tvx = a.vx;
        let tvy = a.vy;

        a.vx = b.vx;
        a.vy = b.vy;

        b.vx = tvx;
        b.vy = tvy;

    }

}

// ------------------------------
// تکمیل Update
// ------------------------------

function physics(){

    wallCollision(ball);

    for(let p of players){

        wallCollision(p);

        ballCollision(p);

    }

    for(let i=0;i<players.length;i++){

        for(let j=i+1;j<players.length;j++){

            playerCollision(players[i],players[j]);

        }

    }

            }
// ======================================
// Soccer Stars - Game.js
// بخش ۴ از ۵
// ======================================

// ------------------------------
// بررسی نوبت
// ------------------------------

function checkTurn(){

    let stop = true;

    for(let p of players){

        if(Math.abs(p.vx)>0.05 || Math.abs(p.vy)>0.05){

            stop = false;

        }

    }

    if(Math.abs(ball.vx)>0.05 || Math.abs(ball.vy)>0.05){

        stop = false;

    }

    if(stop && moving){

        moving = false;

        currentTurn =
            currentTurn==="blue"
            ? "red"
            : "blue";

    }

}

// ------------------------------
// بررسی گل
// ------------------------------

function checkGoal(){

    let top = canvas.height/2-GAME.goalHeight/2;
    let bottom = canvas.height/2+GAME.goalHeight/2;

    // گل قرمز
    if(ball.x<=ball.r && ball.y>top && ball.y<bottom){

        redScore++;

        resetPositions();

    }

    // گل آبی
    if(ball.x>=canvas.width-ball.r && ball.y>top && ball.y<bottom){

        blueScore++;

        resetPositions();

    }

}

// ------------------------------
// شروع مجدد
// ------------------------------

function resetPositions(){

    createPlayers();

    ball.x=canvas.width/2;
    ball.y=canvas.height/2;

    ball.vx=0;
    ball.vy=0;

    moving=false;

}

// ------------------------------
// رسم زمین
// ------------------------------

function drawField(){

    ctx.fillStyle="#2e8b57";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle="white";
    ctx.lineWidth=4;

    ctx.strokeRect(
        40,
        40,
        canvas.width-80,
        canvas.height-80
    );

    // خط وسط

    ctx.beginPath();

    ctx.moveTo(canvas.width/2,40);

    ctx.lineTo(canvas.width/2,canvas.height-40);

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

    ctx.lineWidth=8;

    ctx.beginPath();

    ctx.moveTo(
        40,
        canvas.height/2-GAME.goalHeight/2
    );

    ctx.lineTo(
        40,
        canvas.height/2+GAME.goalHeight/2
    );

    ctx.stroke();

    // دروازه راست

    ctx.beginPath();

    ctx.moveTo(
        canvas.width-40,
        canvas.height/2-GAME.goalHeight/2
    );

    ctx.lineTo(
        canvas.width-40,
        canvas.height/2+GAME.goalHeight/2
    );

    ctx.stroke();

}
// ======================================
// Soccer Stars - Game.js
// بخش ۵ از ۵
// ======================================

// ------------------------------
// رسم دایره
// ------------------------------

function drawCircle(x, y, r, color){

    ctx.beginPath();

    ctx.arc(x, y, r, 0, Math.PI * 2);

    ctx.fillStyle = color;

    ctx.fill();

}

// ------------------------------
// حلقه اصلی بازی
// ------------------------------

function draw(){

    update();

    drawField();

    // بازیکنان

    for(let p of players){

        drawCircle(
            p.x,
            p.y,
            p.r,
            p.color
        );

    }

    // توپ

    drawCircle(
        ball.x,
        ball.y,
        ball.r,
        ball.color
    );

    // حلقه دور مهره انتخاب شده

    if(selected){

        ctx.beginPath();

        ctx.arc(
            selected.x,
            selected.y,
            selected.r + 5,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle = "yellow";

        ctx.lineWidth = 3;

        ctx.stroke();

        // فلش قدرت

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

    // امتیاز

    ctx.fillStyle = "white";

    ctx.font = "40px Arial";

    ctx.textAlign = "center";

    ctx.fillText(

        blueScore + " : " + redScore,

        canvas.width / 2,

        50

    );

    // نوبت

    ctx.font = "24px Arial";

    ctx.fillText(

        "Turn : " + currentTurn,

        canvas.width / 2,

        90

    );

    requestAnimationFrame(draw);

}

// ------------------------------
// شروع بازی
// ------------------------------

draw();
