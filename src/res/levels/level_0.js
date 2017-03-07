
LevelSelector.getLevels().push({

	title : "Level 0",

	description : "Draw a shape",

    bodies : [
        {
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

    success : function() {
        return false;
    }

});