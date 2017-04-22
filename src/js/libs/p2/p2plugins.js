

var P2Plugins = (function(){

	function shouldCollide(obj1, obj2)
	{
		/* si pertenecen al grupo 1 deberian colisionar con todos los objetos */
		if(obj1.collisionGroup == 1 || obj2.collisionGroup == 1)
		{
			return true;
		}

		/* si pertenecen al grupo 0 entonces tienen la propiedad collisionGroups en plural
		 * asi que se busca si pertenecen a algun grupo en comun
		 */
		var i, l1 = obj1.collisionGroups.length;
		var j, l2 = obj2.collisionGroups.length;
		for(i = 0; i < l1; i++)
			for(j = 0; j < l2; j++)
				if(obj1.collisionGroups[i] == obj2.collisionGroups[j])
					return false;
        return true;
	}
	
	return { shouldCollide : shouldCollide }
})();