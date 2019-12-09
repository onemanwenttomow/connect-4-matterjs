
window.addEventListener("load", function() {
    //Fetch our canvas
    var canvas = document.getElementById("world");

    //Setup Matter JS
    var engine = Matter.Engine.create();
    var events = Matter.Events;
    var world = engine.world;

    var render = Matter.Render.create({
        canvas: canvas,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            background: "transparent",
            wireframes: false,
            showAngleIndicator: false
        }
    });

    //Add pieces
    var redPieces = generateBalls(22, "red", 200);
    var yellowPieces = generateBalls(22, "yellow", 1300);
    Matter.World.add(world, redPieces);
    Matter.World.add(world, yellowPieces);

    //generate outer constraints

    //floor
    outerContraints(percentX(50), percentY(99), percentX(100), 10);
    //left left
    outerContraints(percentX(1), percentY(50), 40, percentY(100));
    // right wall
    outerContraints(percentX(99), percentY(50), 40, percentY(100));



    // add columns to the board
    var x = 500;
    for (var i = 0; i < 8; i++) {
        outerContraints(x, 410, 10, 235);
        x += 50;
    }

    // board base
    var boardBase = outerContraints(675, 525, 360, 10);
    console.log(boardBase);

    //Make interactive
    var mouseConstraint = Matter.MouseConstraint.create(engine, {
        //Create Constraint
        element: canvas,
        constraint: {
            render: {
                visible: false
            },
            stiffness: 1
        }
    });
    Matter.World.add(world, mouseConstraint);

    //Start the engine
    Matter.Engine.run(engine);
    Matter.Render.run(render);

    console.log(world);

    var boardPositions = [];
    var position, col, row, gameOver;

    function checkPositions() {
        gameOver = false;
        console.log("*********");
        for (var i = 0; i < 44; i++) {
            position = world.bodies[i].position;
            if (position.x > 520 && position.x < 840 && position.y < 520 && position.y > 300) {
                col = Math.abs(Math.round(525 - position.x)) / 50;
                row = Math.abs(Math.round((520 - position.y) / 38 - 1));
                gameOver = updateBoardPosition(col, row, world.bodies[i].render.fillStyle);
            }
        }
        console.log("*********");
        if (gameOver) { return; }
        setTimeout(checkPositions, 1000);
    }

    generateBoardArray();
    checkPositions();

    function generateBoardArray() {
        boardPositions = [];
        for (var k = 0; k < 7; k++) {
            boardPositions.push(new Array);
        }
    }

    function updateBoardPosition(col, row, colour) {
        if (row !== 0 && !boardPositions[col][row - 1]) { return; }
        boardPositions[col][row] = colour[0];
        if (colVictory()) {
            return true;
        }
        if (rowVictory()) {
            return true;
        }
        // console.log("Board Posititons: *****************");
        // console.log(boardPositions[0]);
        // console.log(boardPositions[1]);
        // console.log(boardPositions[2]);
        // console.log(boardPositions[3]);
        // console.log(boardPositions[4]);
        // console.log(boardPositions[5]);
        // console.log(boardPositions[6]);
        // console.log("/Board Posititons: *****************");
    }

    function colVictory(){
        var domCols = document.getElementsByClassName('col');
        for (var i = 0; i < boardPositions.length; i++) {
            if (boardPositions[i].join("").indexOf("rrrr") > -1) {
                addWinningClasses(boardPositions[i], "r", domCols[i].children);
                return true;
            }
            if (boardPositions[i].join("").indexOf("yyyy") > -1 ) {
                addWinningClasses(boardPositions[i], "y", domCols[i].children);
                return true;
            }
        }
    }

    function rowVictory(){
        var domCols = document.getElementsByClassName('col');
        var domRows = [];
        for (var i = 0; i < boardPositions.length; i++) {
            var rowToCheck = [];
            console.log("domCols.children: ", domCols[i].children);
            for(var j = 0; j < 6; j++) {
                console.log(boardPositions[i][j]);
                rowToCheck.push(boardPositions[j][i]);
            }
            if (rowToCheck.join("").indexOf("rrrr") > -1) {
                console.log("rowVictory!!! r");
                addWinningClasses(boardPositions[i], "r", domCols[i].children);
                return true;
            }
            if (rowToCheck.join("").indexOf("yyyy") > -1 ) {
                console.log("rowVictory!!! y");

                addWinningClasses(boardPositions[i], "y", domCols[i].children);
                return true;
            }
        }
    }

    function addWinningClasses(col, player, elems) {
        console.log("col, player", col, player, elems);
        elems = Array.from(elems).reverse();
        for (var i = 0; i < col.length; i++) {
            if (col[i] === player && col[i+1] === player && col[i+2] === player && col[i+3] ===player) {
                elems[i].children[0].classList.add(player);
                elems[i + 1].children[0].classList.add(player);
                elems[i + 2].children[0].classList.add(player);
                elems[i + 3].children[0].classList.add(player);
            }
        }
    }


    var wall;
    function outerContraints(x, y, width, height) {
        wall = Matter.Bodies.rectangle(
            x,
            y,
            width,
            height,
            {
                isStatic: true, //An immovable object
                render: {
                    visible: true
                }
            }
        );
        Matter.World.add(world, wall);
        return wall;
    }

    document.body.addEventListener("mouseup", function(e) {
        gameOver = true;
        var y = mouseConstraint.constraint.pointA.y;
        if (y > 520 && y < 530) {
            boardBase.isStatic = false;
            document.getElementsByClassName('board-base')[0].classList.add('open');
            setTimeout(function() {
                gameOver = false;
                generateBoardArray();
                checkPositions();
                document.getElementsByClassName('board-base')[0].classList.remove('open');
                boardBase = outerContraints(675, 525, 360, 10);
            }, 3000);
        }
    });


    function generateBalls(num, col, startX) {
        var balls = [];
        for (var i = 0; i < num; i++) {
            balls.push(
                Matter.Bodies.circle(
                    Math.random() * 50 + startX,
                    Math.random() * 400 + percentY(5),
                    19.8,
                    {
                        // density: 100.14,
                        // friction: 1.11,
                        // frictionAir: 0.0221,
                        // restitution: 0.5,
                        render: {
                            fillStyle: col,
                            strokeStyle: "black",
                        }
                    }
                )
            );
        }
        return balls;
    }
});

function percentX(percent) {
    return Math.round((percent / 100) * window.innerWidth);
}
function percentY(percent) {
    return Math.round((percent / 100) * window.innerHeight);
}
