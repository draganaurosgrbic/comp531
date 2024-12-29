const checkGameWon = () => {
    let goldenCells = 0;
    let silverCells = 0;
    for (let i = 0; i < BOARD_STATUS.length; ++i) {
        for (let j = 0; j < BOARD_STATUS[0].length; ++j) {
            const color = BOARD_STATUS[i][j][0].style.backgroundColor;
            if (color === GOLD_COLOR) {
                ++goldenCells;
            }
            if (color === SILVER_COLOR) {
                ++silverCells;
            }
        }
    }

    if (goldenCells + silverCells === BOARD_STATUS.length ** 2 && goldenCells > 0) {
        updateGameMetrics('totalWins');
        updateGameDifficulty();
        showDialog('Congrats! You won!!');
    }
}


const checkGameLost = () => {
    let cellsWithShape = 0;
    for (let i = 0; i < BOARD_STATUS.length; ++i) {
        for (let j = 0; j < BOARD_STATUS[0].length; ++j) {
            if (BOARD_STATUS[i][j][1] !== '') {
                ++cellsWithShape;
            }
        }
    }

    if (cellsWithShape === BOARD_STATUS.length ** 2) {
        updateGameMetrics('totalLosses');
        showDialog('Sorry, you lost :(')
    }
}


const updateCurrentShape = () => {
    const canvas = document.getElementById('next-shape');
    const c = canvas.getContext('2d');
    c.clearRect(0, 0, canvas.width, canvas.height);

    const array = Object.keys(COLORS_TABLE).slice(0, DIFFERENT_SHAPES_COUNT);
    CURRENT_SHAPE = array[Math.floor(Math.random() * array.length)];
    drawing[CURRENT_SHAPE](c, createNewShape(canvas));
}

const createNewShape = canvas => {
    return {
        loc: {
            x: canvas.width / 2,
            y: canvas.height / 2
        },
        size: Math.min(canvas.width, canvas.height) / 3,
        name: CURRENT_SHAPE,
        color: COLORS_TABLE[CURRENT_SHAPE]
    }
}
