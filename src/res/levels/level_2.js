
LevelSelector.getLevels().push({

    title       : "La pelota en el vaso",
    description : "Saca la pelota del vaso",
    bodies      : [
        {
            label : "ground",
            isStatic : true,
            position : { x : 0, y : 1 },
            vertices: [
                {x : -6, y : 0.5 },
                {x : -6, y : 0 },
                {x : 6, y : 0 },
                {x : 6, y : 0.5 },
            ],
        },
        {
            label : "cup",
            isStatic : false,
            position : { x : -0, y : 3 },
            vertices: [
                {x : -1, y : 3 },
                {x : -1, y : 0 },
                {x : 1, y : 0 },
                {x : 1, y : 3 },
                {x : 0.8, y : 3 },
                {x : 0.5, y : 0.5 },
                {x : -0.5, y : 0.5 },
                {x : -0.8, y : 3 },
            ],
        },
        {
            label    : "ball",
            type     : "circle",
            radio    : 0.25,
            isStatic : false,
            position : { x : 0, y : 10 },
        },
    ],

    hints : [
        {
            label : "hint",
            position : { x : 1, y : 5 },
            vertices: [
                {
                    "x": -0.30,
                    "y": 0
                },
                {
                    "x": -0.30,
                    "y": 0.96
                },
                {
                    "x": 0.12,
                    "y": 0.96
                },
                {
                    "x": 0.12,
                    "y": 0
                },
                {
                    "x": 0.54,
                    "y": 0
                },
                {
                    "x": 0.54,
                    "y": 0.96
                },
                {
                    "x": 3.36,
                    "y": 0.96
                },
                {
                    "x": 3.36,
                    "y": 1.56
                },
                {
                    "x": -0.72,
                    "y": 1.50
                },
                {
                    "x": -0.72,
                    "y": 0
                },
                {
                    "x": -0.30,
                    "y": 0
                },
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
