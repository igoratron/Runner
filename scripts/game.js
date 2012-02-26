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
        var buildingHeight = Math.round(Math.random() * (canvas.h - 100));
        for(var i = 0; i < 4; i ++) {
            var h = Math.round(Math.random() * buildingHeight) + 50;
            h %= (canvas.h - 100);
            buildingHeight = h;
            buildings.push(new buildingFactory[0](buildingHeight));
        }
        
        var playerY = 0;
        var buildingX = 0;

        function gameLoop() {
            var delay = Date.now() - timeStamp;
            player.setPace(0.3*(delay)/33);
            ctx.clearRect(0, 0, canvas.w, canvas.h);
            
            var bx = buildingX;
            
            buildings.forEach(function(building) {
                var box = building.getBoundingBox();
                //fixme
                if(!box.by)
                    box.by = Math.random()*(50);
                    
                building.draw(ctx, bx, (canvas.h - box.h) + box.by);
                bx += box.w;
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
                buildingX = 0;
            }
            
            buildingX -= 3;
            timeStamp = Date.now();
            
            if(buildings[0].getBoundingBox().w + buildingX < 0) {
                var firstB = buildings.shift();
                var h = Math.round(Math.random() * buildingHeight) + 50;
                h %= (canvas.h - 100);
                buildingHeight = h;
                firstB.randomiseBuilding(buildingHeight);
                console.log("building " + buildingHeight);
                buildings.push(firstB);
                buildingX = 0;
            }
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
