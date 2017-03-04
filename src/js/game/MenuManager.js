

var MenuManager = (function(){

	function showLevelSelector()
	{
        
	}

	function showSettings()
	{
		var menu_layer = document.querySelector(".menu_layer");
		menu_layer.appendChild(createCheckBox("full screen","fullscreen_checkbox"));
		menu_layer.appendChild(createCheckBox("debug renderer","debug_renderer_checkbox"));
        Touch.checkbox("#fullscreen_checkbox", function(e){
            e.sender.dataset.checked = e.checked ? "true" : "false";
            if(e.checked)
            {
                Screen.requestFullscreen();
            }
            else
            {
                Screen.exitFullscreen();
            }
        });
        Touch.checkbox("#debug_renderer_checkbox", function(e){
            e.sender.dataset.checked = e.checked ? "true" : "false";
            if(e.checked)
            {
                CrayonPhysics.enableDebugRenderer();
            }
            else
            {
                CrayonPhysics.disableDebugRenderer();
            }
        });
        menu_layer.style.width = "30%";
        menu_layer.style.left = "35%";
        menu_layer.style.zIndex = "1";
	}

	function hide()
	{
        document.querySelector(".menu_layer").style.zIndex = "-1";
	}

	function createCheckBox(text, id)
	{
        var span = document.createElement("span");
        span.innerHTML = text + " <span id='" + id +
        "' class='checkbox' data-checked='false'></span><br>";
        return span;
	}

	return { showSettings      : showSettings,
		     showLevelSelector : showLevelSelector,
	         hide              : hide };
})();