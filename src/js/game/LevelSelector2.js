
/*
     Game.loadLevel(level_index);
*/

/**
  * @module LevelSelector
  */
var LevelSelector = (function(){

	var levels = [];
	var level_metadata = [];
	var container = null;
	var listeners = [];
    var visible = false;

	function init()
	{
        var levelsHTML = "";
        for(var i = 0; i < levels.length; i++)
        {
        	levelsHTML += GenLevelLauncherHTML(i);
        }
        container = document.createElement("div");
        container.id = "level-selector-container";
        document.body.appendChild(container);
        container.innerHTML = levelsHTML;

        on("preview", function(level_index){
        	Screen.setTitleText(levels[level_index].title);
        	Game.loadLevel(level_index);
        });

        on("selected", function(level_index){
           hide();
           //Game.loadLevel(level_index);
        });
	}

	function show()
	{
		 visible = true;
         container.style.zIndex = 11;
         //container.style.opacity = 1;
         container.style.pointerEvents = 'auto'; 
	}

	function hide()
	{
		visible = false;
        container.style.zIndex = -11;
        //container.style.opacity = 0;
        container.style.pointerEvents = 'none';
	}

	function getLevels()
	{
		return levels;
	}

	function GenLevelLauncherHTML(level_index)
	{
		var filled1 = "true";
		var filled2 = "true";
		var filled3 = "false";
		var unlocked = "true";
		if(level_index > 0)
			unlocked = "false";
        var html =  '<div onmouseenter="LevelSelector.dispatch(\'preview\',' + level_index + ')" ' +
                    ' onclick="LevelSelector.dispatch(\'selected\',' + level_index + ')" class="level-launcher" data-unlocked="' + unlocked + '">\r\n' +
            	    '	<div class="level-number"> ' + (level_index + 1) + ' </div>\r\n' +
            	    '	<div class="level-stars-container">\r\n' +
            	    '		<span class="level-star" data-filled="' + filled1 + '"></span>\r\n' +
            	    '		<span class="level-star" data-filled="' + filled2 + '"></span>\r\n' +
            	    '		<span class="level-star" data-filled="' + filled3 + '"></span>\r\n' +
            	    '	</div>\r\n' +
            	    '</div>\r\n';
        return html;
	}

     /** @func isVisible
       */
    function isVisible()
    {
        return visible;
    }

    function on(type, callback)
    {
        if(!listeners[type])
        {
            listeners[type] = [];
        }
        listeners[type].push(callback);
    }

    function dispatch(event, arg)
    {
        if(listeners[event])
        {
            for(var i = 0; i < listeners[event].length; i++)
            {
                listeners[event][i](arg);
            }
        }
    }

    return { init        : init,
             getLevels   : getLevels,
             show        : show,
             hide        : hide,
             isVisible   : isVisible,
             on          : on,
             dispatch    : dispatch
    };
})();
