
LevelSelector.getLevels().push({

    title       : "Level 0",
    description : "???????",
    bodies      : [
        {
            label : "ground",
            isStatic : true,
            position : { x : 0, y : 1 },
            vertices: [
                {x : -6, y : 0 },
                {x : -6, y : 1 },
                {x : 6,  y : 1 },
                {x : 6,  y : 0 }
            ],
        },
        {
            label : "rock",
            isStatic : false,
            position : { x : 0, y : 2 },
            vertices: [
                {x : -0.50, y : 0 },
                {x : -0.50, y : 1 },
                {x : 0.50,  y : 1 },
                {x : 0.50,  y : 0 }
            ],
        },
        {
            label : "rock",
            isStatic : false,
            position : { x : 0, y : 3 },
            vertices: [
                {x : -0.50, y : 0 },
                {x : -0.50, y : 1 },
                {x :  0.50,  y : 1 },
                {x :  0.50,  y : 0 }
            ],
        },
        {
            label : "rock",
            isStatic : false,
            position : { x : 0, y : 4 },
            vertices: [
                {x : -0.50, y : 0 },
                {x : -0.50, y : 1 },
                {x :  0.50,  y : 1 },
                {x :  0.50,  y : 0 }
            ],
        },

        {
            label : "platform",
            isStatic : true,
            position : { x : 0, y : 6 },
            vertices: [
                {x : -0.80, y : 0 },
                {x : -0.80, y : 0.50 },
                {x : 0.80,  y : 0.50 },
                {x : 0.80,  y : 0 }
            ],
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
