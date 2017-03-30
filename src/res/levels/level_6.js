
LevelSelector.getLevels().push({

    title       : "Level 0",
    description : "???????",
    bodies      : [
        {
            label : "ground",
            isStatic : true,
            position : { x : 0, y : 100 },
            vertices: [
                {x : -600, y : 0 },
                {x : -600, y : 100 },
                {x : 600,  y : 100 },
                {x : 600,  y : 0 }
            ],
        },
        {
            label : "rock",
            isStatic : false,
            position : { x : 0, y : 200 },
            vertices: [
                {x : -50, y : 0 },
                {x : -50, y : 100 },
                {x : 50,  y : 100 },
                {x : 50,  y : 0 }
            ],
        },
        {
            label : "rock",
            isStatic : false,
            position : { x : 0, y : 300 },
            vertices: [
                {x : -50, y : 0 },
                {x : -50, y : 100 },
                {x : 50,  y : 100 },
                {x : 50,  y : 0 }
            ],
        },
        {
            label : "rock",
            isStatic : false,
            position : { x : 0, y : 400 },
            vertices: [
                {x : -50, y : 0 },
                {x : -50, y : 100 },
                {x : 50,  y : 100 },
                {x : 50,  y : 0 }
            ],
        },

        {
            label : "platform",
            isStatic : true,
            position : { x : 0, y : 600 },
            vertices: [
                {x : -80, y : 0 },
                {x : -80, y : 50 },
                {x : 80,  y : 50 },
                {x : 80,  y : 0 }
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
