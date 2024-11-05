  
function drawHUD(context = ctx) {
    const hudWidth = 300;
    const hudHeight = 100;
    const hudX = 10;
    const hudY = 10;
    ctx.fillStyle = 'white';
    ctx.fillRect(hudX, hudY, hudWidth, hudHeight);
    ctx.fillStyle = 'black';
    ctx.font = '14px Verdana';
    const info = [
        `VX: ${physics.velocityX.toFixed(2)}`,
        `VY: ${physics.velocityY.toFixed(2)}`,
        `CURRENT LEVEL: ${CURRENT_LEVEL}`,
        "",
        "ARROWS TO MOVE, D FOR TURBO"
    ];
    info.forEach((line, index) => {
        ctx.fillText(line, hudX + 10, hudY + 20 + (index * 16));
    });
}

 
