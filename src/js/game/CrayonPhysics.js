
var CrayonPhysics = (function(){

  /* module/local variables */
  var canvas;
  var context;
  var camera;
  var canvas_rect;
  var engine;
  var objects;
  var drawing_data;
  var level_data;

  function init(options)
  {
      MenuManager.init();
      canvas = options.canvas;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      camera = {
          x : canvas.width >> 1,
          y : canvas.height
      };

      objects = {
          shapes : [],
          tacks  : [],
      };

      level_data = {
          id          : -1,
          game_over   : false,
          update_fnc  : null,
          setup_fnc   : null,
          title       : "",
          description : "",
          context     : { },
      };

      drawing_data = {
          current_polygon     : [],
          current_color_index : -1,
          is_lineto_locked    : false,
      };

      canvas_rect = canvas.getBoundingClientRect();
      context = canvas.getContext("2d");
      ColorManager.init(context);
      PlayerCursor.init({ canvas : canvas, context : context });
      window.addEventListener("mousemove", onMouseMove);
      Touch.surface("div.main_container", onTouchEvent);
      engine = Matter.Engine.create();
      Matter.Engine.run(engine);
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      window.requestAnimationFrame(update);
      LevelSelector.show();
  }

  function restartEngine()
  {
      // remove all objects.shapes
      var _bodies = Matter.Composite.allBodies(engine.world);
      Matter.World.remove(engine.world, _bodies);

      // Reset some variables
      objects.shapes = [];
      objects.tacks  = [];

      drawing_data.current_polygon = [];
      drawing_data.current_color_index = -1;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      camera = {
          x : canvas.width >> 1,
          y : canvas.height
      };
      
  }

  function update()
  {
      if(!level_data.game_over && level_data.update_fnc != null)
      {
          level_data.game_over = level_data.update_fnc(level_data.context, engine);
          if(level_data.game_over)
              Screen.setTitleText("You won!!");
      }
      render();
      window.requestAnimationFrame(update);
  }

  function render()
  {
      /* Clearing the screen */
      context.clearRect(0,0, canvas.width, canvas.height);
      context.save();
      context.translate(camera.x, camera.y);

      /* Drawing the current polygon */
      context.save();
      if(drawing_data.current_polygon.length > 1)
      {
          context.strokeStyle = ColorManager.getColorAt(drawing_data.current_color_index);
          context.lineWidth = 8;
          context.beginPath();
          context.moveTo(drawing_data.current_polygon[0].x, drawing_data.current_polygon[0].y);
          for(var i = 0; i < drawing_data.current_polygon.length; i++)
          {
              context.lineTo(drawing_data.current_polygon[i].x, drawing_data.current_polygon[i].y);
          }
          context.stroke();
      }
      context.restore();

      /* Drawing polygons */
      var i, l = objects.shapes.length;
      for(i = 0; i < l; i++)
      {
          context.strokeStyle = ColorManager.getColorAt(objects.shapes[i].color_index);
          context.lineWidth = 8;
          /* Drawing polygons */
          context.save();
              context.globalAlpha = objects.shapes[i].deleted ? 0.1 : 1.0;
              context.translate(objects.shapes[i].body.position.x, objects.shapes[i].body.position.y);
              context.rotate(objects.shapes[i].body.angle);
              context.translate(-objects.shapes[i].centroid.x, -objects.shapes[i].centroid.y);
              context.beginPath();
              if(objects.shapes[i].type == "polygon" ) {
                  context.moveTo(objects.shapes[i].vertices[0].x, objects.shapes[i].vertices[0].y);
                  for(var j = 1; j < objects.shapes[i].vertices.length; j++) {
                      context.lineTo(objects.shapes[i].vertices[j].x, objects.shapes[i].vertices[j].y);
                  }
                  context.closePath();
              }
              else if(objects.shapes[i].type == "circle" ) {
                  context.arc(0,0, objects.shapes[i].radio, 0, Math.PI * 2);
              }
              context.stroke();
          context.restore();
          /* Drawing polygons (ghost mode) */
          if(objects.shapes[i].body.label == "Body" ) {
              context.save();
                  context.beginPath();
                  context.moveTo(objects.shapes[i].vertices[0].x, objects.shapes[i].vertices[0].y);
                  for(var j = 1; j < objects.shapes[i].vertices.length; j++) {
                      context.lineTo(objects.shapes[i].vertices[j].x, objects.shapes[i].vertices[j].y);
                  }
                  context.closePath();
                  context.globalAlpha = 0.1;
                  context.stroke();
              context.restore();
          }
      }

      /* Drawing objects.tacks */
      context.strokeStyle = ColorManager.getColorAt(0);
      context.lineWidth = 8;
      for(var i = 0; i < objects.tacks.length; i++)
      {
          context.save();
          context.beginPath();
          context.arc(objects.tacks[i].x, objects.tacks[i].y, 10, 0, Math.PI * 2);
          context.globalAlpha = objects.tacks[i].deleted ? 0.1 : 1.0;
          context.stroke();
          context.restore();
      }

      if(ConfigOptions.use_debug_render)
      {
          debugRender();
      }

      context.restore();
  }

  function debugRender()
  {
      context.save();
      var _bodies = Matter.Composite.allBodies(engine.world);
      context.beginPath();
      for (var i = 0; i < _bodies.length; i += 1) {
          var vertices = _bodies[i].vertices;
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
      var pos = { x : e.clientX - canvas_rect.left, y: e.clientY - canvas_rect.top };
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
          drawing_data.is_lineto_locked = false;
          if(PlayerCursor.getCurrentToolName() == "ereaser")
          {
              erease();
          }
          if(PlayerCursor.getCurrentToolName() == "tack")
          {
              tack();
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
      if(drawing_data.is_lineto_locked) { return; }
      if(PlayerCursor.getCurrentToolName() == "chalk")
      {
          var new_pos = {
            x : pos.x - camera.x,
            y : pos.y - camera.y,
          };
          if(drawing_data.current_polygon.length > 0){
            var old_pos = drawing_data.current_polygon[drawing_data.current_polygon.length - 1];
            distance = Math.sqrt((new_pos.x - old_pos.x) * (new_pos.x - old_pos.x) + (new_pos.y - old_pos.y) * (new_pos.y - old_pos.y));
            if(distance < ConfigOptions.vertex_min_distance)
            {
              return; 
            }
          }
          if(drawing_data.current_color_index == -1)
          {
            drawing_data.current_color_index = ColorManager.getRandomColorIndex();
          }     
          drawing_data.current_polygon.push(new_pos);

          // El siguiente fragmento de codigo detecta
          // si ya se formo un cuerpo cerrado y recorta
          // aquellos vertices que queden fuera de dicho cuerpo.
          if(drawing_data.current_polygon.length >= ConfigOptions.min_vertices_per_polygon)
          {
              var vertex_i, l = drawing_data.current_polygon.length - ConfigOptions.min_vertices_per_polygon;
              for(var vertex_i = 0; vertex_i < l ; vertex_i++)
              {
                   var diff_x = drawing_data.current_polygon[vertex_i].x -
                                drawing_data.current_polygon[drawing_data.current_polygon.length-1].x;
                   var diff_y = drawing_data.current_polygon[vertex_i].y -
                                drawing_data.current_polygon[drawing_data.current_polygon.length-1].y;
                   var head_to_tail_distance = Math.sqrt(diff_x * diff_x + diff_y * diff_y);
                   // si la distancia es menor a 30 pixeles damos por terminada la figura
                   // Esto es un cuerpo solido.
                   if(head_to_tail_distance < 20)
                   {
                       drawing_data.current_polygon = drawing_data.current_polygon.splice(vertex_i, l);
                       closePath();
                       drawing_data.is_lineto_locked = true;
                       break;
                   }
              }
          }

      }
      moveTo(pos);
  }

  function closePath()
  {
      if(drawing_data.current_polygon.length < ConfigOptions.min_vertices_per_polygon)
      {
          drawing_data.current_polygon = [];
          drawing_data.current_color_index = -1;
          return;
      }
      console.log(drawing_data.current_polygon.length + " vertices");
      drawing_data.current_polygon = PolyCompressor.compress(drawing_data.current_polygon);
      console.log(drawing_data.current_polygon.length + " vertices - compressed");
      var centroid = Matter.Vertices.centre(drawing_data.current_polygon);
      var body = Matter.Bodies.fromVertices(centroid.x, centroid.y, drawing_data.current_polygon, {friction: 0.5});
      if(body == undefined)
      {
          drawing_data.current_polygon = [];
          return;
      };
      var diff = {
          x : body.vertices[0].x - drawing_data.current_polygon[0].x,
          y : body.vertices[0].y - drawing_data.current_polygon[0].y,
      };
      objects.shapes.push({
          body : body,
          type : "polygon",
          vertices : drawing_data.current_polygon,
          centroid: centroid,
          color_index : drawing_data.current_color_index,
      });
      Matter.World.add(engine.world, [body]);
      checkForTacks(objects.shapes[objects.shapes.length-1]);
      drawing_data.current_polygon = [];
      drawing_data.current_color_index = -1;
  }

  function checkForTacks(my_body)
  {
      var count = 0;
      var _bodies = null;
      for(var tack_i = 0; tack_i < objects.tacks.length; tack_i++)
      {
          if(objects.tacks[tack_i].deleted)
          {
              continue;
          }

          _bodies = Matter.Composite.allBodies(engine.world);
          _bodies = Matter.Query.point(_bodies, {x : objects.tacks[tack_i].x, y : objects.tacks[tack_i].y} );
          var i, l = _bodies.length;
          for(i = 0; i < l; i++)
          {
              if(my_body.body.id == _bodies[i].id)
              {
                  var diff = {
                      x : objects.tacks[tack_i].x - my_body.body.position.x,
                      y : objects.tacks[tack_i].y - my_body.body.position.y,
                  };
                  // agregar restriccion al mundo y conservar una referencia
                  objects.tacks[tack_i].body_id = my_body.body.id;
                  objects.tacks[tack_i].constraint = Matter.Constraint.create({
                      bodyA  : my_body.body,
                      pointA : diff,
                      pointB :  objects.tacks[tack_i],
                      stiffness: 0.1,
                      length : 1,
                  });
                  count++;
                  Matter.World.add(engine.world, [objects.tacks[tack_i].constraint]);
              }
          }
      }
      if(count > 1)
      {
          // si tiene 2 tacks entonces debe quedar completamente estatica
          Matter.Body.setStatic(my_body.body,true);
      }
  }

  function tack()
  {
      var cur_pos = PlayerCursor.getPosition();
      tack_pos = {
        x : cur_pos.x - camera.x,
        y: cur_pos.y - camera.y
      };
      var i, l = objects.tacks.length;
      for(var i = 0 ; i < l; i ++)
      {
          var diff_x = tack_pos.x - objects.tacks[i].x;
          var diff_y = tack_pos.y - objects.tacks[i].y;
          var distance = Math.sqrt(diff_x * diff_x + diff_y * diff_y);
          if(distance < ConfigOptions.min_distance_between_tacks)
          {
              return;
          }
      }
      objects.tacks.push(tack_pos);
  }

  function erease()
  {
      var _bodies = Matter.Composite.allBodies(engine.world);
      var cur_pos = PlayerCursor.getPosition();
      cur_pos.x -= camera.x;
      cur_pos.y -= camera.y;
      var _bodies = Matter.Query.point(_bodies, cur_pos);
      var i, l = _bodies.length;
      for(i = 0; i < l; i++)
      {
          removeBody(_bodies[i]);
      }
      drawing_data.current_polygon = [];
      drawing_data.current_color_index = -1;
  }

  function removeBody(body)
  {
      if(body.label != "Body")
        return;
      Matter.World.remove(engine.world, [body]);
      removeTacksConnectedTo(body.id);
      var i, l = objects.shapes.length;
      for(i = 0; i < l; i++)
      {
          if(body.id == objects.shapes[i].body.id)
          {
              objects.shapes[i].deleted = true;
              return;
          }
      }      
  }

  function removeTacksConnectedTo(body_id)
  {
      for(var i = objects.tacks.length-1; i >= 0; i--)
      {
          if(objects.tacks[i].body_id == body_id)
          {
               objects.tacks[i].deleted = true;
          }
      }
  }

  function changeTool()
  {
      PlayerCursor.changeTool();
  }

  function loadLevel(level_index)
  {
      restartEngine();
      level_data.game_over = false;
      level_data.context = {};
      level_data.id = level_index;
      var level = LevelSelector.getLevels()[level_index];
      level_data.update_fnc = level.update;
      var _bodies = [];
      for(var i = 0; i < level.bodies.length; i++)
      {
          var type = level.bodies[i].type == "circle" ? "circle" : "polygon";
          if(type == "polygon")
          {
              if(level.bodies[i].mapped == undefined)
              {
                  level.bodies[i].position.y = -level.bodies[i].position.y;
                  for(var v = 0; v < level.bodies[i].vertices.length; v++)
                  {
                      level.bodies[i].vertices[v].y = -level.bodies[i].vertices[v].y;
                  }
                  level.bodies[i].mapped = true;
              }
              var centroid = Matter.Vertices.centre(level.bodies[i].vertices);
              if(level.bodies[i].label == "cup")
              {
                  console.log("El centroide del vaso es: " + centroid.x + "," + centroid.y);
              }
              var body = Matter.Bodies.fromVertices(level.bodies[i].position.x,
                                                    level.bodies[i].position.y,
                                                    level.bodies[i].vertices,
                                                    { isStatic : level.bodies[i].isStatic, label : level.bodies[i].label });
          }
          else if(type == "circle")
          {
              if(level.bodies[i].mapped == undefined)
              {
                  level.bodies[i].position.y = -level.bodies[i].position.y;
                  level.bodies[i].mapped = true;
              }
              var centroid = { x : 0, y: 0 };
              var body = Matter.Bodies.circle( level.bodies[i].position.x,
                                               level.bodies[i].position.y,
                                               level.bodies[i].radio,
                                               { isStatic : level.bodies[i].isStatic, label : level.bodies[i].label }
              );
          }
          objects.shapes.push({
              body : body,
              type : type,
              vertices : level.bodies[i].vertices,
              radio : level.bodies[i].radio,
              centroid: centroid,
              color_index : ColorManager.getRandomColorIndex(),
          });
          _bodies.push(body);
      }
      Matter.World.add(engine.world, _bodies);

      level_data.title       = level.title;
      level_data.description = level.description;
      level_data.setup_fnc   = level.setup;

      Screen.setTitleText(level.description);
      if(level_data.setup_fnc != undefined)
          level_data.setup_fnc(level_data.context, engine);
  }

  function restartLevel()
  {
      loadLevel(level_data.id);
  }

  return {  init          : init,
            moveTo        : moveTo,
            lineTo        : lineTo,
            closePath     : closePath,
            tack          : tack,
            erease        : erease,
            changeTool    : changeTool,
            loadLevel     : loadLevel,
            restartLevel  : restartLevel };
})();
