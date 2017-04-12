
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
                { "x": -2.9, "y": 3.6 },
                { "x": -1.9, "y": 3.6 },
                { "x": -1.9, "y": 2.6 },
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
            position : { x : -2.5, y : 6.2},
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
            position : { x : -2.5, y : 6.9},
            vertices : [
                { "x": 0.63, "y": -0.94 },
                { "x": 0.63, "y": 0.31 },
                { "x": 0.71, "y": 0.67 },
                { "x": 0.63, "y": 0.87 },
                { "x": 0, "y": 0.87 },
                { "x": -0.31, "y": 0.63 },
                { "x": -0.63, "y": 0.94 },
                { "x": -1.57, "y": 0.94 },
                { "x": -2.01, "y": 0.63 },
                { "x": -2.08, "y": 0.51 },
                { "x": -2.08, "y": 0.35 },
                { "x": -2.04, "y": 0.24 },
                { "x": -1.97, "y": 0.16 },
                { "x": -1.85, "y": 0.12 },
                { "x": -1.69, "y": 0.16 },
                { "x": -1.61, "y": 0.2 },
                { "x": -1.45, "y": 0.28 },
                { "x": -1.3, "y": 0.24 },
                { "x": -1.18, "y": 0.24 },
                { "x": -1.02, "y": 0.2 },
                { "x": -0.83, "y": 0.12 },
                { "x": -0.71, "y": 0.04 },
                { "x": -0.59, "y": -0.08 },
                { "x": -0.47, "y": -0.16 },
                { "x": -0.47, "y": -0.31 },
                { "x": -0.51, "y": -0.55 },
                { "x": -0.59, "y": -0.75 },
                { "x": -0.63, "y": -0.87 },
                { "x": -0.63, "y": -1.02 },
                { "x": 0.63, "y": -0.94 },
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
