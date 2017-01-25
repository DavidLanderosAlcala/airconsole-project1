

/**
  * @Module Touch
  */
var Touch = (function() {

    /** @func button
      * @desc converts DOM elements into buttons and installs an event listener
      * @param selector {string} the CSS selector to hook the DOM elements
      * @param callback {function} called for each event ocurred with the buttons
      */
    function button(selector, callback)
    {
        var selection = document.querySelectorAll(selector);
        var i = 0, l = selection.length;
        for(i = 0; i < l; i++)
        {
            hookAllEventsForButton(selection[i], callback);
        }
    }

    /** @func surface
      * @desc converts DOM elements into touch surfaces such as virtual sticks, touchpads etc, and installs an event listener
      * @param selector {string} the CSS selector to hook the DOM elements
      * @param callback {function} called for each event ocurred with the surfaces
      */
    function surface(selector, callback)
    {
        var selection = document.querySelectorAll(selector);
        var i = 0, l = selection.length;
        for(i = 0; i < l; i++)
        {
            hookAllEventsForSurface(selection[i], callback);
        }
    }

    function hookAllEventsForButton(element, callback)
    {
        var event = {
            sender : element,
            isPressed : false,
        };

        element.addEventListener("touchstart", function(e) {
            event.isPressed = true;
            callback(event);
        });

        element.addEventListener("mousedown", function(e) {
            event.isPressed = true;
            callback(event);
        });

        element.addEventListener("touchend", function(e) {
            event.isPressed = false;
            callback(event);
        });

        element.addEventListener("mouseup", function(e) {
            event.isPressed = false;
            callback(event);
        });

        element.addEventListener("mouseleave", function(e) {
            event.isPressed = false;
            callback(event);
        });

        element.addEventListener("touchcancel", function(e) {
            event.isPressed = false;
            callback(event);
        });
    }

    function hookAllEventsForSurface(element, callback)
    {
        // TO DO
    }

	return { button  : button,
	         surface : surface };
})();