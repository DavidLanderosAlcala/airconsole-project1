

##### debug
  evento que llega a la pantalla cuando algun dispositivo utiliza DebugConsole

```javascript
AirConsoleBus.on("debug", function(info) {
    /*
     * El objeto info tiene los miembros:
     *   info.origin,
     *   info.message
     */
});
```

##### gamepadevent
evento que llega a la pantalla cuando un dispositivo presiona un boton del gamepad

```javascript
AirConsoleBus.on("gamepadevent", function(event) {
  /*
   * El objeto event tiene los miembros:
   *   event.origin,
   *   event.key
   *   event.value
   */
});
```
Nota : el tipo de dato de <strong>event.value</strong> depende del valor <strong>event.key</strong>, ya que los valores analogicos son flotantes, los valores digitales son enteros y los sticks son vectores.


##### vibraterequest
evento que llega a los dispositivos cuando la pantalla solicita una vibracion

```javascript
AirConsoleBus.on("vibraterequest", function(request) {
  /*
   * El objeto request tiene los miembros:
   *   event.pattern,
   */
});
```
