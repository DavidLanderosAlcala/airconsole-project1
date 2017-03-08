
var CrayonPhysics = (function(){

  /* constants */
  const default_canvas_width  = 640;
  const default_canvas_height = 480;  

  /* variables */
  var canvas;
  var context;
  var canvas_left;
  var canvas_top;
  var engine;
  var bodies = [];
  var current_polygon = [];
  var current_color_index = -1;
  var ground_info;
  var ground;
  var useDebugRenderer = false;
  var seconds = 0;

  var global_x_offset = 0;
  var global_y_offset = 0;

  // Level related
  var current_level_index = 0;
  var current_update_function = null;
  var current_level_context = {};
  var game_over = false;

  function init(options)
  {
      MenuManager.init();
      canvas = options.canvas;
      canvas.width = options.width == undefined ? default_canvas_width : options.width;
      canvas.height = options.height == undefined ? default_canvas_height : options.height;
      canvas_left = canvas.getBoundingClientRect().left;
      canvas_top = canvas.getBoundingClientRect().top;
      global_x_offset = canvas.width >> 1;
      global_y_offset = canvas.height;
      context = canvas.getContext("2d");
      ColorManager.init(context);
      PlayerCursor.init({ canvas : canvas, context : context });
      window.addEventListener("mousemove", onMouseMove);
      Touch.surface("div.main_container", onTouchEvent);
      engine = Matter.Engine.create();
      Matter.Engine.run(engine);
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      window.requestAnimationFrame(render);
      LevelSelector.show();
  }

  function restartEngine()
  {
      // remove all bodies
      var _bodies = Matter.Composite.allBodies(engine.world);
      Matter.World.remove(engine.world, _bodies);

      // Reset some variables
      bodies = [];
      current_polygon = [];
      current_color_index = -1;

      //// create initial objects / load level, etc.
      //ground_info = {
      //    x : canvas.width>>1,
      //    y : canvas.height - 25,
      //    width  : canvas.width,
      //    height : 50,
      //};
      //ground = Matter.Bodies.rectangle(
      //    ground_info.x,
      //    ground_info.y,
      //    ground_info.width,
      //    ground_info.height,
      //    { isStatic : true }
      //)
      //Matter.World.add(engine.world, [ground]);
  }

  function render()
  {
      if(!game_over && current_update_function != null)
      {
          game_over = current_update_function(current_level_context, engine);
          if(game_over)
            Screen.setTitleText("You won!!");
      }

      // clearing the screen
      context.clearRect(0,0, canvas.width, canvas.height);
      context.save();
      context.translate(global_x_offset, global_y_offset);

      // drawing the current polygon
      context.save();
      if(current_polygon.length > 1)
      {
          context.strokeStyle = ColorManager.getColorAt(current_color_index);
          context.lineWidth = 8;
          context.beginPath();
          context.moveTo(current_polygon[0].x, current_polygon[0].y);
          for(var i = 0; i < current_polygon.length; i++)
          {
            context.lineTo(current_polygon[i].x, current_polygon[i].y);
          }
          context.stroke();
      }
      context.restore();

      //// drawing the floor
      //context.save();
      //context.translate(ground.position.x, ground.position.y);
      //context.lineWidth = 8;
      //context.fillStyle = ColorManager.getColorAt(0);
      //context.fillRect(
      //    -ground_info.width>>1,
      //    -ground_info.height>>1,
      //    ground_info.width,
      //    ground_info.height
      //);
      //context.restore();

      // drawing polygons
      var i, l = bodies.length;
      for(i = 0; i < l; i++)
      {
          context.save();
          context.translate(bodies[i].body.position.x, bodies[i].body.position.y);
          context.rotate(bodies[i].body.angle);
          context.translate(-bodies[i].centroid.x, -bodies[i].centroid.y);
          context.strokeStyle = ColorManager.getColorAt(bodies[i].color_index);
          context.beginPath();
          context.moveTo(bodies[i].vertices[0].x, bodies[i].vertices[0].y);
          for(var j = 1; j < bodies[i].vertices.length; j++)
          {
              context.lineTo(bodies[i].vertices[j].x, bodies[i].vertices[j].y);
          }
          context.closePath();
          context.lineWidth = 8;
          context.stroke();
          context.restore();
      }

      if(useDebugRenderer)
      {
          debugRender();
      }

      context.restore();
      window.requestAnimationFrame(render);
  }

  function debugRender()
  {
      context.save();
      var bodies = Matter.Composite.allBodies(engine.world);
      context.beginPath();
      for (var i = 0; i < bodies.length; i += 1) {
          var vertices = bodies[i].vertices;
          context.moveTo(vertices[0].x, vertices[0].y);
          for (var j = 1; j < vertices.length; j += 1) {
              context.lineTo(vertices[j].x, vertices[j].y);
          }
          context.lineTo(vertices[0].x, vertices[0].y);
      }
      context.lineWidth = 3;
      context.strokeStyle = '#0f0';
      context.stroke();
      context.restore();
  }

  function onKeyDown(e)
  {
      
  }

  function onKeyUp(e)
  {
      console.log(e.keyCode);
      if(e.keyCode == 80) // P key
      {
          if(MenuSettings.isVisible())
          {
              MenuSettings.hide();
          }
          else
          {
              MenuSettings.show();
          }
      }
      if(e.keyCode == 76) // L key
      {
          if(LevelSelector.isVisible())
          {
              LevelSelector.hide();
          }
          else
          {
              LevelSelector.show();
          }
      }
      if(e.keyCode == 84) // T key
      {
          PlayerCursor.changeTool();
      }
  }

  function onMouseMove(e)
  {
      var pos = { x : e.clientX - canvas_left, y: e.clientY - canvas_top};
      moveTo(pos);
  }

  function onTouchEvent(e)
  {
      if(e.type == "touchmove")
      {
          lineTo(e);
      }
      else if(e.type == "touchend")
      {
          if(PlayerCursor.getCurrentToolName() == "ereaser")
          {
              erease();
          }
          else
          {
              closePath();
          }
      }
  }

  function moveTo(pos)
  {
      PlayerCursor.moveTo(pos);
  }

  function lineTo(pos)
  {
      if(current_color_index == -1)
      {
          current_color_index = ColorManager.getRandomColorIndex();
      }
      current_polygon.push({
          x : pos.x - global_x_offset,
          y : pos.y - global_y_offset,
      });
      moveTo(pos);
  }

  function closePath()
  {
      if(current_polygon.length == 0)
          return;
      console.log(current_polygon.length + " vertices");
      current_polygon = PolyCompressor.compress(current_polygon);
      console.log(current_polygon.length + " vertices - compressed");
      var centroid = Matter.Vertices.centre(current_polygon);
      var body = Matter.Bodies.fromVertices(centroid.x, centroid.y, current_polygon, {friction: 0.5});
      if(body == undefined)
      {
          current_polygon = [];
          return;
      };
      var diff = {
          x : body.vertices[0].x - current_polygon[0].x,
          y : body.vertices[0].y - current_polygon[0].y,
      };
      bodies.push({
          body : body,
          vertices : current_polygon,
          centroid: centroid,
          color_index : current_color_index,
      });
      Matter.World.add(engine.world, [body]);
      current_polygon = [];
      current_color_index = -1;
  }

  function tack()
  {
      
  }

  function erease()
  {
       var _bodies = Matter.Composite.allBodies(engine.world);
       var _bodies = Matter.Query.point(_bodies, PlayerCursor.getPosition());
       var i, l = _bodies.length;
       for(i = 0; i < l; i++)
       {
           removeBody(_bodies[i]);
       }
  }

  function changeTool()
  {
      PlayerCursor.changeTool();
  }

  function removeBody(body)
  {
  	  if(body.id == ground.id)
  	      return;
      Matter.World.remove(engine.world, [body]);
      var i, l = bodies.length;
      for(i = 0; i < l; i++)
      {
          if(body.id == bodies[i].body.id)
          {
              bodies.splice(i,1);
              return;
          }
      }      
  }

  function enableDebugRenderer()
  {
      useDebugRenderer = true;
  }

  function disableDebugRenderer()
  {
      useDebugRenderer = false;
  }

  function isDebugRendererEnabled()
  {
      return useDebugRenderer;
  }

  function loadLevel(level_index)
  {
      restartEngine();
      game_over = false;
      current_level_context = {};
      current_level_index = level_index;
      var level_data = LevelSelector.getLevels()[level_index];
      current_update_function = level_data.update;
      var _bodies = [];
      for(var i = 0; i < level_data.bodies.length; i++)
      {
          if(level_data.bodies[i].mapped == undefined)
          {
              level_data.bodies[i].position.y = -level_data.bodies[i].position.y;
              for(var v = 0; v < level_data.bodies[i].vertices.length; v++)
              {
                  level_data.bodies[i].vertices[v].y = -level_data.bodies[i].vertices[v].y;
              }
              level_data.bodies[i].mapped = true;
          }
          var centroid = Matter.Vertices.centre(level_data.bodies[i].vertices);
          var body = Matter.Bodies.fromVertices(level_data.bodies[i].position.x,
                                                level_data.bodies[i].position.y,
                                                level_data.bodies[i].vertices,
                                                { isStatic : level_data.bodies[i].isStatic, label : level_data.bodies[i].label });
          bodies.push({
              body : body,
              vertices : level_data.bodies[i].vertices,
              centroid: centroid,
              color_index : ColorManager.getRandomColorIndex(),
          });
          _bodies.push(body);
      }
      Matter.World.add(engine.world, _bodies);
      Screen.setTitleText(level_data.description);
      if(level_data.setup != undefined)
          level_data.setup(current_level_context, engine);
  }

  function restartLevel()
  {
      loadLevel(current_level_index);
  }

  return {  init          : init,
            onTouchEvent  : onTouchEvent,
            moveTo        : moveTo,
            lineTo        : lineTo,
            closePath     : closePath,
            tack          : tack,
            erease        : erease,
            changeTool    : changeTool,
            enableDebugRenderer    : enableDebugRenderer,
            disableDebugRenderer   : disableDebugRenderer,
            isDebugRendererEnabled : isDebugRendererEnabled,
            loadLevel     : loadLevel,
            restartLevel  : restartLevel };

})();
