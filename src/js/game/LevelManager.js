

/* Global constants
 */
const FIRST_STAR  = (1<<0);
const SECOND_STAR = (1<<1);
const THIRD_STAR  = (1<<2);

/**
  * @module LevelManager
  */
var LevelManager = (function(){

  const saveName = "progress";
  var levels = [];
  var levelMetadata = [];
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

        on("preview", function(level_index) {
            if(levelMetadata[level_index].unlocked)
            {
                Screen.setTitleText(levels[level_index].title);
                Game.loadLevel(level_index);
            }
            else
            {
                Screen.setTitleText("Locked level");
                Screen.setSubtitleText("You need to complete previous levels");
            }
        });

        on("selected", function(level_index){
            if(levelMetadata[level_index].unlocked)
            {
                hide();
                //Game.loadLevel(level_index);
            }
        });
        loadSave();
	}

	function show()
	{
        document.querySelector("#hud-bar").style.opacity = 0;
		 visible = true;
         //container.style.zIndex = 11;
         //container.style.opacity = 1;
         container.style.pointerEvents = 'auto'; 
         container.style.marginTop = "-25vh";
	}

	function hide()
	{
        document.querySelector("#hud-bar").style.opacity = 1;
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
        var html =  '<div id="level' + level_index + '" onmouseenter="LevelManager.dispatch(\'preview\',' + level_index + ')" ' +
                    ' onclick="LevelManager.dispatch(\'selected\',' + level_index + ')" class="level-launcher" data-unlocked="false">\r\n' +
            	    '	<div class="level-number"> ' + (level_index + 1) + ' </div>\r\n' +
            	    '	<div class="level-stars-container">\r\n' +
            	    '		<span class="level-star" data-filled="false"></span>\r\n' +
            	    '		<span class="level-star" data-filled="false"></span>\r\n' +
            	    '		<span class="level-star" data-filled="false"></span>\r\n' +
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

    function loadSave()
    {
        if(localStorage.getItem(saveName) == undefined)
        {
            for(var i = 0; i < levels.length; i++)
            {
                levelMetadata.push({stars:0, unlocked : false});
            }
            unlockLevel(0);
        }
    }

    function updateLevelStars(index, stars)
    {
        if(index < levelMetadata.length)
        {
            levelMetadata[index].stars |= stars;
            var stars_count = getEarnedStarsCount(index);

            var star_elements = document.querySelectorAll("#level" + index + " > .level-stars-container > .level-star");
            for(var i = 0; i < 3; i++)
            {
                if(i < stars_count){
                   star_elements[i].dataset.filled = "true";
                }
                else {
                  star_elements[i].dataset.filled = "false";
                }
            }
            checkForAchievement();
            save();
        }
    }

    function checkForAchievement()
    {
        for(var i = 0; i < levelMetadata.length; i++)
        {
            if(levelMetadata[i].stars < 3)
            {
                return;
            }
        }
        AchievementManager.unlock("all-stars");
    }

    function unlockLevel(index)
    {
        if(index < levelMetadata.length)
        {
            levelMetadata[index].unlocked = true;
            document.querySelector("#level" + index).dataset.unlocked = "true";
            save();
        }
    }

    function getEarnedStarsCount(level_index)
    {
        var count = 0;
        var bitFlag = levelMetadata[level_index].stars;
        if(bitFlag & (1<<0) ) count++;
        if(bitFlag & (1<<1) ) count++;
        if(bitFlag & (1<<2) ) count++;
        return count;
    }

    function getEarnedStarsDesc(level_index)
    {
        var res = [];
        var bitFlag = levelMetadata[level_index].stars;
        var descriptions = levels[level_index].descriptions;
        if(bitFlag & (1<<0) ) res.push(descriptions[0]);
        if(bitFlag & (1<<1) ) res.push(descriptions[1]);
        if(bitFlag & (1<<2) ) res.push(descriptions[2]);
        return res;
    }

    function getMissingStarsDesc(level_index)
    {
        var res = [];
        var bitFlag = levelMetadata[level_index].stars;
        var descriptions = levels[level_index].descriptions;
        if((bitFlag & (1<<0)) === 0)
            res.push(descriptions[0]);
        if((bitFlag & (1<<1)) === 0)
            res.push(descriptions[1]);
        if((bitFlag & (1<<2)) === 0)
            res.push(descriptions[2]);
        return res;
    }

    function getLevelStars(level_index)
    {
        return levelMetadata[level_index].stars;
    }

    return { init        : init,
             getLevels   : getLevels,
             show        : show,
             hide        : hide,
             isVisible   : isVisible,
             on          : on,
             dispatch    : dispatch,
             save        : save,
             loadSave    : loadSave,
             updateLevelStars : updateLevelStars,
             getLevelStars : getLevelStars,
             unlockLevel : unlockLevel,
             getEarnedStarsCount : getEarnedStarsCount,
             getEarnedStarsDesc  : getEarnedStarsDesc,
             getMissingStarsDesc : getMissingStarsDesc };
})();
