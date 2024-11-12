  
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
        'VX: '+physics.velocityX.toFixed(2)+'VY: '+physics.velocityY.toFixed(2),
        'X: '+player.x.toFixed(2)+' Y: '+player.y.toFixed(2),
        'FRAMES: '+canvas_setting.frame_counter
        ,
        'CURRENT LEVEL:'+CURRENT_LEVEL+ ' LAP:'+0,
        '',
        "ARROWS TO MOVE, D FOR TURBO"
    ];
    info.forEach((line, index) => {
        ctx.fillText(line, hudX + 10, hudY + 20 + (index * 16));
    });
}

 
