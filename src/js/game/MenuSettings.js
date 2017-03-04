

var MenuSettings = (function(){

    var menu_layer = null;
    var visible = false;

    function init(container)
    {
        menu_layer = container;
    }

    function show()
    {
        clear();
        var value = Screen.isInFullscreen();
		addCheckBox("full screen","fullscreen_checkbox", value , function(e){
            e.sender.dataset.checked = e.checked ? "true" : "false";
            if(e.checked) {
                Screen.requestFullscreen();
            }
            else {
                Screen.exitFullscreen();
            }
		});

		value = CrayonPhysics.isDebugRendererEnabled();
		addCheckBox("debug renderer","debug_renderer_checkbox", value, function(e){
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

        menu_layer.style.width = "30%";
        menu_layer.style.left = "35%";
        menu_layer.style.zIndex = "1";
        visible = true;
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

	function addCheckBox(text, id, value, callback)
	{
        var span = document.createElement("span");
        span.innerHTML = text + " <span id='" + id +
        "' class='checkbox' data-checked='" + (value ? "true" : "false") + "'></span><br>";
        menu_layer.appendChild(span);
        setTimeout(function(){
        	Touch.checkbox("#" + id, callback);
        },1);
	}

	function isVisible()
	{
		return visible;
	}

	function hide()
	{
		clear();
		menu_layer.style.zIndex = "-1";
		visible = false;
	}


    return { init : init,
             show : show,
             hide : hide,
             isVisible : isVisible };
})();