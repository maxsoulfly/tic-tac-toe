const GameBoard = (function () {
	let board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

	const getBoard = () => board;
	const getCell = (cellNumber) => board[cellNumber];
	const updateACell = (cellNumber, value) => {
		board[cellNumber] = value;
	};

	const resetBoard = () => {
		for (let i = 0; i < board.length; i++) {
			board[i] = "";
		}
	};

	const printBoard = () => {
		for (let i = 0; i < board.length; i += 3) {
			console.log(` ${board[i]} | ${board[i + 1]} | ${board[i + 2]} `);
			if (i == 0 || i == 3) console.log(`---+---+---`);
		}
	};

	return {
		getBoard,
		updateACell,
		resetBoard,
		printBoard,
	};
})();

GameBoard.printBoard();
