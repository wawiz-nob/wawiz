let randomNumber;
let attempts = 0;
let totalGames = 0;
let totalWins = 0;
let guessHistory = [];

const submitButton = document.getElementById('submit');
const guessInput = document.getElementById('guess');
const messageDisplay = document.getElementById('message');
const restartButton = document.getElementById('restart');
const historyDisplay = document.getElementById('history');
const statsDisplay = document.getElementById('stats');
const difficultySelect = document.getElementById('difficulty');

// Fungsi untuk memulai game baru
function startGame() {
    const difficulty = difficultySelect.value;
    if (difficulty === 'easy') {
        randomNumber = Math.floor(Math.random() * 50) + 1; // 1-50
    } else if (difficulty === 'medium') {
        randomNumber = Math.floor(Math.random() * 100) + 1; // 1-100
    } else {
        randomNumber = Math.floor(Math.random() * 200) + 1; // 1-200
    }
    attempts = 0;
    guessHistory = [];
    messageDisplay.textContent = '';
    guessInput.value = '';
    historyDisplay.textContent = 'Histori Tebakan: ';
    totalGames++;
    updateStats();
}

// Memperbarui statistik
function updateStats() {
    statsDisplay.textContent = `Total Permainan: ${totalGames} | Kemenangan: ${totalWins}`;
}

// Event listener untuk mengirim tebakan
submitButton.addEventListener('click', () => {
    const userGuess = Number(guessInput.value);
    attempts++;

    guessHistory.push(userGuess); // Menyimpan tebakan
    historyDisplay.textContent = `Histori Tebakan: ${guessHistory.join(', ')}`; // Menampilkan histori

    messageDisplay.classList.remove('visible'); // Menyembunyikan pesan sebelum memperbarui
    setTimeout(() => {
        if (userGuess === randomNumber) {
            messageDisplay.textContent = `Selamat! Anda berhasil menebak angka ${randomNumber} dalam ${attempts} percobaan!`;
            messageDisplay.classList.add('visible');
            submitButton.disabled = true; // Menonaktifkan tombol setelah menebak dengan benar
            restartButton.style.display = 'block'; // Menampilkan tombol main lagi
            totalWins++; // Menambah jumlah kemenangan
            updateStats();
        } else if (userGuess < randomNumber) {
            messageDisplay.textContent = 'Tebakan Anda terlalu rendah. Coba lagi!';
            messageDisplay.classList.add('visible');
        } else {
            messageDisplay.textContent = 'Tebakan Anda terlalu tinggi. Coba lagi!';
            messageDisplay.classList.add('visible');
        }
    }, 300);
});

// Event listener untuk tombol main lagi
restartButton.addEventListener('click', () => {
    startGame(); // Memulai game baru
});

// Memulai game pertama kali saat halaman dimuat
startGame();
