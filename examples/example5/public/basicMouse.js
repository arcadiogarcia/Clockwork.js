// Preset for the Clockwork engine
// Arcadio Garcia Salvadores
var basicClickPreset = [
{
    name: "basicMouse",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("listener_click", this.engine.getEngineVar("#DOM").addEventListener("click", (function (that) { return that.execute_event.curryThis(that,"onclick") })(this), false));
                this.setVar("listener_move", this.engine.getEngineVar("#DOM").addEventListener("mousemove", (function (that) { return that.execute_event.curryThis(that,"onmove") })(this), false));
            }
        },
        {
            name: "#exit", code: function (event) {
                this.engine.getEngineVar("#DOM").removeEventListener("click", this.getVar("listener_click"));
                this.engine.getEngineVar("#DOM").removeEventListener("mousemove", this.getVar("listener_move"));
            }
        },
        {
            name: "onclick", code: function (e) {
                this.collision["point"][1].x = (e.offsetX==undefined?e.layerX:e.offsetX);
                this.collision["point"][1].y = e.offsetY==undefined?e.layerY:e.offsetY;
                if(e.target!=e.currentTarget){
                    this.collision["point"][1].x += e.target.offsetLeft;
                    this.collision["point"][1].y += e.target.offsetTop;
                }
                this.setVar("timer", 1);
                //Warning: This will only work if there is no scaling between the game coordinates and the canvas!
                //If you are using a custom Spritesheet.js renderMode, you will need to do something like this:
                //
                //this.collision["point"][1].x =  e.clientX / window.innerWidth * 1366;
                //this.collision["point"][1].y = (e.clientY - (window.innerHeight - 768 * window.innerWidth / 1366) / 2) * 1366 / window.innerWidth
                //
                // Where 1366x768 is the size of the buffer and the virtual game screens
            }
        },
         {
             name: "onmove", code: function (e) {
                 this.collision["point"][0].x = e.offsetX==undefined?e.layerX:e.offsetX;
                 this.collision["point"][0].y = e.offsetY==undefined?e.layerY:e.offsetY;
                 //Warning: Read the previous warning
             }
         },
         {
             name: "#loop", code: function (event) {
                 //We wait one iteration before deleting the click coordinates
                 if (this.getVar("timer") == 1) {
                     this.setVar("timer", 2);
                 } else if (this.getVar("timer") == 2) {
                     this.collision["point"][1].x = NaN;
                     this.collision["point"][1].y = NaN;
                     this.setVar("timer", 0);
                 }
             }
         }
    ],
    collision: {
        "point": [
            //Coordinates of the pointer
            { "x": 0, "y": 0 },
            //Coordinates of the click
            { "x": NaN, "y": NaN }
        ]
    }
}
];
