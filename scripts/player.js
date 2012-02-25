define(function() {
    var state = {
        RUNNING: "running",
        JUMPING: "jumping",
        FALLING: "falling"
    };
    
    var Player = function(image, spriteParams) {
        var JUMP_HEIGHT = 50;
        this.pace = 0;
        this.image = image;
        this.sprite = spriteParams;
        this.boundingBox = {x: 0, y: 0, w: 0, h: 0};
        
        this.state = state.FALLING;
        var spriteIterator = 0;
        
        this.draw = function(ctx, x, y) {
            if(this.isJumping()) {
                var animLen = this.sprite[state.JUMPING].length - 1;
                y -= JUMP_HEIGHT * Math.sin(spriteIterator * (1 / animLen) * Math.PI);
                
                if(Math.round(spriteIterator) === animLen) {
                    console.log("jump finished");
                    this.setState(state.FALLING);
                    spriteIterator = 0;
                }
            }
            
            var sprite = this.sprite[this.state][Math.round(spriteIterator)];
            ctx.drawImage(image, sprite.x, sprite.y, sprite.w, sprite.h, 
                                 x + sprite.offsetX, y - sprite.offsetY, sprite.w, sprite.h);
            
            this.boundingBox.x = x + sprite.offsetX;
            this.boundingBox.y = y - sprite.offsetY;
            this.boundingBox.w = 26;//sprite.w;
            this.boundingBox.h = sprite.h;
            
            if(Math.round(spriteIterator + this.pace) < this.sprite[this.state].length) {
                spriteIterator += this.pace;
            } else if(this.isRunning()) {
                spriteIterator = 0;
            }
        };
        
        this.jump = function() {
            if(!this.isJumping()) {
                this.setState(state.JUMPING);
                spriteIterator = 0;
            }
        };
        
        this.setPace = function(pace) {
            if(pace > 1) {
                pace = 1;
            }
            this.pace = pace;
        };
        
        this.getBoundingBox = function() {
            return this.boundingBox;  
        };
        
        this.setState = function(state) {
            if(this.state !== state)
                console.log(state);
            this.state = state;
        };
        
        this.isFalling = function() {
            return this.state === state.FALLING;
        };
        
        this.isJumping = function() {
            return this.state === state.JUMPING;
        };
        
        this.isRunning = function() {
            return this.state === state.RUNNING;
        };
    };    
    
    return Player;
});
