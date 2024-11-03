//player
const player = {
  x: TILE_SIZE * 1.5,
  y: TILE_SIZE * 1.5,
  angle: 0,
  speed: 1,
  max_speed: 0.4,
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
  let player_img = playerImage;

  if (keys["ArrowLeft"]) {
    player_img = playerImageiz;
  } else if (keys["ArrowRight"]) {
    player_img = playerImageder;
  }

  ctx.drawImage(
    player_img,
    parseInt(canvas.width / 2 - 5),
    parseInt(canvas.height / 2),
    parseInt(250 - camera.z * 2),
    parseInt(250 - camera.z * 2)
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
        console.log(
          "se ha movido al jugador--> x:" +
            player.x +
            "(j=" +
            j +
            ") y-->" +
            player.y +
            "(i=" +
            i +
            ") Escena :" +
            CURRENT_LEVEL
        );
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
