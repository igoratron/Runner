define(function() {
    
    var SceneGenerator = function(canvas, buildingFactories) {
        var MAX_HEIGHT_DIFF = 50;
        var MAX_GAP = 40;
        
        var objects = [];
        var buildingHeight = Math.round(Math.random() * (canvas.h - 100));
        var sceneWidth = 0;
        var sceneX = 0;
    
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

        function refreshScene() {
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
        }
        
        this.drawScene = function(ctx) {
            refreshScene();
            var x = sceneX;
            
            objects.forEach(function(obj) {
                if(typeof obj === "number") {
                    x += obj;
                } else if(obj.draw) {
                    var box = obj.getBoundingBox();
                    obj.draw(ctx, x, (canvas.h - box.h));
                    x += box.w;
                }
            });
            
            sceneX -= 2;
        };
        
        this.getObjects = function() {
            return objects;
        };
            
    };
    
    var PhysicsSimulator = function(player, objects) {
        var GRAVITY = 10;
        var jumpAngle = 0 * Math.PI/180;
        var playerV = 5;
        var runningY = 0;
        
        var jumping = false;
        
        var playerX = 0;
        
        this.playerJump = function() {
            player.jump();
            jumping = true;
            jumpAngle = 30 * Math.PI/180;
        };
        
        this.applyPhysics = function() {
            
            var colliding = hitTest(player, objects);
            if(colliding.length === 0 || jumping) {
                playerX += 0.05;
                jumping = false;
            } else {
                runningY = colliding[0].y - player.getBoundingBox().h;
                playerX = 0;
                jumpAngle = 0;
            }
            
            player.y = calcTrajectory(playerX) + runningY;
        };
        
        function calcTrajectory(x) {
            var y = -(((-GRAVITY * Math.pow(1/Math.cos(jumpAngle), 2)) / (2 * Math.pow(playerV, 2))) * Math.pow(x, 2) + x * Math.tan(jumpAngle));
            return y * 200;
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
    };
    
    var Game = function(player, buildingFactory) {
    
        var ctx = document.querySelector("#canvas").getContext("2d");
        var canvas = {w: 600, h: 300};
        var timeStamp = Date.now();
        var sg = new SceneGenerator(canvas, buildingFactory);
        var ps = new PhysicsSimulator(player, sg.getObjects());
    
        var keyPressed = function(event) {
            switch(event.keyCode) {
                case 32: //space
                    ps.playerJump();
                    break;
            }
        };
        document.querySelector("body").addEventListener("keydown", keyPressed, false);
        
        function gameLoop(time) {
            ctx.clearRect(0, 0, canvas.w, canvas.h);
            sg.drawScene(ctx);
            ps.applyPhysics();
            
            var delay = time - timeStamp;
            drawFPS(ctx, delay);

            player.setPace(0.3*(delay)/33);
            player.draw(ctx);
                                    
            timeStamp = time;
            window.webkitRequestAnimationFrame(gameLoop)
        }
        
        
        
        function drawFPS(ctx, delay) {
            var text = "fps: " + Math.round(1000/delay);
            var len = ctx.measureText(text);
            ctx.fillText(text, 599 - len.width, 10);
        }
        
        //start game loop
        gameLoop();
    };
    
    return Game;
});
