define(function() {
    var Player = function(image, spriteParams) {
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
            ctx.drawImage(image, sprite.x, sprite.y, sprite.w, sprite.h, 
                                 x + sprite.offsetX, y - sprite.offsetY, sprite.w, sprite.h);
    
            
            spriteIterator += this.pace;
        };
        
        this.jump = function() {
            if(this.state !== "jumping") {
                this.state = "jumping";
                spriteIterator = 0;
            }
        };
        
        this.setPace = function(pace) {
            if(pace > 1) {
                pace = 1;
            }
            this.pace = pace;
        };
    };    
    
    return Player;
});
