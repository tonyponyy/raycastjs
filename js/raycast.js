//raycast
const FOV = PI / 3;
const RAY_COUNT = 200;
var ITERATIONS_RAYDATA_H = 30;
var ITERATIONS_RAYDATA_V = 30;
let zBuffer = new Array(RAY_COUNT).fill(Infinity);

function castRays() {
  const rayAngleStep = FOV / RAY_COUNT;

  zBuffer = new Array(RAY_COUNT).fill(Infinity);

  for (let i = 0; i < RAY_COUNT; i++) {
    const rayAngle = normalizeAngle(camera.angle - FOV / 2 + i * rayAngleStep);
    const rayData = getRayData(rayAngle);

    if (rayData.tileType > 0) {
      const adjustedDistance =
        rayData.distance * Math.cos(rayAngle - camera.angle);

      zBuffer[i] = adjustedDistance;

      if (adjustedDistance <= 0) continue;

      const wallHeight = Math.min(
        canvas.height * 2,
        (TILE_SIZE * canvas.height) / adjustedDistance - camera.z
      );
      const finalWallHeight = Math.max(0, wallHeight);

      const textureX =
        Math.floor(rayData.hitPosition * textures[rayData.tileType].width) %
        textures[rayData.tileType].width;
      const wallX = i * (canvas.width / RAY_COUNT);

      ctx.drawImage(
        textures[rayData.tileType],
        textureX,
        0,
        1,
        textures[rayData.tileType].height,
        wallX,
        canvas.height / 2 - finalWallHeight / 2 + camera.z,
        canvas.width / RAY_COUNT + 1,
        finalWallHeight
      );
    }
  }
}

function getRayData(angle) {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);

  let horizontalDist = Number.MAX_VALUE;
  let verticalDist = Number.MAX_VALUE;
  let finalDistance, finalHitPosition, finalTileType;

  {
    const firstY =
      Math.floor(camera.y / TILE_SIZE) * TILE_SIZE + (sin > 0 ? TILE_SIZE : 0);
    const ya = sin > 0 ? TILE_SIZE : -TILE_SIZE;
    const xa = ya / Math.tan(angle);

    let x = camera.x + (firstY - camera.y) / Math.tan(angle);
    let y = firstY;

    for (let i = 0; i < ITERATIONS_RAYDATA_H; i++) {
      const mapX = Math.floor(x / TILE_SIZE);
      const mapY = Math.floor(y / TILE_SIZE) - (sin <= 0 ? 1 : 0);

      if (
        map[mapY] &&
        map[mapY][mapX] > 0 &&
        map_setting.billboard.indexOf(map[mapY][mapX]) == -1
      ) {
        horizontalDist = Math.hypot(x - camera.x, y - camera.y);
        const hitPos = (x % TILE_SIZE) / TILE_SIZE;
        if (horizontalDist < finalDistance || !finalDistance) {
          finalDistance = horizontalDist;
          finalHitPosition = hitPos;
          finalTileType = map[mapY][mapX];
        }
        break;
      }

      x += xa;
      y += ya;
    }
  }

  {
    const firstX =
      Math.floor(camera.x / TILE_SIZE) * TILE_SIZE + (cos > 0 ? TILE_SIZE : 0);
    const xa = cos > 0 ? TILE_SIZE : -TILE_SIZE;
    const ya = xa * Math.tan(angle);

    let x = firstX;
    let y = camera.y + (firstX - camera.x) * Math.tan(angle);

    for (let i = 0; i < ITERATIONS_RAYDATA_V; i++) {
      const mapX = Math.floor(x / TILE_SIZE) - (cos <= 0 ? 1 : 0);
      const mapY = Math.floor(y / TILE_SIZE);

      if (
        map[mapY] &&
        map[mapY][mapX] > 0 &&
        map_setting.billboard.indexOf(map[mapY][mapX]) == -1
      ) {
        verticalDist = Math.hypot(x - camera.x, y - camera.y);
        const hitPos = (y % TILE_SIZE) / TILE_SIZE;
        if (verticalDist < finalDistance || !finalDistance) {
          finalDistance = verticalDist;
          finalHitPosition = hitPos;
          finalTileType = map[mapY][mapX];
        }
        break;
      }

      x += xa;
      y += ya;
    }
  }

  return {
    distance: finalDistance || 1000,
    hitPosition: finalHitPosition || 0,
    tileType: finalTileType || 0,
  };
}
