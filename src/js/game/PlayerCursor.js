

/** @module PlayerCursor
  */
var PlayerCursor = (function() {

    var element;
    var tools = [
        "chalk",
        "ereaser",
        "tack"
    ];
    var position = { x : 0, y : 0};
    var current_tool_index = 0;

    function init(config)
    {
        element = document.querySelector("#player_cursor");
        element.dataset.tool = tools[current_tool_index];
        if(Utils.isRunningOnAirConsole())
        {
            moveTo({x:config.canvas.width>>1,y:config.canvas.height>>1});
        }
    }

    function getPosition()
    {
        return position;
    }

    function moveTo( pos )
    {
        position.x = pos.x;
        position.y = pos.y;
        element.style.left = pos.x + "px";
        element.style.top = pos.y + "px";
    }

    function changeTool()
    {
    	current_tool_index++;
    	if(current_tool_index >= tools.length)
    		current_tool_index = 0;
        element.dataset.tool = tools[current_tool_index];
    }

    function setTool(index)
    {
        current_tool_index = index;
        element.dataset.tool = tools[current_tool_index];
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