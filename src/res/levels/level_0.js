
LevelSelector.getLevels().push({

    title       : "Level 0",
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
