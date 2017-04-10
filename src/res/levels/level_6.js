
LevelSelector.getLevels().push({

    title       : "Level 0",
    description : "Despata la coladera",
    bodies      : [
        {
            label : "pieceA",
            isStatic : true,
            position : { x : -500, y : 0 },
            vertices: [
                {x : -800, y : 800 },
                {x : -800, y : 0 },
                {x : 400, y : 0 },
                {x : 350, y : 200 },
            ],
        },

        {
            label : "pieceB",
            isStatic : true,
            position : { x : 380, y : 0 },
            vertices: [
                {x : 100, y : 400 },
                {x : 100, y : 800 },
                {x : 150, y : 800 },
                {x : 150, y : 0 },
                {x : 100, y : 0 },
                {x : -400, y : 0 },
                {x : -350, y : 200 },
            ],
        },

        {
            label : "slim-plug",
            isStatic : false,
            position : { x : -50, y : 400 },
            vertices: [
                {x : -95, y  :  50 },
                {x : -65, y  : -50 },
                {x :  65, y  : -50 },
                {x :  95, y  :  50 },
                {x :  20, y  :  50 },   // handler
                {x :  20, y  :   90 },  // handler
                {x :  -20, y  :  90 },  // handler
                {x :  -20, y  :  50 },  // handler
            ],
        },

        {
            label    : "ball",
            type     : "circle",
            radio    : 25,
            isStatic : false,
            position : { x : -430, y : 500 },
        },
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
