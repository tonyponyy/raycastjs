//main
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
first_load = true;

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFloor();
  drawSky();
  castRays();
  drawSprites();
  drawPlayer();
  drawHUD();
}

function gameLoop() {
  turbo = 1;
  if (first_load) {
    load_map(0);
    set_player_pos(map);
    first_load = false;
  }
  let px = player.x;
  let py = player.y;

  let mapX = parseInt(px / 64);
  let mapY = parseInt(py / 64);

  if (keys["ArrowUp"]) {
    physics.velocityX += Math.cos(player.angle) * physics.speed_trust;
    physics.velocityY += Math.sin(player.angle) * physics.speed_trust;
  }
  if (keys["ArrowDown"]) {
    physics.velocityX -= Math.cos(player.angle) * physics.speed_trust * 0.5;
    physics.velocityY -= Math.sin(player.angle) * physics.speed_trust * 0.5;
  }

  if (keys["d"]) {
    turbo = 2;
  }

  const currentSpeed = Math.sqrt(
    physics.velocityX ** 2 + physics.velocityY ** 2
  );

  if (
    physics.velocityX > player.max_speed * turbo ||
    physics.velocityX < -player.max_speed * turbo
  ) {
    physics.velocityX =
      physics.velocityX > 0
        ? player.max_speed * turbo
        : -player.max_speed * turbo;
  }
  if (
    physics.velocityY > player.max_speed * turbo ||
    physics.velocityY < -player.max_speed * turbo
  ) {
    physics.velocityY =
      physics.velocityY > 0
        ? player.max_speed * turbo
        : -player.max_speed * turbo;
  }

  px += physics.velocityX;
  py += physics.velocityY;

  if (!can_move(px, py)) {
    physics.velocityX *= -0.5;
    physics.velocityY *= -0.5;
  } else {
    player.x = px;
    player.y = py;
  }

  if (keys["ArrowLeft"]) {
    player.angle -= physics.angleSpeed;
  }
  if (keys["ArrowRight"]) {
    player.angle += physics.angleSpeed;
  }

  if (!keys["ArrowUp"] && !keys["ArrowDown"]) {
    physics.velocityX *= 0.998;
    physics.velocityY *= 0.998;
  }

  camera.z = (currentSpeed / physics.maxSpeed) * 50;

  camera.x = player.x - Math.cos(player.angle) * camera.distance;
  camera.y = player.y - Math.sin(player.angle) * camera.distance;
  camera.angle = player.angle;

  if (map[mapY][mapX] === DOOR_TILE) {
    physics.velocityX = 0;
    physics.velocityY = 0;
    load_map(maps[CURRENT_LEVEL].door);
    set_player_pos(map);
  }

  move_other_sprites();
  render();
  requestAnimationFrame(gameLoop);
}

const keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

  textures[1].onload =
  textures[2].onload =
  textures[3].onload =
  textures[4].onload =
  textures[5].onload =
  textures[6].onload =
  textures[7].onload =
  textures[8].onload =
  textures[9].onload =
  textures.floor.onload =
  textures.floor.onload =
  textures.sky.onload =
  textures.floor2.onload =
  playerImage.onload =
  playerImageiz.onload =
  playerImageder.onload =
  playerImage.onload =
    gameLoop;
