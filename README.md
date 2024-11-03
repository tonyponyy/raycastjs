
# Proyecto de Raycasting con Sprites
<div align="center">
  <img src="https://tonyponyy.github.io/raycastjs/img/screenshot.png" alt="Coche en el juego" width="450"/>
</div>
Este proyecto implementa una técnica de **raycasting** en JavaScript para crear una perspectiva tridimensional en un entorno 2D, similar a los primeros juegos en 3D. Además, incluye **sprites** tipo billboard.
Puedes ver la [demo](https://tonyponyy.github.io/raycastjs/) del proyecto.

## Características Principales

- **Sistema de Raycasting**: Calcula la distancia y el ángulo de visión de cada pared en el entorno, generando una sensación de profundidad en 3D.
- **Sprites Dinámicos**: Los sprites están compuestos por múltiples ángulos, lo que permite que se muestren correctamente desde distintas perspectivas.

## Ejemplo

En este ejemplo o demo, el personaje se puede mover utilizando las flechas del teclado y **D** para el turbo. El personaje es una persona subida en un carrito de la compra (el carrito se eligió porque me dio pereza corregir la física aplicada al movimiento del jugador 😅).

Existen dos escenas: una es un estacionamiento y, si cruzamos la puerta, accedemos a una especie de desierto.

## Mapas

Los mapas se añaden en el array de la variable global **maps** y deben tener el siguiente formato:

```javascript
var maps = [
  {
    map: [/* 0,0,1... */],
    w: 30,
    h: 20,
    door: 1,
    floor: " imageSources.floor,
  },
  {
    // segundo mapa
  }
];
```

### Propiedades de los Mapas

- **map**: Es un array unidimensional que contiene todos los tiles.
- **w** y **h**: Representan el ancho (width) y el alto (height) del mapa, respectivamente.
- **door**: Indica el mapa a cargar al cruzar una puerta (el número representa la posición del mapa en el array **maps**).
- **floor**: Es la ruta del sprite que se usará para el suelo.

## Añadir elementos al mapa

Para añadir un nuevo elemento al mapa (como una nueva pared), primero debemos **añadir la imagen** al proyecto en el archivo **js/textures.js**, creando la imagen en **textures** y añadiendo la fuente en **imageSources**

```javascript
const textures = {
  1: new Image(),
  2: new Image(), // <- en este caso añadimos el sprite que representaremos como 2 en el mapa
  floor: new Image(),
  sky: new Image(),
};
const imageSources = {
  1: "img/ladrillo.png",
  2: "img/piedra.png", // <- añadimos la ruta de la imagen
  floor: "img/arena.png",
  sky: "img/cielo.png",
};
```

Una vez añadido el elemento, podremos utilizar el tile 2 en los mapas. Además, podemos añadir propiedades adicionales al elemento que acabamos de crear.

## Añadir propiedades al elemento

Para configurar el sprite, debemos ir al archivo **js/map.js** y modificar la variable global **map_setting**, donde guardamos todas las propiedades de los tiles (este paso es opcional, ya que algunos elementos no requieren ninguna configuración especial).

Por ejemplo, si queremos que el tile sea atravesable, añadimos el número del tile en el array **hollow**:

```javascript
const map_setting = {
  hollow: [2], // <- hemos añadido aquí el tile 2
  billboard: [],
  multilater: [],
}; 
```

### Tipos de Propiedades

- **hollow**: Hace que el elemento sea atravesable, pero visible para el jugador.
- **billboard**: El elemento se imprimirá como sprite estático y no le afectará el ángulo de visión.
- **multilater** (solo aplica a los billboards): Permite que un sprite tipo billboard cambie de apariencia según el ángulo de visión. Los tiles multilater deben seguir un formato específico (ver siguiente imagen).
  ![Ejemplo de sprite multilater](https://tonyponyy.github.io/raycastjs/img/coche.png)

## Cargar Sprites en el mapa

Existen varias formas de cargar sprites en el mapa:

### Integrarlo como elemento billboard

Cargamos el elemento como se describió anteriormente y lo añadimos en el mapa.

### Integrarlo dinámicamente

Para este caso, cargamos el elemento como en el paso anterior, pero en lugar de añadirlo al mapa, podemos incluirlo en un objeto en la variable global **other_sprites** ubicada en **js/sprites.js**:

```javascript
var other_sprites = [
  {
    x: 1900,
    y: 970,
    texture: textures[9],
    distanceToCamera: 0,
    multilater: true,
    loop: true,
    vx: -0.3,
    vy: 0.004,
    original_pos: { x: 1900, y: 970 },
  },
  {
    // otro objeto
  },
];
```

Este método permite modificar dinámicamente sus propiedades y añadir características adicionales.

- **x**: La posición X en la que se imprimirá el objeto.
- **y**: La posición Y en la que se imprimirá el objeto.
- **texture**: La textura del sprite (utilizamos `textures[numero_del_tile]` para escoger la imagen).
- **distanceToCamera**: Distancia de la cámara (se recomienda dejarlo en 0).
- **multilater**: Indica si el sprite es multilateral.
- **vx** y **vy**: **Experimental**. Velocidad en los ejes X e Y aplicada en cada iteración del renderizado.
- **loop**: **Experimental**. Si está en `true`, el objeto volverá a su posición original al colisionar con una pared u otro elemento (posición definida en `original_pos`).
- **original_pos**: **Experimental**. Define la posición inicial del objeto, a la cual vuelve después de colisionar.

## Otras Consideraciones y Mejoras

Aún quedan muchas cosas por mejorar, como el suelo, la visualización del sprite del jugador y solucionar algunos errores visuales. Con lo escrito aquí, tienes una base suficiente para empezar a explorar el código. Espero solucionar estos problemas y añadir nuevas funciones pronto.

Este proyecto tiene licencia **UNLICENSE**, lo que significa que puedes utilizar el código para lo que quieras: modificarlo, venderlo... ¡de hecho, te animo a intentar sacar dinero con él! Buena suerte.
