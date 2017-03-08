
LevelSelector.getLevels().push({

    title       : "el hielo en el vaso",
    description : "Saca el hielo del vaso",
    bodies      : [
        {
            label : "ground",
            isStatic : true,
            position : { x : 0, y : 100 },
            vertices: [
                {x : -500, y : 50 },
                {x : -500, y : 0 },
                {x : 500, y : 0 },
                {x : 500, y : 50 },
            ],
        },
        {
            label : "cup",
            isStatic : false,
            position : { x : -0, y : 500 },
            vertices: [
                {x : -100, y : 300 },
                {x : -100, y : 0 },
                {x : 100, y : 0 },
                {x : 100, y : 300 },
                {x : 80, y : 300 },
                {x : 80, y : 50 },
                {x : -80, y : 50 },
                {x : -80, y : 300 },
            ],
        },
        {
            label : "ice",
            isStatic : false,
            position : { x : 0, y : 1000 },
            vertices: [
                {x : -25, y : 25 },
                {x : -25, y : -25 },
                {x : 25, y : -25 },
                {x : 25, y : 25 },
            ],
        },
    ],

    setup : function(context, engine)
    {

    },

    update : function(context, engine)
    {
        return false;
    }

});
