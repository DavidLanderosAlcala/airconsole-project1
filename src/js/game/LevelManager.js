
/**
  * @module LevelManager
  */
var LevelManager = (function(){

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
        container.style.marginTop = "-150vh";
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
        //show();
	}

	function show()
	{
		 visible = true;
         //container.style.zIndex = 11;
         //container.style.opacity = 1;
         container.style.pointerEvents = 'auto'; 
         container.style.marginTop = "-25vh";
	}

	function hide()
	{
		visible = false;
        //container.style.zIndex = -11;
        //container.style.opacity = 0;
        container.style.pointerEvents = 'none';
        container.style.marginTop = "-150vh";
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
		if(level_index > 3)
			unlocked = "false";
        if(level_index  == 3)
        {
            filled1 = "false";
            filled2 = "false";
        }
        var html =  '<div onmouseenter="LevelManager.dispatch(\'preview\',' + level_index + ')" ' +
                    ' onclick="LevelManager.dispatch(\'selected\',' + level_index + ')" class="level-launcher" data-unlocked="' + unlocked + '">\r\n' +
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

    function save()
    {

    }

    function restore()
    {

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
