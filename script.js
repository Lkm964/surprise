// --- CONFIGURATION DATE & TEXTE ---
const startDate = new Date("2019-09-02T00:00:00"); 

// --- GESTION DU TIMER ---
function updateTimer() {
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("timer").innerText = 
        `${days}j ${hours}h ${minutes}m ${seconds}s`;
}
setInterval(updateTimer, 1000);
updateTimer();

// --- CONFIGURATION CANVAS & ARBRE ---
const canvas = document.getElementById('loveTree');
const ctx = canvas.getContext('2d');

let width, height;

// Fonction pour ajuster la taille du canvas à l'écran
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    // On relance le dessin si on redimensionne
    drawTree();
}

window.addEventListener('resize', resize);

// Fonction pour dessiner un coeur (feuille)
function drawHeart(x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    /* Forme mathématique du coeur */
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-size / 2, -size / 2, -size, size / 3, 0, size);
    ctx.bezierCurveTo(size, size / 3, size / 2, -size / 2, 0, 0);
    ctx.fill();
    ctx.restore();
}

// Fonction récursive de l'arbre
function drawBranch(x, y, len, angle, widthBranch) {
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = "#5a3e36"; // Couleur tronc
    ctx.lineWidth = widthBranch;
    ctx.translate(x, y);
    ctx.rotate(angle * Math.PI / 180);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.stroke();

    // Si on arrive au bout des branches
    if (len < 10) {
        // Palette de couleurs pour les coeurs
        const colors = ["#ff0a54", "#ff477e", "#ff7096", "#ff85a1", "#fbb1bd"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Dessiner le coeur
        // On varie un peu la taille pour faire naturel
        drawHeart(0, -len, 8 + Math.random() * 8, color);
        ctx.restore();
        return;
    }

    ctx.restore();

    // Calcul des prochains points
    // Note : pas de setTimeout ici pour que l'arbre soit instantané et net
    // Si tu veux l'animation progressive, c'est plus complexe à rendre "responsive" parfaitement
    // Ici on priorise le visuel "entier" sur l'écran.
    
    const newX = x + len * Math.sin(angle * Math.PI / 180);
    const newY = y - len * Math.cos(angle * Math.PI / 180);

    // Facteur de réduction (0.75 = chaque branche est 75% de la précédente)
    const newLen = len * 0.72; 
    
    // Angles : on réduit l'écart pour que l'arbre reste plus compact (pas trop large)
    drawBranch(newX, newY, newLen, angle + 20, widthBranch * 0.7);
    drawBranch(newX, newY, newLen, angle - 20, widthBranch * 0.7);
}

function drawTree() {
    // Effacer le canvas
    ctx.clearRect(0, 0, width, height);
    
    // Paramètres dynamiques basés sur la taille de l'écran
    // La taille du tronc dépend de la hauteur de l'écran (environ 16%)
    const trunkLen = height * 0.16; 
    
    // On commence en bas au centre
    // On dessine la première branche (le tronc)
    drawBranch(width / 2, height, trunkLen, 0, 12);
}

// Lancement initial
resize();
