const { Engine, Render, Runner, Bodies, World, Body, Events } = Matter;

function startSimulation() {
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

    // Function to handle resizing
    function handleResize() {
        render.canvas.width = window.innerWidth;
        render.canvas.height = window.innerHeight;
        Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: window.innerWidth, y: window.innerHeight }
        });

        // Update the positions of static elements
        Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight - 25 });
        Body.setPosition(leftWall, { x: 0, y: window.innerHeight / 2 });
        Body.setPosition(rightWall, { x: window.innerWidth, y: window.innerHeight / 2 });
    }

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

    // Create balls of different masses
    const ball1 = Bodies.circle(120, window.innerHeight - 75, 40, {
        mass: 1,
        restitution: 0.8,
        friction: 0.03,
        render: {
            fillStyle: 'blue'
        }
    });

    const ball2 = Bodies.circle(240, window.innerHeight - 75, 40, {
        mass: 2,
        restitution: 0.8,
        friction: 0.03,
        render: {
            fillStyle: 'green'
        }
    });

    World.add(world, [ball1, ball2]);

    // Apply force every 2 seconds to ensure collision
    setInterval(() => {
        // Reset positions
        Body.setPosition(ball1, { x: 120, y: window.innerHeight - 75 });
        Body.setPosition(ball2, { x: window.innerWidth / 2 + 40, y: window.innerHeight - 75 });

        // Set velocities to zero
        Body.setVelocity(ball1, { x: 0, y: 0 });
        Body.setVelocity(ball2, { x: 0, y: 0 });

        // Apply forces
        const forceToApply = 0.1;
        Body.applyForce(ball1, { x: ball1.position.x, y: ball1.position.y }, { x: forceToApply, y: 0 });
        Body.applyForce(ball2, { x: ball2.position.x, y: ball2.position.y }, { x: -forceToApply, y: 0 });
    }, 2000);

    // Override the render function to add custom drawing
    Events.on(render, 'afterRender', function() {
        const context = render.context;

        // Display text above each ball
        context.font = '40px Arial';
        context.fillStyle = 'white';

        const text1 = 'm = 1';
        const text2 = 'm = 2';

        // Measure text width to center it
        const textWidth1 = context.measureText(text1).width;
        const textWidth2 = context.measureText(text2).width;

        context.fillText(text1, ball1.position.x - textWidth1 / 2, ball1.position.y - 50);
        context.fillText(text2, ball2.position.x - textWidth2 / 2, ball2.position.y - 50);

        // Description
        const topText = 'A general property of bodies in nature is interaction, that is, the mutual action between two bodies.';
        context.font = '24px Arial';

        const topTextWidth1 = context.measureText(topText).width;
        const xPosition1 = (window.innerWidth - topTextWidth1) / 2;

        context.fillText(topText, xPosition1, 50);

        const topText2 = 'The effects of body interaction are either dynamic (the velocity vector changes) or static (the bodies deform).';
        context.font = '24px Arial';

        const topTextWidth2 = context.measureText(topText2).width;
        const xPosition2 = (window.innerWidth - topTextWidth2) / 2;

        context.fillText(topText2, xPosition2, 80);

        const topText3 = 'After a delay of 2 seconds, the same force is applied to both balls. The difference in the balls accelerations can be seen.';
        context.font = '24px Arial';

        const topTextWidth3 = context.measureText(topText3).width;
        const xPosition3 = (window.innerWidth - topTextWidth3) / 2;

        context.fillText(topText3, xPosition3, 260);
    });

    const image = new Image();
    image.src = 'img/principle-2.jpg';
    image.onload = function() {
        const body = Bodies.rectangle(765, 170, image.width, image.height, {
            isStatic: true,
            render: {
                sprite: {
                    texture: image.src,
                    xScale: 1,
                    yScale: 1
                }
            }
        });

        World.add(world, body);
    };

    // Add event listener to handle window resize
    window.addEventListener('resize', handleResize);
    handleResize();  // Initial call to set up positions correctly
}

startSimulation();
