define(function() {
    var state = {
        RUNNING: "running",
        JUMPING: "jumping",
        FALLING: "falling"
    };
    
    var Player = function(image, spriteParams) {
        this.pace = 0;
        this.image = image;
        this.sprite = spriteParams;
        this.boundingBox = {x: 0, y: 0, w: 0, h: 0};
        
        this.state = state.FALLING;
        var spriteIterator = 0;
        
        this.x = 50;
        this.y = 0;
        
        var oldY = 0;
        
        this.draw = function(ctx) {
            if(this.isJumping()) {
                var animLen = this.sprite[state.JUMPING].length - 1;
                
                if(Math.round(spriteIterator) === animLen) {
                    this.setState(state.FALLING);
                }
            }
            if(this.isFalling()) {
                spriteIterator = 0;
            }

            var sprite = this.sprite[this.state][Math.round(spriteIterator)];
            ctx.drawImage(image, sprite.x, sprite.y, sprite.w, sprite.h, 
                                 this.x + sprite.offsetX, this.y - sprite.offsetY, sprite.w, sprite.h);
            
            this.boundingBox.x = this.x + sprite.offsetX;
            this.boundingBox.y = this.y - sprite.offsetY - (sprite.h - this.boundingBox.h);
            this.boundingBox.w = sprite.w - sprite.offsetX;
            this.boundingBox.h = sprite.h - sprite.offsetY;
            
            if(!this.isJumping()) {
                if(Math.abs(oldY - (this.boundingBox.y + this.boundingBox.h)) < 1) {
                    this.setState(state.RUNNING);
                } else if(oldY - (this.boundingBox.y + this.boundingBox.h) < -1) {
                    this.setState(state.FALLING);
                }
            }
            
            if(Math.round(spriteIterator + this.pace) < this.sprite[this.state].length) {
                    spriteIterator += this.pace;
            } else if(this.isRunning()) { //rewind if running
                spriteIterator = 0;
            }
            
            oldY = this.boundingBox.y + this.boundingBox.h;
        };
        
        this.jump = function() {
            if(!this.isJumping() && !this.isFalling()) {
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
