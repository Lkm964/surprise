// 📅 Date de rencontre : 2 septembre 2019
const startDate = new Date(2019, 8, 2);

function updateTimer() {
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
}

setInterval(updateTimer, 1000);
updateTimer();

// 💌 Afficher Joyeuse Saint-Valentin
function showValentine() {
    document.getElementById("valentine").classList.remove("hidden");
}

// ❤️ Hearts generator
function createHeart() {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerHTML = "❤️";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = Math.random() * 28 + 14 + "px";
    heart.style.animationDuration = Math.random() * 3 + 4 + "s";

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 7000);
}

setInterval(createHeart, 250);
