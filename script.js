// --- CONFIGURATION ---
const startDate = new Date("2019-09-02T00:00:00"); // Ta date : 2 Sept 2019
const messages = [
    "Pour l'amour de ma vie...",
    "Si je pouvais choisir un endroit,",
    "ce serait toujours à tes côtés.",
    "Joyeuse Saint-Valentin !",
    "Je t'aime !"
];

// --- GESTION DU TIMER ---
function updateTimer() {
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("timer").innerText = 
        `${days} jours, ${hours} h, ${minutes} min, ${seconds} s`;
}
setInterval(updateTimer, 1000);
updateTimer();

// --- EFFET MACHINE À ÉCRIRE (Texte) ---
let msgIndex = 0;
let charIndex = 0;
const typeElement = document.getElementById("typewriter");

function typeWriter() {
    if (msgIndex < messages.length) {
        if (charIndex < messages[msgIndex].length) {
            typeElement.innerHTML += messages[msgIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 100); // Vitesse de frappe
        } else {
            setTimeout(eraseText, 2000); // Attendre avant d'effacer
        }
    } else {
        // Fin des messages, on laisse le dernier affiché ou on recommence
        typeElement.innerHTML = "Je t'aime ! ❤"; 
    }
}

function eraseText() {
    if (charIndex > 0) {
        typeElement.innerHTML = messages[msgIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseText, 50);
    } else {
        msgIndex++;
        if(msgIndex >= messages.length) msgIndex = messages.length; // Stop à la fin
        setTimeout(typeWriter, 500);
    }
}
// Lancer l'animation du texte après 1 seconde
setTimeout(typeWriter, 1000);


// --- ANIMATION DE L'ARBRE (CANVAS) ---
const canvas = document.getElementById('loveTree');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Redimensionner si on tourne l'écran
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // On pourrait redessiner l'arbre ici, mais pour faire simple on laisse tel quel
});

function drawHeart(x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    // Forme du coeur avec courbes de Bézier
    ctx.bezierCurveTo(-size / 2, -size / 2, -size, size / 3, 0, size);
    ctx.bezierCurveTo(size, size / 3, size / 2, -size / 2, 0, 0);
    ctx.fill();
    ctx.restore();
}

function drawBranch(startX, startY, len, angle, branchWidth) {
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = "#5a3e36"; // Couleur marron arbre
    ctx.fillStyle = "#5a3e36";
    ctx.lineWidth = branchWidth;
    ctx.translate(startX, startY);
    ctx.rotate(angle * Math.PI/180);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.stroke();

    if (len < 10) {
        // C'est le bout de la branche : dessiner un coeur (feuille)
        // Couleurs variées de rose/rouge
        const colors = ["#ff4d6d", "#d63384", "#ff8fa3", "#ffb3c1"]; 
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        // Dessiner le coeur
        drawHeart(0, -len, 10 + Math.random() * 5, randomColor); 
        ctx.restore();
        return;
    }

    ctx.restore();

    // Animation récursive (pousse lentement)
    setTimeout(() => {
        // Calcul des nouvelles coordonnées
        const endX = startX + len * Math.sin(angle * Math.PI/180); // Corrigé pour la trigo canvas
        const endY = startY - len * Math.cos(angle * Math.PI/180);

        // Deux nouvelles branches
        drawBranch(endX, endY, len * 0.75, angle + 25, branchWidth * 0.7);
        drawBranch(endX, endY, len * 0.75, angle - 25, branchWidth * 0.7);
    }, 400); // Vitesse de croissance (plus le chiffre est bas, plus c'est rapide)
}

// Lancer l'arbre
// Position de départ : bas au centre
const startX = canvas.width / 2;
const startY = canvas.height;
const trunkLength = 120; // Taille du tronc

// Dessiner le tronc initial
drawBranch(startX, startY, trunkLength, 0, 15);
