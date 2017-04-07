
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

    setup : function(context)
    {
    	context.time = new Date().getTime();
        var bodies = Physics.getAllBodies();
        for(var i = 0; i < bodies.length; i++)
        {
            if(Physics.getLabel(bodies[i]) == "rock")
            {
            	// Buscamos rock y guardamos una referencia
            	// para no volver a buscarla en cada llamada a update
                context.rock = bodies[i];
                break;
            }
        }
    },

    update : function(context)
    {
	    // si rock ha salido de la pantalla
        if( Physics.getPosition(context.rock).y >= Screen.getHeight())
        {
        	// la regresamos a su posicion inicial
            Physics.setVelocity(context.rock, { x : 0, y : 0 });
            Physics.setPosition(context.rock, { x : Screen.getWidth()/2, y : 0 });
            context.time = new Date().getTime();
        }
        else
        {
            // si rock lleva mas de 3 segundos sin caer,
            // el jugador ha ganado
            if(new Date().getTime() - context.time > 3000)
            	return true;
        }
        return false;
    }

});
