
LevelSelector.getLevels().push({

    title       : "Mi primer dibujo",
    description : "Dibuja una figura cualquiera",
    bodies : [
        {
            label : "ground",
            isStatic : true,
            position : [ 0.0, 0.0 ],
            vertices : [[ -20.0, 0.0 ],
                        [ -20.0, 1.0 ],
                        [ 20.0,  1.0 ],
                        [ 20.0,  0.0 ]],
        },
        {
            label : "shape1",
            isStatic : false,
            position : [0,2],
            vertices : [
               [ -0.7, 0.7 ],
               [ -0.7, -0.9 ],
               [ 0, -0.9 ],
               [ 0, 0.7 ]
            ]
        },
        {
            label : "circle",
            type : "circle",
            radio : 0.5,
            position: [-3, 3],
        },
        {
            label : "triangle",
            position : [3, 2],
            vertices : [
                [ -0.8, -0.8 ],
                [ -0.8, 0.8 ],
                [ 2.4, -0.8 ]
            ]
        }
    ],

    setup : function(context)
    {
	    // agregamos una variable al contexto del nivel
    	context.game_over = false;

        Physics.on("addBody", function(){
            Screen.setTitleText("Buen trabajo!, ahora intenta borrarla con click derecho");
        });

        Physics.on("removeBody", function(){
            Screen.setTitleText("Excelente!");
            context.game_over = true;
        });        
    },

    update : function(context)
    {
	    // retornamos el estado actual del nivel
        return context.game_over;
    }

});
