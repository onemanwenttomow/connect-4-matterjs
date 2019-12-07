var welcome = document.getElementsByClassName('welcome')[0];

setTimeout(function() {
    console.log(welcome);
    welcome.style.display = "none";
} ,2000);

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

    //Add a ball
    var redBalls = generateBalls(20, "red", 200);
    var yellowBalls = generateBalls(20, "yellow", 1400);
    Matter.World.add(world, redBalls);
    Matter.World.add(world, yellowBalls);

    //Add a floor
    var floor = Matter.Bodies.rectangle(
        percentX(50),
        percentY(99),
        percentX(100),
        10,
        {
            isStatic: true, //An immovable object
            render: {
                visible: true
            }
        }
    );

    var leftWall = Matter.Bodies.rectangle(
        percentX(1),
        percentY(50),
        40,
        percentY(100),
        {
            isStatic: true, //An immovable object
            render: {
                visible: true
            }
        }
    );

    var rightWall = Matter.Bodies.rectangle(
        percentX(99),
        percentY(50),
        40,
        percentY(100),
        {
            isStatic: true, //An immovable object
            render: {
                visible: true
            }
        }
    );


    var col;
    var x = 400;
    for (var i = 0; i < 8; i++) {
        col = Matter.Bodies.rectangle(
            x,
            400,
            10,
            500,
            {
                isStatic: true, //An immovable object
                render: {
                    visible: true
                }
            }
        );
        x += 100;
        Matter.World.add(world, col);
    }

    var boardBase = Matter.Bodies.rectangle(
        750,
        650,
        710,
        10,
        {
            isStatic: true, //An immovable object
            render: {
                visible: true
            }
        }
    );



    Matter.World.add(world, boardBase);
    Matter.World.add(world, floor);
    Matter.World.add(world, leftWall);
    Matter.World.add(world, rightWall);


    //Make interactive
    var mouseConstraint = Matter.MouseConstraint.create(engine, {
        //Create Constraint
        element: canvas,
        constraint: {
            render: {
                visible: false
            },
            stiffness: 0.8
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
                    startX,
                    percentY(10),
                    45,
                    {
                        // density: 1.14,
                        // friction: 0.11,
                        // frictionAir: 0.0221,
                        // restitution: 0.9,
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

function randomColor() {
    function getRandomNumber(num) {
        return Math.floor(Math.random() * num);
    }
    var r = getRandomNumber(256);
    var g = getRandomNumber(256);
    var b = getRandomNumber(256);
    return "rgb(" + r + "," + g + "," + b + ")";
}
