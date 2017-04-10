
LevelSelector.getLevels().push({

    title       : "La pelota en el vaso",
    description : "Saca la pelota del vaso",
    bodies      : [
        {
            label : "ground",
            isStatic : true,
            position : { x : 0, y : 100 },
            vertices: [
                {x : -600, y : 50 },
                {x : -600, y : 0 },
                {x : 600, y : 0 },
                {x : 600, y : 50 },
            ],
        },
        {
            label : "cup",
            isStatic : false,
            position : { x : -0, y : 300 },
            vertices: [
                {x : -100, y : 300 },
                {x : -100, y : 0 },
                {x : 100, y : 0 },
                {x : 100, y : 300 },
                {x : 80, y : 300 },
                {x : 50, y : 50 },
                {x : -50, y : 50 },
                {x : -80, y : 300 },
            ],
        },
        {
            label    : "ball",
            type     : "circle",
            radio    : 25,
            isStatic : false,
            position : { x : 0, y : 1000 },
        },
    ],

    hints : [
        {
            label : "hint",
            position : { x : 100, y : 500 },
            vertices: [
                {
                    "x": -30,
                    "y": 0
                },
                {
                    "x": -30,
                    "y": 96
                },
                {
                    "x": 12,
                    "y": 96
                },
                {
                    "x": 12,
                    "y": 0
                },
                {
                    "x": 54,
                    "y": 0
                },
                {
                    "x": 54,
                    "y": 96
                },
                {
                    "x": 336,
                    "y": 96
                },
                {
                    "x": 336,
                    "y": 156
                },
                {
                    "x": -72,
                    "y": 150
                },
                {
                    "x": -72,
                    "y": 0
                },
                {
                    "x": -30,
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
