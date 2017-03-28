
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
          id          : 0,
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
          clear : function() {
              drawing_data.current_polygon = [];
              drawing_data.current_color_index = -1;
          }
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

      drawing_data.clear();

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
          if(level_data.pending_static)
          {
              setStaticForCurrentLevel();
          }
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
          context.fillStyle = ColorManager.getColorAt(objects.shapes[i].color_index);
          context.lineWidth = 8;
          /* Drawing polygons */
          context.save();
              context.globalAlpha = objects.shapes[i].deleted ? 0.1 : 1.0;
              context.translate(objects.shapes[i].body.position.x, objects.shapes[i].body.position.y);
              context.rotate(objects.shapes[i].body.angle);
              context.translate(-objects.shapes[i].centroid.x, -objects.shapes[i].centroid.y);
              context.beginPath();
              if(objects.shapes[i].type == "polygon" || objects.shapes[i].type == "wire" ) {
                  context.moveTo(objects.shapes[i].vertices[0].x, objects.shapes[i].vertices[0].y);
                  for(var j = 1; j < objects.shapes[i].vertices.length; j++) {
                      context.lineTo(objects.shapes[i].vertices[j].x, objects.shapes[i].vertices[j].y);
                  }
                  if(objects.shapes[i].type == "polygon")
                      context.closePath();
              }
              else if(objects.shapes[i].type == "circle" ) {
                  context.arc(0,0, objects.shapes[i].radio, 0, Math.PI * 2);
              }
              if(objects.shapes[i].type == "wire" || objects.shapes[i].hint)
              {
                  context.stroke();
              }
              else
              {
                  context.globalAlpha = objects.shapes[i].deleted ? 0.05 : 0.2;
                  context.fill();
                  context.globalAlpha = objects.shapes[i].deleted ? 0.1 : 1.0;
                  context.stroke(); 
              }
          context.restore();
          /* Drawing polygons (ghost mode) */
          if(objects.shapes[i].body.label == "Body" ) {
              context.save();
                  context.beginPath();
                  context.moveTo(objects.shapes[i].vertices[0].x, objects.shapes[i].vertices[0].y);
                  for(var j = 1; j < objects.shapes[i].vertices.length; j++) {
                      context.lineTo(objects.shapes[i].vertices[j].x, objects.shapes[i].vertices[j].y);
                  }

                  if(objects.shapes[i].type == "polygon")
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
          var pos = calcTackAbsPos(i);
          context.translate(pos.x,pos.y);
          context.arc(0, 0, 10, 0, Math.PI * 2);
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
      if(e.button == 2 && e.type == "touchstart")
      {
          erease();
          return;
      }
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
          if(PlayerCursor.getCurrentToolName() == "tack" || (drawing_data.current_polygon.length == 0 && !drawing_data.is_lineto_locked))
          {
              tack();
          }
          else
          {
              closePath();
          }
          drawing_data.is_lineto_locked = false;
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
                   if(head_to_tail_distance < ConfigOptions.polygon_autoclose_distance)
                   {
                       drawing_data.current_polygon = drawing_data.current_polygon.splice(vertex_i, l);
                       closePath(true);
                       drawing_data.is_lineto_locked = true;
                       break;
                   }
              }
          }

      }
      moveTo(pos);
  }

  function closePath(force_polygon)
  {
      var type = evalCurrentShape();

      if(type == "invalid")
      {
          drawing_data.clear();
          return;
      }

      if(type == "polygon" || force_polygon)
      {
          closeAsPolygon();
          return;
      }

      if(type == "wire")
      {
          closeAsWire();
          return;
      }

      if(type == "chain")
      {
          closeAsChain();
          return;
      }
  }

  /*
   * return "polygon", "wire", "chain" or "invalid"
   */
  function evalCurrentShape()
  {
      if(drawing_data.current_polygon.length < ConfigOptions.min_vertices_per_polygon)
      {
          return "invalid";
      }

      var diff_x = drawing_data.current_polygon[0].x - drawing_data.current_polygon[drawing_data.current_polygon.length-1].x;
      var diff_y = drawing_data.current_polygon[0].y - drawing_data.current_polygon[drawing_data.current_polygon.length-1].y;
      var head_to_tail_distance = Math.sqrt(diff_x * diff_x + diff_y * diff_y);
      if(head_to_tail_distance > ConfigOptions.polygon_autoclose_distance * 3)
      {
          return "wire";
      }

      return "polygon"
  }

  function createStick(pos1, pos2)
  {
      var pos = {
          x : ((pos1.x + pos2.x) / 2),
          y : ((pos1.y + pos2.y) / 2)
      };
      var height = 10;
      var vector_x = pos2.x - pos1.x;
      var vector_y = pos2.y - pos1.y;
      var width = Math.sqrt( (vector_x * vector_x) + (vector_y * vector_y) );
      var angle = Math.atan(vector_y / vector_x);
      return Matter.Bodies.rectangle(pos.x, pos.y, width*2, height, {friction: 1.0, angle : angle});
  }

  function calcCentroidOfWire(vertices)
  {
       var centroid = { x : 0, y : 0 };
       var i , l = vertices.length;
       for(i = 0; i < l; i++)
       {
          centroid.x += vertices[i].x;
          centroid.y += vertices[i].y;
       }
       centroid.x /= l;;
       centroid.y /= l;
       return centroid;
  }

  function closeAsPolygon()
  {
      drawing_data.current_polygon = PolyCompressor.compress(drawing_data.current_polygon);
      var centroid = Matter.Vertices.centre(drawing_data.current_polygon);
      var body = Matter.Bodies.fromVertices(centroid.x, centroid.y, drawing_data.current_polygon, {friction: 0.5 });
      if(body == undefined) {
          drawing_data.clear();
          return;
      };
      var group = null;
      var tack_indices = [];
      var i, l = objects.tacks.length;
      for(i = 0; i < l; i++)
      {
          if(objects.tacks[i].bodyB == null)
          {
              if(itsInsideOf(calcTackAbsPos(i), drawing_data.current_polygon ))
              {
                  if(group == null)
                  {
                      group = objects.tacks[i].bodyA.collisionFilter.group;
                  }
                  else
                  {
                      objects.tacks[i].bodyA.collisionFilter.group = group;
                  }
                  tack_indices.push(i);
              }
          }
      }

      objects.shapes.push({
          body : body,
          type : "polygon",
          vertices : drawing_data.current_polygon,
          centroid: centroid,
          color_index : drawing_data.current_color_index,
      });

      if(group != null) {
          body.collisionFilter.group = group;
      }

      Matter.World.add(engine.world, [body]);
      l = tack_indices.length;
      var static_connections = 0;
      for(i = 0; i < l; i++)
      {
          objects.tacks[tack_indices[i]].bodyB = body;
          objects.tacks[tack_indices[i]].offsetB = calcTackOffset(calcTackAbsPos(tack_indices[i]), body);
          objects.tacks[tack_indices[i]].contraint = Matter.Constraint.create({
              bodyA  : objects.tacks[tack_indices[i]].bodyA,
              pointA : objects.tacks[tack_indices[i]].offsetA,
              bodyB  : objects.tacks[tack_indices[i]].bodyB,
              pointB : objects.tacks[tack_indices[i]].offsetB,
              stiffness: 0.1,
              length : 5,
          });

          if(objects.tacks[tack_indices[i]].bodyA.isStatic)
          {
              static_connections++;
          }

          Matter.World.add(engine.world, [objects.tacks[tack_indices[i]].contraint]);
          if(!objects.tacks[tack_indices[i]].bodyA.isStatic)
          {
              Matter.Body.setMass(body, body.mass * 5);
              objects.tacks[tack_indices[i]].contraint.stiffness = 0.05;
              objects.tacks[tack_indices[i]].contraint.length = 5;
          }

      }
      if(static_connections > 1)
      {
          Matter.Body.set(body, {isStatic : true });
      }
      drawing_data.clear();
  }

  function closeAsWire()
  {
      var parts = [];
      var i, l = drawing_data.current_polygon.length;
      for(var i = 1 ; i < l; i++)
      {
          parts.push(createStick(drawing_data.current_polygon[i-1], drawing_data.current_polygon[i]));
      }

      var body = Matter.Body.create( {parts: parts});
      Matter.Body.setInertia(body, body.inertia * 5);

      var centroid = calcCentroidOfWire(drawing_data.current_polygon);

      objects.shapes.push({
          body : body,
          type : "wire",
          vertices : drawing_data.current_polygon,
          centroid: centroid,
          color_index : drawing_data.current_color_index,
      });

      Matter.World.add(engine.world, [body]);
      drawing_data.clear();
  }

  function closeAsChain()
  {
      var parts = [];
      var i, l = drawing_data.current_polygon.length;
      for(var i = 1 ; i < l; i++)
      {
          parts.push(createStick(drawing_data.current_polygon[i-1], drawing_data.current_polygon[i]));
      }

      var body = Matter.Body.create( {parts: parts});
      Matter.Body.setInertia(body, body.inertia * 5);

      var centroid = calcCentroidOfWire(drawing_data.current_polygon);

      objects.shapes.push({
          body : body,
          type : "wire",
          vertices : drawing_data.current_polygon,
          centroid: centroid,
          color_index : drawing_data.current_color_index,
      });

      Matter.World.add(engine.world, [body]);
      drawing_data.clear();
  }

  function tack()
  {
      var cur_pos = PlayerCursor.getPosition();
      cur_pos.x -= camera.x;
      cur_pos.y -= camera.y;

      var tack = {
          bodyA     : null,
          offsetA   : null,
          bodyB     : null,
          offsetB   : null,
          contraint : null,
      };
      var _bodies = Matter.Composite.allBodies(engine.world);
      var _bodies = Matter.Query.point(_bodies, cur_pos);
      if(_bodies.length == 0)
      {
          console.log("You cannot put tacks in the air");
          return;
      }

      tack.bodyA = _bodies[0];
      if(!tack.bodyA.__Assigned)
      {
          tack.bodyA.collisionFilter.group = Matter.Body.nextGroup(true);
          tack.bodyA.__Assigned = true;
      }
      tack.offsetA = calcTackOffset(cur_pos, tack.bodyA);
      objects.tacks.push(tack);
  }

  function erease()
  {
      // obtener la posicion del cursor
      var cur_pos = PlayerCursor.getPosition();
      cur_pos.x -= camera.x;
      cur_pos.y -= camera.y;

      // buscar tacks para elminarlas
      var i, l = objects.tacks.length;
      for(i = 0 ; i < l; i ++)
      {
          if(!objects.tacks[i].deleted)
          {
              var tack_pos = calcTackAbsPos(i)
              var diff_x = cur_pos.x - tack_pos.x;
              var diff_y = cur_pos.y - tack_pos.y;
              var distance = Math.sqrt((diff_x * diff_x) + (diff_y * diff_y));
              if(distance < 20)
              {
                 // si se encuentra un tack, borrarla y terminar
                  if(objects.tacks[i].contraint != null)
                      Matter.World.remove(engine.world, [objects.tacks[i].contraint]);
                  objects.tacks[i].contraint = null;
                  objects.tacks[i].deleted = true;
                  drawing_data.clear();
                  return;
              }
          }
      }

      // si no se encuentra tack, eliminar una figura que se encuentre bajo el cursor
      var _bodies = Matter.Composite.allBodies(engine.world);
      var _bodies = Matter.Query.point(_bodies, cur_pos);
      l = _bodies.length;
      for(i = 0; i < l; i++)
      {
          removeBody(_bodies[i]);
          break;
      }
      drawing_data.clear();
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

  function calcTackAbsPos(index)
  {
      var tack = objects.tacks[index];

      var x = tack.offsetA.x;
      var y = tack.offsetA.y;
      var r = tack.bodyA.angle;

      // 2D Rotation 
      var pos = {
          x : (x  * Math.cos(r)) - (y * Math.sin(r)),
          y : (y * Math.cos(r)) + (x * Math.sin(r)),
      };

      pos.x += tack.bodyA.position.x;
      pos.y += tack.bodyA.position.y;
      return pos;
  }

  function calcTackOffset(pos, body)
  {
      var x = pos.x - body.position.x;
      var y = pos.y - body.position.y;
      var radians = -body.angle;

      // 2D Rotation 
      offset = {
          x : (x  * Math.cos(radians)) - (y * Math.sin(radians)),
          y : (y * Math.cos(radians)) + (x * Math.sin(radians)),
      };
      return offset;
  }

  function removeTacksConnectedTo(body_id)
  {
      for(var i = objects.tacks.length-1; i >= 0; i--)
      {
          if(!objects.tacks[i].deleted)
          {
              if(objects.tacks[i].bodyA.id == body_id)
              {
                   if(objects.tacks[i].contraint != null)
                       Matter.World.remove(engine.world, [objects.tacks[i].contraint]);
                   objects.tacks[i].contraint = null;
                   objects.tacks[i].deleted = true;
              }
              if(objects.tacks[i].bodyB != null && objects.tacks[i].bodyB.id == body_id)
              {
                   Matter.World.remove(engine.world, [objects.tacks[i].contraint]);
                   objects.tacks[i].contraint = null;
                   objects.tacks[i].deleted = true;
              }
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
      level_data.pending_static = true;
      level_data.static_bodies = [];
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
              if(level.bodies[i].isStatic)
              {
                  level_data.static_bodies.push(level.bodies[i].label);
              }
              var body = Matter.Bodies.fromVertices(level.bodies[i].position.x,
                                                    level.bodies[i].position.y,
                                                    level.bodies[i].vertices,
                                                    { label : level.bodies[i].label });
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
                                               { isStatic : level.bodies[i].isStatic,
                                                 label : level.bodies[i].label } 
              );
          }
          objects.shapes.push({
              body : body,
              deleted : level.bodies[i].hint,
              hint : level.bodies[i].hint,
              type : type,
              vertices : level.bodies[i].vertices,
              radio : level.bodies[i].radio,
              centroid: centroid,
              color_index : ColorManager.getRandomColorIndex(),
          });
          if(!level.bodies[i].hint)
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

  function setStaticForCurrentLevel()
  {
      bodies = Matter.Composite.allBodies(engine.world);
      for(var i = 0; i < bodies.length; i++)
      {
          for(var j = 0; j < level_data.static_bodies.length; j++)
          if(bodies[i].label == level_data.static_bodies[j])
          {
              Matter.Body.setStatic(bodies[i], true);
          }
      }
      level_data.static_bodies = null;
      level_data.pending_static = false;
  }

  function restartLevel()
  {
      loadLevel(level_data.id);
  }

  function itsInsideOf(pos, polygon)
  {
      var sides = polygon.length - 1;
      var j = sides - 1;
      var pointStatus = false;
      for (var i = 0; i < sides; i++)
      {
          if (polygon[i].y < pos.y && polygon[j].y >= pos.y || polygon[j].y < pos.y && polygon[i].y >= pos.y)
          {
              if (polygon[i].x + (pos.y - polygon[i].y) /  (polygon[j].y - polygon[i].y) * (polygon[j].x - polygon[i].x) < pos.x)
              {
                  pointStatus = !pointStatus ;                        
              }
          }
          j = i;
      }
      return pointStatus;
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
