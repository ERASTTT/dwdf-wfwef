// Настройка «холста»
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Получаем ширину и высоту элемента canvas
var width = canvas.width;
var height = canvas.height;

// Вычисляем ширину и высоту в ячейках
var blockSize = 10;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;

//Устанавливаем счёт 0
var score = 0;

//Рисуем рамку
var drawBorder = function () {
    ctx.fillStyle = "Gray";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
};

 ctx.fillText("Привет мир!", 50, 50);
 ctx.textBaseline = "top";

ctx.font = "20px Courier";
ctx.fillText("Courier", 50 ,50);

ctx.font = "24px Comic Sans MS";
ctx.fillText("Comic Sans", 50 ,100);

ctx.font = "18px Arial";
ctx.fillText("Arial", 50 ,100);

//Выводим счёт игры в девом верхнем углу 
var drawScore = function () {
 ctx.font = "20px Courier";
 ctx.fillStyle = "Black";
 ctx.textAllign = "left";
 ctx.textBaseline = "top";
 ctx.fillText("Счёт: " + score , blockSize, blockSize);   
};
// Отменяем действие setInterval и печатаем сообщение «Конец игры»
var gameOver = function () {
    clearInterval(inretvalId);
    ctx.font = "60px Courier";
    ctx.fillStyle = "Black";
    ctx.textAllign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Конец игры", width / 2, height / 2);
};

// Рисуем окружность (используя функцию из главы 14)
var circle = function (x, y, radius, fillCircle) {
   ctx.beginPath();
   ctx.arc(x, y, radius, 0, Math.PI * 2, false);
   if (fillCircle) {
    ctx.fill();
} else {
    ctx.stroke();
}
};

//Задаём конструктору Block (ячейки)
var Block = function (col, row) {
    this.col = col;
    this.row = row;
};

// Рисуем квадрат в позиции ячейки
Block.prototype.drawSquare = function (color) {
    var x = this.col * blockSize;
    var y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
};

// Рисуем круг в позиции ячейки
Block.prototype.drawCircle = function (color) {
    var centerX = this.col * blockSize + blockSize / 2;
    var centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
};

// Проверяем, находится ли эта ячейка в той же позиции, что и ячейка
// otherBlock
Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
};

// Задаем конструктор Snake (змейка)
var Snake = function () {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ];
    this.direction = "right";
    this.nextDirection = "right";
};

// Рисуем квадратик для каждого сегмента тела змейки
Snake.prototype.draw = function () {
    for (var i = 0; i < this.segments.length; i++) {
        this.segments[i].drawSquare("Blue");
    }
};

// Создаем новую голову и добавляем ее к началу змейки,
// чтобы передвинуть змейку в текущем направлении
Snake.prototype.move = function () {
    var head = this.segments[0];
    var newHead;

    this.direction = this.nextDirection;

    if (this.direction === "right") {
        newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === "down") {
        newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === "left") {
        newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === "up") {
        newHead = new Block(head.col, head.row - 1);
    }

    if (this.checkCollision(newHead)) {
        gameOver();
        return;
    }
    this.segments.unshift(newHead);
    if (newHead.equal(apple.position)) {
        score++;
        apple.move();
    } else {
        this.segments.pop();
    }
};

//Проверяем не столкнулась ли змейка со стеной или собственным
//телом
Snake.prototype.checkCollision = function (head){
    var leftCollision = (head.col === 0);
    var topCollision = (head.row === 0);
    var rightCollision = (head.col === widthInBlocks - 1);
    var bottomCollision = (head.row === heightInBlocks - 1);

    var wallCollision = leftCollision || topCollision || 
    rightCollision || bottomCollision;

    var selfCollision = false;


    for (var i = 0; i < this.segments.length; i++) {
        if (head.equal(this.segments[i])) {
            selfCollision = true;
        }
    }

    return wallCollision || selfCollision;
};