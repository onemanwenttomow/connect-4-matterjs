// var welcome = document.getElementsByClassName('welcome')[0];
// var board = document.getElementsByClassName('board')[0];
//
// setTimeout(function() {
//     console.log(welcome);
//     welcome.classList.add("invisible");
//     board.classList.remove("hidden");
// } ,2500);

window.addEventListener("load", function() {
    //Fetch our canvas
    var canvas = document.getElementById("world");

    //Setup Matter JS
    var engine = Matter.Engine.create();
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
    var redPieces = generateBalls(20, "red", 200);
    var yellowPieces = generateBalls(20, "yellow", 1300);
    Matter.World.add(world, redPieces);
    Matter.World.add(world, yellowPieces);

    //generate outer constraints

    //floor
    outerContraints(percentX(50), percentY(99), percentX(100), 10);

    //left left
    outerContraints(percentX(1), percentY(50), 40, percentY(100));

    // right wall
    outerContraints(percentX(99), percentY(50), 40, percentY(100));


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
    }

    // add columns to the board
    var x = 400;
    for (var i = 0; i < 8; i++) {
        outerContraints(x, 400, 10, 500);
        x += 100;
    }

    // board base
    console.log(Matter.World);
    outerContraints(750, 650, 710, 10);

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


    function generateBalls(num, col, startX) {
        var balls = [];
        for (var i = 0; i < num; i++) {
            balls.push(
                Matter.Bodies.circle(
                    Math.random() * 50 + startX,
                    Math.random() * 400 + percentY(5),
                    45,
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
