
LevelSelector.getLevels().push({

    title       : "El vaso",
    description : "Saca la pelota del vaso",
    bodies      : [
        {
            label : "ground",
            isStatic : true,
            position : [ 0, 1 ],
            vertices: [
                [-6, 0.5 ],
                [-6, 0   ],
                [ 6, 0   ],
                [ 6, 0.5 ],
            ],
        },
        {
            label : "cup",
            isStatic : false,
            position : [ -0, 3],
            vertices: [
                [ -1,   3 ],
                [ -1,   0 ],
                [ 1,    0 ],
                [ 1,    3 ],
                [ 0.8,  3 ],
                [ 0.5,  0.5 ],
                [ -0.5, 0.5 ],
                [ -0.8, 3 ],
            ],
        },
        {
            label : "sensor",
            isStatic : true,
            isSensor : true,
            position : [ -0, 3],
            vertices: [
                [-1, 3 ],
                [-1, 0 ],
                [1, 0 ],
                [1, 3 ]
            ],
        },
        {
            label    : "ball",
            type     : "circle",
            radio    : 0.25,
            isStatic : false,
            position : [ 0, 10],
        },
    ],

    hints : [
        {
            label : "hint",
            position : [ 1, 5],
            vertices: [
                [ -0.30, 0 ],
                [ -0.30, 0.96 ],
                [ 0.12, 0.96 ],
                [ 0.12, 0 ],
                [ 0.54, 0 ],
                [ 0.54, 0.96 ],
                [ 3.36, 0.96 ],
                [ 3.36, 1.56 ],
                [ -0.72, 1.50 ],
                [ -0.72, 0 ],
                [ -0.30, 0 ],
            ]
        },
    ],

    setup : function(context)
    {
        context.gameover = false;
        context.sensor = Physics.getBodyByLabel("sensor");
        context.cup = Physics.getBodyByLabel("cup");

        Physics.on("endContact", function(event){
            if( Physics.getLabel(event.bodyA) == "sensor" || Physics.getLabel(event.bodyA) == "ball" )
            {
                if( Physics.getLabel(event.bodyB) == "sensor" || Physics.getLabel(event.bodyB) == "ball" )
                {
                    Screen.setTitleText("Bien hecho!");
                    context.gameover = true;
                }
            }
        });
    },

    update : function(context)
    {
        Physics.setPosition(context.sensor, Physics.getPosition(context.cup));
        Physics.setAngle(context.sensor, Physics.getAngle(context.cup))
        return context.gameover;
    }

});
