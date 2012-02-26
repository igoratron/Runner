define(function() {
    
    var SceneGenerator = function(canvas, buildingFactories) {
        var MAX_HEIGHT_DIFF = 50;
        var MAX_GAP = 40;
        
        var objects = [];
        var buildingHeight = Math.round(Math.random() * (canvas.h - 100));
        var sceneWidth = 0;

        init();

        function init() {
            buildingHeight = (Math.round(Math.random() * buildingHeight) + MAX_HEIGHT_DIFF) % (canvas.h - 100);
            var building = new buildingFactories[0](buildingHeight);
            var gap = Math.round(Math.random() * MAX_GAP);
            objects.push(building);
            sceneWidth += building.getBoundingBox().w;
            objects.push(gap);
            sceneWidth += gap;
            
            if(canvas.w > sceneWidth - building.getBoundingBox().w)
                setTimeout(init,1);
        }

        this.refreshScene = function(sceneX) {
            if(objects[0].getBoundingBox().w + sceneX < 0) {

                //reuse building object
                var firstB = objects.shift();
                buildingHeight = (Math.round(Math.random() * buildingHeight) + MAX_HEIGHT_DIFF) % (canvas.h - 100);
                sceneX += firstB.getBoundingBox().w;
                firstB.randomiseBuilding(buildingHeight);
                objects.push(firstB);
            
                var gap = Math.round(Math.random() * MAX_GAP);
                objects.push(gap);
                sceneX += objects.shift();
            }
            return sceneX;
        };
        
        this.drawScene = function(ctx, sceneX) {
            var x = this.refreshScene(sceneX);
            
            objects.forEach(function(obj) {
                if(typeof obj === "number") {
                    x += obj;
                } else if(obj.draw) {
                    var box = obj.getBoundingBox();
                
                    obj.draw(ctx, x, (canvas.h - box.h));
                    x += box.w;
                }
            });
        };
        
        this.getObjects = function() {
            return objects;
        };
            
    };
    
    var Game = function(player, buildingFactory) {
        var GRAVITY = 10;
        
        var keyPressed = function(event) {
            switch(event.keyCode) {
                case 32: //space
                    player.jump();
                    break;
            }
        };
        document.querySelector("body").addEventListener("keydown", keyPressed, false);
        
        var ctx = document.querySelector("#canvas").getContext("2d");
        var canvas = {w: 600, h: 300};
        var timeStamp = Date.now();
        
        var sg = new SceneGenerator(canvas, buildingFactory);
        
        var playerY = 0;
        var sceneX = 0;
        
        function gameLoop() {
            sceneX = sg.refreshScene(sceneX);
            ctx.clearRect(0, 0, canvas.w, canvas.h);
            sg.drawScene(ctx, sceneX);
            
            var delay = Date.now() - timeStamp;
            drawFPS(ctx, delay);
            player.setPace(0.3*(delay)/33);
            player.draw(ctx, 10, playerY);
            
            var colliding = hitTest(player, sg.getObjects());
            if(colliding.length === 0) {
                player.setState("falling");
                playerY += GRAVITY;
            } else {
                player.setState("running");
                playerY = colliding[0].y - player.getBoundingBox().h;
            }
            
            //player fell of screen
            if(playerY > canvas.h) {
                playerY = 0;
                sceneX = 0;
            }
            
            sceneX -= 3;
            timeStamp = Date.now();
        }
        
        function hitTest(player, objects) {
            var p = player.getBoundingBox();
            var bbox = objects.map(function(obj) { 
                if(obj.getBoundingBox)
                    return obj.getBoundingBox(); 
            });
            return bbox.filter(function(box) {
                if(box) {
                    if ((p.x + p.w - box.x >= 0) && //right
                        (p.x - (box.x + box.w) <= 0) && //left
                        (p.y + p.h - box.y >= 0) && //bottom
                        (p.y - (box.y + box.h) <= 0)) { //top
                            return true;
                    } else {
                        return false;
                    }
                }
                return false;
            });            
        }
        
        function drawFPS(ctx, delay) {
            var text = "fps: " + Math.round(1000/delay);
            var len = ctx.measureText(text);
            ctx.fillText(text, 599 - len.width, 10);
        }
        
        //start game loop
        setInterval(function() {
            gameLoop();
        }, 33);
    };
    
    return Game;
});
