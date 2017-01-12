
/**
  * @module AirConsoleBus
  * @desc since airconsole only allows to set one single listener for each event
  * i decided to make a simple hub for event broadcasting.
  */
var AirConsoleBus = (function(){

	const ON_MESSAGE = 0;
	const ON_CONNECT = 1;
	const ON_DISCONNECT = 2;

    var airconsole;
    var callbacks = [ [], [], [] ];

    /**
      * @func init
      * @param {object} airconsole_instance the airConsole's instance
      * @desc must be called after creating the airConsole object
      */
    function init(airconsole_instance)
    {
        airconsole = airconsole_instance;
    }

    /**
      * @func addEventListener
      * @param {eventType} event can be ON_MESSAGE, ON_CONNECT or ON_DISCONNECT
      * @param {function} callback the callback to be executed
      * @desc It adds a new event listener
      * @example AirConsoleBus.addEventListener(AirConsoleBus.ON_MESSAGE, mycallback );
      */
    function addEventListener(event, callback)
    {
    	callbacks[event].push(callback);
    }

    /**
      * @func removeEventListener
      * @param {eventType} event AirConsoleBus.ON_MESSAGE, AirConsoleBus.ON_CONNECT, AirConsoleBus.ON_DISCONNECT
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

    }

    function triggerOnConnect(device)
    {

    }

    function triggerOnDisconnect(device)
    {

    }

    return { init                : init,
             addEventListener    : addEventListener, 
             removeEventListener : removeEventListener,
             ON_MESSAGE          : ON_MESSAGE,
             ON_CONNECT          : ON_CONNECT,
             ON_DISCONNECT       : ON_DISCONNECT };
})();