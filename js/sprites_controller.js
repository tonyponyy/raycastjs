
var other_sprites = [
  {
    x: 1900,
    y: 970,
    texture: textures[9],
    distanceToCamera: 0,
    multilater: true,
    loop: true,
    vx: -3,
    vy: 0.04,
    origonal_pos: { x: 1778, y: 1179 },
    map:0,
  },
  {
    x: 1900,
    y: 970,
    texture: textures[15],
    distanceToCamera: 0,
    multilater: true,
    loop: true,
    vx: -4,
    vy: 0.08,
    origonal_pos: { x: 1778, y: 1179 },
    map:0,
  },
  {
    x: 1900,
    y: 970,
    texture: textures[16],
    distanceToCamera: 0,
    multilater: true,
    loop: true,
    vx: -1,
    vy: 0.006,
    origonal_pos: { x: 1778, y: 1179 },
    map:0,
  },
];

function normalizeAngle(angle) {
  while (angle > PI) angle -= 2 * PI;
  while (angle < -PI) angle += 2 * PI;
  return angle;
}

function drawSprites() {
  var sprites = [];

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map_setting.billboard.indexOf(map[y][x]) != -1) {
        sprites.push({
          x: parseInt(x * TILE_SIZE + TILE_SIZE / 2),
          y: parseInt(y * TILE_SIZE + TILE_SIZE / 2),
          texture: textures[map[y][x]],
          distanceToCamera: 0,
          multilater: map_setting.multilater.indexOf(map[y][x]) != -1,
        });
      }
    }
  }
  sprites = sprites.concat(other_sprites.filter(sprite => sprite.map === CURRENT_LEVEL));

  const visibleSprites = sprites.filter((sprite) => {
    const dx = sprite.x - camera.x;
    const dy = sprite.y - camera.y;
    sprite.distanceToCamera = Math.hypot(dx, dy);
    return sprite.distanceToCamera < TILE_SIZE * 50;
  });

  visibleSprites.sort((a, b) => b.distanceToCamera - a.distanceToCamera);

  visibleSprites.forEach((sprite) => {
    const dx = sprite.x - camera.x;
    const dy = sprite.y - camera.y;
    let spriteAngle = Math.atan2(dy, dx) - camera.angle;
    spriteAngle = normalizeAngle(spriteAngle);

    if (Math.abs(spriteAngle) >= raycast_setting.fov / 1.2) return;

    const distance = sprite.distanceToCamera * Math.cos(spriteAngle);
    if (distance <= 0) return;

    const maxHeight = canvas.height * 1.5;
    const spriteHeight = Math.min(
      maxHeight,
      (TILE_SIZE * canvas.height) / distance
    );
    const screenX = Math.round(
      canvas.width / 2 + Math.tan(spriteAngle) * (canvas.width / raycast_setting.fov)
    );
    const screenY = Math.round((canvas.height - spriteHeight) / 2 + camera.z);
    const spriteWidth = spriteHeight;

    let tileXOffset = 0;
    if (sprite.multilater) {
      let angleToCamera = Math.atan2(player.y - sprite.y, player.x - sprite.x);

      let relativeAngle = normalizeAngle(angleToCamera);

      let angleDegrees = ((relativeAngle * 180) / Math.PI + 360) % 360;

      const sectorSize = 45;
      let sector = Math.floor(
        ((angleDegrees + sectorSize / 2) % 360) / sectorSize
      );

      tileXOffset = (sector % 8) * 64;
    }

    const margin = 2;
    const startX = Math.max(0, Math.floor(screenX - spriteWidth / 2) - margin);
    const endX = Math.min(
      canvas.width,
      Math.ceil(screenX + spriteWidth / 2) + margin
    );

    if (screenY + spriteHeight < 0 || screenY > canvas.height) return;

    for (let x = startX; x < endX; x++) {
      const bufferIndex = Math.floor(x / (canvas.width / raycast_setting.ray_count));

      if (
        bufferIndex >= 0 &&
        bufferIndex < zBuffer.length &&
        distance < zBuffer[bufferIndex]
      ) {
        const progress = (x - (screenX - spriteWidth / 2)) / spriteWidth;
        const sourceX =
          tileXOffset + Math.max(0, Math.min(63, Math.floor(progress * 64)));

        try {
          ctx.drawImage(
            sprite.texture,
            sourceX,
            0,
            1,
            TILE_SIZE,
            x,
            screenY,
            1,
            spriteHeight
          );
        } catch (e) {
          console.error("Error al renderizar sprite:", e);
        }
      }
    }
  });
}

function move_other_sprites() {
  for (let i = 0; i < other_sprites.length; i++) {
      if (other_sprites[i].map == CURRENT_LEVEL){
        other_sprites[i].x = other_sprites[i].x + other_sprites[i].vx;
        other_sprites[i].y = other_sprites[i].y + other_sprites[i].vy;
        if (other_sprites[i].loop) {
          if (
            map[parseInt(other_sprites[i].y / 64)][
              parseInt(other_sprites[i].x / 64)
            ] != 0
          ) {
            other_sprites[i].x = other_sprites[i].origonal_pos.x;
            other_sprites[i].y = other_sprites[i].origonal_pos.y;
          }
        }
      }
    }
}
