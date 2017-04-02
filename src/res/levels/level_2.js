
LevelSelector.getLevels().push({

    title       : "La pelota en el vaso",
    description : "Saca la pelota del vaso",
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
        {
            hint : true,
            label : "hint",

            position : { x : 195, y : 510 },
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
                }
            ]
        },
    ],

    setup : function(context, engine)
    {
        context.gameover = false;
        // si ocurre una colision cualquiera el nivel esta terminado
        //Matter.Events.on(engine, 'collisionActive', function(event) {
        //    var pairs = event.pairs;
        //    var l = pairs.length;
        //    for(var i = 0; i < l; i++)
        //    {
        //        if(pairs[i].bodyA.label == "ground" || pairs[i].bodyA.label == "ball")
        //        {
        //            if(pairs[i].bodyB.label == "ground" || pairs[i].bodyB.label == "ball")
        //            {
        //                context.gameover = true;
        //            }
        //        }
        //        
        //    }
        //    console.log(event.pairs[0].bodyA.label + event.pairs[0].bodyB.label);
        //});
    },

    update : function(context, engine)
    {
        return context.gameover;
    }

});
