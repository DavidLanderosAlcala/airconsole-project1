
LevelSelector.getLevels().push({

    title       : "Pelota al vaso",
    description : "Mete la pelota al vaso",
    bodies      : [
        {
            label : "towerA",
            isStatic : true,
            position : { x : -400, y : 100 },
            vertices: [
                {x : 0, y : 300 },
                {x : 0, y : 0 },
                {x : 400, y : 0 },
                {x : 400, y : 300 },
            ],
        },
        {
            label    : "ball",
            isStatic : false,
            position : { x : -300, y : 600 },
            type     : "circle",
            radio    : 25,
        },
        {
            label : "cup",
            isStatic : true,
            position : { x : 500, y : 200 },
            vertices: [
                {x : -100, y : 300 },
                {x : -100, y : 0 },
                {x : 100, y : 0 },
                {x : 100, y : 300 },
                {x : 80, y : 300 },
                {x : 50, y : 80 },
                {x : -50, y : 80 },
                {x : -80, y : 300 }
            ],
        },
        {
            label : "sensor",
            isSensor : true,
            isStatic : true,
            position : { x : 500, y : 250 },
            vertices: [
                {x : 0, y : 0 },
                {x : 0, y : 100 },
                {x : 50, y : 100 },
                {x : 50, y : 0 },
            ],
        },
    ],

    setup : function(context, engine)
    {
        context.gameover = false;
        var bodies = Matter.Composite.allBodies(engine.world);
        for(var i = 0; i < bodies.length; i++)
        {
            if(bodies[i].label == "ball")
            {
                // Buscamos ball y guardamos una referencia
                // para no volver a buscarla en cada llamada a update
                context.ball = bodies[i];
                break;
            }
        }
        Matter.Events.on(engine, 'collisionActive', function(event) {
            var pairs = event.pairs;
            var l = pairs.length;
            for(var i = 0; i < l; i++)
            {
                if(pairs[i].bodyA.label == "ball" || pairs[i].bodyA.label == "sensor")
                {
                    if(pairs[i].bodyB.label == "ball" || pairs[i].bodyB.label == "sensor")
                    {
                        context.gameover = true;
                    }
                }
                
            }
            console.log(event.pairs[0].bodyA.label + event.pairs[0].bodyB.label);
        });
    },

    update : function(context, engine)
    {
        if(context.ball.position.y > 300)
        {
            Matter.Body.setVelocity(context.ball, { x : 0, y : 0 });
            Matter.Body.setPosition(context.ball, { x : -300, y : -600 });
        }
        return context.gameover;
    }

});
