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

	const formatRow = (startIndex) => {
		return `${board[startIndex]} | ${board[startIndex + 1]} | ${
			board[startIndex + 2]
		} `;
	};
	const printBoard = () => {
		console.log("  0   1   2");
		let row = 0;
		for (let i = 0; i < board.length; i += 3) {
			console.log(`${row} ${formatRow(i)}`);
			if (i == 0 || i == 3) console.log(` ---+---+---`);
			row++;
		}
	};

	return {
		getBoard,
		updateACell,
		resetBoard,
		printBoard,
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
		GameBoard.printBoard();

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

const GameLoop = (function () {
	// Private: any setup or helpers
	const start = () => {
		GameController.resetGame();
		GameBoard.printBoard();

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
				break;

			case "draw":
				DisplayController.draw();
				break;

			default:
				break;
		}
		DisplayController.printBoard();
		DisplayController.nextTurn(playerName);
	};
	return {
		start,
		step,
	};
})();

const DisplayController = (function () {
	const invalid = () => {
		console.log("Cell already taken!");
	};
	const draw = () => {
		console.log("It's a draw!");
	};
	const win = (playerName) => {
		console.log(`Player ${playerName} wins! Use GameLoop.start to reset.`);
	};
	const nextTurn = (playerName) => {
		console.log(
			`${playerName} turn! Tip: Use GameLoop.step(index) to play.`
		);
	};
	const printBoard = () => {
		GameBoard.printBoard();
	};
	const welcome = () => {
		console.log(
			"Hi there! Welcome to Tic-Tac-Toe Use GameLoop.start() to play."
		);
	};
	const gameStart = () => {
		console.log("Game started. Use GameLoop.step(index) to play.");
	};
	const info = (msg) => {
		console.log(msg);
	};

	return {
		invalid,
		win,
		draw,
		printBoard,
		welcome,
		gameStart,
		nextTurn,
		info,
	};
})();

DisplayController.welcome();
