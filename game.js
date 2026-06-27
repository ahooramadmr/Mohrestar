const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const ball = {
    x: window.innerWidth/2,
    y: window.innerHeight/2,
    r: 15
};

const players = [];

for(let i=0;i<5;i++){
    players.push({
        x:150,
        y:150+i*90,
        r:22,
        color:"dodgerblue",
        vx:0,
        vy:0
    });

    players.push({
        x:window.innerWidth-150,
        y:150+i*90,
        r:22,
        color:"crimson",
        vx:0,
        vy:0
    });
}

let selected = null;
let startX = 0;
let startY = 0;

canvas.addEventListener("pointerdown",e=>{

    for(let p of players){

        let dx=e.clientX-p.x;
        let dy=e.clientY-p.y;

        if(Math.sqrt(dx*dx+dy*dy)<p.r){

            selected=p;
            startX=e.clientX;
            startY=e.clientY;

        }

    }

});

canvas.addEventListener("pointerup",e=>{

    if(selected){

        selected.vx=(startX-e.clientX)/6;
        selected.vy=(startY-e.clientY)/6;

        selected=null;

    }

});

function update(){

    for(let p of players){

        p.x+=p.vx;
        p.y+=p.vy;

        p.vx*=0.97;
        p.vy*=0.97;

    }

}

function drawField(){

    ctx.fillStyle="#2e8b57";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle="white";
    ctx.lineWidth=4;

    ctx.strokeRect(40,40,canvas.width-80,canvas.height-80);

    ctx.beginPath();
    ctx.arc(canvas.width/2,canvas.height/2,90,0,Math.PI*2);
    ctx.stroke();

}

function draw(){

    update();

    drawField();

    for(let p of players){

        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.color;
        ctx.fill();

    }

    ctx.beginPath();
    ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);
    ctx.fillStyle="white";
    ctx.fill();

    requestAnimationFrame(draw);

}

draw();
