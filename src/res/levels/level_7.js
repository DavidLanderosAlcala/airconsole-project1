
LevelSelector.getLevels().push({

    title       : "Que no caiga",
    description : "Haz que las pelotas se toquen",
    bodies      : [
        {
            label : "towerA",
            isStatic : true,
            position : { x : 2, y : 3 },
            vertices: [
                { "x": 0, "y": 2.4 },
                { "x": 0, "y": 0 },
                { "x": 3.2, "y": 0 },
                { "x": 3.2, "y": 0.8 },
                { "x": 0.8, "y": 0.8 },
                { "x": 0.8, "y": 4.8 },
                { "x": 0, "y": 4.8 }
            ],
        },
        {
            label : "towerB",
            isStatic : true,
            position : { x : -2, y : 3 },
            vertices: [
                { "x": 0, "y": 2.4 },
                { "x": 0, "y": 0 },
                { "x": -3.2, "y": 0 },
                { "x": -3.2, "y": 0.8 },
                { "x": -0.8, "y": 0.8 },
                { "x": -0.8, "y": 4.8 },
                { "x": 0, "y": 4.8 }
            ],
        },
        {
            label : "ballA",
            position : { x : -3.5, y : 10 },
            type : "circle",
            radio : 0.25,
        },
        {
            label : "ballB",
            position : { x : 3.5, y : 10 },
            type : "circle",
            radio : 0.25,
        },
    ],

    setup : function(context)
    {
    	context.time = new Date().getTime();
        context.gameover = false;
        var bodies = Physics.getAllBodies();
        for(var i = 0; i < bodies.length; i++)
        {
            if(Physics.getLabel(bodies[i]) == "ballA")
            {
                context.ballA = bodies[i];
                context.ballAStartPos = Physics.getPosition(context.ballA);
            }
            if(Physics.getLabel(bodies[i]) == "ballB")
            {
                context.ballB = bodies[i];
                context.ballBStartPos = Physics.getPosition(context.ballB);
            }
        }

        Physics.on("beginContact", function(event){
            if( Physics.getLabel(event.bodyA) == "ballA" || Physics.getLabel(event.bodyB) == "ballA" )
            {
                if( Physics.getLabel(event.bodyA) == "ballB" || Physics.getLabel(event.bodyB) == "ballB" )
                {
                    context.gameover = true;
                }
            }
        });
    },

    update : function(context)
    {
        if(Physics.getPosition(context.ballA).y > Screen.getHeight())
        {
            Physics.setPosition(context.ballA, context.ballAStartPos);
            Physics.clearForces(context.ballA);
        }
        if(Physics.getPosition(context.ballB).y > Screen.getHeight())
        {
            Physics.setPosition(context.ballB, context.ballBStartPos);
            Physics.clearForces(context.ballB);
        }
        return context.gameover;
    }

});
