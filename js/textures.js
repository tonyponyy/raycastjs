  
const TILE_SIZE = 64;
const DOOR_TILE = 4;

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
  floor: new Image(),
  sky: new Image(),
  floor2: new Image(),
  playerImage: new Image(),
  playerImageiz: new Image(),
  playerImageder: new Image(),
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
  floor: "img/suelo.png",
  sky: "img/cielo.png",
  floor2: "img/arena.png",
  playerImage:"img/personaje.png",
  playerImageiz:"img/personajeiz.png",
  playerImageder:"img/personajeder.png",
};



var FLOOR_SPEED = 0.5;

function drawSky() {
  const skyTexture = textures.sky;
  const skyWidth = canvas.width * 2;
  const skyHeight = canvas.height / 2 + camera.z;
  const imageCount = Math.ceil(skyWidth / skyTexture.width) + 7;

  for (let i = -400; i < imageCount; i++) {
    const x = parseInt(
      i * skyTexture.width * 2 - ((camera.angle * 110) % skyTexture.width) * 2
    );

    ctx.drawImage(skyTexture, x - 450, 0, skyTexture.width * 2, skyHeight);
  }
}

function drawFloor() {
  const floorTexture = textures.floor;
  const horizon = canvas.height / 2 + camera.z - 70;

  SPEED_FACTOR = 0.013;
  const WRAP_SIZE = 1000;

  const STEP_SIZE = 10;

  const wrappedPlayerX = ((player.x % WRAP_SIZE) + WRAP_SIZE) % WRAP_SIZE;
  const wrappedPlayerY = ((player.y % WRAP_SIZE) + WRAP_SIZE) % WRAP_SIZE;

  for (let y = horizon; y < canvas.height; y += STEP_SIZE) {
    const rowDistance = (12 * 32) / (y - horizon);

    let blockStart = 0;
    let lastTexX = -1,
      lastTexY = -1;

    for (let x = 0; x < canvas.width; x++) {
      const floorX =
        wrappedPlayerX * SPEED_FACTOR +
        rowDistance *
          Math.cos(camera.angle - FOV / 2 + (FOV * x) / canvas.width);
      const floorY =
        wrappedPlayerY * SPEED_FACTOR +
        rowDistance *
          Math.sin(camera.angle - FOV / 2 + (FOV * x) / canvas.width);

      const texX = Math.floor(((floorX % 32) + 32) % 32);
      const texY = Math.floor(((floorY % 32) + 32) % 32);

      if (lastTexX !== texX || lastTexY !== texY || x === canvas.width - 1) {
        if (lastTexX !== -1) {
          ctx.drawImage(
            floorTexture,
            parseInt(lastTexX),
            parseInt(lastTexY),
            1,
            1,
            blockStart,
            parseInt(y),
            parseInt(x) - blockStart,
            STEP_SIZE
          );
        }
        blockStart = x;
        lastTexX = texX;
        lastTexY = texY;
      }
    }
  }
}
