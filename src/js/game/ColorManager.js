

var ColorManager = (function(){

  var context = null;
  var patterns = [];
  var urls = [
      "http://oi65.tinypic.com/2e1gbpc.jpg",
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