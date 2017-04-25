
/**
  * @namespace
  * @property {Number}  min_vertex_distance         - The minimun distance between vertices
  * @property {Number}  polygon_autoclose_distance  - The game closes a polygon if the distance between the head and the tail is < polygon_autoclose_distance
  * @property {Number}  min_vertices_per_polygon    - A polygon cannot be created with less than "min_vertices_per_polygon" vertices
  */
var ConfigOptions = {
    min_vertex_distance        : 0.2,
    polygon_autoclose_distance : 0.3,
    min_vertices_per_polygon   : 5,
    use_dirty_layer            : true,
}