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
  const shadow_distance = (-0.0001538 * shadow_settings.distance) + 0.8;
  const floorTexture = textures.floor;
  const horizon = canvas.height / 2 + camera.z - 10;
  const SPEED_FACTOR = 0.045;
  const STEP_SIZE = 8;  
  const COLUMN_STEP = 10; 

  for (let y = horizon; y < canvas.height; y += STEP_SIZE) {
    const rowDistance = (64 * 32) / (y - horizon);
    let blockStart = 0;
    let lastTexX = -1, lastTexY = -1;

    for (let x = 0; x < canvas.width; x += COLUMN_STEP) {
      const floorX = camera.x * SPEED_FACTOR + rowDistance * Math.cos(camera.angle - raycast_setting.fov / 2 + (raycast_setting.fov * x) / canvas.width);
      const floorY = camera.y * SPEED_FACTOR + rowDistance * Math.sin(camera.angle - raycast_setting.fov / 2 + (raycast_setting.fov * x) / canvas.height);

      const texX = Math.floor(((floorX % 32) + 32) % 32);
      const texY = Math.floor(((floorY % 32) + 32) % 32);

      if (lastTexX !== texX || lastTexY !== texY || x === canvas.width - COLUMN_STEP) {
        if (lastTexX !== -1) {
          ctx.drawImage(
            floorTexture,
            lastTexX, lastTexY, 1, 1,
            blockStart, y, x - blockStart + COLUMN_STEP, STEP_SIZE
          );
        }
        blockStart = x;
        lastTexX = texX;
        lastTexY = texY;
      }
    }
  }

  if (shadow_settings.enabled) {
    const gradient = ctx.createLinearGradient(0, horizon, 0, canvas.height);
    gradient.addColorStop(0, `rgba(128, 128, 128, ${shadow_settings.max})`);
    gradient.addColorStop(
      Math.max(0, Math.min(shadow_distance, 0.9)), 
      `rgba(128, 128, 128, ${shadow_settings.min})` 
    );
    ctx.fillStyle = gradient;
    ctx.fillRect(0, horizon, canvas.width, canvas.height - horizon);
  }
}



