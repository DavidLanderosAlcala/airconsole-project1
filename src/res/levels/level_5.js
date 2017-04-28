
LevelSelector.getLevels().push({

    title       : "Golf",
    description : "Haz un hoyo en 1",
    bodies : [
        {
            label : "ground",
            isStatic : true,
            position : [ 0.0, 4.0 ],
            vertices : [
                [ -9.6, -2.4  ],
                [ -9.6, -0.8  ],
                [ -2.5, 0  ],
                [ 0.8, 0  ],
                [ 6.7, 0.8  ],
                [ 6.7, -0.5  ],
                [ 8, -0.5  ],
                [ 8, 0.8  ],
                [ 8.9, 0.8  ],
                [ 8.8, -2.4  ]
            ],
        },
        {
            label : "floatingRock",
            isStatic : true,
            position: [0,6],
            vertices : [
                [  -1.4,  0.8  ],
                [  -1.4,  0  ],
                [  1.4,  0  ],
                [  1.4,  0.8  ]
            ]
        },
        {
            label : "ball",
            isStatic : false,
            type : "circle",
            position : [0,5],
            radio : 0.4,
        },
        {
            label : "sensor",
            position : [7.35,4.2],
            isStatic : true,
            isSensor : true,
            vertices : [
                [ -0.4,  0.4 ],
                [ -0.4,  -0.4 ],
                [ 0.4,  -0.4 ],
                [ 0.4,  0.4 ]
            ]
        }
    ],

    hints : [
        {
            label : "solution",
            position  : [0,7],
            vertices : [
                [ -0.3,  -1.6 ],
                [ -0.3,  0.3 ],
                [ -1.6,  0.3 ],
                [ -1.6,  1.1 ],
                [ 0.3,  1.5 ],
                [ 0.2,  -1.6 ],
                [ -0.3,  -1.6 ],
            ]
        }
    ],

    tacks : [
        { bodyA: "floatingRock", bodyB: "null", position : [0,6.4] }
    ],

    setup : function(context)
    {
    	context.gameover = false;
        Physics.getBodyByLabel("ball").mass *= 0.9;
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
        return context.gameover;
    }

});
