
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


    function checkPositions() {
        console.log("*********");
        for (var i = 0; i < 40; i++) {
            // console.log("world: ", world.bodies[i].position);

        }

        console.log("*********");

        // console.log("world: ", world.bodies[3].position);
        // console.log("world: ", world.bodies[39].position);
        // setTimeout(checkPositions, 500);
    }

    checkPositions();


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
        var y = mouseConstraint.constraint.pointA.y;
        console.log(mouseConstraint.constraint.pointA);
        if (y > 520 && y < 530) {
            console.log(boardBase.isStatic);
            boardBase.isStatic = false;
            setTimeout(function() {
                boardBase = outerContraints(675, 525, 360, 10);
            }, 5000);
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
