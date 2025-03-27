const GameBoard = (function () {
	let board = ["", "", "", "", "", "", "", "", ""];

	const getBoard = () => board;
	const getCell = (index) => board[index];
	const updateACell = (index, value) => {
		board[index] = value;
	};
	const isEmptyCell = (index) => {
		if (getCell(index) === "") return true;
		return false;
	};

	const resetBoard = () => {
		for (let i = 0; i < board.length; i++) {
			board[i] = "";
		}
	};

	return {
		getBoard,
		updateACell,
		resetBoard,
		getCell,
		isEmptyCell,
	};
})();

const createPlayer = (name, mark) => {
	const getName = () => name;
	const getMark = () => mark;
	return {
		getName,
		getMark,
	};
};

// GameController
const GameController = (function () {
	const player1 = createPlayer("player1", "X");
	const player2 = createPlayer("player2", "O");

	let activePlayer = player1;
	let gameOver = false;

	const getActivePlayer = () => activePlayer;
	const getPlayers = () => [player1, player2];

	const togglePlayer = () => {
		if (activePlayer === player1) activePlayer = player2;
		else activePlayer = player1;
	};

	const playRound = (index) => {
		if (gameOver) return false;

		const mark = getActivePlayer().getMark();
		if (!GameBoard.isEmptyCell(index)) return "invalid";

		GameBoard.updateACell(index, mark);
		DisplayController.printBoard();

		if (checkWinner(mark)) return "win";
		if (checkDraw()) return "draw";

		if (!gameOver) togglePlayer();
		return "next";
	};

	const checkDraw = () => {
		const board = GameBoard.getBoard();

		if (!board.includes("") && !gameOver) {
			gameOver = true;
			return true;
		}
		return false;
	};
	const checkWinner = (mark) => {
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
	const start = () => {
		GameController.resetGame();
		DisplayController.printBoard();
		DisplayController.gameStart();
	};

	const step = (index) => {
		const result = GameController.playRound(index);
		const playerName = GameController.getActivePlayer().getName();
		switch (result) {
			case "invalid":
				DisplayController.invalid();
				break;

			case "win":
				DisplayController.win(playerName);
				DisplayController.restart();
				break;

			case "draw":
				DisplayController.draw();
				DisplayController.restart();
				break;

			default:
				break;
		}

		DisplayController.printBoard();
		DisplayController.updateBoard();
		DisplayController.nextTurn(playerName);
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
		const message = "Cell already taken!";
		console.log(message);
		DisplayController.setStatus(message);
	};
	const draw = () => {
		const message = "It's a draw!";
		console.log(message);
		DisplayController.setStatus(message);
	};
	const win = (playerName) => {
		const message = `Player ${playerName} wins!`;
		console.log(message);
		DisplayController.setStatus(message);
	};
	const nextTurn = (playerName) => {
		const message = `${playerName} turn!`;
		console.log(message + " Tip: Use GameLoop.step(index) to play.");
		DisplayController.setStatus(message);
	};
	const welcome = () => {
		const message = "Hi there! Welcome to Tic-Tac-Toe!";
		console.log(message + " Use GameLoop.start() to play.");
		DisplayController.setStatus(message);
	};
	const gameStart = () => {
		console.log("Game started. Use GameLoop.step(index) to play.");
		DisplayController.setStatus("New game started!");
	};
	const restart = () => {
		console.log("Use GameLoop.start() to reset.");
		DisplayController.setStatus("Click 'New Game' to reset.");
	};
	const info = (message) => {
		console.log(message);
		DisplayController.setStatus(message);
	};

	const setStatus = (message) => {
		document.querySelector("#status").textContent  = message;
	}

	// User Interface
	const formatRow = (board, startIndex) => {
		return `${board[startIndex]} | ${board[startIndex + 1]} | ${
			board[startIndex + 2]
		} `;
	};
	const printBoard = () => {
		const board = GameBoard.getBoard();
		console.log("  0   1   2");
		let row = 0;
		for (let index = 0; index < board.length; index += 3) {
			console.log(`${row} ${formatRow(board, index)}`);
			if (index == 0 || index == 3) console.log(` ---+---+---`);
			row++;
		}
	};

	const renderBoard = () => {
		const gameBoardElement = document.querySelector("#gameBoard");
		gameBoardElement.innerHTML = "";

		const board = GameBoard.getBoard();

		for (let index = 0; index < board.length; index++) {
			const cell = document.createElement("div");
			cell.classList.add("cell");
			cell.dataset.index = index;
			cell.textContent = GameBoard.getCell(index);
			gameBoardElement.appendChild(cell);
		}
	};

	const updateBoard = () => {
		const cells = document.querySelectorAll(".cell");
		cells.forEach((cell) => {
			const index = cell.dataset.index;
			cell.textContent = GameBoard.getCell(index);
		});
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
	};
})();

// InputController
const InputController = (function () {
	const init = () => {
		const cells = document.querySelectorAll(".cell");
		cells.forEach((cell) => {
			const index = cell.dataset.index;
			cell.addEventListener("click", () => {
				GameLoop.step(index);
			});
		});

		const resetButtonBtn = document.querySelector("#resetButton");
		resetButtonBtn.addEventListener("click", () => {
			GameLoop.start();
			InputController.init();
			DisplayController.renderBoard();
		});
	};
	return { init };
})();

// Init
DisplayController.renderBoard();
InputController.init();
