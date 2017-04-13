
LevelSelector.getLevels().push({

    title       : "Cruza el pozo",
    description : "Haz cruzar la pelota",
    bodies      : [
        {
            label    : "ball",
            isStatic : false,
            position : { x : -3, y : 8 },
            type     : "circle",
            radio    : 0.25,
        },
        {
            label : "plattformA",
            isStatic : true,
            position : { x : -6, y : 0 },
            vertices: [
                {x : -4, y : 4 },
                {x : -4, y : 0 },
                {x : 4, y : 0 },
                {x : 4, y : 4 },
            ],
        },
        {
            label : "plattformB",
            isStatic : true,
            position : { x : 6, y : 0 },
            vertices: [
                {x : -4, y : 4 },
                {x : -4, y : 0 },
                {x : 4, y : 0 },
                {x : 4, y : 4 },
            ],
        },
        {
            label : "sensor",
            isStatic : true,
            isSensor : true,
            position : { x : 6.40, y : 3 },
            vertices: [
                {x : -4, y : 4 },
                {x : -4, y : 0 },
                {x : 4, y : 0 },
                {x : 4, y : 4 },
            ],
        },
    ],

    setup : function(context)
    {
        context.gameover = false;
        var bodies = Physics.getAllBodies();
        for(var i = 0; i < bodies.length; i++)
        {
            if(Physics.getLabel(bodies[i]) == "ball")
            {
                // Buscamos ball y guardamos una referencia
                // para no volver a buscarla en cada llamada a update
                context.ball = bodies[i];
                break;
            }
        }

        Physics.on("beginContact", function(event){
            if( Physics.getLabel(event.bodyA) == "sensor" || Physics.getLabel(event.bodyB) == "sensor" )
            {
                if( Physics.getLabel(event.bodyA) == "ball" || Physics.getLabel(event.bodyB) == "ball" )
                {
                    Screen.setTitleText("Buen trabajo");
                    context.gameover = true;
                }
            }
        });
    },

    update : function(context, engine)
    {
        if(Physics.getPosition(context.ball).y > Screen.getHeight())
        {
            Physics.clearForces(context.ball);
            Physics.setPosition(context.ball, { x : (Screen.getWidth()/2) - 300, y : 0 });
        }
        return context.gameover;
    }

});
