

var ColorManager = (function(){

  var context = null;
  var patterns = [];
  var urls = [
      "http://oi65.tinypic.com/2e1gbpc.jpg",
	    //"http://oi67.tinypic.com/2ugcwaa.jpg",
	    //"http://oi68.tinypic.com/2zyftwh.jpg",
	    //"http://oi66.tinypic.com/2lwkcpw.jpg",
	    //"http://oi67.tinypic.com/11sywid.jpg",
	];
	var last_index = 0;

   function init(_context)
   {
       last_index = 0;
   	   context = _context;
       var i, l = urls.length;
       for(i = 0; i < l; i++)
       {
           var img = new Image();
           img.onload = function(){
               onImageLoaded(this);
           };
           img.src = urls[i];
       }
   }

   function getColorAt(index)
   {
        return patterns[index];
   }

   function getRandomColorIndex()
   {
       return Math.floor((Math.random() * urls.length));
   }

   function onImageLoaded(img)
   {
        patterns.push(context.createPattern(img, "repeat"));
   }

   return { init                : init,
   	        getColorAt          : getColorAt,
   	        getRandomColorIndex : getRandomColorIndex };
})();