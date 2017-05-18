

var AchievementManager = (function(){

    function init()
    {

    }

    function unlock(achievementName)
    {
    	//document.querySelector("#achievement-text").innerHTML = achievementName;
        document.querySelector("#achievement-dialog").dataset.visible = "true";
        setTimeout(function(){
        	document.querySelector("#achievement-dialog").dataset.visible = "false";
        }, 4000);
    }

	return { init   : init,
	         unlock : unlock };
})();