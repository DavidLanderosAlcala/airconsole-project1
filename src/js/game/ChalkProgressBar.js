

var ChalkProgressBar = (function(){

	var m_elem = document.querySelector("#chalk-progressbar");
	var m_value = 1.0;
	window.addEventListener("resize", onresize);

    function setValue(value)
    {
        m_value = value;
        var rect = m_elem.getBoundingClientRect();
        var bgPosX = -(rect.width * (1.0 - value));
        m_elem.style.backgroundPosition = bgPosX + "px 0px";
    }

    function onresize()
    {
        setValue(m_value);
    }

    return { setValue : setValue };

})();