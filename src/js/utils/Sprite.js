

class Sprite {
  
   /**
     * @class Sprite
     * @desc creates a new sprite-based animation
     * @param {object} options object containing: filename, width, height, frame_count, fps [, x_offset, y_offset, starting_frame]
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
        this.frame_count = options.frame_count;
        this.time_limit = 1 / this.fps * 1000;
        this.current_time = new Date().getTime();
        this.time_stamp = 0;
        this.img = new Image();
        this.img.src = this.filename;
        this.img.addEventListener("onload", function() {
            callback();
            if(self.width == undefined)
            {
                selft.width = self.img.width / self.frame_count;
            }
            if(self.height == undefined)
            {
                self.height = self.img.height;
            }
        });
        this.img.addEventListener("onerror", function() {
            callback({ message : "couldn't load the image" });
        });
        var self = this;
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
     * @param {number} w width (optional)
     * @param {number} h height (optional)
     * @desc Draws the sprite's current frame on the canvas
     */
   render(x, y, w, h, inverted)
   {
        this.calcCurrentFrame();
        var sx = (this.current_frame * this.width) + this.x_offset;
        var sy = this.y_offset;
        var sw = this.width;
        var sh = this.height;
        var dx = x;
        var dy = y;
        var dw = w == undefined ? this.width : w;
        var dh = h == undefined ? this.height : h;
        Sprite.context.save();
        if(inverted)
        {
            Sprite.context.scale(-1,1);
            dx = -dx;
            Sprite.context.translate(-dw, 0);
        }
        Sprite.context.drawImage(this.img, sx, sy, sw, sh, dx, dy, dw, dh);
        Sprite.context.restore();
   }

   /** @private
     * @method calcCurrentFrame
     * @memberof Sprite
     * @instance
     * @desc Sets the current frame based on the time elapsed since the last call
     */
   calcCurrentFrame()
   {
        var new_time = new Date().getTime();
        this.time_stamp += new_time - this.current_time;
        this.current_time = new_time;

        if(this.time_stamp > this.time_limit)
        {
            this.time_stamp = 0;
            this.current_frame++;
            if(this.current_frame == this.frame_count)
            {
                this.current_frame = 0;
            }
        }
   }

}
