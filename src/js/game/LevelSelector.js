

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
    	Screen.setTitleText("");
    	clear();
        //menu_layer.innerHTML +=  "<img src='./res/img/text_header.png'><br>";
        menu_layer.innerHTML += "<div style='font-size: 30px;background-position:center;background-repeat: no-repeat;height: 253px; background-image: url(\"./res/img/text_header.png\")'><br><br> Level selector </div>";
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
            Game.loadLevel(parseInt(e.sender.innerHTML));
            //Screen.requestFullscreen();
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