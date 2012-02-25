(function(){
    window.runner = {};
    
    window.runner.Player = function(image, spriteParams) {
        this.pace = 0;
        this.image = image;
        this.sprite = spriteParams;
        
        this.state = "running";
        var spriteIterator = 0;
        
        this.draw = function(ctx, x, y) {
            if(Math.round(spriteIterator) >= this.sprite[this.state].length) {
                    spriteIterator = 0;
                    this.state = "running";
            }
                    
            var sprite = this.sprite[this.state][Math.round(spriteIterator)];
            if(this.state==="jumping") {
                console.log(Math.round(spriteIterator));
                console.log(sprite);
            }
            ctx.drawImage(image, sprite.x, sprite.y, sprite.w, sprite.h, 
                                 x + sprite.offsetX, y - sprite.offsetY, sprite.w, sprite.h);

            if(this.state === "jumping") {
                spriteIterator += (this.pace * 0.6);
            } else {
                spriteIterator += this.pace;
            }
        };
        
        this.jump = function() {
            if(this.state !== "jumping") {
                this.state = "jumping";
                spriteIterator = 0;
            }
        }
        
        this.setPace = function(pace) {
            if(pace > 1) {
                pace = 1;
            }
            this.pace = pace;
        }
    };
    
    function start() {
        var ctx = document.querySelector("#canvas").getContext("2d");
        var res = loadResources();
        var canvas = {w: 600, h: 300};
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||  
                        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;  
                        
        var keyPressed = function(event) {
            if(event.keyCode == 32) { //space
                player.jump();
            }
        };
        
        document.querySelector("body").addEventListener("keydown", keyPressed, false);
        
        var player = new window.runner.Player(res.runner, {
            running: [
                {x: 19, y: 3, w: 31, h: 47, offsetX: 6, offsetY: 0},
                {x: 65, y: 3, w: 35, h: 47, offsetX: 3, offsetY: 0},
                {x: 115, y: 1, w: 36, h: 49, offsetX: 0, offsetY: 0},
                {x: 172, y: 2, w: 28, h: 48, offsetX: 8, offsetY: 0},
                {x: 219, y: 2, w: 30, h: 48, offsetX: 6, offsetY: 0},
                {x: 264, y: 3, w: 36, h: 48, offsetX: 0, offsetY: 0},
                {x: 315, y: 1, w: 35, h: 49, offsetX: 1, offsetY: 0},
                {x: 374, y: 3, w: 26, h: 47, offsetX: 10, offsetY: 0}
            ],
            jumping: [
                {x: 15, y: 50, w: 35, h: 50, offsetX: 6, offsetY: 0},
                {x: 51, y: 51, w: 49, h: 49, offsetX: 0, offsetY: 0},
                {x: 101, y: 50, w: 49, h: 40, offsetX: 0, offsetY: 9},
                {x: 151, y: 52, w: 47, h: 39, offsetX: 0, offsetY: 7},
                {x: 201, y: 55, w: 49, h: 44, offsetX: 0, offsetY: -5}
            ]
        });

        var timeStamp = Date.now();
        var x = 0;
        
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
            requestAnimationFrame(gameLoop);
        }, 33);
    }
    
    function loadResources() {
        return {
            runner: document.querySelector("#runner")
        };
    }
    
    window.onload = start;
})();