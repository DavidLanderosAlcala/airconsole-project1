
LevelSelector.getLevels().push({

    title       : "La pelota en el vaso",
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
        Physics.on("beginContact", function(event){
            if( Physics.getLabel(event.bodyA) == "ground" || Physics.getLabel(event.bodyA) == "ball" )
            {
                if( Physics.getLabel(event.bodyB) == "ground" || Physics.getLabel(event.bodyB) == "ball" )
                {
                    Screen.setTitleText("Bien hecho!");
                    context.gameover = true;
                }
            }
        });
    },

    update : function(context)
    {
        return context.gameover;
    }

});
