
LevelSelector.getLevels().push({

    title       : "Level 7",
    description : "cinta transportadora",
    bodies : [
        {
            label : "lane",
            isStatic : true,
            position : { x : 0, y : 1 },
            vertices: [ { x: -4, y: 0 },
                        { x: -4, y: 1 },
                        { x: 4, y: 1 },
                        { x: 4, y: 0 } ],
        },
    ],

    setup : function(context)
    {
        /* creamos un array en el objeto context
           el cual contiene los objetos que estan tocando la cinta transportadora */
        context.objects_over_lane = [];

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
            Physics.setVelocity(context.objects_over_lane[i], {x: 100, y: 0});
        }
        return false;
    }

});
