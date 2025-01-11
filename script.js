const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let scoreElement = document.getElementById("Score");
let scoreElementP2 = document.getElementById("ScoreP2");
let P1name = ``;
let P2name = ``;

let incScr = 0;
let incScrP2 = 0;
let speed = 100;
let difficulty = "Easy";

const box = 20;
const canvasSize = canvas.width;

// Player 1 variables
let snake = [];
snake[0] = { x: Math.floor(Math.random() * (canvasSize / box)) * box, y: Math.floor(Math.random() * (canvasSize / box)) * box };
let direction;

// Player 2 variables
let snakeP2 = [];
snakeP2[0] = { x: Math.floor(Math.random() * (canvasSize / box)) * box, y: Math.floor(Math.random() * (canvasSize / box)) * box };
let directionP2;

let food = {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box
};

// Define obstacles
let obstacles = [];
generateObstacles();

function generateObstacles() {
    obstacles = [];
    for (let i = 0; i < 20; i++) {
        let obstacleX = Math.floor(Math.random() * (canvasSize / box)) * box;
        let obstacleY = Math.floor(Math.random() * (canvasSize / box)) * box;
        // Ensure obstacle position does not overlap with snake or food
        while (isObstacleOverlap(obstacleX, obstacleY)) {
            obstacleX = Math.floor(Math.random() * (canvasSize / box)) * box;
            obstacleY = Math.floor(Math.random() * (canvasSize / box)) * box;
        }
        obstacles.push({ x: obstacleX, y: obstacleY });
    }
}

function isObstacleOverlap(x, y) {
    // Check overlap with food
    if (x === food.x && y === food.y) {
        return true;
    }
    // Check overlap with other obstacles
    for (let i = 0; i < obstacles.length; i++) {
        if (x === obstacles[i].x && y === obstacles[i].y) {
            return true;
        }
    }
    // Check overlap with snakes
    for (let i = 0; i < snake.length; i++) {
        if (x === snake[i].x && y === snake[i].y) {
            return true;
        }
    }
    for (let i = 0; i < snakeP2.length; i++) {
        if (x === snakeP2[i].x && y === snakeP2[i].y) {
            return true;
        }
    }
    return false;
}

document.addEventListener("keydown", directionHandler);
document.addEventListener("keydown", directionHandlerP2);

function directionHandler(event) {
    if (event.keyCode == 37 && direction != "RIGHT") direction = "LEFT";  // Left arrow key (Player 1)
    else if (event.keyCode == 38 && direction != "DOWN") direction = "UP";  // Up arrow key (Player 1)
    else if (event.keyCode == 39 && direction != "LEFT") direction = "RIGHT";  // Right arrow key (Player 1)
    else if (event.keyCode == 40 && direction != "UP") direction = "DOWN";  // Down arrow key (Player 1)
}

function directionHandlerP2(event) {
    if (event.keyCode == 65 && directionP2 != "RIGHT") directionP2 = "LEFT";  // A key (Player 2)
    else if (event.keyCode == 87 && directionP2 != "DOWN") directionP2 = "UP";  // W key (Player 2)
    else if (event.keyCode == 68 && directionP2 != "LEFT") directionP2 = "RIGHT";  // D key (Player 2)
    else if (event.keyCode == 83 && directionP2 != "UP") directionP2 = "DOWN";  // S key (Player 2)
}

function collision(newHead, snake, otherSnake) {
    // Check collision with itself
    for (let i = 0; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            return true;
        }
    }
    // Check collision with the other snake
    for (let i = 0; i < otherSnake.length; i++) {
        if (newHead.x === otherSnake[i].x && newHead.y === otherSnake[i].y) {
            return true;
        }
    }
    // Check collision with obstacles
    for (let i = 0; i < obstacles.length; i++) {
        if (newHead.x === obstacles[i].x && newHead.y === obstacles[i].y) {
            return true;
        }
    }
    return false;
}

