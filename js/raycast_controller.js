let zBuffer = new Array(raycast_setting.ray_count).fill(Infinity);

function getRayData(angle) {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  
  let hits = [];

  {
    const firstY = Math.floor(camera.y / TILE_SIZE) * TILE_SIZE + (sin > 0 ? TILE_SIZE : 0);
    const ya = sin > 0 ? TILE_SIZE : -TILE_SIZE;
    const xa = ya / Math.tan(angle);

    let x = camera.x + (firstY - camera.y) / Math.tan(angle);
    let y = firstY;

    for (let i = 0; i < raycast_setting.distance; i++) {
      const mapX = Math.floor(x / TILE_SIZE);
      const mapY = Math.floor(y / TILE_SIZE) - (sin <= 0 ? 1 : 0);

      if (map[mapY] && map[mapY][mapX] > 0 && map_setting.billboard.indexOf(map[mapY][mapX]) == -1 && map_setting.floor.indexOf(map[mapY][mapX]) == -1) {
        const distance = Math.hypot(x - camera.x, y - camera.y);
        const hitPos = (x % TILE_SIZE) / TILE_SIZE;
        
        hits.push({
          distance: distance,
          hitPosition: hitPos,
          tileType: map[mapY][mapX],
          isHorizontal: true
        });
      }

      x += xa;
      y += ya;
    }
  }

  {
    const firstX = Math.floor(camera.x / TILE_SIZE) * TILE_SIZE + (cos > 0 ? TILE_SIZE : 0);
    const xa = cos > 0 ? TILE_SIZE : -TILE_SIZE;
    const ya = xa * Math.tan(angle);

    let x = firstX;
    let y = camera.y + (firstX - camera.x) * Math.tan(angle);

    for (let i = 0; i < raycast_setting.distance; i++) {
      const mapX = Math.floor(x / TILE_SIZE) - (cos <= 0 ? 1 : 0);
      const mapY = Math.floor(y / TILE_SIZE);

      if (map[mapY] && map[mapY][mapX] > 0 && map_setting.billboard.indexOf(map[mapY][mapX]) == -1 && map_setting.floor.indexOf(map[mapY][mapX]) == -1 ) {
        const distance = Math.hypot(x - camera.x, y - camera.y);
        const hitPos = (y % TILE_SIZE) / TILE_SIZE;
        
        hits.push({
          distance: distance,
          hitPosition: hitPos,
          tileType: map[mapY][mapX],
          isHorizontal: false
        });
      }

      x += xa;
      y += ya;
    }
  }

  hits.sort((b, a) => a.distance - b.distance);
  
  if (hits.length === 0) {
    return {
      distance: 1000,
      hitPosition: 0,
      tileType: 0,
    };
  }

  return hits;
}

function castRays() {
  const rayAngleStep = raycast_setting.fov / raycast_setting.ray_count;
  zBuffer = new Array(raycast_setting.ray_count).fill(Infinity);

  for (let i = 0; i < raycast_setting.ray_count; i++) {
    const rayAngle = normalizeAngle(camera.angle - raycast_setting.fov / 2 + i * rayAngleStep);
    const rayHits = getRayData(rayAngle);

    if (Array.isArray(rayHits)) {
      for (const rayData of rayHits) {
        const adjustedDistance = rayData.distance * Math.cos(rayAngle - camera.angle);
        
        if (adjustedDistance <= 0) continue;
        const tileHeightEntry = map_setting.heights.find(entry => entry[0] === rayData.tileType);
        const blockCount = tileHeightEntry ? tileHeightEntry[1] : 1;

        const baseWallHeight = Math.min(
          canvas_setting.height * 2,
          (TILE_SIZE * canvas_setting.height) / adjustedDistance - camera.z
        );
        const singleBlockHeight = Math.max(0, baseWallHeight);
        const textureX = Math.floor(rayData.hitPosition * textures[rayData.tileType].width) % textures[rayData.tileType].width;
        const wallX = i * (canvas_setting.width / raycast_setting.ray_count);
        
        for (let j = 0; j < blockCount; j++) {
          const blockYPosition = canvas_setting.height / 2 - singleBlockHeight / 2 - j * singleBlockHeight + camera.z;
          ctx.drawImage(
            textures[rayData.tileType],
            textureX,
            0,
            1,
            textures[rayData.tileType].height,
            parseInt(wallX),
            parseInt(blockYPosition),
            parseInt(canvas_setting.width / raycast_setting.ray_count + 3),
            singleBlockHeight
          );
          
          let distanceShading = Math.pow(adjustedDistance / shadow_settings.distance, 2);
          distanceShading = Math.min(distanceShading, shadow_settings.max)
          if (shadow_settings.enabled && distanceShading > shadow_settings.min){
            ctx.fillStyle = `rgba(0, 0, 0, ${distanceShading})`;
            ctx.fillRect(wallX, blockYPosition, canvas_setting.width / raycast_setting.ray_count + 1, singleBlockHeight);
          }
      
        }
        if (adjustedDistance < zBuffer[i]) {
          zBuffer[i] = adjustedDistance;
        }
      }
    }
  }
}


function castFloor() {
  const rayAngleStep = raycast_setting.fov / raycast_setting.ray_count;
  const pixelWidth = Math.ceil(canvas_setting.width / raycast_setting.ray_count);
  const floor_setting = 3; // pixeles que se salta

  for (let x = 0; x < raycast_setting.ray_count; x++) {
    const rayAngle = normalizeAngle(camera.angle - raycast_setting.fov / 2 + x * rayAngleStep);
    const wallScreenX = x * pixelWidth;
    const cameraHeight = TILE_SIZE * 0.5;
    const startY = canvas_setting.height / 2;
    
    for (let y = startY; y < canvas_setting.height; y += floor_setting) {
      const dy = y - startY;
      if (dy <= 0) continue;
      
      const straightDist = (cameraHeight * canvas_setting.height) / dy;
      if (straightDist > TILE_SIZE * 20) continue;

      const worldX = parseInt(camera.x + Math.cos(rayAngle) * straightDist);
      const worldY = parseInt( camera.y + Math.sin(rayAngle) * straightDist);
      const mapX = Math.floor(worldX / TILE_SIZE);
      const mapY = Math.floor(worldY / TILE_SIZE);

      if (map[mapY] && map_setting.floor.indexOf(map[mapY][mapX]) != -1) {
        const textureX = Math.floor((worldX % TILE_SIZE) / TILE_SIZE * TILE_SIZE);
        const textureY = Math.floor((worldY % TILE_SIZE) / TILE_SIZE * TILE_SIZE);

        try {
          ctx.drawImage(
            textures[map[mapY][mapX]],
            textureX,
            textureY,
            1,
            1,
            parseInt(wallScreenX),
            parseInt(y),
            pixelWidth,
            floor_setting
          );
          
        } catch (e) {
          console.error('Error al dibujar textura:', e);
          ctx.fillStyle = '#FF0000';
          ctx.fillRect(wallScreenX, y, pixelWidth, floor_setting);
        }
      }
    }
  }
}
