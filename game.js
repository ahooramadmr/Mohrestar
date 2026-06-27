const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize",resize);

const ball={
    x:0,
    y:0,
    r:15
};

const blue=[];
const red=[];

function createPlayers(){

    ball.x=canvas.width/2;
    ball.y=canvas.height/2;

    blue.length=0;
    red.length=0;

    for(let i=0;i<5;i++){

        blue.push({
            x:canvas.width*0.25,
            y:120+i*90,
            r:22
        });

        red.push({
            x:canvas.width*0.75,
            y:120+i*90,
            r:22
        });

    }

}

createPlayers();

function drawField(){

ctx.fillStyle="#2e8b57";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.strokeStyle="white";
ctx.lineWidth=5;

ctx.strokeRect(40,40,canvas.width-80,canvas.height-80);

ctx.beginPath();
ctx.arc(canvas.width/2,canvas.height/2,90,0,Math.PI*2);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(canvas.width/2,40);
ctx.lineTo(canvas.width/2,canvas.height-40);
ctx.stroke();

}

function drawCircle(x,y,r,color){

ctx.beginPath();
ctx.arc(x,y,r,0,Math.PI*2);
ctx.fillStyle=color;
ctx.fill();

}

function draw(){

drawField();

for(let p of blue)
drawCircle(p.x,p.y,p.r,"dodgerblue");

for(let p of red)
drawCircle(p.x,p.y,p.r,"crimson");

drawCircle(ball.x,ball.y,ball.r,"white");

requestAnimationFrame(draw);

}

draw();
