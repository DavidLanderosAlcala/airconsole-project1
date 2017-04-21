
LevelSelector.getLevels().push({

    title       : "Sistema de poleas",
    description : "blah blah blah",
    bodies : [
        {
            label : "structureB",
            isStatic : true,
            position : [ 1, 4 ],
            vertices : [
                [ 3.8, 6 ],
                [ 3.8, 0.3 ],
                [ 3.8, -1 ],
                [ -1.9, -1.8 ],
                [ -1.9, -5.2 ],
                [ -3.2, -5.2 ],
                [ -3.2, -3.6 ],
                [ -3.2, -3 ],
                [ -3.2, -1 ],
                [ 0.4, -0.5 ],
                [ 0.4, 2.8 ],
                [ 0, 2.8 ],
                [ 0, -0.3 ],
                [ -3.8, -0.3 ],
                [ -3.8, 2.1 ],
                [ -4.3, 2.1 ],
                [ -4.6, -5.5 ],
                [ 8.8, -5.5 ],
                [ 8.7, 6 ]
             ],
        },
        {
            label : "structureA",
            isStatic : true,
            position : [ 1, 4 ],
            vertices :[
                [ -10.3, -1.6 ],
                [ -10.3, 6 ],
                [ 2.7, 6 ],
                [ 2.7, -0.1 ],
                [ 2, -0.2 ],
                [ 2, 4.3 ],
                [ -1.7, 4.3 ],
                [ -1.7, 0.9 ],
                [ -2, 0.9 ],
                [ -2, 4.3 ],
                [ -6.6, 4.3 ],
                [ -6.6, -1.6 ]
             ],
        },
        {
            label : "obstacle",
            isStatic : false,
            position : [2.2,5],
            vertices : [
                [ 0.7, 1.1 ],
                [ 0.7, -0.9 ],
                [ -0.6, -1.1 ],
                [ -0.6, 1.1 ]
            ]
        },
        {
            label    : "ball",
            type     : "circle",
            radio    : 0.35,
            isStatic : false,
            position : [4.2, 10 ],
        },
        {
            label    : "polea1",
            type     : "circle",
            radio    : 0.35,
            isStatic : false,
            position : [1.2, 6.7 ],
        },
        {
            label    : "polea2",
            type     : "circle",
            radio    : 0.35,
            isStatic : false,
            position : [-0.85, 5 ],
        },
        {
            label    : "polea3",
            type     : "circle",
            radio    : 0.40,
            isStatic : false,
            position : [-3.05, 6 ],
        },

    ],

    tacks : [
        { bodyA: "structureB", bodyB : "polea1", position : [1.2, 6.7 ] },
        { bodyA: "structureA", bodyB : "polea2", position : [-0.85, 5 ] },
        { bodyA: "structureB", bodyB : "polea3", position : [-3.05, 6 ] },
    ],

    setup : function(context)
    {
    	context.game_over = false;     
        Physics.getBodyByLabel("obstacle").mass *= 2.0;
    },

    update : function(context)
    {
        return context.game_over;
    }

});
