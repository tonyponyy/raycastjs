  
const player = {
  x: TILE_SIZE * 1.5,
  y: TILE_SIZE * 1.5,
  angle: 0,
  speed: 1,
  max_speed: 16,
};

function can_move(x, y) {
  const mapX = parseInt(x / 64);
  const mapY = parseInt(y / 64);
  const result =
    map[mapY] &&
    map[mapY][mapX] &&
    map_setting.hollow.indexOf(map[mapY][mapX]) == -1;
  return !result > 0;
}


function drawPlayer() {
  let player_img = textures.playerImage;

  if (keys["ArrowLeft"]) {
    player_img = textures.playerImageiz;
  } else if (keys["ArrowRight"]) {
    player_img = textures.playerImageder;
  }

  ctx.drawImage(
    player_img,
    parseInt(canvas.width / 2 - 5),
    parseInt(canvas.height / 2)+80,
    parseInt(150 - camera.z * 2),
    parseInt(150 - camera.z * 2)
  );
}

function set_player_pos(map) {
  var i = 0;
  var j = 0;
  for (i = 0; i < map.length; i++) {
    for (j = 0; j < map[i].length; j++) {
      if (map[i][j] == 8) {
        player.x = j * TILE_SIZE;
        player.y = i * TILE_SIZE;
        if (player.angle == 0) {
          player.angle = 4.75;
        }
        return;
      }
    }
  }
  player.x = 0;
  player.y = 0;
}

function player_physics() {

  let acceleration = 0;
  if (keys["ArrowUp"]) {
    acceleration = physics.speed_trust*4;
  } else if (keys["ArrowDown"]) {
    acceleration = -physics.speed_trust * 0.5;
  }
  const directionX = Math.cos(player.angle);
  const directionY = Math.sin(player.angle);

    
  if (acceleration !== 0) {
    physics.velocityX += directionX * acceleration;
    physics.velocityY += directionY * acceleration;
  }

    
  const turbo = keys["d"] ? 2 : 1;
  const maxSpeed = player.max_speed * turbo;

    
  const currentSpeed = Math.sqrt(
    physics.velocityX * physics.velocityX + 
    physics.velocityY * physics.velocityY
  );

    
  if (currentSpeed > maxSpeed) {
    const slowdownFactor = 1 - Math.min((currentSpeed - maxSpeed) / maxSpeed, 0.1);
    physics.velocityX *= slowdownFactor;
    physics.velocityY *= slowdownFactor;
  }

    
  const friction = Math.max(physics.inertia - (currentSpeed / maxSpeed) * 0.03, physics.inertia);
  physics.velocityX *= friction;
  physics.velocityY *= friction;

    
  let newX = player.x + physics.velocityX;
  let newY = player.y + physics.velocityY;

    
  if (!can_move(newX, newY)) {
      
    const canMoveX = can_move(newX, player.y);
    const canMoveY = can_move(player.x, newY);

    if (!canMoveX) {
      physics.velocityX *= -1.3;   
      newX = player.x;
    }
    if (!canMoveY) {
      physics.velocityY *= -1.3;   
      newY = player.y;
    }

  }

  player.x = newX;
  player.y = newY;

  const turnSpeed = physics.angleSpeed * (1 - (currentSpeed / maxSpeed) * 0.3);
  if (keys["ArrowLeft"]) {
    player.angle -= turnSpeed;
  }
  if (keys["ArrowRight"]) {
    player.angle += turnSpeed;
  }

  const targetCameraZ = (currentSpeed / maxSpeed) * 5;
  camera.z += (targetCameraZ - camera.z) * 0.1;

  const cameraTargetX = player.x - Math.cos(player.angle) * camera.distance;
  const cameraTargetY = player.y - Math.sin(player.angle) * camera.distance;
  
  camera.x += (cameraTargetX - camera.x) * 0.1;
  camera.y += (cameraTargetY - camera.y) * 0.1;
  camera.angle = player.angle;
  if (map[Math.floor(player.y / 64)][Math.floor(player.x / 64)] === DOOR_TILE) {
    physics.velocityX = 0;
    physics.velocityY = 0;
    load_map(maps[CURRENT_LEVEL].door);
    set_player_pos(map);
  }
}
