

/** @module PlayerCursor
  */
var PlayerCursor = (function() {

    const chalk_image_url   = "http://oi63.tinypic.com/eupyfo.jpg";
    const ereaser_image_url = "http://oi67.tinypic.com/670aye.jpg";
    const tack_image_url    = "http://oi68.tinypic.com/2aezb03.jpg";

    var canvas = null;
    var context = null;
    var tools = [];

    var position = null;
    var current_tool_index = 0;

    function init(config)
    {
    	var img;
        canvas = config.canvas;
        context = config.context;

        position = {
            x : canvas.width>>1,
            y : canvas.height>>1
        };

        img = new Image();
        img.src = chalk_image_url;
        tools.push({
            img    : img,
            offset : { x : -5, y : -5 },
            size   : { width : 183/4, height : 254/4 }
        });

        img = new Image();
        img.src = ereaser_image_url;
        tools.push({
            img    : img,
            offset : { x : -2 , y : -95 },
            size   : { width : 100, height : 100 }
        });

        img = new Image();
        img.src = tack_image_url;
        tools.push({
            img    : img,
            offset : { x : -2 , y : -95 },
            size   : { width : 100, height : 100 }
        });
    }

    function getPosition()
    {
        return position;
    }

    function moveTo( pos )
    {
        position.x = pos.x;
        position.y = pos.y;
    }

    function draw()
    {
        var tool = tools[current_tool_index];
        context.drawImage(tool.img, position.x + tool.offset.x, position.y + tool.offset.y, tool.size.width, tool.size.height);
    }

    function changeTool()
    {
    	current_tool_index++;
    	if(current_tool_index >= tools.length)
    		current_tool_index = 0;
    }

    function setTool(index)
    {
        current_tool_index = index;
    }

    return { init        : init,
             changeTool  : changeTool,
             setTool     : setTool,
             moveTo        : moveTo,
             draw        : draw,
             getPosition : getPosition };
})();