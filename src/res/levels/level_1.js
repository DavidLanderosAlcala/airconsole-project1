
LevelSelector.getLevels().push({

    title       : "Los pilares",
    description : "dibuja una linea por encima de los pilares",
    bodies      : [
        {
            label : "towerA",
            isStatic : true,
            position : [ -2, 1 ],
            vertices: [
                [ 0.0, 4 ],
                [ 0.0, 0 ],
                [ 0.5, 0 ],
                [ 0.5, 4 ],
            ],
        },
        {
            label : "towerB",
            isStatic : true,
            position : [ 2, 1 ],
            vertices: [
                [ 0.0, 4 ],
                [ 0.0, 0 ],
                [ 0.5, 0 ],
                [ 0.5, 4 ],
            ],
        },
        {
            label : "rock",
            isStatic : false,
            position : [ 0, 10 ],
            vertices: [
                [ -0.25,  0.25 ],
                [ -0.25, -0.25 ],
                [  0.25, -0.25 ],
                [  0.25,  0.25 ],
            ],
        },
    ],

    hints: [
        {
            line : "dotted",
            label : "simple line",
            position : [ 0, 6 ],
            vertices: [
                [ -3, 0 ],
                [  3, 0 ],
            ],
        }
    ],

    setup : function(context)
    {
    	context.time = new Date().getTime();
        context.rock = Physics.getBodyByLabel("rock");
    },

    update : function(context)
    {
	    // si rock ha salido de la pantalla
        if( Physics.getPosition(context.rock)[1] >= Screen.getHeight())
        {
        	// la regresamos a su posicion inicial
            Physics.setVelocity(context.rock, new Float32Array(2));
            Physics.setPosition(context.rock, [ Screen.getWidth()/2, 0 ]);
            context.time = new Date().getTime();
        }
        else
        {
            // si rock lleva mas de 3 segundos sin caer,
            // el jugador ha ganado
            if(new Date().getTime() - context.time > 5000)
            {
                Screen.setTitleText("Bien hecho ;)");
            	return true;
            }
        }
        return false;
    }

});
