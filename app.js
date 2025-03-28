const GameBoard = (function () {
    const emptyCellMark = '';
    let board = Array(9).fill(emptyCellMark);

    const getBoard = () => board;
    const getCell = (index) => board[index];
    const getEmptyCellMark = () => emptyCellMark;
    const updateACell = (index, value) => {
        board[index] = value;
    };
    const isEmptyCell = (index) => {
        if (getCell(index) === '') return true;
        return false;
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
    };

    return {
        getBoard,
        updateACell,
        resetBoard,
        getCell,
        isEmptyCell,
        getEmptyCellMark,
    };
})();

const createPlayer = (name, mark, aiPlayer = false) => {
    const getName = () => name;
    const getMark = () => mark;
    const isAI = () => aiPlayer;
    return {
        getName,
        getMark,
        isAI,
    };
};

// GameController
const GameController = (function () {
    let player1;
    let player2;

    let activePlayer = player1;
    let gameOver = false;

    const setupPlayers = (name1, isAI1, name2, isAI2) => {
        player1 = createPlayer(name1 || 'Player 1', 'X', isAI1);
        player2 = createPlayer(name2 || 'Player 2', 'O', isAI2);
        activePlayer = player1;
    };

    const getActivePlayer = () => activePlayer;
    const getPlayers = () => [player1, player2];

    const togglePlayer = () => {
        if (activePlayer === player1) activePlayer = player2;
        else activePlayer = player1;
    };

    const playRound = (index) => {
        if (gameOver) return false;

        const mark = getActivePlayer().getMark();
        if (!GameBoard.isEmptyCell(index)) return 'invalid';

        GameBoard.updateACell(index, mark);

        if (checkWinner(mark)) return 'win';
        if (checkDraw()) return 'draw';

        if (!gameOver) togglePlayer();
        return 'next';
    };

    const checkDraw = () => {
        const board = GameBoard.getBoard();

        if (!board.includes('') && !gameOver) {
            gameOver = true;
            return true;
        }
        return false;
    };
    const checkWinner = (mark) => {
        console.log('Checking for winner with mark:', mark);
        console.log('Current board:', GameBoard.getBoard());
        const winningCombinations = [
            [0, 1, 2], // Top row
            [3, 4, 5], // Middle row
            [6, 7, 8], // Bottom row
            [0, 3, 6], // Left column
            [1, 4, 7], // Middle column
            [2, 5, 8], // Right column
            [0, 4, 8], // Diagonal (top-left to bottom-right)
            [2, 4, 6], // Diagonal (top-right to bottom-left)
        ];

        const board = GameBoard.getBoard();

        for (let combo of winningCombinations) {
            const [a, b, c] = combo;
            if (
                board[a] === mark &&
                board[a] === board[b] &&
                board[a] === board[c]
            ) {
                gameOver = true;
                DisplayController.colorWinningMove(combo);

                return true;
            }
        }

        return false;
    };

    const resetGame = () => {
        gameOver = false;
        GameBoard.resetBoard();
        activePlayer = player1;
    };

    const isGameOver = () => gameOver;

    return {
        setupPlayers,
        getActivePlayer,
        getPlayers,
        togglePlayer,
        playRound,
        resetGame,
        isGameOver,
    };
})();

