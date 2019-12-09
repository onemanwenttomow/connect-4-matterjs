
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


    var boardPositions = [];
    var position, col, row, gameOver;
    var count = 0;

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
        if (gameOver) { return; }
        setTimeout(checkPositions, 1000);
    }

    generateBoardArray();
    checkPositions();

    function generateBoardArray() {
        boardPositions = [];
        for (var k = 0; k < 7; k++) {
            boardPositions.push(["x", "x", "x", "x", "x", "x"]);
        }
        console.log("boardPositions: ", boardPositions);
    }

    function updateBoardPosition(col, row, colour) {
        // console.log("colour[0]: ", colour[0]);
        if (row !== 0 && boardPositions[col][row - 1] === "x") { return; }
        boardPositions[col][row] = colour[0];
        if (colVictory() || rowVictory() || diagVictory()) {
            return true;
        }
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
        for (var i = 0; i < boardPositions.length; i++) {
            var domRows = [];
            var rowToCheck = [];
            for (var p = 0; p < 7; p++) {
                var slots = Array.from(domCols[p].children).reverse();
                domRows.push(slots[i]);
                rowToCheck.push(boardPositions[p][i]);
            }
            if (rowToCheck.join("").indexOf("rrrr") > -1) {
                addWinningClasses(rowToCheck, "r", domRows.reverse());
                return true;
            }
            if (rowToCheck.join("").indexOf("yyyy") > -1 ) {
                addWinningClasses(rowToCheck, "y", domRows.reverse());
                return true;
            }
        }
    }

    function diagVictory() {
        console.log("checking diag...");
        for (var i = 0; i < boardPositions.length; i++) {
            // console.log("checking: ", boardPositions[i]);
            var str = ""
            var strNeg = "";
            // console.log(boardPositions[i][0]);
            str += boardPositions[i][0];
            strNeg += boardPositions[i][0];
            for (var j = 1; j < 4; j++) {
                if (boardPositions[i + 1]) {
                    str+=boardPositions[i + 1][j];
                }
            }

            for (var k = 1; k < 4; k++) {
                if (boardPositions[i - 1]) {
                    strNeg+=boardPositions[i - 1][k];
                }
            }
            console.log(strNeg);
            if (str === "rrrr" || strNeg === "rrrr") {
                console.log("red diag win:");
                console.log(i, j, k);
            } else if (str === "yyyy" || strNeg == "yyyy") {
                console.log("yellow diag win:");
                console.log(i, j, k);
            }

            // console.log(boardPositions[i + 2] && boardPositions[i + 2][0 + 2]);
            // console.log(boardPositions[i + 3] && boardPositions[i + 3][0 + 3]);

        }
    }

    function addWinningClasses(col, player, elems) {
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
