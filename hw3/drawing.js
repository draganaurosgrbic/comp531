const drawCircle = (c, shape) => {
    c.fillStyle = shape.color;
    c.beginPath();

    c.arc(shape.loc.x, shape.loc.y, shape.size, 0, 2 * Math.PI, false);

    c.strokeStyle = 'black';
    c.stroke();
    c.closePath();
    c.fill();
}

const drawRhombus = (c, shape) => {
    c.fillStyle = shape.color;
    c.beginPath();

    c.moveTo(shape.loc.x + shape.size, shape.loc.y);
    c.lineTo(shape.loc.x, shape.loc.y - shape.size);
    c.lineTo(shape.loc.x - shape.size, shape.loc.y);
    c.lineTo(shape.loc.x, shape.loc.y + shape.size);
    c.lineTo(shape.loc.x + shape.size, shape.loc.y);

    c.strokeStyle = 'black';
    c.stroke();
    c.closePath();
    c.fill();
}

const drawPentagon = (c, shape) => {
    c.fillStyle = shape.color;
    c.beginPath();

    c.moveTo(shape.loc.x - shape.size / 2, shape.loc.y + shape.size);
    c.lineTo(shape.loc.x + shape.size / 2, shape.loc.y + shape.size);
    c.lineTo(shape.loc.x + shape.size, shape.loc.y);
    c.lineTo(shape.loc.x, shape.loc.y - shape.size);
    c.lineTo(shape.loc.x - shape.size, shape.loc.y);
    c.lineTo(shape.loc.x - shape.size / 2, shape.loc.y + shape.size);

    c.strokeStyle = 'black';
    c.stroke();
    c.closePath();
    c.fill();
}

const drawHexagon = (c, shape) => {
    c.fillStyle = shape.color;
    c.beginPath();

    c.moveTo(shape.loc.x - shape.size, shape.loc.y);
    c.lineTo(shape.loc.x - shape.size / 2, shape.loc.y - shape.size);
    c.lineTo(shape.loc.x + shape.size / 2, shape.loc.y - shape.size);
    c.lineTo(shape.loc.x + shape.size, shape.loc.y);
    c.lineTo(shape.loc.x + shape.size / 2, shape.loc.y + shape.size);
    c.lineTo(shape.loc.x - shape.size / 2, shape.loc.y + shape.size);
    c.lineTo(shape.loc.x - shape.size, shape.loc.y);

    c.strokeStyle = 'black';
    c.stroke();
    c.closePath();
    c.fill();
}

const drawOctagon = (c, shape) => {
    c.fillStyle = shape.color;
    c.beginPath();

    c.moveTo(shape.loc.x - shape.size, shape.loc.y + shape.size / 2);
    c.lineTo(shape.loc.x - shape.size, shape.loc.y - shape.size / 2);
    c.lineTo(shape.loc.x - shape.size / 2, shape.loc.y - shape.size);
    c.lineTo(shape.loc.x + shape.size / 2, shape.loc.y - shape.size);
    c.lineTo(shape.loc.x + shape.size, shape.loc.y - shape.size / 2);
    c.lineTo(shape.loc.x + shape.size, shape.loc.y + shape.size / 2);
    c.lineTo(shape.loc.x + shape.size / 2, shape.loc.y + shape.size);
    c.lineTo(shape.loc.x - shape.size / 2, shape.loc.y + shape.size);
    c.lineTo(shape.loc.x - shape.size, shape.loc.y + shape.size / 2);

    c.strokeStyle = 'black';
    c.stroke();
    c.closePath();
    c.fill();
}

const drawTriangle = (c, shape) => {
    c.fillStyle = shape.color;
    c.beginPath();

    c.moveTo(shape.loc.x, shape.loc.y - shape.size);
    c.lineTo(shape.loc.x + shape.size, shape.loc.y + shape.size);
    c.lineTo(shape.loc.x - shape.size, shape.loc.y + shape.size);
    c.lineTo(shape.loc.x, shape.loc.y - shape.size);

    c.strokeStyle = 'black';
    c.stroke();
    c.fill();
    c.closePath();
}

const drawRightTriangle = (c, shape) => {
    c.fillStyle = shape.color;
    c.beginPath();

    c.moveTo(shape.loc.x + shape.size, shape.loc.y - shape.size);
    c.lineTo(shape.loc.x - shape.size, shape.loc.y - shape.size);
    c.lineTo(shape.loc.x - shape.size, shape.loc.y + shape.size);
    c.lineTo(shape.loc.x + shape.size, shape.loc.y - shape.size);

    c.strokeStyle = 'black';
    c.stroke();
    c.closePath();
    c.fill();
}

const drawParallelogram = (c, shape) => {
    c.fillStyle = shape.color;
    c.beginPath();

    c.moveTo(shape.loc.x - shape.size, shape.loc.y + shape.size);
    c.lineTo(shape.loc.x, shape.loc.y + shape.size);
    c.lineTo(shape.loc.x + shape.size, shape.loc.y - shape.size);
    c.lineTo(shape.loc.x, shape.loc.y - shape.size);
    c.lineTo(shape.loc.x - shape.size, shape.loc.y + shape.size);

    c.strokeStyle = 'black';
    c.stroke();
    c.closePath();
    c.fill();
}

