const createOverlayCanvas = cellState => {
    const button = cellState[0];
    const canvas = button.firstChild;
    const c = canvas.getContext('2d');

    button.style.backgroundColor = SILVER_COLOR;
    c.clearRect(0, 0, canvas.width, canvas.height);

    const starShape = 'star';
    const starsCount = 5;
    let y = 20;

    const intervalId = setInterval(() => {
        c.clearRect(0, 0, canvas.width, canvas.height);
        y += 2;

        if (y >= canvas.height + 10) {
            clearInterval(intervalId);
            cleanCell(cellState);
            return;
        }

        for (let i = 0; i < starsCount; ++i) {
            const x = 20 + canvas.width / starsCount * i;

            const shape = {
                loc: {
                    x,
                    y
                },
                size: 10,
                name: starShape,
                color: COLORS_TABLE[starShape]
            }

            drawing[shape.name](c, shape);
        }

    }, 50);

    cellState[1] = '';
    cellState[2] = intervalId;
}


const initBoard = () => {
    BOARD_STATUS = [];
    const board = document.getElementById('board');
    board.innerHTML = '';

    for (let i = 0; i < BOARD_SIZE; ++i) {
        const boardRow = [];
        BOARD_STATUS.push(boardRow);

        const row = document.createElement('div');
        board.appendChild(row);

        for (let j = 0; j < BOARD_SIZE; ++j) {
            const button = document.createElement('div');
            row.append(button);
            button.style.backgroundColor = 'lightgoldenrodyellow';

            const canvas = document.createElement('canvas');
            button.appendChild(canvas);
            canvas.height = BOARD_SIZE_TO_CANVAS_SIZE[BOARD_SIZE];
            canvas.width = canvas.height;

            const c = canvas.getContext('2d');

            const cellState = [button, '', ''];
            boardRow.push(cellState);

            button.addEventListener('mouseenter', () => {
                if (dialogVisible() || cellState[2] !== '') {
                    return;
                }

                if (cellState[0].style.backgroundColor === SILVER_COLOR && cellState[1] !== '') {
                    return;
                }

                button.style.opacity = 0.4;
                button.style.cursor = 'pointer';
            });

            button.addEventListener('mouseleave', () => {
                button.style.opacity = 1;
                button.style.cursor = '';
            });

            button.addEventListener('click', () => {
                if (dialogVisible() || cellState[2] !== '') {
                    return;
                }

                if (cellState[0].style.backgroundColor === SILVER_COLOR && cellState[1] !== '') {
                    return;
                }

                if (cellState[1] !== '') {
                    createOverlayCanvas(cellState);
                    updateGameMetrics('totalDestroyedShapes');
                    return;
                }

                button.style.opacity = 1;
                button.style.cursor = '';

                drawing[CURRENT_SHAPE](c, createNewShape(canvas));
                cellState[1] = CURRENT_SHAPE;

                updateCurrentShape();
                updateBoard(i, j);
            });
        }
    }

}

const updateBoard = (row, column) => {
    checkGameLost();

    const enteredShape = BOARD_STATUS[row][column][1];

    let connectedRowCells = 0;
    let connectedColumnCells = 0;
    let connectedDiagonal1Cells = 0;
    let connectedDiagonal2Cells = 0;

    for (let i = 0; i < BOARD_STATUS.length; ++i) {
        if (BOARD_STATUS[row][i][1] === enteredShape) {
            ++connectedRowCells;
        }

        if (BOARD_STATUS[i][column][1] === enteredShape) {
            ++connectedColumnCells;
        }

        if (row === column && BOARD_STATUS[i][i][1] === enteredShape) {
            ++connectedDiagonal1Cells;
        }

        if (row + column === BOARD_STATUS.length - 1 && BOARD_STATUS[i][BOARD_STATUS.length - 1 - i][1] === enteredShape) {
            ++connectedDiagonal2Cells;
        }
    }

    const cells = [];
    for (let i = 0; i < BOARD_STATUS.length; ++i) {
        if (connectedRowCells === BOARD_STATUS.length) {
            cells.push(BOARD_STATUS[row][i]);
        }

        if (connectedColumnCells === BOARD_STATUS.length) {
            cells.push(BOARD_STATUS[i][column]);
        }

        if (connectedDiagonal1Cells === BOARD_STATUS.length) {
            cells.push(BOARD_STATUS[i][i]);
        }

        if (connectedDiagonal2Cells === BOARD_STATUS.length) {
            cells.push(BOARD_STATUS[i][BOARD_STATUS.length - 1 - i]);
        }
    }

    const color = cells.some(x => x[0].style.backgroundColor === SILVER_COLOR) ? SILVER_COLOR : GOLD_COLOR;
    const colorName = color === GOLD_COLOR ? 'Golden' : 'Silver';

    if (connectedRowCells === BOARD_STATUS.length) {
        updateGameMetrics(`total${colorName}Rows`);
    }

    if (connectedColumnCells === BOARD_STATUS.length) {
        updateGameMetrics(`total${colorName}Rows`);
    }

    if (connectedDiagonal1Cells === BOARD_STATUS.length) {
        updateGameMetrics(`total${colorName}Diagonals`);
    }

    if (connectedDiagonal2Cells === BOARD_STATUS.length) {
        updateGameMetrics(`total${colorName}Diagonals`);
    }

    setTimeout(() => {
        for (const cell of cells) {
            cleanCell(cell, color);
        }

        checkGameWon();

    }, 100);
}
