
LevelSelector.getLevels().push({

    title       : "La grua",
    description : "Despata la coladera",
    bodies      : [
        {
            label : "pieceA",
            isStatic : true,
            position : [ -5, 0 ],
            vertices: [
                [ -8, 8 ],
                [ -8, 0 ],
                [ 4, 0 ],
                [ 3.5, 2 ],
            ],
        },

        {
            label : "pieceB",
            isStatic : true,
            position : [ 3.8, 0 ],
            vertices: [
                [ 1, 4 ],
                [ 1, 8 ],
                [ 1.5, 8 ],
                [ 1.5, 0 ],
                [ 1, 0 ],
                [ -4, 0 ],
                [ -3.5, 2 ],
            ],
        },

        {
            label : "slim-plug",
            isStatic : false,
            position : [ -0.50, 4 ],
            vertices: [
                [-0.95,  0.50 ],
                [-0.65, -0.50 ],
                [ 0.65, -0.50 ],
                [ 0.95,  0.50 ],
                [ 0.20,  0.50 ],  
                [ 0.20,   0.90 ], 
                [ -0.20,  0.90 ], 
                [ -0.20,  0.50 ], 
            ],
        },

        {
            label    : "ball",
            type     : "circle",
            radio    : 0.25,
            isStatic : false,
            position : [-4.3, 5 ],
        },
        {
            isStatic : true,
            label : "tap",
            position: [ -5, 8 ],
            vertices : [
                [ -0.70, 0.80 ],
                [ -1.60, 0.70 ],
                [ -1.60, 0.90 ],
                [ 0.50, 0.90 ],
                [ 0.50, 0.70 ],
                [ -0.40, 0.80 ],
                [ -0.40, 0.40 ],
                [ 0.90, 0.40 ],
                [ 0.90, -0.20 ],
                [ 1.10, -0.20 ],
                [ 1.10, -0.40 ],
                [ 0.10, -0.40 ],
                [ 0.10, -0.20 ],
                [ 0.30, -0.20 ],
                [ 0.30, 0 ],
                [ -0.70, 0 ],
                [ -9.60, 0 ],
                [ -9.60, 0.40 ],
                [ -0.70, 0.40 ]
            ]
        },
        {
            label    : "gear",
            type     : "circle",
            radio    : 0.8,
            isStatic : false,
            position : [5.05,7.7],
        },
    ],

    tacks : [
        { bodyA: "pieceB", bodyB : "gear", position: [5.05,7.7]  }
    ],

    setup : function(context, engine)
    {
    	context.game_over = false;
    },

    update : function(context, engine)
    {
        return context.game_over;
    }

});
