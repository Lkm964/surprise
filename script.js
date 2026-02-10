* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background-color: #ffe8d6; /* Beige crème */
    font-family: 'Nunito', sans-serif;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    position: absolute;
    top: 5%;
    z-index: 10;
    text-align: center;
    background: rgba(255, 255, 255, 0.5);
    padding: 15px 30px;
    border-radius: 20px;
    backdrop-filter: blur(5px);
}

.title {
    font-family: 'Dancing Script', cursive;
    font-size: 2.5rem;
    color: #333;
}

.timer {
    font-size: 1.2rem;
    font-weight: 700;
    color: #d63384;
    margin: 10px 0;
}

.subtitle {
    color: #666;
    font-size: 0.9rem;
}

canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