function drawGrid() {
    // Draw vertical grid lines
    ctx.beginPath();
    for (let x = 0; x <= canvasSize; x += box) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasSize);
    }
    ctx.strokeStyle = "lightgray";
    ctx.stroke();

    // Draw horizontal grid lines
    ctx.beginPath();
    for (let y = 0; y <= canvasSize; y += box) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvasSize, y);
    }
    ctx.strokeStyle = "lightgray";
    ctx.stroke();
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    scoreElement.innerHTML = "Player 1 Score: " + incScr + "<br>" + difficulty;
    scoreElementP2.innerHTML = "Player 2 Score: " + incScrP2 + "<br>" + difficulty;

    // Draw obstacles
    ctx.fillStyle = "gray";
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillRect(obstacles[i].x, obstacles[i].y, box, box);
    }

    // Draw Grid
    drawGrid();

    // Draw Player 1's snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "black" : "grey";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "black";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw Player 2's snake
    for (let i = 0; i < snakeP2.length; i++) {
        ctx.fillStyle = i === 0 ? "blue" : "lightblue";
        ctx.fillRect(snakeP2[i].x, snakeP2[i].y, box, box);

        ctx.strokeStyle = "blue";
        ctx.strokeRect(snakeP2[i].x, snakeP2[i].y, box, box);
    }

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Update Player 1's snake's head position based on direction
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    // Wrap around logic for Player 1
    if (snakeX < 0) snakeX = canvasSize - box;
    if (snakeX >= canvasSize) snakeX = 0;
    if (snakeY < 0) snakeY = canvasSize - box;
    if (snakeY >= canvasSize) snakeY = 0;

    // Update Player 2's snake's head position based on direction
    let snakeP2X = snakeP2[0].x;
    let snakeP2Y = snakeP2[0].y;

    if (directionP2 === "LEFT") snakeP2X -= box;
    if (directionP2 === "UP") snakeP2Y -= box;
    if (directionP2 === "RIGHT") snakeP2X += box;
    if (directionP2 === "DOWN") snakeP2Y += box;

    // Wrap around logic for Player 2
    if (snakeP2X < 0) snakeP2X = canvasSize - box;
    if (snakeP2X >= canvasSize) snakeP2X = 0;
    if (snakeP2Y < 0) snakeP2Y = canvasSize - box;
    if (snakeP2Y >= canvasSize) snakeP2Y = 0;

    // Check if Player 1's snake eats food
    if (snakeX === food.x && snakeY === food.y) {
        food = {
            x: Math.floor(Math.random() * (canvasSize / box)) * box,
            y: Math.floor(Math.random() * (canvasSize / box)) * box
        };
        incScr++;

        if ((incScr + incScrP2) % 10 === 0) {
            speed -= 5;
            clearInterval(game);
            game = setInterval(draw, speed);
        }
    
        // Update difficulty level and regenerate obstacles
        if ((incScr + incScrP2) % 20 === 0) {
            difficulty = (difficulty === "Easy") ? "Medium" : (difficulty === "Medium") ? "Hard" : "Easy";
            generateObstacles();
        }

    } else {
        snake.pop(); // Remove the last part of Player 1's snake
    }

    // Check if Player 2's snake eats food
    if (snakeP2X === food.x && snakeP2Y === food.y) {
        food = {
            x: Math.floor(Math.random() * (canvasSize / box)) * box,
            y: Math.floor(Math.random() * (canvasSize / box)) * box
        };
        incScrP2++;

        if ((incScr + incScrP2) % 10 === 0) {
            speed -= 5;
            clearInterval(game);
            game = setInterval(draw, speed);
        }
    
        // Update difficulty level and regenerate obstacles
        if ((incScr + incScrP2) % 20 === 0) {
            difficulty = (difficulty === "Easy") ? "Medium" : (difficulty === "Medium") ? "Hard" : "Easy";
            generateObstacles();
        }
        
    } else {
        snakeP2.pop(); // Remove the last part of Player 2's snake
    }

    // Add new head to Player 1's snake
    if (!collision({ x: snakeX, y: snakeY }, snake, snakeP2)) {
        snake.unshift({ x: snakeX, y: snakeY });
    } else {
        // Handle collision for Player 1's snake
        if (collision({ x: snakeX, y: snakeY }, [], snakeP2)) {
           
            if (snake.length > 0) {
                // Reverse the direction if the snake has at least one segment left
                if (direction === "LEFT") direction = "UP";
                else if (direction === "RIGHT") direction = "DOWN";
                else if (direction === "UP") direction = "RIGHT";
                else if (direction === "DOWN") direction = "LEFT";
                
            } else {
                // If the snake is completely consumed, reset to initial state
                snake = [{ x: Math.floor(Math.random() * (canvasSize / box)) * box, y: Math.floor(Math.random() * (canvasSize / box))* box }];
                direction = null; // Reset direction
            }
        }
        
    }

    // Add new head to Player 2's snake
    if (!collision({ x: snakeP2X, y: snakeP2Y }, snakeP2, snake)) {
        snakeP2.unshift({ x: snakeP2X, y: snakeP2Y });
    } else {
       
        // Handle collision for Player 2's snake
        if (collision({ x: snakeP2X, y: snakeP2Y }, [], snake)) {
            
            if (snakeP2.length > 0) {
                // Reverse the direction if the snake has at least one segment left
                if (directionP2 === "LEFT") directionP2 = "UP";
                else if (directionP2 === "RIGHT") directionP2 = "DOWN";
                else if (directionP2 === "UP") directionP2 = "RIGHT";
                else if (directionP2 === "DOWN") directionP2 = "LEFT";
               
            } else {
                // If the snake is completely consumed, reset to initial state
                snakeP2 = [{ x: Math.floor(Math.random() * (canvasSize / box)) * box, y: Math.floor(Math.random() * (canvasSize / box))* box }];
                directionP2 = null; // Reset direction
            }
        }
        
    }

    // Check for win conditions
    if (incScr == 100) {
        clearInterval(game); // Stop the game loop
        ctx.fillStyle = "black";
        ctx.font = "50px Arial";
        ctx.fillText("Player 1 Wins!", canvasSize / 4, canvasSize / 10);
        return;
    } else if (incScrP2 == 100) {
        clearInterval(game); // Stop the game loop
        ctx.fillStyle = "black";
        ctx.font = "50px Arial";
        ctx.fillText("Player 2 Wins", canvasSize / 4, canvasSize / 4);
        return;
    }
}

// Start the game
document.body.style.zoom = "80%"; // Zoom out to 80%
let game = setInterval(draw, speed);