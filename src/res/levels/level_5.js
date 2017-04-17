
LevelSelector.getLevels().push({

    title       : "Pelota al vaso",
    description : "Mete la pelota al vaso",
    bodies      : [
        {
            label : "towerA",
            isStatic : true,
            position : [ -4, 1 ],
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
            position : [ -1, 6],
            type     : "circle",
            radio    : 0.25,
        },
        {
            label : "cup",
            isStatic : true,
            position : [ 5, 2 ],
            vertices: [
                [ -1, 3 ],
                [ -1, 0 ],
                [ 1, 0 ],
                [ 1, 3 ],
                [ 0.80, 3 ],
                [ 0.50, 0.80 ],
                [ -0.50, 0.80 ],
                [ -0.80, 3 ],
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
            if( Physics.getLabel(event.bodyA) == "sensor" || Physics.getLabel(event.bodyA) == "ball" )
            {
                if( Physics.getLabel(event.bodyB) == "sensor" || Physics.getLabel(event.bodyB) == "ball" )
                {
                    Screen.setTitleText("Excelente!");
                    context.gameover = true;
                }
            }
        });
    },

    update : function(context)
    {
        if(Physics.getPosition(context.ball)[1] > Screen.getHeight())
        {
            Physics.clearForces(context.ball);
            Physics.setPosition(context.ball, [(Screen.getWidth()/2) - 100, 0 ]);
        }
        return context.gameover;
    }

});
