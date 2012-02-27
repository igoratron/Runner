define(function() {
    var BuildingSetup = function(image, spriteParams)  {
        var args = Array.prototype.slice.call(arguments);
        
        return function() {
            return Building.apply(this, args.concat(
                Array.prototype.slice.call(arguments)));
        };
    };
    
    var Building = function(image, spriteParams, desiredHeight) {
        this.image = image;
        this.boundingBox = {x: 0, y: 0, w: 0, h: 0};
        
        this.randomiseBuilding = function(desiredHeight) {
            var plan = [];
            
            //roof
            var rand = Math.round(Math.random() * (spriteParams.roof.length-1));
            var sprite = spriteParams.roof[rand];
            plan.push({
                x: 0,
                y: 0,
                sprite: sprite                
            });
            var buildingWidth = sprite.w;
            var buildingHeight = sprite.h;
            
            while(buildingHeight < desiredHeight) {
                //floor
                rand = Math.round(Math.random() * (spriteParams.side.left.length-1));
                sprite = spriteParams.side.left[rand];
                plan.push({
                    x: 0,
                    y: buildingHeight,
                    sprite: sprite                
                });
                
                var leftSize = sprite.w;
                
                rand = Math.round(Math.random() * (spriteParams.side.right.length-1));
                sprite = spriteParams.side.right[rand];
                plan.push({
                    x: buildingWidth - sprite.w,
                    y: buildingHeight,
                    sprite: sprite                
                });
                
                for(var i=0; i<2; i++) {
                    rand = Math.round(Math.random() * (spriteParams.windows.length-1));
                    sprite = spriteParams.windows[rand];
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
            var img = this.image;
            this.plan.forEach(function(block) {
                ctx.drawImage(img, block.sprite.x, block.sprite.y, block.sprite.w, block.sprite.h,
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