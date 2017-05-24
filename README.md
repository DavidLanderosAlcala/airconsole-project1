### Como programar niveles ( from zero to hero )

Los niveles se programan mediante 2 funciones vitales:
 + setup
   - Se ejecuta solo una vez al iniciar el nivel
   - No tiene valor de retorno
   - recibe un objeto "contexto" como unico parametro
 + update
   - Se ejecuta "infinitamente" por frame hasta que el nivel se termina
   - su valor de retorno es un bitflag de 3 bits que representan las 3 estrellas
   - recibe un objeto "contexto" como unico parametro

##### Cuando se termina el nivel ?
cuando la funcion update retorna algo distinto de 0 (es decir al menos 1 de 3 bits prendidos)
y obviamente las estrellas ganadas son aquellas cuyo bit esta prendido.

##### El nivel mas facil del mundo
El siguiente codigo representa un nivel que se termina justo en el primer frame
dando al jugador las 3 estrellas.

```javascript
function setup(ctx) {

}

function update(ctx) {
    return FIRST_STAR | SECOND_STAR | THIRD_STAR;
}
```
##### El objecto ctx
El objecto ctx se comporta como "almacen" de variables para el nivel,
dicho objeto se encuentra vacio al llegar como parametro a la funcion setup,
cualquier miembro que se agregue se podra recuperar en la funcion update.



##### El segundo nivel mas facil de mundo
El siguiente ejemplo es un nivel que se gana en el momento exacto en el que el jugador dibuja algun objeto;
Pon atencion al uso del objeto ctx.

```javascript
function setup(ctx) {
    // Almacenamos el bitflag en alguna variable
    ctx.bitflag = 0;

    // Nos suscribimos al evento "addBody" que se ejecuta cuando el usuario dibuja un objecto
    Phy.on("addBody", function(){
      // damos las 3 estrellas
      ctx.bitflag = FIRST_STAR | SECOND_STAR | THIRD_STAR;
    });
}

function update(ctx) {
    // retornamos el bitflag en cada ejecucion;
    // Mientras el bitflag siga valiendo 0 el nivel sige corriendo :D
    return ctx.bitflag;
}
```

##### Eventos, cuales existen y como usarlos
En el juego hay 2 emisores de eventos que se pueden utilizar en la programacion de niveles.
 - Game
 - Physics (a.k.a Phy)

Los eventos que emiten son:

| Eventos de Game    |  Desc.                                                   |
|--------------------|:--------------------------------------------------------:|
| addTack            |  cuando el jugador agrega una tachuela                   |
| connectTack        |  cuando el jugador dibuja un objeto sobre una tachuela   |
| removeTack         |  cuando el jugador borra una tachuela                    |
  
| Eventos de Physics  |  Desc.                                                   |
|---------------------|:--------------------------------------------------------:|
| addBody             |  cuando el jugador agrega un dibujo                      |
| removeBody          |  cuando el jugador borra un dibujo                       |
| beginContact        |  cuando ocurre un contacto entre 2 objetos               |
| endContact          |  cuando termina un contacto entre 2 objetos              |
| beginContactBetween |  cuando ocurre un contacto entre 2 objetos espesificos   |
| endContactBetween   |  cuando termina un contacto entre 2 objetos espesificos  |

##### Ejemplos

- Terminar el nivel con 3 estrellas si el jugador logra hacer chocar los objetos llamados  "ball1" y "ball2",  pero castigar dando solo 1na estrella si ha utilizado la herramienta de borrar.

```javascript
function setup(ctx) {

   ctx.haBorrado = false;
   ctx.bitflag = 0;
   
   Phy.on("removeBody", function(){
       ctx.haBorrado = true;
   });

   Phy.on("beginContactBetween", "ball1", "ball2", function(){
       if(ctx.haBorrado)
       {
           ctx.bitflag = FIRST_STAR;
       }
       else
       {
           ctx.bitflag = FIRST_STAR | SECOND_STAR | THIRD_STAR;
       }
   });
}

function update(ctx) {
   return ctx.bitflag;
}
```


##### Algunas funciones utiles

| Funcion                        |  Desc.                                                                  |
|--------------------------------|:-----------------------------------------------------------------------:|
| Game.getTime()                 |  Obtiene el tiempo transcurrido desde que inicio el nivel (en segundos) |
| Game.getDrawnObjectsCount()    | Obtiene la cantidad de dibujos que el jugador ha hecho durante el nivel |
| Game.getHints()                |   Obtiene los hints del nivel para que puedas modificar su visibilidad  |
| Phy.getPosition(handler)       |               Obtiene la posicion de un objeto en pixeles               |
| Phy.getAngle(handler)          |                Obtiene el angulo de un objeto en radianes               |
| Phy.getAllBodies()             |             Obtiene un array con todos los objetos del mundo            |
| Phy.setPosition(handler, pos ) |    Teletransporta un objeto a la posicion dada (expresada en pixeles)   |
| Phy.setVelocity(handler, vel)  |                   Imprime una velocidad al objeto dado                  |
| Phy.setAngle(handler, angle)   |               Establece el angulo de un objeto en radianes              |
| Phy.clearForces(handler)       |          Limpia las fuerzas que mueven al objeto (quedan en 0)          |
| Phy.getBodyByLabel(label)      |                      Obtiene el handler de un objeto                    |



Creo que con eso se pueden hacer todo tipo de niveles ;)

David L.
