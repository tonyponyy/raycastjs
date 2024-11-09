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
  var corx = 0
  var cory = 0
  frame = parseInt(canvas_setting.frame_counter/5)%3
  let player_img = textures.playerImage;
  var turbo_img = textures.turbo1

  if (keys["ArrowLeft"]) {
     corx = 30
     cory = -20
    player_img = textures.playerImageiz;
    turbo_img = textures.turbo2
  } else if (keys["ArrowRight"]) {
    corx = -30
    cory = -20
    player_img = textures.playerImageder;
    turbo_img = textures.turbo3
  }

  ctx.drawImage(
    player_img,
    parseInt(canvas.width / 2 - 5),
    parseInt(canvas.height / 2)+80,
    parseInt(150 - camera.z * 2),
    parseInt(150 - camera.z * 2)
  );
  if (player.turbo_enabled) {
    ctx.drawImage(
      turbo_img,
      TILE_SIZE*frame,          // Coordenada X de la sección de la imagen a recortar
      0,          // Coordenada Y de la sección de la imagen a recortar
      64,         // Ancho de la sección a recortar (64 píxeles)
      64,         // Alto de la sección a recortar (64 píxeles)
      parseInt(canvas.width / 2 - 5)+corx, // Coordenada X en el canvas donde se dibujará la imagen
      parseInt(canvas.height / 2) + 130+cory , // Coordenada Y en el canvas donde se dibujará la imagen
      parseInt(150 - camera.z * 2), // Ancho de la imagen en el canvas
      parseInt(150 - camera.z * 2)  // Alto de la imagen en el canvas
    );
  }
  




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
  player.turbo_enabled = false;
  var turbo =1
  if (keys["D"] || keys["d"]) {
    player.turbo_enabled = true;
    turbo = player.turbo

  }
  let acceleration = 0;
  if (keys["ArrowUp"]) {
    acceleration = (physics.speed_trust*4)*turbo;
  } else if (keys["ArrowDown"]) {
    acceleration = -physics.speed_trust * 0.5;
  }
  const directionX = Math.cos(player.angle);
  const directionY = Math.sin(player.angle);

    
  if (acceleration !== 0) {
    physics.velocityX += directionX * acceleration;
    physics.velocityY += directionY * acceleration;
  }

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

    
  friction = Math.max(physics.inertia - (currentSpeed / maxSpeed) * 0.03, physics.inertia);

  physics.velocityX *= friction;
  physics.velocityY *= friction;

    
  let newX = player.x + physics.velocityX;
  let newY = player.y + physics.velocityY;

    
  if (!can_move(newX, newY)) {
      
    const canMoveX = can_move(newX, player.y);
    const canMoveY = can_move(player.x, newY);

    if (!canMoveX) {
      physics.velocityX *= -0.8;   
      newX = player.x;
    }
    if (!canMoveY) {
      physics.velocityY *= -0.8;   
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
