

var P2Plugins = (function(){

	function shouldCollide(obj1, obj2)
	{
        if(obj1.collisionGroup == obj2.collisionGroup && obj2.collisionGroup != 1){
            return false;
        }
        return true;
	}
	
	return { shouldCollide : shouldCollide }
})();