(function(){
    window.runner = {};
    
    window.runner.Player = function(image, spriteParams) {
        this.pace = 0.35;
        this.image = image;
        this.sprite = spriteParams;
        
        this.running = true;
        
        var spriteIterator = 0;
        this.draw = function(ctx, x, y) {
            if(Math.round(spriteIterator) >= this.sprite.running.length)
                    spriteIterator = 0;
                    
            if(this.running) {
                var sprite = this.sprite.running[Math.round(spriteIterator)];
                ctx.drawImage(image, sprite.x, sprite.y, sprite.w, sprite.h, 
                                     x + sprite.offsetX, y, sprite.w, sprite.h);
            }
            
            spriteIterator += this.pace;
        }
    };
    
    function run() {
        var ctx = document.querySelector("#canvas").getContext("2d");
        var res = loadResources();
        var canvas = {w: 600, h: 300};
        
        var player = new runner.Player(res.runner, {
            running: [
                {x: 19, y: 3, w: 31, h: 47, offsetX: 6},
                {x: 65, y: 3, w: 35, h: 47, offsetX: 3},
                {x: 115, y: 1, w: 36, h: 49, offsetX: 0},
                {x: 172, y: 2, w: 28, h: 48, offsetX: 8},
                {x: 219, y: 2, w: 30, h: 48, offsetX: 6},
                {x: 264, y: 3, w: 36, h: 48, offsetX: 0},
                {x: 315, y: 1, w: 35, h: 49, offsetX: 1},
                {x: 374, y: 3, w: 26, h: 47, offsetX: 10},
            ]
        });
        
        var x = 0;
        function gameLoop() {
            ctx.clearRect(0, 0, canvas.w, canvas.h);
            ctx.fillRect(0, 57, 600, 1);
            player.draw(ctx, x, 10);
            x = x > canvas.w ? 0 : x += 3;
        }
        
        setInterval(gameLoop, 33);
    }
    
    function loadResources() {
        return {
            runner: document.querySelector("#runner")
        };
    }
    
    window.onload = run;
})();