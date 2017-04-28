
LevelSelector.getLevels().push({

    title       : "Los abismos",
    description : "Lleva la pelota al hoyo derecho",
    bodies      : [
        {
            label : "plattform1",
            isStatic : true,
            position : [ -12, 1 ],
            vertices: [
                [ -4.4, 0.8 ],
                [ -4.4, -1.6 ],
                [ 4.5, -1.6 ],
                [ 4.5, 0.8 ]
            ],
        },
        {
            label : "plattform2",
            isStatic : true,
            position : [ 0, 1 ],
            vertices: [
                [ -4.4, 0.8 ],
                [ -4.4, -1.6 ],
                [ 4.5, -1.6 ],
                [ 4.5, 0.8 ]
            ],
        },
        {
            label : "plattform3",
            isStatic : true,
            position : [ 12, 1 ],
            vertices: [
                [ -4.4, 0.8 ],
                [ -4.4, -1.6 ],
                [ 4.5, -1.6 ],
                [ 4.5, 0.8 ]
            ],
        },
        {
            label : "ball",
            position : [-6, 12],
            type : "circle",
            radio : 0.5,
        },
        {
            label : "sensor",
            isSensor : true,
            isStatic : true,
            position : [6,0],
            vertices : [
                [-1,-1],
                [-1, 1],
                [ 1, 1],
                [ 1, -1],
            ]
        }
    ],

    hints : [
        {
            label : "triangle",
            position : [-7.5,5],
            vertices : [
                [ -1.06, 4.26 ],
                [ -1.06, 0 ],
                [ 4.26, 0 ],
                [ -1.06, 4.26 ],
            ]
        }
    ],

    decorations: [
        {
            label : "arrow",
            position : [6, 3],
            vertices : [
                [ 0,  3.2 ],
                [ 0,  0 ],
                [ 0.8,  0.8 ],
                [ 0,  0 ],
                [ -0.8,  0.8 ],
                [ 0,  0 ]
            ]
        }
    ],

    setup : function(context)
    {
        context.ball = Physics.getBodyByLabel("ball");
        context.startPos = Physics.getPosition(context.ball);
        context.gameover = false;
        Physics.on("beginContact", function(event){
            if( Physics.getLabel(event.bodyA) == "sensor" || Physics.getLabel(event.bodyA) == "ball" )
            {
                if( Physics.getLabel(event.bodyB) == "sensor" || Physics.getLabel(event.bodyB) == "ball" )
                {
                    Screen.setTitleText("Bien hecho!");
                    context.gameover = true;
                }
            }
        });
    },

    update : function(context)
    {
        if(context.ball.position[1] > 10)
        {
            Physics.setPosition(context.ball, context.startPos);
            Physics.clearForces(context.ball);
        }
        return context.gameover;
    }

});
