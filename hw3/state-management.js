const GOLD_COLOR = 'gold';
const SILVER_COLOR = 'gray';

let BOARD_STATUS = [];
let BOARD_SIZE = 4;

let CURRENT_SHAPE = '';
let DIFFERENT_SHAPES_COUNT = 2;

const SHAPES_COUNT_TO_BOARD_SIZE = {
    2: 4,
    3: 4,
    4: 4,
    5: 4,
    6: 5,
    7: 5,
    8: 5,
    9: 5,
    10: 6,
    11: 6,
    12: 6,
    13: 6
}

const BOARD_SIZE_TO_CANVAS_SIZE = {
    4: 150,
    5: 120,
    6: 100
}

let GAME_METRICS = {
    totalWins: 0,
    totalLosses: 0,
    totalGoldenRows: 0,
    totalGoldenDiagonals: 0,
    totalSilverRows: 0,
    totalSilverDiagonals: 0,
    totalDestroyedShapes: 0,
    totalScore: 0
}

const COLORS_TABLE = {
    'circle': 'red',
    'rhombus': 'orange',
    'pentagon': 'yellow',
    'hexagon': 'green',
    'octagon': 'lime',
    'triangle': 'olive',
    'right_triangle': 'blue',
    'parallelogram': 'aqua',
    'house': 'teal',
    'trapezoid': 'purple',
    'kite': 'fuchsia',
    'star': 'gold',
    'cross': 'pink'
}

const setBoardSize = () => {
    BOARD_SIZE = SHAPES_COUNT_TO_BOARD_SIZE[DIFFERENT_SHAPES_COUNT];
}

const updateGameDifficulty = () => {
    if (DIFFERENT_SHAPES_COUNT < Object.keys(COLORS_TABLE).length) {
        ++DIFFERENT_SHAPES_COUNT;
        setBoardSize();
    }
}

const showDialog = text => {
    document.getElementById('dialog').style.display = 'flex';
    document.getElementById('dialog-text').innerHTML = text;
}

const hideDialog = () => {
    document.getElementById('dialog').style.display = 'none';
}

const dialogVisible = () => {
    return document.getElementById('dialog').style.display !== 'none';
}

const loadGameMetrics = () => {
    GAME_METRICS = JSON.parse(localStorage.getItem('game_metrics')) || GAME_METRICS;
}

const updateGameMetrics = metricKey => {
    if (metricKey in GAME_METRICS) {
        ++GAME_METRICS[metricKey];
    }

    GAME_METRICS.totalScore = 5 * GAME_METRICS.totalWins - 5 * GAME_METRICS.totalLosses
        + 3 * (GAME_METRICS.totalGoldenRows + GAME_METRICS.totalGoldenDiagonals)
        + 2 * (GAME_METRICS.totalSilverRows + GAME_METRICS.totalSilverDiagonals)
        - 4 * GAME_METRICS.totalDestroyedShapes;

    for (const metric in GAME_METRICS) {
        document.getElementById(metric).innerHTML = GAME_METRICS[metric];
    }

    localStorage.setItem('game_metrics', JSON.stringify(GAME_METRICS));
}

const registerDialogPopdown = () => {
    document.getElementById('dialog-button').addEventListener('click', () => {
        initBoard();
        hideDialog();
    });
}

const cleanCell = (cell, color) => {
    const button = cell[0];
    const canvas = button.firstChild;
    const c = canvas.getContext('2d');

    button.style.backgroundColor = color || button.style.backgroundColor;
    button.style.opacity = 1;
    button.style.cursor = 'pointer';

    canvas.style.backgroundColor = '';
    canvas.style.opacity = 1;

    c.clearRect(0, 0, canvas.width, canvas.height);

    cell[1] = '';
    clearInterval(cell[2]);
    cell[2] = '';
}
