// Gameboard Module
const Gameboard = (function() {
    let board = Array.from({ length: 3 }, () => Array(3).fill(""));

    const getBoard = () => board;
    const resetBoard = () => board = Array.from({ length: 3 }, () => Array(3).fill(""));
    const placeMarker = (row, col, marker) => {
        if (board[row][col] === "") {
            board[row][col] = marker;
            return true;
        }
        return false;
    };

    const isFull = () => board.every(row => row.every(cell => cell !== ""));

    return { getBoard, resetBoard, placeMarker, isFull };
})();

// Player Factory
const createPlayer = (name, marker) => {
    let score = 0;
    const getScore = () => score;
    const incrementScore = () => score++;
    return { name, marker, getScore, incrementScore };
};

// Game Controller Module
const GameController = (function() {
    const player1 = createPlayer("X", "X");
    const player2 = createPlayer("O", "O");
    let currentPlayer = player1;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        UIController.updateTurnIndicator();
    };

    const getCurrentPlayer = () => currentPlayer;

    const checkWin = () => {
        const board = Gameboard.getBoard();
        const winPatterns = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
                return currentPlayer;
            }
        }
        return null;
    };

    const playTurn = (row, col) => {
        if (Gameboard.placeMarker(row, col, currentPlayer.marker)) {
            const winner = checkWin();
            if (winner) {
                winner.incrementScore();
                UIController.updateScores();
                UIController.displayResult(`${winner.name} wins!`);
                Gameboard.resetBoard();
                UIController.updateDisplay();
            } else if (Gameboard.isFull()) {
                UIController.displayResult("It's a draw!");
                Gameboard.resetBoard();
                UIController.updateDisplay();
            } else {
                switchPlayer();
            }
        } else {
            alert("Cell already occupied! Try again.");
        }
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        UIController.updateDisplay();
    };

    return { playTurn, getCurrentPlayer, resetGame, player1, player2 };
})();

// UI Controller
const UIController = (function() {
    const cells = document.querySelectorAll('.cell');
    const turnIndicator = document.createElement('div');
    turnIndicator.id = 'turnIndicator';
    document.body.prepend(turnIndicator);

    const resetButton = document.createElement('button');
    resetButton.id = 'resetButton';
    resetButton.textContent = 'Reset Game';
    resetButton.addEventListener('click', GameController.resetGame);
    document.body.appendChild(resetButton);

    const resultDisplay = document.createElement('div');
    resultDisplay.id = 'resultDisplay';
    resultDisplay.style.marginTop = '10px';
    document.body.appendChild(resultDisplay);

    const scoreDisplay = document.createElement('div');
    scoreDisplay.id = 'scoreDisplay';
    scoreDisplay.style.marginTop = '10px';
    document.body.appendChild(scoreDisplay);

    const updateTurnIndicator = () => {
        turnIndicator.textContent = `${GameController.getCurrentPlayer().name}'s turn`;
    };

    const displayResult = (message) => {
        resultDisplay.textContent = message;
    };

    const updateScores = () => {
        scoreDisplay.textContent = `X: ${GameController.player1.getScore()} | O: ${GameController.player2.getScore()}`;
    };

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            GameController.playTurn(row, col);
            updateDisplay();
        });
    });

    const updateDisplay = () => {
        const board = Gameboard.getBoard();
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            cell.textContent = board[row][col];
        });
        updateTurnIndicator();
        updateScores();
    };

    updateTurnIndicator();
    updateScores();
    return { updateDisplay, updateTurnIndicator, displayResult, updateScores };
})();
