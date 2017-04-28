
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
        }
    ],

    tacks : [
        { bodyA: "floatingRock", bodyB: "null", position : [0,6.4] }
    ],

    setup : function(context)
    {
    	context.game_over = false;
        
    },

    update : function(context)
    {
        return context.game_over;
    }

});
