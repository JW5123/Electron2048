const boardSize = 4;
let board = [];
let score = 0;

const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-button');
const gameOverElement = document.getElementById('game-over');
const popupRestartButton = document.getElementById('popup-restart');

function createBoard() {
    board = [];
    gameBoard.innerHTML = '';
    for (let i = 0; i < boardSize * boardSize; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        gameBoard.appendChild(tile);
        board.push(0);
    }
    addNumber();
    addNumber();
    updateBoard();
}

function addNumber() {
    let empty = board.map((v, i) => v === 0 ? i : null).filter(v => v !== null);
    if (empty.length === 0) return;
    let index = empty[Math.floor(Math.random() * empty.length)];
    board[index] = Math.random() > 0.9 ? 4 : 2;
}

function updateBoard() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach((tile, i) => {
        tile.textContent = board[i] === 0 ? '' : board[i];
        tile.style.background = getTileColor(board[i]);
    });
    scoreElement.textContent = `Score: ${score}`;
}

function getTileColor(value) {
    const colors = {
        0: '#cdc1b4', 2: '#eee4da', 4: '#ede0c8',
        8: '#f2b179', 16: '#f59563', 32: '#f67c5f',
        64: '#f65e3b', 128: '#edcf72', 256: '#edcc61',
        512: '#edc850', 1024: '#edc53f', 2048: '#edc22e'
    };
    return colors[value] || '#3c3a32';
}

function move(direction) {
    if (isGameOver) return;

    let moved = false;

    const getLine = (i) => {
        let line = [];
        for (let j = 0; j < boardSize; j++) {
            switch (direction) {
                case 'left': line.push(board[i * boardSize + j]); break;
                case 'right': line.push(board[i * boardSize + (boardSize - 1 - j)]); break;
                case 'up': line.push(board[j * boardSize + i]); break;
                case 'down': line.push(board[(boardSize - 1 - j) * boardSize + i]); break;
            }
        }
        return line;
    };

    const setLine = (i, newLine) => {
        for (let j = 0; j < boardSize; j++) {
            let index;
            switch (direction) {
                case 'left': index = i * boardSize + j; break;
                case 'right': index = i * boardSize + (boardSize - 1 - j); break;
                case 'up': index = j * boardSize + i; break;
                case 'down': index = (boardSize - 1 - j) * boardSize + i; break;
            }

            if (board[index] !== newLine[j]) moved = true;
            board[index] = newLine[j];
        }
    };

    const combine = (line) => {
        let newLine = line.filter(n => n !== 0);
        for (let i = 0; i < newLine.length - 1; i++) {
            if (newLine[i] === newLine[i + 1]) {
                newLine[i] *= 2;
                score += newLine[i];
                newLine[i + 1] = 0;
            }
        }
        return newLine.filter(n => n !== 0).concat(Array(boardSize).fill(0)).slice(0, boardSize);
    };

    for (let i = 0; i < boardSize; i++) {
        const line = getLine(i);
        const newLine = combine(line);
        setLine(i, newLine);
    }

    if (moved) {
        addNumber();
        updateBoard();
        checkGameOver();
    }
}

function checkGameOver() {
    if (board.includes(0)) return;

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const val = board[i * boardSize + j];
            if (
                (j < boardSize - 1 && val === board[i * boardSize + (j + 1)]) ||
                (i < boardSize - 1 && val === board[(i + 1) * boardSize + j])
            ) {
                return;
            }
        }
    }

    gameOverElement.classList.add('active');
    isGameOver = true;
}

let isGameOver = false;

function resetGame() {
    score = 0;
    isGameOver = false;
    gameOverElement.classList.remove('active');
    createBoard();
}

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': move('up'); break;
        case 'ArrowDown': move('down'); break;
        case 'ArrowLeft': move('left'); break;
        case 'ArrowRight': move('right'); break;
    }
});

restartButton.addEventListener('click', () => {
    resetGame();
});

popupRestartButton.addEventListener('click', () => {
    resetGame();
});

resetGame();