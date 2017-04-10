
LevelSelector.getLevels().push({

    title       : "Level 0",
    description : "Despata la coladera",
    bodies      : [
        {
            label : "plattformA",
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
            label : "plattformA",
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
            label : "rock",
            isStatic : false,
            position : { x : -50, y : 400 },
            vertices: [
                {x : -60, y  :  90 },
                {x : -60, y  : -90 },
                {x :  60, y  : -90 },
                {x :  60, y  :  90 },
            ],
        },

        {
            label    : "ball",
            type     : "circle",
            radio    : 25,
            isStatic : false,
            position : { x : -430, y : 500 },
        },
        {
            label    : "ball",
            type     : "circle",
            radio    : 25,
            isStatic : false,
            position : { x : -380, y : 500 },
        },
        {
            label    : "ball",
            type     : "circle",
            radio    : 25,
            isStatic : false,
            position : { x : -400, y : 600 },
        },
        {
            label    : "ball",
            type     : "circle",
            radio    : 25,
            isStatic : false,
            position : { x : -400, y : 400 },
        },
        {
            label    : "ball",
            type     : "circle",
            radio    : 25,
            isStatic : false,
            position : { x : -500, y : 500 },
        },
        {
            label    : "ball",
            type     : "circle",
            radio    : 25,
            isStatic : false,
            position : { x : -400, y : 550 },
        },
        {
            label    : "ball",
            type     : "circle",
            radio    : 25,
            isStatic : false,
            position : { x : 300, y : 550 },
        },
        {
            label    : "ball",
            type     : "circle",
            radio    : 25,
            isStatic : false,
            position : { x : 300, y : 500 },
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
