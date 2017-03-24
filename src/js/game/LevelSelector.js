

var LevelSelector = (function(){

    var levels = [];

    var menu_layer = null;
    var visible = false;

    function init(container)
    {
        menu_layer = container;
    }

    function show()
    {
    	Screen.setTitleText("Level selection");
    	clear();
        var i; l = levels.length;
        for(i = 0; i < l; i++)
        {
        	createButton(i, "levelButton" + i, onLevelSelected);
        }

        menu_layer.style.zIndex = "1";
        menu_layer.style.width = "60%";
        menu_layer.style.left = "20%";
        visible = true;
    }

    function onLevelSelected(e)
    {
    	if(e.isPressed)
    	{
            e.sender.dataset.pressed = "true";
    	}
    	else
    	{
            hide();
            CrayonPhysics.loadLevel(parseInt(e.sender.innerHTML));
            Screen.requestFullscreen();
    	}
    }

    function hide()
    {
    	clear();
		menu_layer.style.zIndex = "-1";
		visible = false;
    }

    function clear()
    {
    	menu_layer.innerHTML = "";
    }

    function createButton(text, id, callback)
    {
    	menu_layer.innerHTML += "<span class='level_button button' id='" + id + "' > " + text + " </span>";
    	setTimeout(function(){
            Touch.button("#" + id, callback);
    	}, 1);
    }

    function isVisible()
    {
    	return visible;
    }

    function getLevels()
    {
        return levels;
    }

    return { init : init,
             show : show,
             hide : hide,
             isVisible : isVisible,
             getLevels : getLevels };
})();