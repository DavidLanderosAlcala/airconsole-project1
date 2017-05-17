


var RateThisGame = (function(){

	function init()
	{
        var stars = document.querySelectorAll(".rate-this-game-star");
        for(var i = 0; i < stars.length; i++)
        {
        	stars[i].addEventListener("mouseenter", function(){
        		var rate = this.dataset.starno;
                for(var j = 0; j < stars.length; j++)
                {
                	if(j < rate)
                		stars[j].dataset.filled = "true";
                	else
                		stars[j].dataset.filled = "false";
                }
        	});
        }

        document.querySelector(".rate-this-game").addEventListener("mouseleave", function(){
            for(var j = 0; j < stars.length; j++)
            {
                stars[j].dataset.filled = "false";
            }
        });
	}

	return {
		init : init,
	};
})();

RateThisGame.init();