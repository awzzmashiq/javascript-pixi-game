// Initialize PixiJS application
const app = new PIXI.Application({ width: 500, height: 400, backgroundColor: 0x000000 });
document.body.appendChild(app.view); // Append canvas to body

// Load best score from local storage (if exists)
let bestScore = localStorage.getItem("bestScore") ? parseInt(localStorage.getItem("bestScore")) : 0;
document.getElementById("score").innerText = `Score: 0 | Best Score: ${bestScore}`;

// Player object
const player = new PIXI.Graphics();
player.beginFill(0x0000FF); // Blue color
player.drawRect(0, 0, 20, 20);
player.endFill();
player.x = 50;
player.y = 180;
app.stage.addChild(player);

// Enemy storage
let enemies = [];
let score = 0;
let gameOver = false;

// Function to create an enemy
function createEnemy() {
    const enemy = new PIXI.Graphics();
    enemy.beginFill(0xFF0000); // Red color
    enemy.drawRect(0, 0, 20, 20);
    enemy.endFill();
    enemy.x = app.screen.width;
    enemy.y = Math.random() * (app.screen.height - 20);
    enemy.speed = Math.random() * 3 + 2;
    app.stage.addChild(enemy);
    enemies.push(enemy);
}

// Function to move enemies
function updateEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.x -= enemy.speed;
        if (enemy.x + enemy.width < 0) {
            enemies.splice(index, 1);
            score++;
            updateScore();
        }
    });
}

// Function to update score & best score
function updateScore() {
    document.getElementById("score").innerText = `Score: ${score} | Best Score: ${bestScore}`;
}

// Restart the game when "R" is pressed
function restartGame() {
    location.reload(); // Reload the page to reset everything
}

// Function to check collisions
function checkCollision() {
    enemies.forEach(enemy => {
        if (
            player.x < enemy.x + 20 &&
            player.x + 20 > enemy.x &&
            player.y < enemy.y + 20 &&
            player.y + 20 > enemy.y
        ) {
            gameOver = true;
        }
    });

    if (gameOver) {
        // Update best score if the current score is higher
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem("bestScore", bestScore); // Save to browser storage
        }

        app.stage.removeChildren();
        const message = new PIXI.Text(`Game Over!\nScore: ${score}\nBest Score: ${bestScore}\nPress 'R' to Restart`, {
            fontSize: 24,
            fill: 0xFFFFFF,
            align: "center",
        });
        message.x = app.screen.width / 2 - 120;
        message.y = app.screen.height / 2;
        app.stage.addChild(message);

        // Listen for "R" key to restart
        window.addEventListener("keydown", (event) => {
            if (event.key === "r" || event.key === "R") {
                restartGame();
            }
        });
    }
}

// Event listener for player movement (Now Supports Left and Right Movement!)
window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && player.y > 0) player.y -= 10;
    if (event.key === "ArrowDown" && player.y < app.screen.height - 20) player.y += 10;
    if (event.key === "ArrowLeft" && player.x > 0) player.x -= 10; // Move left
    if (event.key === "ArrowRight" && player.x < app.screen.width - 20) player.x += 10; // Move right
});

// Game loop
app.ticker.add(() => {
    if (!gameOver) {
        updateEnemies();
        checkCollision();
    }
});

// Generate enemies periodically
setInterval(createEnemy, 1000);