// GameLoop
const GameLoop = (function () {
    // Private: any setup or helpers
    let aiTimeout = null;

    const getPlayerInput = (id) => {
        const name = document.querySelector(`#${id}`).value;
        const isAI = document.querySelector(`#${id}AI`).checked;
        return { name, isAI };
    };
    const maybeTriggerAI = () => {
        if (
            !GameController.isGameOver() &&
            GameController.getActivePlayer().isAI()
        ) {
            if (aiTimeout) clearTimeout(aiTimeout); // 🧼 cancel previous

            DisplayController.disableBoard();
            DisplayController.setStatus('AI is thinking...');

            aiTimeout = setTimeout(() => {
                AIController.makeMove(
                    GameController.getActivePlayer(),
                    GameBoard.getBoard()
                );
            }, 300);
        } else {
            DisplayController.enableBoard();
        }
    };
    const start = () => {
        if (aiTimeout) clearTimeout(aiTimeout);
        aiTimeout = null;

        const { name: name1, isAI: isAI1 } = getPlayerInput('player1');
        const { name: name2, isAI: isAI2 } = getPlayerInput('player2');
        GameController.setupPlayers(name1, isAI1, name2, isAI2);

        GameController.resetGame();
        DisplayController.printBoard();
        DisplayController.gameStart(GameController.getActivePlayer().getName());
        maybeTriggerAI();
    };

    const step = (index) => {
        const playerName = GameController.getActivePlayer().getName();
        const result = GameController.playRound(index);

        DisplayController.printBoard();
        DisplayController.updateBoard();
        switch (result) {
            case 'invalid':
                DisplayController.invalid();
                break;

            case 'win':
                DisplayController.win(playerName);
                break;

            case 'draw':
                DisplayController.draw();
                break;

            case 'next':
                const nextPlayerName =
                    GameController.getActivePlayer().getName();
                DisplayController.nextTurn(nextPlayerName);

                maybeTriggerAI();
                break;
        }
    };
    return {
        start,
        step,
    };
})();

// DisplayController
const DisplayController = (function () {
    // Console + status messages
    const invalid = () => {
        const message = 'Cell already taken!';
        console.log(message);
        setStatus(message);
    };
    const draw = () => {
        const message = "<b>It's a draw!</b> Click 'New Game' to play again.";
        console.log(message);
        setStatus(message);
        disableBoard();
    };
    const win = (playerName) => {
        const message = `<b>${playerName} wins!</b> Click 'New Game' to play again.`;
        console.log(message);
        setStatus(message);
        disableBoard();
    };
    const nextTurn = (playerName) => {
        const message = `${playerName} turn!`;
        console.log(message + ' Tip: Use GameLoop.step(index) to play.');
        setStatus(message);
    };
    const welcome = () => {
        const message = 'Hi there! Welcome to Tic-Tac-Toe!';
        console.log(message + ' Use GameLoop.start() to play.');
        setStatus(message);
    };
    const gameStart = (playerName) => {
        const message = `New game started! ${playerName}'s turn.`;
        console.log(message + '\nTip: Use GameLoop.step(index) to play.');
        setStatus(message);
    };
    const restart = () => {
        console.log('Use GameLoop.start() to reset.');
        setStatus("Click 'New Game' to reset.");
    };
    const info = (message) => {
        console.log(message);
        setStatus(message);
    };

    const setStatus = (message) => {
        document.querySelector('#status').innerHTML = message;
    };

    // User Interface
    const formatRow = (board, startIndex) => {
        return `${board[startIndex] || ' '} | ${
            board[startIndex + 1] || ' '
        } | ${board[startIndex + 2] || ' '} `;
    };
    const printBoard = () => {
        const board = GameBoard.getBoard();
        console.log('  0   1   2');
        let row = 0;
        for (let index = 0; index < board.length; index += 3) {
            console.log(`${row} ${formatRow(board, index)}`);
            if (index == 0 || index == 3) console.log(` ---+---+---`);
            row++;
        }
    };

    const renderBoard = () => {
        const gameBoardElement = document.querySelector('#gameBoard');
        gameBoardElement.innerHTML = '';

        const board = GameBoard.getBoard();

        for (let index = 0; index < board.length; index++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = index;
            cell.textContent = GameBoard.getCell(index);
            gameBoardElement.appendChild(cell);
        }
    };

    const updateBoard = () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell) => {
            const index = cell.dataset.index;
            cell.textContent = GameBoard.getCell(index);
            if (!GameBoard.isEmptyCell(index)) {
                cell.classList.add('filled');
            }
        });
    };

    const colorWinningMove = (winningCombo) => {
        winningCombo.forEach((index) => {
            const cell = document.querySelector(`[data-index="${index}"]`);
            cell.classList.add('win');
        });
    };

    const disableBoard = () => {
        const gameBoard = document.querySelector('#gameBoard');
        gameBoard.classList.add('disabled');
    };
    const enableBoard = () => {
        const gameBoard = document.querySelector('#gameBoard');
        gameBoard.classList.remove('disabled');
    };

    return {
        invalid,
        win,
        draw,
        printBoard,
        welcome,
        gameStart,
        nextTurn,
        restart,
        info,
        setStatus,

        renderBoard,
        updateBoard,
        colorWinningMove,
        disableBoard,
        enableBoard,
    };
})();

