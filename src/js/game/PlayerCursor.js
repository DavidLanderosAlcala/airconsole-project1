

/** @module PlayerCursor
  */
var PlayerCursor = (function() {

    var element;
    var tools = [
        "chalk",
        "ereaser",
        "tack"
    ];
    var position = new Float32Array(2);
    var current_tool_index = 0;

    function init(config)
    {
        //element = document.querySelector("#player_cursor");
        //element.dataset.tool = tools[current_tool_index];
        if(Utils.isRunningOnAirConsole())
        {
            moveTo({x:config.canvas.width>>1,y:config.canvas.height>>1});
        }
        onResize();
        window.addEventListener("resize", onResize);
    }

    function onResize()
    {
        //element.style.width = (45 / 1920 * window.innerWidth) + "px";
        //element.style.height = (63 / 1920 * window.innerWidth) + "px";
        //element.style.backgroundSize = element.style.width + " " +  element.style.height;
    }

    function getPosition()
    {
        return position;
    }

    function moveTo( pos )
    {
        position[0] = pos[0];
        position[1] = pos[1];
        //element.style.left = pos[0] + "px";
        //element.style.top = pos[1] + "px";
    }

    function changeTool()
    {
    	current_tool_index++;
    	if(current_tool_index >= tools.length)
    		current_tool_index = 0;
        //element.dataset.tool = tools[current_tool_index];
    }

    function setTool(index)
    {
        current_tool_index = index;
        //element.dataset.tool = tools[current_tool_index];
    }

    function getCurrentToolName()
    {
        return tools[current_tool_index];
    }

    return { init        : init,
             changeTool  : changeTool,
             setTool     : setTool,
             moveTo      : moveTo,
             getPosition : getPosition,
             getCurrentToolName: getCurrentToolName };
})();