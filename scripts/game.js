define(function() {
    var Game = function(player, buildingFactory) {
        var GRAVITY = 10;
        
        var ctx = document.querySelector("#canvas").getContext("2d");
        var canvas = {w: 600, h: 300};
        
        var timeStamp = Date.now();
        
        var keyPressed = function(event) {
            if(event.keyCode == 32) { //space
                player.jump();
            }
        };
        document.querySelector("body").addEventListener("keydown", keyPressed, false);
        
        var buildings = [];
        buildings.push(new buildingFactory[0](100));
        
        var playerY = 0;

        function gameLoop() {
            var delay = Date.now() - timeStamp;
            player.setPace(0.3*(delay)/33);
            ctx.clearRect(0, 0, canvas.w, canvas.h);
                                
            buildings.forEach(function(building) {
                building.draw(ctx, 0, 200);
            });
            
            player.draw(ctx, 10, playerY);
            
            var platform = hitTest(player, buildings);
            if(!player.isJumping()) {
                if(platform === false) {
                    player.setState("falling");
                    playerY += GRAVITY;
                } else if(platform.y) {
                    player.setState("running");
                    playerY = platform.y + 1;
                }
            }
            
            if(playerY > canvas.h) {
                playerY = 0;
            }

            timeStamp = Date.now();
        }
        
        function hitTest(player, buildings) {
            var p = player.getBoundingBox();
            var ret = false;
            
            buildings.some(function(building) {
                var b = building.getBoundingBox();
                
                if ((p.x + p.w - b.x >= 0) && //right
                    (p.x - (b.x + b.w) <= 0) && //left
                    (p.y + p.h - b.y >= -5) && //bottom
                    (p.y - (b.y + b.h) <= 0)) { //top
                    ret = {y: b.y - p.h};
                    return true;
                } else
                return false;
            });

            return ret;
        }
        
        //start game loop
        setInterval(function() {
            gameLoop();
        }, 33);
    };
    
    return Game;
});
