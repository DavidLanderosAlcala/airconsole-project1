
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
        Physics.setVelocity(context.cup, { x : 0, y : 0 });
        if(Physics.getPosition(context.ball).y > Screen.getHeight())
        {
            Physics.setVelocity(context.ball, { x : 0, y : 0 });
            Physics.setPosition(context.ball, { x : (Screen.getWidth()/2) - 100, y : 0 });
        }
        return context.gameover;
    }

});
