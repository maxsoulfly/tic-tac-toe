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
	};
})();

GameBoard.printBoard();
