/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {

    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        offsetX = canvas.offsetLeft,
        offsetY = canvas.offsetTop,
        ctx = canvas.getContext('2d'),
        lastTime;
    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    selector = new Selector();
    var doRender = renderStarter;
        doUpdate = selector.update;

    canvas.addEventListener('click', function(event) {
        var x = event.pageX - offsetX,
            y = event.pageY;
        for (var i = 0; i < rects.length; i++) {
            if (rects[i].isPointInside(x, y)) {
                player.score = 0;
                player.lifes = 3;
                player.x = 101*2;
                player.y = 83*5;
                };
        };
    },
    false
    );

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call  update/render functions, pass along the time delta to
         * update function to ensure smooth animation.
         */
        doRender();
        doUpdate(dt);
       /* lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();
        main();
    }

    changeSlide = function() {
            doRender = renderMain;
            doUpdate = update;
        }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        if(player.score < 50 && player.lifes >= 0) {
            updateEntities(dt);
            checkCollisions();
       };
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update(dt);
    }

    function checkCollisions () {
        allEnemies.forEach(function(enemy) {
            if( Math.round(enemy.x/101) == player.x/101
                     && enemy.y == player.y) {
                player.y = 83*5;
                player.x = 101*2;
                if(player.score > 2) {
                    player.score -= 3;
                } else {
                    player.score <= 2;
                    player.lifes --
                    player.score = 0;
                }
            };
        });
    }

    function renderText () {
        if (player.score >= 50) {
            rectWin.draw();
        } else if (player.lifes < 0) {
            rectLose.draw();
       }
    }

    /* rendering first screen where you can choose the character */

    function renderStarter() {

        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.fill();

        var myImages = [
                'images/char-cat-girl.png',
                'images/char-horn-girl.png',
                'images/char-boy.png',
                'images/char-pink-girl.png',
                'images/char-princess-girl.png'
            ],
            numRows = 1,
            numCols = 5;

        ctx.font = "30px Consolas";
        ctx.fillStyle = "black";
        ctx.fillText('Select your character:', 50, 83*2.5);

        for (var col = 0; col < numCols; col++) {
            ctx.drawImage(Resources.get(myImages[col]), col * 101, 83*3);
        }

        selector.render();
    }
    

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */

    function renderMain() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
                numRows = 6,
                numCols = 5;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (var row = 0; row < numRows; row++) {
            for (var col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        };

        if(player.lifes >= 0) {
            ctx.drawImage(Resources.get('images/Heart.png'), 403, 12, width = 101, height = 145);
            ctx.font = "30px Consolas";
            ctx.textAlign = "center";
            ctx.fillStyle = "white";
            ctx.fillText(player.score,50.5,112);
            ctx.fillText(player.lifes,454.5,95);
            ctx.font = "25px Consolas";
            ctx.fillText('Score:', 50, 78);
        };
        renderEntities();
        renderText ();
    }

    /* This function is called by the renderMain function and is called on each game
     * tick to render enemy and player (defined within app.js).
     */
    function renderEntities() {
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        player.render();
    }

     /* all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Heart.png',
        'images/Star.png',
        'images/Selector.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
