

var MenuManager = (function(){

	function show()
	{
        document.querySelector(".menu_layer").style.zIndex = "1";
	}

	function hide()
	{
        document.querySelector(".menu_layer").style.zIndex = "-1";
	}

	return { show : show,
	         hide : hide };
})();