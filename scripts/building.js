define(function() {
    var BuildingSetup = function(image, spriteParams)  {
        this.image = image;
        this.sprite = spriteParams;
        
        Building.prototype = this;
        
        return Building;
    };
    
    var Building = function(desiredHeight) {
        this.boundingBox = {x: 0, y: 0, w: 0, h: 0};
        this.randomiseBuilding = function(desiredHeight) {
            var plan = [];
            
            //roof
            var rand = Math.round(Math.random() * (this.sprite.roof.length-1));
            var sprite = this.sprite.roof[rand];
            plan.push({
                x: 0,
                y: 0,
                sprite: sprite                
            });
            var buildingWidth = sprite.w;
            var buildingHeight = sprite.h;
            
            while(buildingHeight < desiredHeight) {
                //floor
                rand = Math.round(Math.random() * (this.sprite.side.left.length-1));
                sprite = this.sprite.side.left[rand];
                plan.push({
                    x: 0,
                    y: buildingHeight,
                    sprite: sprite                
                });
                
                var leftSize = sprite.w
                
                rand = Math.round(Math.random() * (this.sprite.side.right.length-1));
                sprite = this.sprite.side.right[rand];
                plan.push({
                    x: buildingWidth - sprite.w,
                    y: buildingHeight,
                    sprite: sprite                
                });
                
                for(var i=0; i<2; i++) {
                    rand = Math.round(Math.random() * (this.sprite.windows.length-1));
                    sprite = this.sprite.windows[rand];
                    plan.push({
                        x: leftSize + i * sprite.w,
                        y: buildingHeight,
                        sprite: sprite                
                    });
                }
                
                buildingHeight += sprite.h;
            }
            
            this.boundingBox = {
                x: 0,
                y: 0,
                w: buildingWidth,
                h: desiredHeight
            };
            
            this.plan = plan;
        };
        this.draw = function(ctx, x, y) {
            this.boundingBox.x = x;
            this.boundingBox.y = y;
            
            ctx.save();
            ctx.translate(x, y);
            this.plan.forEach(function(block) {
                ctx.drawImage(this.image, block.sprite.x, block.sprite.y, block.sprite.w, block.sprite.h,
                                        block.x, block.y, block.sprite.w, block.sprite.h);
            });
            ctx.restore();
        };
        this.getBoundingBox = function() {
            return this.boundingBox;  
        };
        
        this.randomiseBuilding(desiredHeight);
    };
    
    return BuildingSetup;
});