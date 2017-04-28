
LevelSelector.getLevels().push({

    title       : "El puente",
    description : "Dibuja un puente",
    bodies      : [
        {
            label : "platformA",
            position : [-7,5],
            isStatic : true,
            vertices : [
                [ -6.4, 0.4 ],
                [ -6.3, -5.5 ],
                [ 4.4, -5.5 ],
                [ 4.4, -0.8 ],
                [ 3.2, -0.8 ],
                [ 3.2, 0.4 ]
            ]
        },
        {
            label : "platformB",
            position : [6,5],
            isStatic : true,
            vertices : [
                [ 6.4,  0.4 ],
                [ 6.4,  -5.5 ],
                [ -2.4,  -5.5 ],
                [ -2.4,  -0.8 ],
                [ -1.2,  -0.8 ],
                [ -1.2,  0.4 ]
             ]
        },
        {
            label : "jeep",
            position : [-10.4, 7.1],
            isStatic : false,
            vertices : [
                [ -1.17,  0.25 ],
                [-1.17,  -0.34 ],
                [-1.05,  -0.37 ],
                [-1.17,  -0.37 ],
                [-1.17,  -0.49 ],
                [-1.11,  -0.55 ],
                [-1.01,  -0.55 ],
                [-0.98,  -0.55 ],
                [-0.8,  -0.25 ],
                [-0.43,  -0.25 ],
                [-0.34,  -0.28 ],
                [-0.18,  -0.52 ],
                [0.74,  -0.52 ],
                [0.77,  -0.52 ],
                [0.95,  -0.25 ],
                [1.01,  -0.22 ],
                [1.45,  -0.22 ],
                [1.51,  -0.25 ],
                [1.54,  -0.37 ],
                [1.57,  -0.55 ],
                [1.69,  -0.49 ],
                [1.69,  -0.4 ],
                [1.6,  -0.37 ],
                [1.57,  -0.31 ],
                [1.63,  -0.31 ],
                [1.45,  -0.03 ],
                [0.71,  0.06 ],
                [0.52,  0.43 ],
                [0.46,  0.46 ],
                [-0.8,  0.49 ],
                [-0.86,  0.49 ],
                [-0.89,  0.46 ],
                [-0.95,  0.25 ]
            ]
        },
        {
            label : "wheel1",
            isStatic : false,
            position : [-11, 6.2],
            vertices : [
                [ -0.1,  0.45 ],
                [0.11,  0.45 ],
                [0.11,  0.39 ],
                [0.19,  0.34 ],
                [0.26,  0.39 ],
                [0.39,  0.25 ],
                [0.34,  0.2 ],
                [0.38,  0.1 ],
                [0.45,  0.1 ],
                [0.45,  -0.1 ],
                [0.38,  -0.11 ],
                [0.34,  -0.19 ],
                [0.39,  -0.26 ],
                [0.26,  -0.39 ],
                [0.19,  -0.34 ],
                [0.11,  -0.38 ],
                [0.11,  -0.45 ],
                [-0.1,  -0.45 ],
                [-0.1,  -0.38 ],
                [-0.19,  -0.34 ],
                [-0.25,  -0.39 ],
                [-0.39,  -0.24 ],
                [-0.34,  -0.19 ],
                [-0.37,  -0.11 ],
                [-0.45,  -0.1 ],
                [-0.45,  0.1 ],
                [-0.39,  0.1 ],
                [-0.34,  0.19 ],
                [-0.39,  0.25 ],
                [-0.25,  0.39 ],
                [-0.19,  0.34 ],
                [-0.1,  0.39 ]
            ]
        },
        {
            label : "wheel2",
            isStatic : false,
            position : [-9.15, 6.2],
            vertices : [
                [ -0.1,  0.45 ],
                [0.11,  0.45 ],
                [0.11,  0.39 ],
                [0.19,  0.34 ],
                [0.26,  0.39 ],
                [0.39,  0.25 ],
                [0.34,  0.2 ],
                [0.38,  0.1 ],
                [0.45,  0.1 ],
                [0.45,  -0.1 ],
                [0.38,  -0.11 ],
                [0.34,  -0.19 ],
                [0.39,  -0.26 ],
                [0.26,  -0.39 ],
                [0.19,  -0.34 ],
                [0.11,  -0.38 ],
                [0.11,  -0.45 ],
                [-0.1,  -0.45 ],
                [-0.1,  -0.38 ],
                [-0.19,  -0.34 ],
                [-0.25,  -0.39 ],
                [-0.39,  -0.24 ],
                [-0.34,  -0.19 ],
                [-0.37,  -0.11 ],
                [-0.45,  -0.1 ],
                [-0.45,  0.1 ],
                [-0.39,  0.1 ],
                [-0.34,  0.19 ],
                [-0.39,  0.25 ],
                [-0.25,  0.39 ],
                [-0.19,  0.34 ],
                [-0.1,  0.39 ]
            ]
        },    
        {
            label : "sensor",
            isStatic : true,
            isSensor : true,
            position : [10, 6],
            vertices : [
                [ -1.6, 0.8 ],
                [ -1.6, -0.8 ],
                [ 1.6, -0.8 ],
                [ 1.6, 0.8 ]
            ]
        }
    ],

    tacks : [
        { bodyA : "jeep", bodyB : "wheel1", position : [-11, 6.2] },
        { bodyA : "jeep", bodyB : "wheel2", position : [ -9.15, 6.2] }
    ],

    hints : [
        {
            label : "bridge",
            position : [0.4,8],
            vertices : [
                [ 3.9, 0.4 ],
                [ 3.9, -0.8 ],
                [ -3.9, -0.8 ],
                [ -3.9, 0.4 ],
                [ 3.9, 0.4 ],
            ]
        }
    ],

    setup : function(context)
    {
         context.gameover = false;
         context.speed = 0;
         context.wheel1 = Physics.getBodyByLabel("wheel1");
         context.wheel2 = Physics.getBodyByLabel("wheel2");
         Physics.on("addBody", function(){
            context.speed = 10.0;
         });

        Physics.on("beginContact", function(event){
            if( Physics.getLabel(event.bodyA) == "sensor" || Physics.getLabel(event.bodyA) == "jeep" )
            {
                if( Physics.getLabel(event.bodyB) == "sensor" || Physics.getLabel(event.bodyB) == "jeep" )
                {
                    Screen.setTitleText("Bien hecho!");
                    context.gameover = true;
                }
            }
        });
    },

    update : function(context)
    {
        context.wheel1.angularVelocity = context.speed;
        context.wheel2.angularVelocity = context.speed;
        if(context.gameover)
        {
            context.wheel1.angularVelocity = -10;
            context.wheel2.angularVelocity = -10;
        }
        return context.gameover;
    }

});
