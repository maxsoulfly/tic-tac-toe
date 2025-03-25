const GameBoard = (function () {
	let board = ["X", "X", "X", "", "", "", "", "", ""];

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

	const getActivePlayer = () => activePlayer;
	const getPlayers = () => [player1, player2];

	const togglePlayer = () => {
		if (activePlayer === player1) activePlayer = player2;
		else activePlayer = player1;
	};

	const playRound = (index) => {
		const mark = getActivePlayer().getMark();
		if (!GameBoard.isEmptyCell(index)) return false;
		GameBoard.updateACell(index, mark);
		GameBoard.printBoard();
		togglePlayer();
		checkWinner();
		return true;
	};

	const checkWinner = () => {
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
				!GameBoard.isEmptyCell(board[a]) &&
				board[a] === board[b] &&
				board[a] === board[c]
			) {
				console.log(`Player ${board[a]} wins!`);
			}
		}
	};

	const init = () => {};

	return {
		init,
		getActivePlayer,
		getPlayers,
		togglePlayer,
		playRound,
	};
})();

GameBoard.printBoard();
