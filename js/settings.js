const TILE_SIZE = 64;
const DOOR_TILE = 4;
var FLOOR_SPEED = 0.5;
var PI = 3.14

//configuración del raycast
var raycast_setting = {
    fov: PI / 3, //el angulo del campo de visión
    ray_count:240, // los numeros de rayos ( a mas rayos, mas calidad pero se pierde rendimiento)
    distance: 90, // la distancia a partir se empieza a dibujar
}

// configuración del jugador
const player = {
    x: TILE_SIZE * 1.5,
    y: TILE_SIZE * 1.5,
    angle: 0,
    speed: 1,
    max_speed: 16,
    turbo:2,
    turbo_enabled:false
  };

//configuración del canvas
const canvas_setting = {
    width:960,
    height:540,
    frame_counter : 0
}


//configuración de la fisica

const physics = {
  inertia: 0.97,
  maxSpeed: 3,
  velocityX: 0,
  velocityY: 0,
  angleSpeed: 0.03,
  speed_trust: 0.05,
};

//configuración de las sombras
var shadow_settings = {
    enabled:true, // activo 
    max:0.5, // maximo sombra aplicada (1 cuadrado negro, 0 sin sombra)
    min:0.1, // minimo al cual se empieza a sombrear
    distance:2000 //distancia a la que se empieza a sombrear
}

// configuración de la camara
const camera = {
    x: player.x,
    y: player.y,
    z: 6,
    angle: player.angle,
    distance: 90,
    height: 32,
    dirX: Math.cos(45),
    dirY: Math.sin(45),
    planeX: Math.cos(45 + PI / 2) * 0.66,
    planeY: Math.sin(45 + PI / 2) * 0.66,
  };

  // configuración de los tiles
  const map_setting = {
    hollow: [4, 8,26,27,28,29,30,31,32,33,34,35],
    billboard: [5, 6, 7, 8, 9,25,36,37],
    multilater: [9],
    heights : [ // aqui definimos la altura del tile (primer elemento el tile, el segundo la altura)
        [17, 2],
        [18,3],
        [19,4],
        [20,5],
        [21,2],
        [22,3],
        [24,4],
        [25,5], 
      ],
    floor: [26,27,28,29,30,31,32,33,34,35],
    move:[[37,6]]
    
  };  

// configuración de las texturas
  const textures = {
    1: new Image(),
    2: new Image(),
    3: new Image(),
    4: new Image(),
    5: new Image(),
    6: new Image(),
    7: new Image(),
    8: new Image(),
    9: new Image(),
    10: new Image(),
    11: new Image(),
    12: new Image(),
    13: new Image(),
    14: new Image(),
    15: new Image(),
    16: new Image(),
    17: new Image(),
    18: new Image(),
    19: new Image(),
    20: new Image(),
    21: new Image(),
    22: new Image(),
    23: new Image(),
    24: new Image(),
    25: new Image(),
    26: new Image(),
    27: new Image(),
    28: new Image(),
    29: new Image(),
    30: new Image(),
    31: new Image(),
    32: new Image(),
    33: new Image(),
    34: new Image(),
    35: new Image(),
    36: new Image(),
    37: new Image(),
    38: new Image(),
    floor: new Image(),
    sky: new Image(),
    floor2: new Image(),
    playerImage: new Image(),
    playerImageiz: new Image(),
    playerImageder: new Image(),
    sky2: new Image(),
    turbo1: new Image(),
    turbo2: new Image(),
    turbo3: new Image(),
  };
  
  const imageSources = {
    1: "img/ladrillo.png",
    2: "img/piedra.png",
    3: "img/arbol.png",
    4: "img/puerta.png",
    5: "img/sprite.png",
    6: "img/cactus.png",
    7: "img/container.png",
    8: "img/blank.png",
    9: "img/coche.png",
    10: "img/ladrillo2.png",
    11: "img/ladrillo3.png",
    12: "img/ladrilloder.png",
    13: "img/ladrilloiz.png",
    14: "img/black.png",
    15: "img/cocheblanco.png",
    16: "img/cocheverde.png",
    17: "img/arbol.png",
    18: "img/arbol.png",
    19: "img/arbol.png",
    20: "img/arbol.png",
    21: "img/ladrillo.png",
    22: "img/ladrillo.png",
    23: "img/ladrillo.png",
    24: "img/ladrillo.png",
    25: "img/cono.png",
    26: "img/asfalto1.png",
    27: "img/asfalto2.png",
    28: "img/asfalto3.png",
    29: "img/asfalto4.png",
    30: "img/asfalto5.png",
    31: "img/asfalto6.png",
    32: "img/asfalto7.png",
    33: "img/asfalto8.png",
    34: "img/asfalto9.png",
    35: "img/checkpoint.png",
    36: "img/ceda.png",
    37: "img/baile.png",
    38: "img/cochetest.png",
    floor: "img/suelo.png",
    sky: "img/cielo.png",
    sky2: "img/desert_fondo.png",
    floor2: "img/arena.png",
    playerImage:"img/personaje.png",
    playerImageiz:"img/personajeiz.png",
    playerImageder:"img/personajeder.png",
    turbo1:"img/turbo1.png",
    turbo2:"img/turbo3.png",
    turbo3:"img/turbo2.png",
  };
