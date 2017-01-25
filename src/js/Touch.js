

/**
  * @Module Touch
  * a simple module to handle touch events
  */
var Touch = (function(){

    function button(selector, callback)
    {
    	var element = document.querySelector(selector);

    	element.addEventListener("touchstart", function(e) {
            callback(true);
    	});

    	element.addEventListener("mousedown", function(e) {
            callback(true);
    	});

    	element.addEventListener("touchend", function(e) {
            callback(false);
    	});

    	element.addEventListener("mouseup", function(e) {
            callback(false);
    	});

    	element.addEventListener("mouseleave", function(e) {
            callback(false);
    	});

    	element.addEventListener("touchcancel", function(e) {
            callback(false);
    	});
    }

    function surface(selector, callback)
    {
         // TO DO
    }

	return { button  : button,
	         surface : surface };
})();