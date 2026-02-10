const canvas = document.getElementById('loveTree');
const ctx = canvas.getContext('2d');
const startDate = new Date("2019-09-02T00:00:00");

let width, height, centerX, centerY;
let state = "SEED"; // SEED -> TRUNK -> BRANCHES -> HEART
let seedY = -20;
let trunkHeight = 0;
let leaves = [];
let branchesDrawn = false;

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    centerX = width * 0.65; // Arbre décalé à droite pour laisser place au texte
    centerY = height * 0.7;
}
window.addEventListener('resize', resize);
resize();

// --- LOGIQUE DU COMPTEUR ---
function updateTimer() {
    const now = new Date();
    const diff = now - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    document.getElementById("timer").innerText = `${days}j ${hrs}h ${mins}m ${secs}s`;
}
setInterval(updateTimer, 1000);
updateTimer();

// --- MATHS DU COEUR ---
function getHeartPoint(angle, scale) {
    const x = 16 * Math.pow(Math.sin(angle), 3);
    const y = 13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle);
    return { x: x * scale, y: -y * scale };
}

function drawHeartLeaf(x, y, size, color, opacity = 1) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-size, -size, -size * 2, size / 2, 0, size * 1.5);
    ctx.bezierCurveTo(size * 2, size / 2, size, -size, 0, 0);
    ctx.fill();
    ctx.restore();
}

// --- INITIALISATION DES FEUILLES DU COEUR ---
function initHeartLeaves() {
    const scale = Math.min(width, height) / 35;
    for (let i = 0; i < 500; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * scale; 
        const p = getHeartPoint(angle, r);
        const colors = ["#ff0a54", "#ff477e", "#ff7096", "#ff85a1", "#fbb1bd"];
        
        leaves.push({
            x: centerX + p.x,
            y: centerY + p.y - (height * 0.15),
            size: 0,
            targetSize: 4 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: Math.random() * 200,
            opacity: 0
        });
    }
}

// --- ANIMATION PRINCIPALE ---
function animate() {
    ctx.clearRect(0, 0, width, height);

    if (state === "SEED") {
        // La graine tombe
        drawHeartLeaf(centerX, seedY, 6, "#5a3e36");
        seedY += 4;
        if (seedY >= height - 20) state = "TRUNK";
    }

    if (state === "TRUNK" || state === "BRANCHES" || state === "HEART") {
        // Dessiner le tronc
        ctx.strokeStyle = "#5a3e36";
        ctx.lineWidth = 12;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(centerX, height);
        ctx.lineTo(centerX, height - trunkHeight);
        ctx.stroke();

        if (trunkHeight < (height - centerY + 50)) {
            trunkHeight += 3;
        } else if (state === "TRUNK") {
            state = "HEART";
            initHeartLeaves();
        }
    }

    if (state === "HEART") {
        // Faire pousser les feuilles pour former le grand coeur
        leaves.forEach(leaf => {
            if (leaf.delay > 0) {
                leaf.delay--;
            } else {
                if (leaf.size < leaf.targetSize) leaf.size += 0.2;
                if (leaf.opacity < 1) leaf.opacity += 0.05;
                drawHeartLeaf(leaf.x, leaf.y, leaf.size, leaf.color, leaf.opacity);
            }
        });
    }

    requestAnimationFrame(animate);
}

// Effet écriture du message
const messageText = "Une copine pas comme les autres. une joyeuse saint-Valentin.Merci d'être là pour moi Elo. ;
let charIdx = 0;
function typeMessage() {
    if (charIdx < messageText.length) {
        document.getElementById("typewriter").innerHTML += messageText.charAt(charIdx);
        charIdx++;
        setTimeout(typeMessage, 70);
    }
}

setTimeout(typeMessage, 3000); // Démarre après que la graine soit tombée
animate();
