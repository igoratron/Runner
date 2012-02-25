define(function() {
    var Game = function(player) {
        var ctx = document.querySelector("#canvas").getContext("2d");
        var canvas = {w: 600, h: 300};
        
        var timeStamp = Date.now();
        var x = 0;
        
        var keyPressed = function(event) {
            if(event.keyCode == 32) { //space
                player.jump();
            }
        };
        document.querySelector("body").addEventListener("keydown", keyPressed, false);
        
        function gameLoop() {
            player.setPace(0.3*(Date.now() - timeStamp)/33);
            
            ctx.clearRect(0, 0, canvas.w, canvas.h);
            ctx.fillRect(0, 257, 600, 1);
            player.draw(ctx, x, 210);
            x = x > canvas.w ? 0 : x += 3;
            
            timeStamp = Date.now();
        }
        
        //start game loop
        setInterval(function() {
            gameLoop();
        }, 33);
    };
    
    return Game;
});
