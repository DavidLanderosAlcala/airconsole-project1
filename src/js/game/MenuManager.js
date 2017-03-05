

var MenuManager = (function(){

	var menu_layer = null;

	function init()
	{
	    menu_layer = document.querySelector(".menu_layer");
	    MenuSettings.init(menu_layer);
	    LevelSelector.init(menu_layer);
	}

	function showLevelSelector()
	{
        LevelSelector.show();
	}

	function showSettings()
	{
		MenuSettings.show();
	}

	function hideAll()
	{
		clear();
        menu_layer.style.zIndex = "-1";
	}

	function clear()
	{
		menu_layer.innerHTML = "";
	}

	return { init              : init,
		     showSettings      : showSettings,
		     showLevelSelector : showLevelSelector,
	         hideAll           : hideAll };
})();