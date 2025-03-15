const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Hacer el canvas responsive
function resizeCanvas() {
    const maxWidth = Math.min(window.innerWidth * 0.9, 400);
    const maxHeight = Math.min(window.innerHeight * 0.6, 400);
    const size = Math.min(maxWidth, maxHeight);
    
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10}
];
let food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
};
let dx = 0;
let dy = 0;
let score = 0;
let gameOver = false;

// Función para cambiar la dirección
function changeDirection(newDx, newDy) {
    // Evitar que la serpiente vaya en dirección opuesta
    if ((newDx === 1 && dx === -1) || 
        (newDx === -1 && dx === 1) || 
        (newDy === 1 && dy === -1) || 
        (newDy === -1 && dy === 1)) {
        return;
    }
    dx = newDx;
    dy = newDy;
}

// Controles de teclado
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            if (dy !== 1) changeDirection(0, -1);
            break;
        case 'ArrowDown':
            if (dy !== -1) changeDirection(0, 1);
            break;
        case 'ArrowLeft':
            if (dx !== 1) changeDirection(-1, 0);
            break;
        case 'ArrowRight':
            if (dx !== -1) changeDirection(1, 0);
            break;
    }
});

// Controles táctiles
const upBtn = document.getElementById('up-btn');
const downBtn = document.getElementById('down-btn');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

upBtn.addEventListener('click', () => changeDirection(0, -1));
downBtn.addEventListener('click', () => changeDirection(0, 1));
leftBtn.addEventListener('click', () => changeDirection(-1, 0));
rightBtn.addEventListener('click', () => changeDirection(1, 0));

// Prevenir el scroll al tocar los botones
document.querySelectorAll('.control-btn').forEach(btn => {
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        btn.click();
    });
});

function drawGame() {
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '50px Arial';
        const gameOverText = 'Game Over!';
        const scoreText = `Score: ${score}`;
        
        // Centrar texto
        ctx.textAlign = 'center';
        ctx.fillText(gameOverText, canvas.width/2, canvas.height/2);
        ctx.font = '30px Arial';
        ctx.fillText(scoreText, canvas.width/2, canvas.height/2 + 40);
        
        // Agregar botón de reinicio
        ctx.fillStyle = '#4CAF50';
        const btnWidth = 200;
        const btnHeight = 50;
        const btnX = (canvas.width - btnWidth) / 2;
        const btnY = canvas.height/2 + 80;
        
        ctx.fillRect(btnX, btnY, btnWidth, btnHeight);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('Tap to Restart', canvas.width/2, btnY + 30);
        
        // Agregar evento de reinicio
        canvas.onclick = () => {
            snake = [{x: 10, y: 10}];
            dx = 0;
            dy = 0;
            score = 0;
            gameOver = false;
            generateFood();
            canvas.onclick = null;
            drawGame();
        };
        return;
    }

    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
    checkCollision();
    drawScore();

    setTimeout(drawGame, 100);
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        generateFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function checkCollision() {
    const head = snake[0];
    
    if (head.x < 0 || head.x >= tileCount || 
        head.y < 0 || head.y >= tileCount) {
        gameOver = true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
        }
    }
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

drawGame();

