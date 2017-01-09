
/**
  * @module Sprite
  */
var Sprite = (function(){

    var canvas;
    var context;

    /**
      * @func init
      * @desc initialize the sprite module and its inner class
      * @param cnvas the main canvas to be used
      * @param ctx the 2D context already created
      */
    function init(cnvas, ctx)
    {
        canvas = cnvas;
        context = ctx;
    }

   /**
     * @func createSprite
     * @desc creates a new sprite-based animation
     * @param {object} options object containing, filename, width, height, fps [, x_offset, y_offset, starting_frame]
     * @param {function} callback function to be called when the resource are complete loaded
     * @return {object} returns an instance of the inner class Sprite
     */
   function createSprite(options, callback)
   {
        return new SpriteClass(options, callback);
   }

   /**
     * @func SpriteClass
     * @desc contructor for Sprite's inner class, it is called from Sprite.createSprite(...)
     */
   function SpriteClass(options, callback)
   {
        this.callback = callback == undefined ? function(){ } : callback;
        this.filename = options.filename;
        this.width = options.width;
        this.height = options.height;
        this.fps = options.fps == undefined ? 15 : options.fps;
        this.x_offset = options.x_offset == undefined ? 0 : options.x_offset;
        this.y_offset = options.y_offset == undefined ? 0 : options.y_offset;
        this.starting_frame = options.starting_frame == undefined ? 0 : options.starting_frame;
        this.current_frame = this.starting_frame;
        this.time_limit = 1 / this.fps * 1000;
        this.current_time = new Date().getTime();
        this.time_stamp = 0;
   }

   /**
     * @func reset
     * @desc It resets the Sprite (time, and starting frame)
     */
   SpriteClass.prototype.reset = function()
   {
        this.current_frame = this.starting_frame;
        this.time_stamp = 0;
        this.current_time = new Date().getTime();
   }


   /**
     * @func render
     * @param {number} x Coordinates 
     * @param {number} y Coordinates 
     */
   SpriteClass.prototype.render = function(x, y)
   {

   }

})();
