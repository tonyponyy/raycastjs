var CURRENT_LEVEL = 0;
var map = [[0], [0]];

function load_map(number) {
  CURRENT_LEVEL = number;
  map = map_to_bi(maps[number].map, maps[number].w, maps[number].h);
  textures.floor.src = maps[number].floor;
}

function map_to_bi(map_input, w, h) {
  const map_exp = [];
  for (let i = 0; i < h; i++) {
    map_exp.push(map_input.slice(i * w, (i + 1) * w));
  }
  return map_exp;
}

function drawMinimap() {
  const MINIMAP_SIZE = 100;
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.fillRect(
    canvas.width - MINIMAP_SIZE - 10,
    canvas.height - MINIMAP_SIZE - 10,
    MINIMAP_SIZE,
    MINIMAP_SIZE
  );

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] > 0) {
        ctx.fillStyle = map[y][x] === 1 ? "grey" : "lightgrey";
        ctx.fillRect(
          canvas.width - MINIMAP_SIZE - 10 + x * (MINIMAP_SIZE / map[0].length),
          canvas.height - MINIMAP_SIZE - 10 + y * (MINIMAP_SIZE / map.length),
          MINIMAP_SIZE / map[0].length,
          MINIMAP_SIZE / map.length
        );
      }
    }
  }

  ctx.fillStyle = "red";
  ctx.fillRect(
    canvas.width -
      MINIMAP_SIZE -
      10 +
      (player.x / TILE_SIZE) * (MINIMAP_SIZE / map[0].length),
    canvas.height -
      MINIMAP_SIZE -
      10 +
      (player.y / TILE_SIZE) * (MINIMAP_SIZE / map.length),
    5,
    5
  );
}
