const { Engine, Render, Runner, Bodies, World, Body, Events } = Matter;

const engine = Engine.create();
const { world } = engine;

const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false
    }
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// Ground and walls
const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 50, {
    isStatic: true,
    render: {
        fillStyle: 'brown'
    }
});

const leftWall = Bodies.rectangle(0, window.innerHeight / 2, 50, window.innerHeight, {
    isStatic: true,
    render: {
        visible: true
    }
});

const rightWall = Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 50, window.innerHeight, {
    isStatic: true,
    render: {
        visible: true
    }
});

World.add(world, [ground, leftWall, rightWall]);

// Ball at rest
const ballAtRest = Bodies.circle(200, (window.innerHeight - 25), 40, {
    restitution: 0.8,
    friction: 0.05,
    render: {
        fillStyle: 'blue'
    }
});

World.add(world, ballAtRest);

// Ball in motion
const ballInMotion = Bodies.circle(600, window.innerHeight - 25, 40, {
    restitution: 1,
    friction: 0,
    frictionAir: 0,
    render: {
        fillStyle: 'green'
    }
});

// Apply an initial force to the ball in motion
setTimeout(() => {
    Body.applyForce(ballInMotion, { x: ballInMotion.position.x, y: ballInMotion.position.y }, { x: 0.05, y: 0 });
}, 100);

World.add(world, ballInMotion);

// Event listener to apply force upon mouse click to the ball at rest
document.addEventListener('click', (event) => {
    const x = event.clientX;
    const y = event.clientY;

    if (Matter.Bounds.contains(ballAtRest.bounds, { x, y })) {
        Body.applyForce(ballAtRest, { x: ballAtRest.position.x, y: ballAtRest.position.y }, { x: 0.05, y: 0 });
    }

    if (Matter.Bounds.contains(ballInMotion.bounds, { x, y })) {
        Body.applyForce(ballInMotion, { x: ballInMotion.position.x, y: ballInMotion.position.y }, { x: 0.05, y: 0 });
    }
});

// Text
Events.on(render, 'afterRender', function () {
    const context = render.context;
    context.font = '40px Arial';
    context.fillStyle = 'white';

    let text1 = 'Body at rest';
    let text2 = 'Body at rest';

    // Check the velocity of the first ball
    const threshold1 = 0.14;
    if (Math.abs(ballAtRest.velocity.x) > threshold1) {
        text1 = 'Body in motion';
    }

    // Check the velocity of the first ball
    const threshold2 = 0.14;
    if (Math.abs(ballInMotion.velocity.x) > threshold2) {
        text2 = 'Body in motion';
    }

    const textWidth1 = context.measureText(text1).width;
    context.fillText(text1, ballAtRest.position.x - textWidth1 / 2, ballAtRest.position.y - 60);

    const textWidth2 = context.measureText(text2).width;
    context.fillText(text2, ballInMotion.position.x - textWidth2 / 2, ballInMotion.position.y - 100);

    // Description
    const topText = 'Inertia is the property of bodies to resist changes in their state of rest or uniform rectilinear motion.';
    context.font = '24px Arial';
    
    const topTextWidth1 = context.measureText(topText).width;
    const xPosition1 = (window.innerWidth - topTextWidth1) / 2;
    
    context.fillText(topText, xPosition1, 50);

    const topText2 = 'The inertia of a body manifests only when another body acts on it, that is, when the body has a varied motion (accelerated/braked).';
    context.font = '23.5px Arial';

    const topTextWidth2 = context.measureText(topText2).width;
    const xPosition2 = (window.innerWidth - topTextWidth2) / 2;

    context.fillText(topText2, xPosition2, 100);

    const topText3 = 'An impulse can be applied to the bodies by clicking on them.';
    context.font = '23.5px Arial';

    const topTextWidth3 = context.measureText(topText3).width;
    const xPosition3 = (window.innerWidth - topTextWidth3) / 2;

    context.fillText(topText3, xPosition3, 150);
});
