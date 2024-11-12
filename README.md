
# Proyecto de Raycasting con Sprites

Este proyecto implementa una técnica de **raycasting** en JavaScript para crear una perspectiva tridimensional en un entorno 2D, similar a los primeros juegos en 3D. Además, incluye **sprites** tipo billboard y diferentes alturas.
<div align="center" style="display: flex; justify-content: center; flex-wrap: wrap; gap: 10px;">
  <img src="https://tonyponyy.github.io/raycastjs/img/screenshot2.png" alt="Coche en el juego" height="250" style="max-width: 100%; height: auto;">
  <img src="https://tonyponyy.github.io/raycastjs/img/screenshot.png" alt="Coche en el juego" height="250" style="max-width: 100%; height: auto;">
</div>

Prueba la [demo aquí](https://tonyponyy.github.io/raycastjs/).

## Características Principales

- **Sistema de Raycasting**: Calcula la distancia y el ángulo de visión de cada pared en el entorno, generando una sensación de profundidad en 3D.
- **Sprites Dinámicos**: Los sprites están compuestos por múltiples ángulos, lo que permite que se muestren correctamente desde distintas perspectivas.

## Ejemplo

En [este ejemplo o demo](https://tonyponyy.github.io/raycastjs/), el personaje se puede mover utilizando las flechas del teclado y **D** para el turbo.

Existen dos escenas: una es un estacionamiento y, si cruzamos la puerta, accedemos a un de desierto.

## Mapas

Los mapas se añaden en el array de la variable global **maps** (del archivo maps.js) y deben tener el siguiente formato:

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

## Añadir elementos para usarlos en el mapa

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

## Añadir propiedades al elemento (opcional)

Para configurar el sprite, debemos ir al archivo **js/settings.js** y modificar la variable global **map_setting**, donde guardamos todas las propiedades de los tiles (este paso es opcional, ya que algunos elementos no requieren ninguna configuración especial).

Por ejemplo, si queremos que el tile sea atravesable, añadimos el número del tile en el array **hollow**:

```javascript
 const map_setting = {
    hollow: [4, 8],
    billboard: [5, 6, 7, 8, 9,25],
    multilater: [9],
    heights : [ // aqui definimos la altura del tile (primer elemento el numero asociado al tile, el segundo la altura)
        [17, 2],
        [18,3], 
      ],
    floor: [26,27,28,29,30,31,32,33,34,35],
    move:[[37,6]]
  };  
```

### Tipos de Propiedades

- **hollow**: Hace que el elemento sea atravesable, pero visible para el jugador.
- **heights**: La altura que tendrá el elemento (numero_tile,numero_altura)
- **billboard**: El elemento se imprimirá como sprite estático y no le afectará el ángulo de visión.
- **floor**: El elemento se imprimirá como suelo, como una carretera o una alfombra ( si queremos pasar por encima, deberemos también que añadir el tile a **hollow**).
- **move**: (solo aplica a los billboards) Si queremos que el sprite tenga una animación, debemos exportar la imagen como un tilesheet:
  ![Ejemplo de sprite de movimiento](https://tonyponyy.github.io/raycastjs/img/baile.png)
  Donde tenemos que poner todas las secuencias de la imagen seguidas y poner un array dentro de **move** con la información (numero_tile,numero_de_fotogramas).
- **multilater** (solo aplica a los billboards): Permite que un sprite tipo billboard cambie de apariencia según el ángulo de visión. Los tiles multilater deben seguir un formato específico (ver siguiente imagen).
  ![Ejemplo de sprite multilater](https://tonyponyy.github.io/raycastjs/img/coche.png)

  

## Cargar Sprites en el mapa

Existen varias formas de cargar sprites en el mapa:

### Integrarlo como elemento billboard

Cargamos el elemento como se describió anteriormente (añadir el numero asociado al tile a la array de **map_setting**) y lo añadimos en el mapa.

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
    map:0 
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
- **vx** y **vy**: Velocidad en los ejes X e Y aplicada en cada iteración del renderizado.
- **loop**: Si está en `true`, el objeto volverá a su posición original al colisionar con una pared u otro elemento (posición definida en `original_pos`).
- **original_pos**: Define la posición inicial del objeto, a la cual vuelve después de colisionar.
- **map**: El numero del array del mapa donde se imprimirá el sprite.

## Opciones del raytracing
Debemos ir al archivo **js/settings.js** y modificar la variable global **map_setting**,

```javascript
var raycast_setting = {
    fov: PI / 3, 
    ray_count:200,
    distance: 30, 
}
```
### Tipos de Propiedades

- **fov**: El angulo de campo de visión, el valor **pi/3** es un angulo bastante estandarizado, aunque se puede jugar con los valores, por ejemplo, poniendo fov a **2** tenemos el efecto de ojo de pez.
- **ray_count**: los numeros de rayos ( a mas rayos, mas resolución, pero se pierde rendimiento).
- **distance**: la distancia a partir se deja de dibujar ( a mas distancia, mas abarca la vista, pero como en el caso del ray_count, se pierde rendimiento). 

## Opciones del sombreado
Debemos ir al archivo **js/settings.js** y modificar la variable global **shadow_settings**,

```javascript
var shadow_settings = {
    enabled:true, 
    max:0.3, 
    min:0.1, 
    distance:2000 
}
```
### Tipos de Propiedades
- **enabled**: true/false, **true** para aplicar el sombreado y **false** para desactivarlo.
- **max**: maximo sombra aplicada (1 cuadrado negro, 0 sin sombra).
- **min**: minimo al cual se empieza a sombrear
- **distance**: distancia a la que se empieza a sombrear.

## Otras Consideraciones y Mejoras

Aún quedan muchas cosas por mejorar, como el suelo, la visualización del sprite del jugador y solucionar algunos errores visuales. Con lo escrito aquí, tienes una base suficiente para empezar a explorar el código. Espero solucionar estos problemas y añadir nuevas funciones pronto.

Este proyecto tiene licencia **UNLICENSE**, lo que significa que puedes utilizar el código para lo que quieras: modificarlo, venderlo... de hecho, te animo a intentar sacar dinero con él, buena suerte.