const drawHouse = (c, shape) => {
    c.fillStyle = shape.color;
    c.beginPath();

    c.moveTo(shape.loc.x - shape.size, shape.loc.y + shape.size);
    c.lineTo(shape.loc.x + shape.size, shape.loc.y + shape.size);
    c.lineTo(shape.loc.x + shape.size, shape.loc.y);
    c.lineTo(shape.loc.x, shape.loc.y - shape.size);
    c.lineTo(shape.loc.x - shape.size, shape.loc.y);
    c.lineTo(shape.loc.x - shape.size, shape.loc.y + shape.size);

    c.strokeStyle = 'black';
    c.stroke();
    c.closePath();
    c.fill();
}

const drawTrapezoid = (c, shape) => {
    c.fillStyle = shape.color;
    c.beginPath();

    c.moveTo(shape.loc.x - shape.size, shape.loc.y + shape.size);
    c.lineTo(shape.loc.x + shape.size, shape.loc.y + shape.size);
    c.lineTo(shape.loc.x + shape.size / 2, shape.loc.y - shape.size);
    c.lineTo(shape.loc.x - shape.size / 2, shape.loc.y - shape.size);
    c.lineTo(shape.loc.x - shape.size, shape.loc.y + shape.size);

    c.strokeStyle = 'black';
    c.stroke();
    c.closePath();
    c.fill();
}

const drawKite = (c, shape) => {
    c.fillStyle = shape.color;
    c.beginPath();

    c.moveTo(shape.loc.x - shape.size, shape.loc.y + shape.size);
    c.lineTo(shape.loc.x, shape.loc.y - shape.size);
    c.lineTo(shape.loc.x + shape.size, shape.loc.y - shape.size);
    c.lineTo(shape.loc.x + shape.size, shape.loc.y);
    c.lineTo(shape.loc.x - shape.size, shape.loc.y + shape.size);

    c.strokeStyle = 'black';
    c.stroke();
    c.closePath();
    c.fill();
}

const drawStar = (c, shape) => {
    c.strokeStyle = shape.color;
    // c.lineWidth = 5;

    c.beginPath();
    c.moveTo(shape.loc.x - shape.size, shape.loc.y);
    c.lineTo(shape.loc.x + shape.size, shape.loc.y);
    c.stroke();

    c.beginPath();
    c.moveTo(shape.loc.x, shape.loc.y - shape.size);
    c.lineTo(shape.loc.x, shape.loc.y + shape.size);
    c.stroke();

    c.beginPath();
    c.moveTo(shape.loc.x - shape.size, shape.loc.y - shape.size);
    c.lineTo(shape.loc.x + shape.size, shape.loc.y + shape.size);
    c.stroke();

    c.beginPath();
    c.moveTo(shape.loc.x + shape.size, shape.loc.y - shape.size);
    c.lineTo(shape.loc.x - shape.size, shape.loc.y + shape.size);
    c.stroke();

    c.closePath();
}

const drawCross = (c, shape) => {
    c.fillStyle = shape.color;
    c.beginPath();

    c.moveTo(shape.loc.x - shape.size, shape.loc.y + shape.size / 2);
    c.lineTo(shape.loc.x - shape.size, shape.loc.y - shape.size / 2);
    c.lineTo(shape.loc.x - shape.size / 2, shape.loc.y - shape.size / 2);
    c.lineTo(shape.loc.x - shape.size / 2, shape.loc.y - shape.size);
    c.lineTo(shape.loc.x + shape.size / 2, shape.loc.y - shape.size);
    c.lineTo(shape.loc.x + shape.size / 2, shape.loc.y - shape.size / 2);
    c.lineTo(shape.loc.x + shape.size, shape.loc.y - shape.size / 2);
    c.lineTo(shape.loc.x + shape.size, shape.loc.y + shape.size / 2);
    c.lineTo(shape.loc.x + shape.size / 2, shape.loc.y + shape.size / 2);
    c.lineTo(shape.loc.x + shape.size / 2, shape.loc.y + shape.size);
    c.lineTo(shape.loc.x - shape.size / 2, shape.loc.y + shape.size);
    c.lineTo(shape.loc.x - shape.size / 2, shape.loc.y + shape.size / 2);
    c.lineTo(shape.loc.x - shape.size, shape.loc.y + shape.size / 2);

    c.strokeStyle = 'black';
    c.stroke();
    c.closePath();
    c.fill();
}

const drawing = {
    "circle": drawCircle,
    "rhombus": drawRhombus,
    "pentagon": drawPentagon,
    "hexagon": drawHexagon,
    "octagon": drawOctagon,

    "triangle": drawTriangle,
    "right_triangle": drawRightTriangle,
    "parallelogram": drawParallelogram,

    "house": drawHouse,
    "trapezoid": drawTrapezoid,
    "kite": drawKite,

    "star": drawStar,
    "cross": drawCross,
}