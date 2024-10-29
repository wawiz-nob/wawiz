const gameContainer = document.querySelector('.game-container');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start');
const gameOverDisplay = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');

let snake = [{ x: 10, y: 10 }];
let food = { x: 0, y: 0 };
let obstacles = [];
let powerUp = null;
let score = 0;
let direction = { x: 0, y: 0 };
let gameInterval;
let speed = 150; // Kecepatan awal ular
let level = 1; // Level awal
let isPowerUpActive = false;
let powerUpEffectTimeout;

// Fungsi untuk memulai game
function startGame() {
    score = 0;
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    speed = 150; // Reset kecepatan
    level = 1; // Reset level
    scoreDisplay.textContent = score;
    gameOverDisplay.classList.add('hidden');
    obstacles = []; // Reset penghalang
    powerUp = null;
    isPowerUpActive = false;

    // Mengatur posisi makanan, penghalang, dan power-up
    placeFood();
    placeObstacles();
    placePowerUp();

    // Memulai interval untuk menggerakkan ular
    gameInterval = setInterval(moveSnake, speed);
}

// Fungsi untuk memindahkan ular
function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Mengecek tabrakan dengan makanan
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        snake.unshift(head); // Menambahkan segmen ular
        placeFood(); // Tempatkan makanan baru
        if (score % 5 === 0) { // Setiap 5 poin, tingkatkan level
            level++;
            speed -= 10; // Meningkatkan kecepatan
            clearInterval(gameInterval);
            gameInterval = setInterval(moveSnake, speed);
        }
        placeObstacles(); // Tempatkan penghalang baru setiap kali ular memakan makanan
        placePowerUp(); // Ada kemungkinan muncul power-up baru
    } else {
        snake.unshift(head); // Tambah kepala ular
        snake.pop(); // Hapus ekor ular
    }

    // Mengecek tabrakan dengan power-up
    if (powerUp && head.x === powerUp.x && head.y === powerUp.y) {
        activatePowerUp();
        powerUp = null; // Hapus power-up setelah diambil
    }

    // Mengecek tabrakan dengan dinding, tubuh ular, atau penghalang
    if (!isPowerUpActive && (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || checkCollision(head) || checkObstacleCollision(head))) {
        endGame();
    }

    draw();
}

// Fungsi untuk menggambar ular, makanan, penghalang, dan power-up
function draw() {
    gameContainer.innerHTML = ''; // Hapus elemen sebelumnya
    snake.forEach((segment) => {
        const segmentElement = document.createElement('div');
        segmentElement.classList.add('snake-segment');
        segmentElement.style.left = `${segment.x * 20}px`;
        segmentElement.style.top = `${segment.y * 20}px`;
        gameContainer.appendChild(segmentElement);
    });

    // Gambar makanan
    const foodElement = document.createElement('div');
    foodElement.classList.add('food');
    foodElement.style.left = `${food.x * 20}px`;
    foodElement.style.top = `${food.y * 20}px`;
    gameContainer.appendChild(foodElement);

    // Gambar penghalang
    obstacles.forEach((obstacle) => {
        const obstacleElement = document.createElement('div');
        obstacleElement.classList.add('obstacle');
        obstacleElement.style.left = `${obstacle.x * 20}px`;
        obstacleElement.style.top = `${obstacle.y * 20}px`;
        gameContainer.appendChild(obstacleElement);
    });

    // Gambar power-up jika ada
    if (powerUp) {
        const powerUpElement = document.createElement('div');
        powerUpElement.classList.add('power-up');
        powerUpElement.style.left = `${powerUp.x * 20}px`;
        powerUpElement.style.top = `${powerUp.y * 20}px`;
        gameContainer.appendChild(powerUpElement);
    }
}

// Fungsi untuk mengecek tabrakan dengan tubuh ular
function checkCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// Fungsi untuk mengecek tabrakan dengan penghalang
function checkObstacleCollision(head) {
    for (const obstacle of obstacles) {
        if (head.x === obstacle.x && head.y === obstacle.y) {
            return true;
        }
    }
    return false;
}

// Fungsi untuk mengakhiri game
function endGame() {
    clearInterval(gameInterval);
    finalScoreDisplay.textContent = score;
    gameOverDisplay.classList.remove('hidden');
}

// Fungsi untuk menempatkan makanan
function placeFood() {
    food.x = Math.floor(Math.random() * 20);
    food.y = Math.floor(Math.random() * 20);
}

// Fungsi untuk menempatkan penghalang
function placeObstacles() {
    obstacles = []; // Hapus penghalang sebelumnya
    const obstacleCount = Math.floor(level / 2) + 4; // Menambahkan lebih banyak penghalang dengan meningkatnya level
    for (let i = 0; i < obstacleCount; i++) {
        const obstacle = {
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20),
        };
        obstacles.push(obstacle);
    }
}

// Fungsi untuk menempatkan power-up secara acak
function placePowerUp() {
    // Ada kemungkinan 1 dari 3 setiap kali memakan makanan untuk muncul power-up
    if (Math.random() < 0.33) {
        powerUp = {
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20),
        };
    }
}

// Fungsi untuk mengaktifkan efek power-up
function activatePowerUp() {
    const powerUpType = Math.floor(Math.random() * 3); // Ada 3 jenis power-up
    switch (powerUpType) {
        case 0: // Kecepatan ekstra
            clearInterval(gameInterval);
            gameInterval = setInterval(moveSnake, speed *5); // Kecepatan meningkat
            resetPowerUpEffect(5000); // Efek bertahan selama 5 detik
            break;
        case 1: // Tak terkalahkan
            isPowerUpActive = true;
            resetPowerUpEffect(100000); // Efek bertahan selama 5 detik
            break;
        case 2: // Pertumbuhan cepat
            growSnake(); // Ular akan tumbuh lebih panjang
            break;
    }
}

// Fungsi untuk menumbuhkan ular dengan cepat
function growSnake() {
    for (let i = 0; i < 10; i++) {
        const tail = snake[snake.length - 1];
        snake.push({ x: tail.x, y: tail.y });
    }
}

// Fungsi untuk mengatur ulang efek power-up setelah waktu tertentu
function resetPowerUpEffect(duration) {
    clearTimeout(powerUpEffectTimeout);
    powerUpEffectTimeout = setTimeout(() => {
        clearInterval(gameInterval);
        gameInterval = setInterval(moveSnake, speed); // Kembali ke kecepatan normal
        isPowerUpActive = false;
    }, duration);
}

// Mengendalikan arah ular
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && direction.y !== 1) {
        direction = { x: 0, y: -1 };
    } else if (event.key === 'ArrowDown' && direction.y !== -1) {
        direction = { x: 0, y: 1 };
    } else if (event.key === 'ArrowLeft' && direction.x !== 1) {
        direction = { x: -1, y: 0 };
    } else if (event.key === 'ArrowRight' && direction.x !== -1) {
        direction = { x: 1, y: 0 };
    }
});

// Menjalankan game saat tombol start ditekan
startButton.addEventListener('click', startGame);
