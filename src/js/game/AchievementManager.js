

var AchievementManager = (function(){

    var notification = document.querySelector("#achievement-dialog");
    var content = document.querySelector("#achievement-text");
    var achievements = { };

    /* Achievement declaration
     */
    achievements["massive-rock"] = { message : "A Massive rock", unlocked : false };
    achievements["all-stars"] = { message : "Earn all stars", unlocked : false };

    function unlock(achievementName)
    {
        if(!achievements[achievementName].unlocked)
        {
            achievements[achievementName].unlocked = true;
            notification.dataset.visible = "true";
            content.innerHTML = achievements[achievementName].message;
            
            setTimeout(function(){
            	notification.dataset.visible = "false";
            }, 4000);
        }
    }

    function save()
    {
        
    }

    function restore()
    {
        
    }

	return { unlock : unlock };
})();
