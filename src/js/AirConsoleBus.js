
/**
  * @module AirConsoleBus
  * @desc since airconsole only allows to set one single listener for each event
  * i decided to make a simple hub for event broadcasting.
  */
var AirConsoleBus = (function(){

	const ON_MESSAGE = 0;
	const ON_CONNECT = 1;
	const ON_DISCONNECT = 2;
  const ON_READY   = 3;

    var airconsole;
    var callbacks = [ [], [], [], [] ];

    /**
      * @func init
      * @param {object} airconsole_instance the airConsole's instance
      * @desc must be called after creating the airConsole object
      */
    function init(airconsole_instance)
    {
        airconsole = airconsole_instance;
        airconsole.onMessage = triggerOnMessage;
        airconsole.onConnect = triggerOnConnect;
        airconsole.onDisconnect = triggerOnDisconnect;
    }

    /**
      * @func addEventListener
      * @param {eventType} event ON_MESSAGE, ON_CONNECT or ON_DISCONNECT
      * @param {function} callback the callback to be executed
      * @desc It adds a new event listener
      * @example AirConsoleBus.addEventListener(AirConsoleBus.ON_MESSAGE, mycallback );
      */
    function addEventListener(event, callback)
    {
    	callbacks[event].push(callback);
    }


    /**
      * @func on(event, callback)
      * @param {string} event "message", "connect", "disconnect", "ready"
      * @param {function} callback the callback to be executed
      * @desc It adds a new event listener
      * @example AirConsoleBus.on(AirConsoleBus.ON_MESSAGE, mycallback );
      */
    function on(event, callback)
    {
        var e;
        switch(event)
        {
            case "message"    : e = ON_MESSAGE; break;
            case "connect"    : e = ON_CONNECT; break;
            case "disconnect" : e = ON_DISCONNECT; break;
            case "ready"      : e = ON_READY; break;
        }
        addEventListener(e, callback);
    }

    /**
      * @func removeEventListener
      * @param {eventType} event ON_MESSAGE, ON_CONNECT, ON_DISCONNECT
      * @param {function} callback the callback to be removed
      * @desc It removes an event listener
      */
    function removeEventListener(event, callback)
    {
    	var i, l = callbacks[event].length;
    	for(i = 0; i < l; i++)
    	{
            if(callbacks[event] == callback)
            {
                callbacks[event].slice(i, 1);
            }
    	}
    }

    function triggerOnMessage(from, message)
    {
        var i, l = callbacks[ON_MESSAGE].length;
        for(i = 0; i < l; i++)
        {
        	callbacks[ON_MESSAGE][i](from, message);
        }
    }

    function triggerOnConnect(device_id)
    {
        var i, l = callbacks[ON_CONNECT].length;
        for(i = 0; i < l; i++)
        {
        	callbacks[ON_CONNECT][i](device_id);
        }
    }

    function triggerOnDisconnect(device_id)
    {
        var i, l = callbacks[ON_DISCONNECT].length;
        for(i = 0; i < l; i++)
        {
        	callbacks[ON_DISCONNECT][i](device_id);
        }
    }

    return { init                : init,
             on                  : on,
             addEventListener    : addEventListener, 
             removeEventListener : removeEventListener,
             ON_MESSAGE          : ON_MESSAGE,
             ON_CONNECT          : ON_CONNECT,
             ON_DISCONNECT       : ON_DISCONNECT };
})();