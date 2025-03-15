const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const gameOverText = document.getElementById("gameOverText");
const finalScore = document.getElementById("finalScore");
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");

const box = 20;
let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = spawnFood();
let gameOver = false;
let score = 0;
let speed = 200;
let gameInterval;
let isPaused = false;

function drawSnake() {
    ctx.fillStyle = "lime";
    snake.forEach((segment, index) => {
        ctx.fillRect(segment.x, segment.y, box, box);
        ctx.strokeStyle = "black";
        ctx.strokeRect(segment.x, segment.y, box, box);
    });
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
}

function moveSnake() {
    if (gameOver || isPaused) return;

    let head = { ...snake[0] };
    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        endGame();
        return;
    }

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        food = spawnFood();
        score++;
        scoreDisplay.textContent = score;
        eatSound.play();
        increaseSpeed();
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

function spawnFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

function increaseSpeed() {
    if (speed > 50) {
        speed -= 10;
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
    }
}

function endGame() {
    gameOver = true;
    gameOverText.style.display = "block";
    finalScore.textContent = score;
    gameOverSound.play();
    clearInterval(gameInterval);
}

function restartGame() {
    snake = [{ x: 200, y: 200 }];
    direction = "RIGHT";
    food = spawnFood();
    score = 0;
    speed = 200;
    gameOver = false;
    isPaused = false;
    scoreDisplay.textContent = score;
    gameOverText.style.display = "none";
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
}

function togglePause() {
    isPaused = !isPaused;
}

document.addEventListener("keydown", event => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (event.key === "p" || event.key === "P") togglePause();
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
    moveSnake();
}

gameInterval = setInterval(gameLoop, speed);
