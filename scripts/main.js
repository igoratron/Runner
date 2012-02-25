require(["game", "player"], function(Game, Player){
    
    function start() {
        function loadResources() {
            return {
                runner: document.querySelector("#runner")
            };
        }
        
        var res = loadResources();
        
        var player = new Player(res.runner, {
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
            {x: 51, y: 51, w: 49, h: 49, offsetX: 0, offsetY: 7},
            {x: 101, y: 50, w: 49, h: 40, offsetX: 0, offsetY: 9},
            {x: 151, y: 52, w: 47, h: 39, offsetX: 0, offsetY: 7},
            {x: 201, y: 55, w: 49, h: 44, offsetX: 0, offsetY: -5}
        ]
    });
        var game = new Game(player);
    }
    
    window.onload = start;    
});