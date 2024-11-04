  
const camera = {
  x: player.x,
  y: player.y,
  z: 0,
  angle: normalizeAngle(player.angle),
  distance: 40,
  height: 32,
  dirX: Math.cos(45),
  dirY: Math.sin(45),
  planeX: Math.cos(45 + Math.PI / 2) * 0.66,
  planeY: Math.sin(45 + Math.PI / 2) * 0.66,
};
