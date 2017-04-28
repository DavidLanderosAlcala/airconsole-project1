
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
            label : "car",
            position : [-8, 6],
            isStatic : false,
            vertices : [
                [ -2.4,  0.8 ],
                [ -2.4,  0 ],
                [ -1.6,  0 ],
                [ -1.5,  0.4 ],
                [ -1,  0.4 ],
                [ -0.8,  0 ],
                [ 0.4,  0 ],
                [ 0.6,  0.4 ],
                [ 1,  0.4 ],
                [ 1.3,  0 ],
                [ 1.9,  0 ],
                [ 1.9,  0.3 ],
                [ 1.4,  0.6 ],
                [ 0.6,  0.7 ],
                [ -0.1,  1.1 ],
                [ -1.2,  1.1 ],
                [ -1.5,  0.8 ],
                [ -2.2,  0.7 ]
            ]
        },
        {
            label : "wheel1",
            isStatic : false,
            type : "circle",
            position : [-9.15,6],
            radio : 0.4,
        },
        {
            label : "wheel2",
            isStatic : false,
            type : "circle",
            position : [-7.15,6],
            radio : 0.4,
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
        { bodyA: "car", bodyB: "wheel1", position: [-9.15,6] },
        { bodyA: "car", bodyB: "wheel2", position: [-7.15,6] },
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
            if( Physics.getLabel(event.bodyA) == "sensor" || Physics.getLabel(event.bodyA) == "car" )
            {
                if( Physics.getLabel(event.bodyB) == "sensor" || Physics.getLabel(event.bodyB) == "car" )
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
        if(context.gameover)
        {
            context.wheel1.angularVelocity = -30;
            context.wheel2.angularVelocity = -30;
        }
        return context.gameover;
    }

});
