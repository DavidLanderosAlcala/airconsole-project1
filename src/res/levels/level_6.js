
LevelSelector.getLevels().push({

    title       : "Pelota al vaso",
    description : "Mete la pelota al vaso",
    bodies      : [
        {
            label : "plattform",
            isStatic : true,
            position : [-4, 1 ],
            vertices: [
                [ 0, 3 ],
                [ 0, 0 ],
                [ 4, 0 ],
                [ 4, 3 ],
            ],
        },
        {
            label    : "ball",
            isStatic : false,
            position : [ -1, 6 ],
            type     : "circle",
            radio    : 0.25,
        },
        {
            label : "cup",
            isStatic : true,
            isKinematic : true,
            position : [ 5, 2 ],
            vertices: [
                [ -1,  3 ],
                [ -1,  0 ],
                [ 1,  0 ],
                [ 1,  3 ],
                [ 0.80,  3 ],
                [ 0.50,  0.80 ],
                [ -0.50,  0.80 ],
                [ -0.80,  3 ],
            ],
        },
        {
            label : "sensor",
            isSensor : true,
            isStatic : true,
            position : [ 5, 2.50 ],
            vertices: [
                [ 0, 0 ],
                [ 0, 1 ],
                [ 0.50, 1 ],
                [ 0.50, 0 ],
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
                    Physics.setVelocity(context.cup, [200, 0]);
                }
            }
        });
    },

    update : function(context)
    {
        if(!context.gameover)
        {
            context.frame += 0.05;
            Physics.setVelocity(context.cup, [ (Math.cos(context.frame) * 400), 0]);
            var cup_pos = Physics.getPosition(context.cup);
            Physics.setPosition(context.sensor, [ cup_pos[0], cup_pos[1] - 30 ]);
            if(Physics.getPosition(context.ball)[1] > Screen.getHeight())
            {
                Physics.clearForces(context.ball);
                Physics.setPosition(context.ball, [ (Screen.getWidth()/2) - 100, 0 ]);
            }
        }
        return context.gameover;
    }

});
