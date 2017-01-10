

class Sprite {
  
   /**
     * @class Sprite
     * @desc creates a new sprite-based animation
     * @param {object} options object containing, filename, width, height, fps [, x_offset, y_offset, starting_frame]
     * @param {function} callback function to be called when the resource are complete loaded
     */
   constructor(options, callback)
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
      * @func init
      * @memberof Sprite
      * @desc initialize the sprite module and its inner class
      * @param {object} canvas the main canvas to be used
      * @param {object} context the 2D context already created
      */
    static init(canvas, context)
    {
        Sprite.canvas = canvas;
        Sprite.context = context;
    }

   /**
     * @method reset
     * @memberof Sprite
     * @instance
     * @desc It resets the Sprite (time, and starting frame)
     */
   reset()
   {
        this.current_frame = this.starting_frame;
        this.time_stamp = 0;
        this.current_time = new Date().getTime();
   }


   /**
     * @method render
     * @memberof Sprite
     * @instance
     * @param {number} x Coordinates 
     * @param {number} y Coordinates 
     * @desc Draws the sprite's current frame on the canvas
     */
   render(x, y)
   {

   }

}
