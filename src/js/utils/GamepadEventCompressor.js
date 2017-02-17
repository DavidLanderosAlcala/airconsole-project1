
/**
  * @module GamepadEventCompressor
  */
var GamepadEventCompressor = (function(){

	var header_mask = 0xE0;  // 1110 0000 ~ 7
	var keycode_mask = 0x1E; // 0001 1110 ~ 16
	var value_mask = 0x01;   // 0000 0001 ~ 2

	var keys = [
	   // digitals
	    "pad_a",
	    "pad_b",
	    "pad_x",
	    "pad_y",
	    "pad_left",
	    "pad_right",
	    "pad_up",
	    "pad_down",
	    "pad_select",
	    "pad_start",

	    // analogics
	    "left_stick",
	    "right_stick",
	    "touchpad",
	];

	function getKeyCode(key)
	{
        var i, l = keys.length;
        for(i = 0; i < l; i++)
        {
        	if(keys[i] == key)
        		return i;
        }
        return 0;
	}

    /** @func compress
      * @desc reduce a js object (representing a gamepad event) to a 1 byte length packet for digital
      * input and 3 bytes length packet for analogic input.
      * @param event {object} the gamepad event object
      */
	function compress(event)
	{
        var i32_header = event.header << 5;
        var keyCode = getKeyCode(event.key);
        i32_header |= (keyCode << 1);

        if(keyCode < 10) // it's a digital value
        {
            i32_header |= (event.value & 0x01);
            return String.fromCharCode(i32_header);
        }
        return String.fromCharCode(i32_header) +
               floatToBuffer(event.value.x) + 
               floatToBuffer(event.value.y);
	}

	function floatToBuffer(floatValue)
	{
        var num = ((floatValue * 100) + 100)|0;
        return String.fromCharCode(num);
	}

	function bufferToFloat(char1)
	{
        var num = char1.charCodeAt(0)
        return parseFloat(((num - 100) / 100).toFixed(2));
	}

    /** @func uncompress
      * @desc produce a js object (representing a gamepad event) from a compressed packet
      * @param buffer {string} the compressed packet
      */
	function uncompress(buffer)
	{
        var json = {
        	header : (buffer.charCodeAt(0) & header_mask) >> 5,
        	key : keys[(buffer.charCodeAt(0) & keycode_mask) >> 1],
        	value : buffer.charCodeAt(0) & value_mask,
        };

        var keycode =  (buffer.charCodeAt(0) & keycode_mask) >> 1;
        if(keycode >= 10) // analogic value
        {
            json.value = {
            	x : bufferToFloat(buffer[1]),
            	y : bufferToFloat(buffer[2])
            };
        }

        return json;
	}

	return { compress : compress,
	         uncompress : uncompress };
})();