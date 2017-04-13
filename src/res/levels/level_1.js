
LevelSelector.getLevels().push({

    title       : "Que no caiga",
    description : "dibuja una linea por encima de los pilares",
    bodies      : [
        {
            label : "towerA",
            isStatic : true,
            position : { x : -2, y : 1 },
            vertices: [
                {x : 0.0, y : 4 },
                {x : 0.0, y : 0 },
                {x : 0.5, y : 0 },
                {x : 0.5, y : 4 },
            ],
        },
        {
            label : "towerB",
            isStatic : true,
            position : { x : 2, y : 1 },
            vertices: [
                {x : 0.0, y : 4 },
                {x : 0.0, y : 0 },
                {x : 0.5, y : 0 },
                {x : 0.5, y : 4 },
            ],
        },
        {
            label : "rock",
            isStatic : false,
            position : { x : 0, y : 10 },
            vertices: [
                {x : -0.25, y : 0.25 },
                {x : -0.25, y : -0.25 },
                {x : 0.25, y : -0.25 },
                {x : 0.25, y : 0.25 },
            ],
        },
    ],

    hints: [
        {
            label : "simple line",
            position : { x : 0, y : 6},
            vertices: [
                {x : -3, y : 0 },
                {x : 3, y : 0 },
                {x : 3, y : 0.01 },
                {x : -3, y : 0.01 },
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
            {
                Screen.setTitleText("Bien hecho ;)");
            	return true;
            }
        }
        return false;
    }

});
