
/**
  * @module ColorManager
  */
var ColorManager = (function(){

  var context = null;
   var patterns = [];
   var urls = [
       //"http://oi65.tinypic.com/2e1gbpc.jpg",
       "./res/img/chalk_pattern.png",
       "./res/img/chalk_pattern2.png",
       "./res/img/chalk_pattern3.png",
	 ];
	 var last_index = 0;

    /** @func init
      * @desc Called from Game.init(...)
      */
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

    /** @func getColorAt
      * @desc returns the color object
      * @param index {integer} the index of the color or pattern
      */
   function getColorAt(index)
   {
        return patterns[index];
   }

    /** @func getRandomColorIndex
      * @desc selects a random color and returns its index
      */
   function getRandomColorIndex()
   {
       return Math.floor((Math.random() * urls.length));
   }

    /** @func onImageLoaded
      * @desc called when an image/pattern/color is loaded
      */
   function onImageLoaded(img)
   {
        patterns.push(context.createPattern(img, "repeat"));
   }

   return { init                : init,
   	        getColorAt          : getColorAt,
   	        getRandomColorIndex : getRandomColorIndex };
})();