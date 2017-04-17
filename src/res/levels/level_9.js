
LevelSelector.getLevels().push({

    title       : "Level 7",
    description : "Sube la caja al pickup",
    bodies : [
        {
            label : "lane",
            isStatic : true,
            position : [ -3, 1 ],
            vertices: [ [ -4, 0 ],
                        [ -4, 1 ],
                        [ 4, 1 ],
                        [ 4, 0 ],
                      ],
        },
        {
            label : "wheel",
            isStatic : true,
            type : "circle",
            position : [ 4.7, 2.5 ],
            radio : 0.4,
        },
        {
            label : "wheel",
            isStatic : true,
            type : "circle",
            position : [ 8.7, 2.5 ],
            radio : 0.4,
        },
        {
            label : "box",
            isStatic : false,
            position : [ -8, 10 ],
            vertices: [
                [ -0.30, 0.30 ],
                [ -0.30, -0.30 ],
                [ 0.30, -0.30 ],
                [ 0.30, 0.30 ],
            ],
        },
        {
            label : "base",
            isStatic : true,
            position : [ -10, 5 ],
            vertices : [
                [ 2.9, 0 ],
                [ 2.9, 0.5 ],
                [ 3.7, 0.5 ],
                [ 3.7, -0.8 ],
                [ -2.7, -0.8 ],
                [ -2.7, 0 ],
                [ -2.7, 1.8 ],
                [ 0, 1.8 ],
                [ 0, 0 ]
            ]
        },
        {
            label : "sensor",
            isStatic : true,
            isSensor : true,
            position : [ 4.7, 4 ],
            vertices: [
                [ -1.5,  0.50 ],
                [ -1.5, -0.50 ],
                [  1.5, -0.50 ],
                [  1.5,  0.50 ],
            ],
        },
        {
            label : "pickup",
            isStatic : true,
            position : [ 6, 3 ],
            vertices: [
                [ -3.2, 0.6 ],
                [ -3.2, -0.4 ],
                [ -1.8, -0.4 ],
                [ -1.8, -0.2 ],
                [ -1.6, 0 ],
                [ -1.4, 0 ],
                [ -1.2, 0 ],
                [ -0.9, -0.1 ],
                [ -0.8, -0.4 ],
                [ 2.4, -0.4 ],
                [ 2.4, -0.2 ],
                [ 2.5, 0 ],
                [ 2.8, 0 ],
                [ 3, 0 ],
                [ 3.2, -0.2 ],
                [ 3.2, -0.4 ],
                [ 4.2, -0.4 ],
                [ 4.2, 0.1 ],
                [ 4.2, 0.4 ],
                [ 3.9, 0.6 ],
                [ 2.5, 0.6 ],
                [ 2.3, 1 ],
                [ 2, 1.4 ],
                [ 1.6, 1.6 ],
                [ 0, 1.6 ],
                [ 0, 0.6 ]
            ],
        },
    ],

    hints: [
        {
            opacity : 1.0,
            position : [ -3 , 1.5 ],
            vertices : [
                [ -0.79,  0 ],
                [ 0.74,  0 ],
                [ 0.36,  0.38 ],
                [ 0.74,  0 ],
                [ 0.36,  -0.38 ],
                [ 0.74,  0 ]
            ],
        },
        {
            position : [ 7.4 ,  3.6 ],
            opacity : 1.0,
            vertices : [
                [ -0.8,  0.8 ],
                [ -0.8,  0 ],
                [ 0.8,  0 ],
                [ 0,  0.8 ],
                [ -0.8,  0.8 ]
            ]
        }
    ],

    setup : function(context)
    {
        /* creamos un array en el objeto context
           el cual contiene los objetos que estan tocando la cinta transportadora */
        context.gameover = false;
        context.objects_over_lane = [];

        var bodies = Physics.getAllBodies();
        for(var i = 0; i < bodies.length; i++)
        {
            if(Physics.getLabel(bodies[i]) == "box")
            {
                context.box = bodies[i];
                context.box_start_position = Physics.getPosition(context.box);
                break;
            }
        }

	    /* cuando INICIA una colision, revisamos si la cinta transportadora esta involucrada */
        Physics.on("beginContact", function(event){
            if( Physics.getLabel(event.bodyA) == "lane" )
            {
                /* Metemos el objeto al arreglo */
                context.objects_over_lane.push(event.bodyB);
            }
            if( Physics.getLabel(event.bodyB) == "lane" )
            {
                /* Metemos el objeto al arreglo */
                context.objects_over_lane.push(event.bodyA);
            }
            if( Physics.getLabel(event.bodyA) == "sensor" || Physics.getLabel(event.bodyB) == "sensor" )
            {
                if( Physics.getLabel(event.bodyA) == "box" || Physics.getLabel(event.bodyB) == "box" )
                {
                    context.gameover = true;
                }
            }
        });

        /* cuando TERMINA una colision, revisamos si la cinta transportadora esta involucrada */
        Physics.on("endContact", function(event){
            if( Physics.getLabel(event.bodyA) == "lane" )
            {
                /* Sacamos el objeto al arreglo  mediante la funcion "removeObjectFromLane" */
                context.removeObjectFromLane(event.bodyB);
            }
            if( Physics.getLabel(event.bodyB) == "lane" )
            {
                context.removeObjectFromLane(event.bodyA);
            }
        });


        /* Definimos la funcion removeObjectFromLane */
        context.removeObjectFromLane = function(body){
            for(var i = 0; i < context.objects_over_lane.length; i++)
            {
                if(Physics.getId(context.objects_over_lane[i]) == Physics.getId(body))
                {
                    context.objects_over_lane.splice(i,1);
                    break;
                }
            }
        }
    },

    update : function(context)
    {
	    /* Aplicamos una velocidad a todos los objetos que esten sobe la cinta transportadora */
        for(var i = 0; i < context.objects_over_lane.length; i++)
        {
            /* Se re-aplica en cada frame porque velocidad suele desaparecer por causa de la friccion */
            Physics.setVelocity(context.objects_over_lane[i], [ 100, 0]);
        }

        if( Physics.getPosition(context.box)[1] >= Screen.getHeight())
        {
            // la regresamos a su posicion inicial
            Physics.setPosition(context.box, context.box_start_position );
            Physics.clearForces(context.box);
            context.time = new Date().getTime();
        }
        return context.gameover;
    }

});
