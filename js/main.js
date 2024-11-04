  
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
first_load = true;

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFloor();
  drawSky();
  castRays();
  drawSprites();
  drawPlayer();
  drawHUD();
}

function gameLoop() {
  turbo = 1;
  if (first_load) {
    load_map(0);
    set_player_pos(map);
    first_load = false;
  }
  player_physics();
  move_other_sprites();
  render();
  requestAnimationFrame(gameLoop);
}

const keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

  
let loadedImages = 0;
const totalImages = Object.keys(imageSources).length;

const checkImagesLoaded = () => {
  loadedImages++;
  if (loadedImages === totalImages) {
    gameLoop(); 
  }
};

for (const key in textures) {
  if (textures.hasOwnProperty(key)) {
    textures[key].src = imageSources[key];
    textures[key].onload = checkImagesLoaded; 
  }
}


