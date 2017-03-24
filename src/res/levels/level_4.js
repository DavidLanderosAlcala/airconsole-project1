
LevelSelector.getLevels().push({

    title       : "Pelota al vaso",
    description : "Mete la pelota al vaso",
    bodies      : [
        {
            label : "towerA",
            isStatic : true,
            position : { x : -400, y : 100 },
            vertices: [
                {x : 0, y : 300 },
                {x : 0, y : 0 },
                {x : 400, y : 0 },
                {x : 400, y : 300 },
            ],
        },
        {
            label    : "ball",
            isStatic : false,
            position : { x : -300, y : 600 },
            type     : "circle",
            radio    : 25,
        },
        {
            label : "cup",
            isStatic : true,
            position : { x : 500, y : 200 },
            vertices: [
                {x : -100, y : 300 },
                {x : -100, y : 0 },
                {x : 100, y : 0 },
                {x : 100, y : 300 },
                {x : 80, y : 300 },
                {x : 50, y : 80 },
                {x : -50, y : 80 },
                {x : -80, y : 300 }
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
