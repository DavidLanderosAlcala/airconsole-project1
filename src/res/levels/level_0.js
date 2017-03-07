
LevelSelector.getLevels().push({

	title : "Level 0",

	description : "Draw a shape",

    bodies : [
        {
            label : "ground",
            isStatic : true,
            position : {x : 0, y : 100 },
            vertices: [
                {x : -400, y : 0 },
                {x : -400, y : 100 },
                {x : 400, y : 100 },
                {x : 400, y : 0 }
            ],
        },
    ],

    setup : function(world)
    {
        var bodies = Matter.Composite.allBodies(world);
        console.log(bodies[0]);
    },

    update : function()
    {
        return false;
    }

});