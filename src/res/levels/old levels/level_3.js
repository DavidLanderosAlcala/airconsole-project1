
LevelSelector.getLevels().push({

    title       : "Patea el balon",
    description : "Haz click en el punto indicado",
    bodies      : [
        {
            label : "towerA",
            isStatic : true,
            position : [ 0, 3 ],
            vertices: [
                 [ -6.2,  1 ],
                 [ 3.5,   1 ],
                 [ -5.3,  -0.6 ],
                 [ -5.3,  -2.2 ],
                 [ 3.5,  -3 ],
                 [ -5.3,  -3.8 ],
                 [ -5.3,  -4.6 ],
                 [ -6.1,  -5.4 ],
            ],
        },
        {
            label : "towerB",
            isStatic : true,
            position : [ 0,  3 ],
            vertices: [
                [ -5.3,  -4.6 ],
                [ 4.3,  -3.8 ],
                [ 4.3,  -2.2 ],
                [ -4.5,  -1.4 ],
                [ 4.3,  0.2 ],
                [ 4.3,  1.8 ],
                [ -2.9,  1.9 ],
                [ -2.9,  3.9 ],
                [ -1.9,  3.9 ],
                [ -1.9,  2.6 ],
                [ 5.1,  2.6 ],
                [ 5.1,  -5.4 ],
                [ -6.1,  -5.4 ]
            ],
        },
        {
            label : "ball",
            isStatic : false,
            position : [ -2, 4.5 ],
            type : "circle",
            radio : 0.25,
        },
        {
            label : "sensor",
            isStatic : true,
            isSensor : true,
            position : [ 0, 2.8 ],
            vertices: [
                [ -0.25, 0.25 ],
                [ -0.25, -0.25 ],
                [ 0.25, -0.25 ],
                [ 0.25, 0.25 ],
            ],
        },
    ],

    hints: [
        {
            label : "arrow",
            opacity : 0.8,
            position : [-2.5, 6.5],
            vertices : [
                [ 0,  0 ],
                [ -2.5,  2 ],
                [ 0,  0 ],
                [ 0,  0.8 ],
                [ 0,  0 ],
                [ -0.8,  0 ]
            ]
        },
        {
            label : "shape",
            opacity : 0.0,
            position : [-2.5, 7.0],
            vertices : [
                [ 0.63,  -0.94 ],
                [ 0.63,  0.31 ],
                [ 0.71,  0.67 ],
                [ 0.63,  0.87 ],
                [ 0,  0.87 ],
                [ -0.31,  0.63 ],
                [ -0.63,  0.94 ],
                [ -1.57,  0.94 ],
                [ -2.01,  0.63 ],
                [ -2.08,  0.51 ],
                [ -2.08,  0.35 ],
                [ -2.04,  0.24 ],
                [ -1.97,  0.16 ],
                [ -1.85,  0.12 ],
                [ -1.69,  0.16 ],
                [ -1.61,  0.2 ],
                [ -1.45,  0.28 ],
                [ -1.3,  0.24 ],
                [ -1.18,  0.24 ],
                [ -1.02,  0.2 ],
                [ -0.83,  0.12 ],
                [ -0.71,  0.04 ],
                [ -0.59,  -0.08 ],
                [ -0.47,  -0.16 ],
                [ -0.47,  -0.31 ],
                [ -0.51,  -0.55 ],
                [ -0.59,  -0.75 ],
                [ -0.63,  -0.87 ],
                [ -0.63,  -1.02 ],
                [ 0.63,  -0.94 ],
            ]
        },
    ],

    setup : function(context)
    {
        context.gameover = false;
        Game.on("addTack", function(){
            Screen.setTitleText("Perfecto!, ahora dibuja una figura encerrando la marca circular");
            Game.getHints()[0].opacity = 0.0;
            Game.getHints()[1].opacity = 0.3;
        });

        Physics.on("beginContact", function(event){
            if( Physics.getLabel(event.bodyA) == "sensor" || Physics.getLabel(event.bodyA) == "ball" )
            {
                if( Physics.getLabel(event.bodyB) == "sensor" || Physics.getLabel(event.bodyB) == "ball" )
                {
                    Screen.setTitleText("Lo lograste!");
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