// InputController
const InputController = (function () {
    const init = () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell) => {
            const index = cell.dataset.index;
            cell.addEventListener('click', () => {
                GameLoop.step(index);
            });
        });

        const resetButtonBtn = document.querySelector('#resetButton');
        resetButtonBtn.addEventListener('click', () => {
            GameLoop.start();
            DisplayController.enableBoard();
            DisplayController.renderBoard();
            InputController.init();
        });
    };
    return { init };
})();

// AIController
const AIController = (function () {
    const makeMove = (currentPlayer, board, strategy) => {
        if (!GameController.isGameOver() && currentPlayer.isAI()) {
            const index = randomMove(board);
            GameLoop.step(index);
            console.log('AI Player Move');
        }
    };
    const randomMove = (board) => {
        // Create an array of all possible cell indices on the board
        const allIndices = Array.from({ length: board.length }, (_, i) => i);

        // Filter the list to keep only the indices of empty cells
        const availableIndices = allIndices.filter((index) =>
            GameBoard.isEmptyCell(index)
        );

        // Pick a random index from the list of available moves
        const randomIndex = Math.floor(Math.random() * availableIndices.length);

        return availableIndices[randomIndex];
    };

    const getWinner = (board) => {
        const winningCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (const [a, b, c] of winningCombos) {
            if (
                board[a] !== '' &&
                board[a] === board[b] &&
                board[a] === board[c]
            ) {
                return board[a]; // returns "X" or "O"
            }
        }
        return null; // no winner yet
    };
    const isDraw = (board) => {
        return board.every((cell) => cell !== '') && getWinner(board) === null;
    };
    const isEmptyCellSim = (board, index) => {
        return board[index] === GameBoard.getEmptyCellMark();
    };
    const minimaxMove = (board, aiMark, humanMark) => {};

    const minimax = (board, depth, isMaximizing, aiMark, humanMark) => {
        // Base case: Check if the game is over and return a score
        const winner = getWinner(board);
        if (winner === 'O') return +1; // AI wins
        if (winner === 'X') return -1; // Human wins
        if (isDraw(board)) return 0; // Draw

        // Determine the current player's mark and initialize bestScore
        const mark = isMaximizing ? aiMark : humanMark;
        let bestScore = isMaximizing ? -Infinity : +Infinity;

        // Get all available moves
        const allIndices = Array.from({ length: board.length }, (_, i) => i);
        const availableIndices = allIndices.filter((index) =>
            isEmptyCellSim(board, index)
        );

        // Simulate each move and recursively calculate scores
        availableIndices.forEach((index) => {
            board[index] = mark; // Make a move
            const score = minimax(
                board,
                depth + 1,
                !isMaximizing,
                aiMark,
                humanMark
            );
            board[index] = GameBoard.getEmptyCellMark(); // Undo the move
            // Update bestScore based on maximizing or minimizing
            bestScore = isMaximizing
                ? Math.max(bestScore, score)
                : Math.min(bestScore, score);
        });
        return bestScore;
    };

    const hybridMove = () => {};

    return {
        makeMove,
    };
})();

// Init
DisplayController.disableBoard();
DisplayController.renderBoard();
InputController.init();
