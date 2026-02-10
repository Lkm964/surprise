// --- CONFIGURATION ---
const startDate = new Date("2019-09-02T00:00:00"); 

// --- TIMER ---
function updateTimer() {
    const now = new Date();
    const diff = now - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    document.getElementById("timer").innerText = `${days}j ${hours}h ${minutes}m ${seconds}s`;
}
setInterval(updateTimer, 1000);
updateTimer();

// --- L'ARBRE EN CŒUR ---
const canvas = document.getElementById('loveTree');
const ctx = canvas.getContext('2d');

let width, height;
let leaves = []; // Tableau pour stocker les feuilles
const treeColor = "#5a3e36";

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initTree();
}
window.addEventListener('resize', resize);

// Fonction mathématique pour placer les points en forme de cœur
// k est un facteur pour agrandir le coeur
function getHeartPoint(angle, scale) {
    // Formule mathématique du coeur : 
    // x = 16 sin^3(t)
    // y = 13 cos(t) - 5 cos(2t) - 2 cos(3t) - cos(4t)
    const x = 16 * Math.pow(Math.sin(angle), 3);
    const y = 13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle);
    
    return {
        x: x * scale, 
        y: -y * scale // On inverse Y car le canvas va vers le bas
    };
}

function drawLeaf(x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-size / 2, -size / 2, -size, size / 3, 0, size);
    ctx.bezierCurveTo(size, size / 3, size / 2, -size / 2, 0, 0);
    ctx.fill();
    ctx.restore();
}

function initTree() {
    leaves = [];
    // Le centre de l'arbre (horizontalement au milieu, verticalement un peu plus bas que le milieu)
    const centerX = width / 2;
    const centerY = height * 0.6; 
    
    // Taille du coeur selon l'écran (plus petit sur mobile)
    const scale = Math.min(width, height) / 35; 

    // Création des feuilles
    // On génère 400 feuilles qui suivent le contour du coeur
    for (let i = 0; i < 400; i++) {
        const angle = Math.random() * Math.PI * 2;
        // On ajoute un peu de hasard (random) pour remplir l'intérieur du coeur
        // Math.sqrt(Math.random()) permet de bien répartir à l'intérieur
        const r = Math.sqrt(Math.random()) * scale; 
        
        const point = getHeartPoint(angle, r);
        
        // Couleurs roses variées
        const colors = ["#ff0a54", "#ff477e", "#ff7096", "#ff85a1", "#fbb1bd", "#ff99c8"];
        
        leaves.push({
            x: centerX + point.x,
            y: centerY + point.y - (height * 0.1), // Remonter un peu le feuillage
            targetSize: 5 + Math.random() * 8, // Taille finale
            currentSize: 0, // Taille actuelle (pour l'animation)
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: 0.05 + Math.random() * 0.1 // Vitesse d'apparition
        });
    }
    
    animate();
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // 1. DESSINER LE TRONC
    // Le tronc part du bas et va jusqu'au centre du coeur
    const centerX = width / 2;
    const bottomY = height;
    const trunkHeight = height * 0.45; // Hauteur du tronc
    
    ctx.strokeStyle = treeColor;
    ctx.lineWidth = Math.max(3, width / 80); // Largeur du tronc responsive
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(centerX, bottomY);
    // Courbe légère pour faire naturel
    ctx.quadraticCurveTo(centerX, bottomY - trunkHeight / 2, centerX, bottomY - trunkHeight);
    ctx.stroke();

    // Quelques branches principales statiques pour soutenir le coeur
    ctx.beginPath();
    ctx.moveTo(centerX, bottomY - trunkHeight * 0.6);
    ctx.lineTo(centerX - width * 0.15, bottomY - trunkHeight * 0.9); // Branche gauche
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, bottomY - trunkHeight * 0.6);
    ctx.lineTo(centerX + width * 0.15, bottomY - trunkHeight * 0.9); // Branche droite
    ctx.stroke();


    // 2. DESSINER ET ANIMER LES FEUILLES
    let allComplete = true;

    leaves.forEach(leaf => {
        if (leaf.currentSize < leaf.targetSize) {
            leaf.currentSize += leaf.speed;
            allComplete = false;
        }
        
        // Dessiner la feuille (petit coeur)
        drawLeaf(leaf.x, leaf.y, leaf.currentSize, leaf.color);
        
        // Optionnel : Dessiner une petite tige fine qui relie la feuille vers le centre (effet touffu)
        // C'est gourmand en performance, on le fait simple :
        /*
        ctx.strokeStyle = "rgba(90, 62, 54, 0.1)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(centerX, bottomY - trunkHeight);
        ctx.lineTo(leaf.x, leaf.y);
        ctx.stroke();
        */
    });

    if (!allComplete) {
        requestAnimationFrame(animate);
    } else {
        // Animation continue (léger flottement des feuilles)
        pulse();
    }
}

// Animation de "battement" une fois l'arbre fini
let time = 0;
function pulse() {
    ctx.clearRect(0, 0, width, height);
    
    // Redessiner tronc (copie du code ci-dessus pour la boucle)
    const centerX = width / 2;
    const bottomY = height;
    const trunkHeight = height * 0.45;
    ctx.strokeStyle = treeColor;
    ctx.lineWidth = Math.max(3, width / 80);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(centerX, bottomY);
    ctx.quadraticCurveTo(centerX, bottomY - trunkHeight / 2, centerX, bottomY - trunkHeight);
    ctx.stroke();
    
    // Branches
    ctx.beginPath();
    ctx.moveTo(centerX, bottomY - trunkHeight * 0.6);
    ctx.lineTo(centerX - width * 0.15, bottomY - trunkHeight * 0.9); 
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX, bottomY - trunkHeight * 0.6);
    ctx.lineTo(centerX + width * 0.15, bottomY - trunkHeight * 0.9); 
    ctx.stroke();

    time += 0.05;
    
    leaves.forEach(leaf => {
        // Petit mouvement de vent
        const offsetX = Math.sin(time + leaf.x) * 2;
        const offsetY = Math.cos(time + leaf.y) * 2;
        drawLeaf(leaf.x + offsetX, leaf.y + offsetY, leaf.targetSize, leaf.color);
    });
    
    requestAnimationFrame(pulse);
}

// Lancer
resize();
