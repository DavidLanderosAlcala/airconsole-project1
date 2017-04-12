
LevelSelector.getLevels().push({

    title       : "Que no caiga",
    description : "Click At the indicated point",
    bodies      : [
        {
            label : "towerA",
            isStatic : true,
            position : { x : 0, y : 3 },
            vertices: [
                { "x": -6.2, "y": 1 },
                { "x": 3.5, "y": 1 },
                { "x": -5.3, "y": -0.6 },
                { "x": -5.3, "y": -2.2 },
                { "x": 3.5, "y": -3 },
                { "x": -5.3, "y": -3.8 },
                { "x": -5.3, "y": -4.6 },
                { "x": 4.3, "y": -3.8 },
                { "x": 4.3, "y": -2.2 },
                { "x": -4.5, "y": -1.4 },
                { "x": 4.3, "y": 0.2 },
                { "x": 4.3, "y": 1.8 },
                { "x": -2.9, "y": 1.8 },
                { "x": -2.9, "y": 2.6 },
                { "x": 5.1, "y": 2.6 },
                { "x": 5.1, "y": -5.4 },
                { "x": -6.1, "y": -5.4 }
            ],
        },
        {
            label : "ball",
            isStatic : false,
            position : { x : -2, y : 4.5 },
            type : "circle",
            radio : 0.25,
        },
        {
            label : "sensor",
            isStatic : true,
            isSensor : true,
            position : { x : 0, y : 2.8 },
            vertices: [
                {x : -0.25, y : 0.25 },
                {x : -0.25, y : -0.25 },
                {x : 0.25, y : -0.25 },
                {x : 0.25, y : 0.25 },
            ],
        },
    ],

    hints: [
        {
            label : "arrow",
            opacity : 0.8,
            position : { x : -2, y : 5.2},
            vertices : [
                { "x": 0, "y": 0 },
                { "x": -2.5, "y": 2 },
                { "x": 0, "y": 0 },
                { "x": 0, "y": 0.8 },
                { "x": 0, "y": 0 },
                { "x": -0.8, "y": 0 }
            ]
        },
        {
            label : "shape",
            opacity : 0.0,
            position : { x : -2.5, y : 4.8},
            vertices : [
                { "x": -0.8, "y": 2.4 },
                { "x": -0.8, "y": 0 },
                { "x": 0.8, "y": 0 },
                { "x": 0.8, "y": 2.4 },
                { "x": -0.8, "y": 2.4 }
            ]
        },
    ],

    setup : function(context)
    {
        context.gameover = false;
        CrayonPhysics.on("addTack", function(){
            Screen.setTitleText("Great!, Now draw a shape overlapping the pin");
            CrayonPhysics.getHints()[0].opacity = 0.0;
            CrayonPhysics.getHints()[1].opacity = 0.3;
        });

        Physics.on("beginContact", function(event){
            if( Physics.getLabel(event.bodyA) == "sensor" || Physics.getLabel(event.bodyA) == "ball" )
            {
                if( Physics.getLabel(event.bodyB) == "sensor" || Physics.getLabel(event.bodyB) == "ball" )
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
