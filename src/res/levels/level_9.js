
LevelSelector.getLevels().push({

    title       : "Level 7",
    description : "Sube la caja al pickup",
    bodies : [
        {
            label : "lane",
            isStatic : true,
            position : { x : -3, y : 1 },
            vertices: [ { x: -4, y: 0 },
                        { x: -4, y: 1 },
                        { x: 4, y: 1 },
                        { x: 4, y: 0 } ],
        },
        {
            label : "wheel",
            isStatic : true,
            type : "circle",
            position : { x : 4.7, y : 2.5 },
            radio : 0.4,
        },
        {
            label : "wheel",
            isStatic : true,
            type : "circle",
            position : { x : 8.7, y : 2.5 },
            radio : 0.4,
        },
        {
            label : "box",
            isStatic : false,
            position : { x : -8, y : 10 },
            vertices: [
                {x : -0.30, y : 0.30 },
                {x : -0.30, y : -0.30 },
                {x : 0.30, y : -0.30 },
                {x : 0.30, y : 0.30 },
            ],
        },
        {
            label : "base",
            isStatic : true,
            position : { x : -10, y : 5 },
            vertices : [
                { "x" : 2.9, "y": 0 },
                { "x" : 2.9, "y": 0.5 },
                { "x" : 3.7, "y": 0.5 },
                { "x" : 3.7, "y": -0.8 },
                { "x" : -2.7, "y": -0.8 },
                { "x" : -2.7, "y": 0 },
                { "x" : -2.7, "y": 1.8 },
                { "x" : 0, "y": 1.8 },
                { "x" : 0, "y": 0 }
            ]
        },
        {
            label : "sensor",
            isStatic : true,
            isSensor : true,
            position : { x : 4.7, y : 4 },
            vertices: [
                {x : -1.5, y :  0.50 },
                {x : -1.5, y : -0.50 },
                {x :  1.5, y : -0.50 },
                {x :  1.5, y :  0.50 },
            ],
        },
        {
            label : "pickup",
            isStatic : true,
            position : { x : 6, y : 3 },
            vertices: [
                { "x": -3.2, "y": 0.6 },
                { "x": -3.2, "y": -0.4 },
                { "x": -1.8, "y": -0.4 },
                { "x": -1.8, "y": -0.2 },
                { "x": -1.6, "y": 0 },
                { "x": -1.4, "y": 0 },
                { "x": -1.2, "y": 0 },
                { "x": -0.9, "y": -0.1 },
                { "x": -0.8, "y": -0.4 },
                { "x": 2.4, "y": -0.4 },
                { "x": 2.4, "y": -0.2 },
                { "x": 2.5, "y": 0 },
                { "x": 2.8, "y": 0 },
                { "x": 3, "y": 0 },
                { "x": 3.2, "y": -0.2 },
                { "x": 3.2, "y": -0.4 },
                { "x": 4.2, "y": -0.4 },
                { "x": 4.2, "y": 0.1 },
                { "x": 4.2, "y": 0.4 },
                { "x": 3.9, "y": 0.6 },
                { "x": 2.5, "y": 0.6 },
                { "x": 2.3, "y": 1 },
                { "x": 2, "y": 1.4 },
                { "x": 1.6, "y": 1.6 },
                { "x": 0, "y": 1.6 },
                { "x": 0, "y": 0.6 }
            ],
        },
    ],

    hints: [
        {
            opacity : 1.0,
            position : { x : -3 , y : 1.5 },
            vertices : [
                { "x": -0.79, "y": 0 },
                { "x": 0.74, "y": 0 },
                { "x": 0.36, "y": 0.38 },
                { "x": 0.74, "y": 0 },
                { "x": 0.36, "y": -0.38 },
                { "x": 0.74, "y": 0 }
            ],
        },
        {
            position : { x : 7.4 , y : 3.6 },
            opacity : 1.0,
            vertices : [
                { "x": -0.8, "y": 0.8 },
                { "x": -0.8, "y": 0 },
                { "x": 0.8, "y": 0 },
                { "x": 0, "y": 0.8 },
                { "x": -0.8, "y": 0.8 }
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
            Physics.setVelocity(context.objects_over_lane[i], {x: 100, y: 0});
        }

        if( Physics.getPosition(context.box).y >= Screen.getHeight())
        {
            // la regresamos a su posicion inicial
            Physics.setPosition(context.box, context.box_start_position );
            Physics.clearForces(context.box);
            context.time = new Date().getTime();
        }
        return context.gameover;
    }

});
