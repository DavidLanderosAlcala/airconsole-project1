

var MenuManager = (function(){

	var menu_layer = null;

	function init()
	{
	    menu_layer = document.querySelector(".menu_layer");
	    MenuSettings.init(menu_layer);
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
        document.querySelector(".menu_layer").style.zIndex = "-1";
	}

	function clear()
	{
		menu_layer.innerHTML = "";
	}

	function addButton(text, id, callback)
	{
		var button = "<span id='" + id + "' class='button' >" + text + "</span><br>";
        menu_layer.innerHTML += button;
        setTimeout(function(){
        	Touch.button("#" + id, callback);
        },1);
	}

	function addCheckBox(text, id, callback)
	{
        var span = document.createElement("span");
        span.innerHTML = text + " <span id='" + id +
        "' class='checkbox' data-checked='false'></span><br>";
        menu_layer.appendChild(span);
        setTimeout(function(){
        	Touch.checkbox("#" + id, callback);
        },1);
	}

	return { init              : init,
		     showSettings      : showSettings,
		     showLevelSelector : showLevelSelector,
	         hideAll           : hideAll };
})();