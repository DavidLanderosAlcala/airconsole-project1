
LevelSelector.getLevels().push({

    title       : "Que no caiga",
    description : "dibuja una plataforma entre los pilares",
    bodies      : [
        {
            label : "towerA",
            isStatic : true,
            position : { x : -200, y : 100 },
            vertices: [
                {x : 0, y : 400 },
                {x : 0, y : 0 },
                {x : 50, y : 0 },
                {x : 50, y : 400 },
            ],
        },
        {
            label : "towerB",
            isStatic : true,
            position : { x : 200, y : 100 },
            vertices: [
                {x : 0, y : 400 },
                {x : 0, y : 0 },
                {x : 50, y : 0 },
                {x : 50, y : 400 },
            ],
        },
        {
            label : "rock",
            isStatic : false,
            position : { x : 0, y : 1000 },
            vertices: [
                {x : -25, y : 25 },
                {x : -25, y : -25 },
                {x : 25, y : -25 },
                {x : 25, y : 25 },
            ],
        },
        {
            hint : true,
            label : "line",
            isStatic : true,
            position : { x : 0, y : 500},
            vertices: [
                {x : -300, y : 0 },
                {x : 300, y : 0 },
                {x : 300, y : 1 },
                {x : -300, y : 1 },
            ],
        }
    ],

    setup : function(context, engine)
    {
    	//context.time = new Date().getTime();
        //bodies = Matter.Composite.allBodies(engine.world);
        //for(var i = 0; i < bodies.length; i++)
        //{
        //    if(bodies[i].label == "rock")
        //    {
        //    	// Buscamos rock y guardamos una referencia
        //    	// para no volver a buscarla en cada llamada a update
        //        context.rock = bodies[i];
        //        break;
        //    }
        //}
    },

    update : function(context, engine)
    {
	    // si rock ha salido de la pantalla
        //if(context.rock.position.y >= 0)
        //{
        //	// la regresamos a su posicion inicial
        //    Matter.Body.setVelocity(context.rock, { x : 0, y : 0 });
        //    Matter.Body.setPosition(context.rock, { x : 0, y : -1000 });
        //    context.time = new Date().getTime();
        //}
        //// si no
        //else
        //{
        //    // si rock lleva mas de 3 segundos sin caer,
        //    // el jugador ha ganado
        //    if(new Date().getTime() - context.time > 3000)
        //    	return true;
        //}
        return false;
    }

});
