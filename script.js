const startDate = new Date("2019-09-02T00:00:00");
const canvas = document.getElementById('loveTree');
const ctx = canvas.getContext('2d');

let width, height, centerX, centerY;
let state = "SEED"; // SEED -> TRUNK -> HEART
let seedY = -20;
let trunkHeight = 0;
let heartScale = 0;

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    centerX = width / 2;
    centerY = height * 0.65;
}

window.addEventListener('resize', resize);
resize();

// 1. Compteur de temps
function updateTimer() {
    const now = new Date();
    const diff = now - startDate;
    const days = Math.floor(diff / (86400000));
    const hrs = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    document.getElementById("timer").innerText = `${days}j ${hrs}h ${mins}m ${secs}s`;
}
setInterval(updateTimer, 1000);

// 2. Mathématiques du cœur
function getHeartPoint(angle, scale) {
    const x = 16 * Math.pow(Math.sin(angle), 3);
    const y = 13 * Math.cos(angle) - 5 * Math.cos(2*angle) - 2 * Math.cos(3*angle) - Math.cos(4*angle);
    return { x: x * scale, y: -y * scale };
}

function drawLeaf(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x-size, y-size, x-size*2, y+size, x, y+size*2);
    ctx.bezierCurveTo(x+size*2, y+size, x+size, y-size, x, y);
    ctx.fill();
}

// 3. Boucle principale d'animation
function animate() {
    ctx.clearRect(0, 0, width, height);

    if (state === "SEED") {
        // La graine tombe
        drawLeaf(centerX, seedY, 5, "#5a3e36");
        seedY += 5;
        if (seedY >= height - 20) state = "TRUNK";
    } 
    
    if (state === "TRUNK" || state === "HEART") {
        // Le tronc pousse
        ctx.strokeStyle = "#5a3e36";
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(centerX, height);
        ctx.lineTo(centerX, height - trunkHeight);
        ctx.stroke();
        
        if (trunkHeight < (height - centerY)) trunkHeight += 3;
        else state = "HEART";
    }

    if (state === "HEART") {
        // Les feuilles apparaissent en forme de cœur
        if (heartScale < (Math.min(width, height) / 45)) heartScale += 0.2;
        
        for (let i = 0; i < 300; i++) {
            const angle = (i / 300) * Math.PI * 2;
            const pos = getHeartPoint(angle, heartScale * (0.5 + Math.random() * 0.5));
            const colors = ["#ff4d6d", "#ff758f", "#c9184a", "#ffb3c1"];
            drawLeaf(centerX + pos.x, centerY + pos.y, 4, colors[i % 4]);
        }
    }

    requestAnimationFrame(animate);
}

// Message typewriting
const text = "Le jour où tout a commencé...";
let idx = 0;
function type() {
    if(idx < text.length) {
        document.getElementById("typewriter").innerHTML += text.charAt(idx);
        idx++;
        setTimeout(type, 100);
    }
}

setTimeout(type, 2000); // Commence après 2 secondes
animate();
