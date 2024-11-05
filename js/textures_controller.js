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
          Math.cos(camera.angle - raycast_setting.fov / 2 + (raycast_setting.fov * x) / canvas.width);
      const floorY =
        wrappedPlayerY * SPEED_FACTOR +
        rowDistance *
          Math.sin(camera.angle - raycast_setting.fov / 2 + (raycast_setting.fov * x) / canvas.width);

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
