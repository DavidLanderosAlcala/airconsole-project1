

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

	function compress(json)
	{
        var i32_header = json.header << 5;
        var keyCode = getKeyCode(json.key);
        i32_header |= (keyCode << 1);

        if(keyCode < 10) // it's a digital value
        {
            i32_header |= (json.value & 0x01);
            return String.fromCharCode(i32_header);
        }
        return String.fromCharCode(i32_header) +
               floatToBuffer(json.value.x) + 
               floatToBuffer(json.value.y);
	}

	function floatToBuffer(floatValue)
	{
        var num = ((floatValue * 100) + 32768)|0;
        return String.fromCharCode(num & 0xff00) +
               String.fromCharCode(num & 0x00ff);
	}

	function bufferToFloat(char1, char2)
	{
        var num = char1.charCodeAt(0) + char2.charCodeAt(0);
        return parseFloat(((num - 32768) / 100).toFixed(2));
	}

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
            	x : bufferToFloat(buffer[1], buffer[2]),
            	y : bufferToFloat(buffer[3], buffer[4]),
            };
        }

        return json;
	}

	return { compress : compress,
	         uncompress : uncompress };
})();