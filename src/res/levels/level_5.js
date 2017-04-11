
LevelSelector.getLevels().push({

    title       : "Pelota al vaso",
    description : "Mete la pelota al vaso",
    bodies      : [
        {
            label : "plattform",
            isStatic : true,
            position : { x : -4, y : 1 },
            vertices: [
                {x : 0, y : 3 },
                {x : 0, y : 0 },
                {x : 4, y : 0 },
                {x : 4, y : 3 },
            ],
        },
        {
            label    : "ball",
            isStatic : false,
            position : { x : -1, y : 6 },
            type     : "circle",
            radio    : 0.25,
        },
        {
            label : "cup",
            isStatic : true,
            position : { x : 5, y : 2 },
            vertices: [
                {x : -1, y : 3 },
                {x : -1, y : 0 },
                {x : 1, y : 0 },
                {x : 1, y : 3 },
                {x : 0.80, y : 3 },
                {x : 0.50, y : 0.80 },
                {x : -0.50, y : 0.80 },
                {x : -0.80, y : 3 }
            ],
        },
        {
            label : "sensor",
            isSensor : true,
            isStatic : true,
            position : { x : 5, y : 2.50 },
            vertices: [
                {x : 0, y : 0 },
                {x : 0, y : 1 },
                {x : 0.50, y : 1 },
                {x : 0.50, y : 0 },
            ],
        },
    ],

    setup : function(context)
    {
        context.gameover = false;
        context.frame = 0;
        var bodies = Physics.getAllBodies();
        for(var i = 0; i < bodies.length; i++)
        {
            var label = Physics.getLabel(bodies[i]);
            if(label == "ball")
            {
                context.ball = bodies[i];
            }
            if(label == "cup")
            {
                context.cup = bodies[i];
            }
            if(label == "sensor")
            {
                context.sensor = bodies[i];
            }
        }

        Physics.on("beginContact", function(event){
            if( Physics.getLabel(event.bodyA) == "sensor" || Physics.getLabel(event.bodyA) == "ball" )
            {
                if( Physics.getLabel(event.bodyB) == "sensor" || Physics.getLabel(event.bodyB) == "ball" )
                {
                    context.gameover = true;
                }
            }
        });
    },

    update : function(context)
    {
        context.frame += 0.05;
        Physics.translate(context.cup, {x: (Math.cos(context.frame) * 10), y: 0});
        Physics.translate(context.sensor, {x: (Math.cos(context.frame) * 10), y: 0});
        Physics.clearForces(context.cup);
        if(Physics.getPosition(context.ball).y > Screen.getHeight())
        {
            Physics.clearForces(context.ball);
            Physics.setPosition(context.ball, { x : (Screen.getWidth()/2) - 100, y : 0 });
        }
        return context.gameover;
    }

});
