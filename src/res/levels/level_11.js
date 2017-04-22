
LevelSelector.getLevels().push({

    title       : "La ban",
    description : "Haz que las pelotas se toquen",
    bodies : [
        {
            label : "ground",
            isStatic : true,
            position : [ 0.0, 0.0 ],
            vertices : [[ -20.0, 0.0 ],
                        [ -20.0, 1.0 ],
                        [ 20.0,  1.0 ],
                        [ 20.0,  0.0 ]],
        },
        {
            label : "ban",
            position : [-0.3, 3],
            isStatic : false,
            vertices : [
                [ -1.5, 0.8 ],
                [ -1.5, -0.8 ],
                [ 2.1, -0.8 ],
                [ 2.1, 0 ],
                [ 1.1, 0.1 ],
                [ 1, 0.8 ]
            ]
        },
        {
            label : "wheel1",
            isStatic : false,
            position : [-1, 2.2],
            type : "circle",
            radio : 0.5,
        },
        {
            label : "wheel2",
            isStatic : false,
            position : [1, 2.2],
            type : "circle",
            radio : 0.5,
        },
        {
            label : "ball1",
            isStatic : false,
            position : [-3, 2],
            type : "circle",
            radio : 1.0,
        },
        {
            label : "ball2",
            isStatic : false,
            position : [3, 2],
            type : "circle",
            radio : 1.0,
        },        
    ],

    tacks : [
        { bodyA : "ban", bodyB : "wheel1", position : [-1, 2.2] },
        { bodyA : "ban", bodyB : "wheel2", position : [ 1, 2.2] }
    ],

    setup : function(context)
    {
    	context.game_over = false;
        Physics.getBodyByLabel("obstacle").mass *= 1.5;
    },

    update : function(context)
    {
        return context.game_over;
    }

});

