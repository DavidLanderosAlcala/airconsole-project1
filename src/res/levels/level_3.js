
LevelSelector.getLevels().push({

    title       : "Cruza el pozo",
    description : "Haz cruzar la pelota",
    bodies      : [
        {
            label : "towerA",
            isStatic : true,
            position : { x : -400, y : 100 },
            vertices: [
                {x : 0, y : 400 },
                {x : 0, y : 0 },
                {x : 400, y : 0 },
                {x : 400, y : 400 },
            ],
        },
        {
            label : "towerB",
            isStatic : true,
            position : { x : 400, y : 100 },
            vertices: [
                {x : 0, y : 400 },
                {x : 0, y : 0 },
                {x : 400, y : 0 },
                {x : 400, y : 400 },
            ],
        },
        {
            label    : "ball",
            isStatic : false,
            position : { x : -300, y : 600 },
            type     : "circle",
            radio    : 25,
        },
    ],

    setup : function(context, engine)
    {
        context.gameover = false;
        Matter.Events.on(engine, 'collisionActive', function(event) {
            var pairs = event.pairs;
            var l = pairs.length;
            for(var i = 0; i < l; i++)
            {
                if(pairs[i].bodyA.label == "towerB" || pairs[i].bodyA.label == "ball")
                {
                    if(pairs[i].bodyB.label == "towerB" || pairs[i].bodyB.label == "ball")
                    {
                        context.gameover = true;
                    }
                }
                
            }
            console.log(event.pairs[0].bodyA.label + event.pairs[0].bodyB.label);
        });
    },

    update : function(context, engine)
    {
        return context.gameover;
    }

});
