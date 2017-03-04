

var MenuManager = (function(){

	var menu_layer = null;

	function init()
	{
	    menu_layer = document.querySelector(".menu_layer");
	}

	function showLevelSelector()
	{
        clear();   
        menu_layer.style.zIndex = "1";
	}

	function showSettings()
	{
		clear();

		addCheckBox("full screen","fullscreen_checkbox", function(e){
            e.sender.dataset.checked = e.checked ? "true" : "false";
            if(e.checked) {
                Screen.requestFullscreen();
            }
            else {
                Screen.exitFullscreen();
            }
		});

		addCheckBox("debug renderer","debug_renderer_checkbox", function(e){
            e.sender.dataset.checked = e.checked ? "true" : "false";
            if(e.checked) {
                CrayonPhysics.enableDebugRenderer();
            }
            else {
                CrayonPhysics.disableDebugRenderer();
            }
		});

		addButton("restart world","restart_world", function(e){
            e.sender.dataset.pressed = e.isPressed ? "true" : "false";
            if(!e.isPressed)
            {
            	CrayonPhysics.restartEngine();
            }
		});

		addButton("click me","dummy_button", function(e){
            e.sender.dataset.pressed = e.isPressed ? "true" : "false";
		});

        menu_layer.style.width = "30%";
        menu_layer.style.left = "35%";
        menu_layer.style.zIndex = "1";
	}

	function hide()
	{
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
	         hide              : hide };
})();