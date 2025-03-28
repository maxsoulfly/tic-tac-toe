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
    const getOpponent = (player) => {
        return player === player1 ? player2 : player1;
    };
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
        getOpponent,
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
        const consoleMessage = 'Cell already taken!';
        const statusMessage = '<p>Cell already taken!</p>';
        console.log(consoleMessage);
        setStatus(statusMessage);
    };

    const draw = () => {
        const consoleMessage = "It's a draw! Click 'New Game' to play again.";
        const statusMessage =
            "<h3>It's a draw!</h3><p>Click 'New Game' to play again.<p>";
        console.log(consoleMessage);
        setStatus(statusMessage);
        disableBoard();
    };

    const win = (playerName) => {
        const consoleMessage = `${playerName} wins! Click 'New Game' to play again.`;
        const statusMessage = `<h3>${playerName} wins!</h3><p>Click 'New Game' to play again.</p>`;
        console.log(consoleMessage);
        setStatus(statusMessage);
        disableBoard();
    };

    const nextTurn = (playerName) => {
        const consoleMessage = `${playerName}'s turn! Tip: Use GameLoop.step(index) to play.`;
        const statusMessage = `<p>${playerName}'s turn!</p>`;
        console.log(consoleMessage);
        setStatus(statusMessage);
    };

    const welcome = () => {
        const consoleMessage =
            'Hi there! Welcome to Tic-Tac-Toe! Use GameLoop.start() to play.';
        const statusMessage = '<h3>Hi there! Welcome to Tic-Tac-Toe!</h3>';
        console.log(consoleMessage);
        setStatus(statusMessage);
    };

    const gameStart = (playerName) => {
        const consoleMessage = `New game started! ${playerName}'s turn. Tip: Use GameLoop.step(index) to play.`;
        const statusMessage = `<h4>New game started!</h4><h3>${playerName}'s turn.</h3>`;
        console.log(consoleMessage);
        setStatus(statusMessage);
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
    // Utility Functions
    const pickRandom = (array) => {
        return array[Math.floor(Math.random() * array.length)];
    };

    const getAvailableIndices = (board) => {
        return Array.from({ length: board.length }, (_, i) => i).filter(
            (index) => isEmptyCellSim(board, index)
        );
    };

    const isEmptyCellSim = (board, index) => {
        return board[index] === GameBoard.getEmptyCellMark();
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

    // Move Strategies
    const randomMove = (board) => {
        const availableIndices = getAvailableIndices(board);
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        return availableIndices[randomIndex];
    };

    const greedyMove = (board, aiMark) => {
        const availableIndices = getAvailableIndices(board);

        for (const index of availableIndices) {
            board[index] = aiMark;

            if (getWinner(board) === aiMark) {
                board[index] = GameBoard.getEmptyCellMark(); // undo
                return index;
            }

            board[index] = GameBoard.getEmptyCellMark(); // undo
        }

        // No winning move, make a random move instead
        return pickRandom(availableIndices);
    };

    const minimaxMove = (board, aiMark, humanMark) => {
        let bestScore = -Infinity;
        let bestMove = null;

        const availableIndices = getAvailableIndices(board);
        availableIndices.forEach((index) => {
            board[index] = aiMark;
            const score = minimax(
                board,
                0, // depth starts at 0
                false, // human's turn next
                aiMark,
                humanMark
            );
            board[index] = GameBoard.getEmptyCellMark(); // Undo the move
            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }
        });
        return bestMove;
    };

    const minimax = (board, depth, isMaximizing, aiMark, humanMark) => {
        const winner = getWinner(board);
        if (winner === aiMark) return +1; // AI wins
        if (winner === humanMark) return -1; // Human wins
        if (isDraw(board)) return 0; // Draw

        const mark = isMaximizing ? aiMark : humanMark;
        let bestScore = isMaximizing ? -Infinity : +Infinity;

        const availableIndices = getAvailableIndices(board);
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
            bestScore = isMaximizing
                ? Math.max(bestScore, score)
                : Math.min(bestScore, score);
        });
        return bestScore;
    };

    // Main AI Logic
    const makeMove = (currentPlayer, board) => {
        if (!GameController.isGameOver() && currentPlayer.isAI()) {
            const aiMark = currentPlayer.getMark();
            const humanMark =
                GameController.getOpponent(currentPlayer).getMark();

            const available = getAvailableIndices(board);
            let index;

            if (available.length === 9) {
                index = randomMove(board);
            } else {
                const strategies = ['minimax', 'greedy', 'random'];
                const strategy = pickRandom(strategies);

                index =
                    strategy === 'minimax'
                        ? minimaxMove(board, aiMark, humanMark)
                        : strategy === 'greedy'
                        ? greedyMove(board, aiMark)
                        : randomMove(board);

                console.log(`AI Strategy: ${strategy}`);
            }
            GameLoop.step(index);
            console.log('AI Player Move');
        }
    };

    return {
        makeMove,
        randomMove,
        greedyMove,
        minimaxMove,
    };
})();

// Init
DisplayController.disableBoard();
DisplayController.renderBoard();
InputController.init();
