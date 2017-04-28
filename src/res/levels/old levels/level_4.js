
LevelSelector.getLevels().push({

    title       : "El puente",
    description : "Haz cruzar la pelota",
    bodies      : [
        {
            label    : "ball",
            isStatic : false,
            position : [-3, 8 ],
            type     : "circle",
            radio    : 0.25,
        },
        {
            label : "plattformA",
            isStatic : true,
            position : [ -6, 0 ],
            vertices: [
                [ -4, 4 ],
                [ -4, 0 ],
                [ 4,  0 ],
                [ 4,   3.2 ],
                [ 3.2, 3.2 ],
                [ 3.2, 4 ]
            ],
        },
        {
            label : "plattformB",
            isStatic : true,
            position : [ 6, 0 ],
            vertices: [
                [ -4, 4 ],
                [ -4, 0 ],
                [ 4, 0 ],
                [ 4, 4 ],
            ],
        },

        {
            label : "bridge",
            isStatic : false,
            position : [ 2.5, 3.3 ],
            vertices: [
                [ -0.35, 5.5 ],
                [ -0.35, 0 ],
                [ 0.35, 0 ],
                [ 0.35, 5.5 ],
            ],
        },
        {
            label : "sensor",
            isStatic : true,
            isSensor : true,
            position : [ 6.40, 3 ],
            vertices: [
                [ -4, 4 ],
                [ -4, 0 ],
                [ 4, 0 ],
                [ 4, 4 ],
            ],
        },
    ],

    tacks : [
        { bodyA    : "plattformB",
          bodyB    : "bridge",
          position : [2.5,3.6] },
    ],

    setup : function(context)
    {
        context.gameover = false;
        context.ball = Physics.getBodyByLabel("ball");

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
        if(Physics.getPosition(context.ball)[1] > Screen.getHeight())
        {
            Physics.clearForces(context.ball);
            Physics.setPosition(context.ball, [ (Screen.getWidth()/2) - 300, 0 ]);
        }
        return context.gameover;
    }

});
