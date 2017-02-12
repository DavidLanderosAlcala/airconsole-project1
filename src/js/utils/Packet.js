

var Packet = (function(){
    
	var gamepad_keys = [
	    "pad_a",
	    "pad_b",
	    "pad_x",
	    "pad_y",
	    "pad_select",
	    "touchpad",
	];

	function getKeyIndex(key)
	{
		var i,l = gamepad_keys.length;
		for(i = 0; i < l; i++)
		{
			if(gamepad_keys[i] == key)
			{
				return i;
			}
		}
		return -1;
	}

	function parse(buffer)
	{
        var aux = buffer.split(";");
        var obj = {
        	header: parseInt(aux[0])
        };
        if(obj.header == 5)
        {
        	obj.key = gamepad_keys[parseInt(aux[1])];
        	var aux2 = aux[2].split(",");
        	if(aux2.length > 1)
        	{
        		obj.value = { x : parseFloat(aux2[0]), y : parseFloat(aux2[1]) };
        	}
        	else
        	{
        		obj.value = parseInt(aux2[0]);
        	}
        }
        return obj;
	}

	function pack(json)
	{
        if(json.header == 5)
        {
            return packGamepadEvent(json);
        }
	}

	function packGamepadEvent(json)
	{
        /* packets:
         *    header;key;value
         * values:
         *    num[,num]
         */
        var buffer = 5
                     + ";"
                     + getKeyIndex(json.key)
                     + ";";
        if(typeof(json.value) == "object")
        {
        	buffer += json.value.x.toFixed(2) + "," + json.value.y.toFixed(2);
        }
        else
        {
            buffer += json.value;
        }
        return buffer;
	}

	return { parse : parse,
		     pack  : pack };
})();