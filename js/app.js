var Rect = (function() {

function rect(maintext) {
    this.fill = "rgba(225,225,225,0.8)";
    this.x = 0;
    this.y = 210;
    this.width = 1000;
    this.height = 180;
    this.align = "center";
    this.textcolor = "black";
    this.mainfont = "60px Consolas";
    this.maintext = maintext;
    this.maintextx = 260;
    this.maintexty = 300;
    this.secondfont = "30px Consolas";
    this.secondtext = 'Press here to continue';
    this.secondtextx = 260;
    this.secondtexty = 340;
};

rect.prototype.draw = function() {
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.font = this.mainfont;
    ctx.textAlign = this.align;
    ctx.fillStyle = this.textcolor;
    ctx.fillText(this.maintext, this.maintextx, this.maintexty);
    ctx.font = this.secondfont;
    ctx.fillText(this.secondtext, this.secondtextx, this.secondtexty)
}

rect.prototype.isPointInside = function (x, y) {
    return (x >= this.x && 
            x <= this.x + this.width &&
            y >= this.y && 
            y <= this.y + this.height
    );
};

return rect;
})();


rectWin = new Rect("YOU WON!");
rectLose = new Rect("YOU LOST!");

var rects = [];

rects.push(rectWin);
rects.push(rectLose);

var character;
var enterPressed = 0;
var changeSlide;
var allEnemies, player;

// Enemies our player must avoid
var Enemy = function(loc) {
    this.sprite = 'images/enemy-bug.png';
    this.y = Math.ceil(Math.random()*3)*83;
    this.x = -Math.random()*500;
    this.speed = Math.random()*500;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.x < 600) {
        this.x = this.x + this.speed*dt
    } else {
        this.x = -50; 
        this.y = Math.ceil(Math.random()*3)*83
    };
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y-83/4);
};


// Draw selector on the starter screen
var Selector = function () {
    this.select = 'images/Selector.png';
    this.x = 0;
    this.y = 83 * 3.68;
}

Selector.prototype.update = function(dt) {
    this.x = this.x;
    this.y = this.y;
};

Selector.prototype.render = function() {
    ctx.drawImage(Resources.get(this.select), this.x, this.y);
};

Selector.prototype.handleInput = function(key) {
    if (key == 'right') {
        if (this.x < 101 * 4) {
            this.x = this.x + 101 
        } else {this.x = 0};
    };

    if (key == 'left') {
        if (this.x > 0) {
            this.x = this.x - 101
        } else {this.x = 101 * 4};
    };

    if (key == 'enter') {
        enterPressed ++;
        character = [
         'images/char-cat-girl.png',
         'images/char-horn-girl.png',
         'images/char-boy.png',
         'images/char-pink-girl.png',
         'images/char-princess-girl.png'
        ] [this.x / 101];
        player = new Player();
        e1 = new Enemy();
        e2 = new Enemy();
        e3 = new Enemy();
        e4 = new Enemy();
        e5 = new Enemy();
        e6 = new Enemy();
        allEnemies = [e1,e2,e3,e4,e5,e6];
        changeSlide();
   }
};

var Player = function() {
    this.sprite = character;
    this.y = 83*5;
    this.ytime = 100;
    this.x = 101*2;
    this.xtime = 100;
    this.score = 0;
    this.lifes = 3;
}

Player.prototype.update = function(dt) {
    this.x = this.x;
    this.y = this.y;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y-83/5);
};

Player.prototype.handleInput = function(key) {
    if (this.score < 50  && this.lifes >= 0 && enterPressed > 0) {
        if (key == 'up') {
            if (this.y > 83) {
                this.y = (this.y - 83) 
            } else {
                this.y = 83*5
                this.score += 5
            }
        };

        if (key == 'down') {
            if (this.y < 83 * 5) {
                this.y = (this.y + 83) 
            } else {this.y = 83*5};
        };

        if (key == 'right') {
            if (this.x < 101 * 4) {
                this.x = this.x + 101 
            } else {this.x = 0; this.changex = 0};
        };

        if (key == 'left') {
            if (this.x > 0) {
                this.x = this.x - 101
            } else {this.x = 101 * 4; this.changex = 0};
        };
    };
};


// This listens for key presses and sends the keys to the handleInput() method 


document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };
    if(enterPressed > 0) {
        player.handleInput(allowedKeys[e.keyCode]);
    }
    selector.handleInput(allowedKeys[e.keyCode]);
});

