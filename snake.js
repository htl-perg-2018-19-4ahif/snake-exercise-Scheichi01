var ansi = require('ansi');
var keypress = require('keypress');
var LinkedList = require('linked-list');

keypress(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();

var cursor = ansi(process.stdout);
var width = 40;
var height = 20;
var posX = 0;
var posY = 0;
var dotPosX = 0;
var dotPosY = 0;
var dirX = 1;
var dirY = 0;
var points = 0;
var speed = 3;
var snake = [];
var coords = [];

try {
    process.stdout.write('\x1Bc');
    process.stdout.write('\x1B[?25l');

    cursor.bg.grey();
    drawHorLine(1, 1, width);
    drawHorLine(1, height - 1, width);
    drawVertLine(1, 1, height - 1);
    drawVertLine(width, 1, height - 1);
    cursor.bg.reset();

    process.stdin.on('keypress', handleInput);

    coords.push(Math.floor(width / 2));
    coords.push(Math.floor(height / 2));
    var coordiantes = [coords[0]+1, coords[1]];
    snake.push(coords);
    snake.push(coordiantes);

    spawnDot();

    gameLoop();
} catch (ex) {
    console.log(ex.toString());
    quitGame();
}

function gameLoop() {

    moveSnake();

    if (snake[0][0] == 1 || snake[0][0] == width || snake[0][1] == 1 || snake[0][1] == height - 1) {
        cursor.red().bold();
        cursor.bg.grey();

        drawHorLine(0, height / 2, width);
        cursor.goto(width / 2 - 4, height / 2).write("GAME OVER");
        quitGame();
    }

    if (snake[0][0] == dotPosX && snake[0][1] == dotPosY) {
        points++;

        increaseSize();

        spawnDot();
    }

    drawSnake();

    setTimeout(gameLoop, 1000 / speed);
}

function quitGame() {
    cursor.reset();
    cursor.bg.reset();
    process.stdout.write('\x1B[?25h');
    cursor.goto(1, height + 4);
    process.exit();
}

function handleInput(chunk, key) {
    if (key.name == 'escape') {
        quitGame();
    } else if (key.name == 'right') {
        dirX = 1;
        dirY = 0;
    } else if (key.name == 'left') {
        dirX = -1;
        dirY = 0;
    } else if (key.name == 'up') {
        dirX = 0;
        dirY = -1;
    } else if (key.name == 'down') {
        dirX = 0;
        dirY = 1;
    }
}

function spawnDot() {
    dotPosX = Math.ceil(Math.random() * (width - 2)) + 1;
    dotPosY = Math.ceil(Math.random() * (height - 3) + 1);

    cursor.bg.red();
    drawDot(dotPosX, dotPosY);
    cursor.bg.reset();

    updateStats();
}

function updateStats() {
    cursor.goto(1, height).write("Points: " + points.toString());
    cursor.goto(1, height + 1).write("Speed: " + speed.toString());
}

function removeSnake() {
    for (let i = 0; i < snake.length; i++) {
        cursor.bg.black();
        drawDot(snake[i][0], snake[i][1]);
        cursor.bg.reset();
    }
}

function drawSnake() {
    cursor.bg.green();
    for (let i = 0; i < snake.length; i++) {
        drawDot(snake[i][0], snake[i][1]);
    }
    cursor.bg.reset();
}

function drawDot(col, row) {
    cursor.goto(col, row).write(' ');
}

function drawHorLine(col, row, length) {
    for (var i = 0; i < length; i++) {
        cursor.goto(col + i, row).write(' ');
    }
}

function drawVertLine(col, row, length) {
    for (var i = 0; i < length; i++) {
        cursor.goto(col, row + i).write(' ');
    }
}

function increaseSize() {
    var coordiantes = [];
    if (snake[snake.length - 1][0] == snake[snake.length - 2][0]) {
        if (snake[snake.length - 1][1] > snake[snake.length - 2][1]) {
            coordiantes[0] = snake[snake.length - 1][0];
            coordiantes[1] = snake[snake.length - 1][1] + 1;
        } else {
            coordiantes[0] = snake[snake.length - 1][0];
            coordiantes[1] = snake[snake.length - 1][1] - 1;
        }
    } else {
        if (snake[snake.length - 1][0] > snake[snake.length - 2][0]) {
            coordiantes[0] = snake[snake.length - 1][0] + 1;
            coordiantes[1] = snake[snake.length - 1][1];
        } else {
            coordiantes[0] = snake[snake.length - 1][0] - 1;
            coordiantes[1] = snake[snake.length - 1][1];
        }
    }
    snake.push(coordiantes);
}

function moveSnake() {
    var coordiantes = [];
    coordiantes[0] = snake[0][0] + dirX;
    coordiantes[1] = snake[0][1] + dirY;
    snake.unshift(coordiantes);
    cursor.bg.black();
    drawDot(snake[snake.length-1][0], snake[snake.length-1][1]);
    cursor.reset();
    snake.splice(-1, 1);
}