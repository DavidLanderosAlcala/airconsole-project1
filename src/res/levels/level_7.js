
LevelSelector.getLevels().push({

    title       : "Que no caiga",
    description : "Haz que las pelotas se toquen",
    bodies      : [
        {
            label : "towerA",
            isStatic : true,
            position : [ 2, 3 ],
            vertices: [
                [ 0, 2.4 ],
                [ 0, 0 ],
                [ 3.2, 0 ],
                [ 3.2, 0.8 ],
                [ 0.8, 0.8 ],
                [ 0.8, 4.8 ],
                [ 0, 4.8 ]
            ],
        },
        {
            label : "towerB",
            isStatic : true,
            position : [ -2, 3 ],
            vertices: [
                [ 0, 2.4 ],
                [ 0, 0 ],
                [ -3.2, 0 ],
                [ -3.2, 0.8 ],
                [ -0.8, 0.8 ],
                [ -0.8, 4.8 ],
                [ 0, 4.8 ]
            ],
        },
        {
            label : "ballA",
            position : [ -3.5, 10 ],
            type : "circle",
            radio : 0.25,
        },
        {
            label : "ballB",
            position : [ 3.5, 10 ],
            type : "circle",
            radio : 0.25,
        },
    ],

    setup : function(context)
    {
    	context.time = new Date().getTime();
        context.gameover = false;
        context.ballA = Physics.getBodyByLabel("ballA");
        context.ballAStartPos = Physics.getPosition(context.ballA);
        context.ballB = Physics.getBodyByLabel("ballB");
        context.ballBStartPos = Physics.getPosition(context.ballB);

        Physics.on("beginContact", function(event){
            if( Physics.getLabel(event.bodyA) == "ballA" || Physics.getLabel(event.bodyB) == "ballA" )
            {
                if( Physics.getLabel(event.bodyA) == "ballB" || Physics.getLabel(event.bodyB) == "ballB" )
                {
                    Screen.setTitleText("Buen trabajo!");
                    context.gameover = true;
                }
            }
        });
    },

    update : function(context)
    {
        if(Physics.getPosition(context.ballA)[1]> Screen.getHeight())
        {
            Physics.setPosition(context.ballA, context.ballAStartPos);
            Physics.clearForces(context.ballA);
        }
        if(Physics.getPosition(context.ballB)[1]> Screen.getHeight())
        {
            Physics.setPosition(context.ballB, context.ballBStartPos);
            Physics.clearForces(context.ballB);
        }
        return context.gameover;
    }

});
