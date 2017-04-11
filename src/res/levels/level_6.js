
LevelSelector.getLevels().push({

    title       : "Level 0",
    description : "Despata la coladera",
    bodies      : [
        {
            label : "pieceA",
            isStatic : true,
            position : { x : -5, y : 0 },
            vertices: [
                {x : -8, y : 8 },
                {x : -8, y : 0 },
                {x : 4, y : 0 },
                {x : 3.5, y : 2 },
            ],
        },

        {
            label : "pieceB",
            isStatic : true,
            position : { x : 3.8, y : 0 },
            vertices: [
                {x : 1, y : 4 },
                {x : 1, y : 8 },
                {x : 1.5, y : 8 },
                {x : 1.5, y : 0 },
                {x : 1, y : 0 },
                {x : -4, y : 0 },
                {x : -3.5, y : 2 },
            ],
        },

        {
            label : "slim-plug",
            isStatic : false,
            position : { x : -0.50, y : 4 },
            vertices: [
                {x : -0.95, y  :  0.50 },
                {x : -0.65, y  : -0.50 },
                {x :  0.65, y  : -0.50 },
                {x :  0.95, y  :  0.50 },
                {x :  0.20, y  :  0.50 },   // handler
                {x :  0.20, y  :   0.90 },  // handler
                {x :  -0.20, y  :  0.90 },  // handler
                {x :  -0.20, y  :  0.50 },  // handler
            ],
        },

        {
            label    : "ball",
            type     : "circle",
            radio    : 0.25,
            isStatic : false,
            position : { x : -4.3, y : 5 },
        },
        {
            isStatic : true,
            label : "tap",
            position: { x : -5, y : 8 },
            vertices : [
                {
                    "x": -0.70,
                    "y": 0.80
                },
                {
                    "x": -1.60,
                    "y": 0.70
                },
                {
                    "x": -1.60,
                    "y": 0.90
                },
                {
                    "x": 0.50,
                    "y": 0.90
                },
                {
                    "x": 0.50,
                    "y": 0.70
                },
                {
                    "x": -0.40,
                    "y": 0.80
                },
                {
                    "x": -0.40,
                    "y": 0.40
                },
                {
                    "x": 0.90,
                    "y": 0.40
                },
                {
                    "x": 0.90,
                    "y": -0.20
                },
                {
                    "x": 1.10,
                    "y": -0.20
                },
                {
                    "x": 1.10,
                    "y": -0.40
                },
                {
                    "x": 0.10,
                    "y": -0.40
                },
                {
                    "x": 0.10,
                    "y": -0.20
                },
                {
                    "x": 0.30,
                    "y": -0.20
                },
                {
                    "x": 0.30,
                    "y": 0
                },
                {
                    "x": -0.70,
                    "y": 0
                },
                {
                    "x": -9.60,
                    "y": 0
                },
                {
                    "x": -9.60,
                    "y": 0.40
                },
                {
                    "x": -0.70,
                    "y": 0.40
                }
            ]
        }
    ],

    setup : function(context, engine)
    {
    	context.game_over = false;
    },

    update : function(context, engine)
    {
        return context.game_over;
    }

});
