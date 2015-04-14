// Preset for the Solaria engine
// Arcadio Garcia Salvadores
var basicClickPreset = [
{
    name: "basicMouse",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("listener_click", window.addEventListener("click", (function (that) { return that.execute_event.curry("onclick") })(this), true));
                this.setVar("listener_move", window.addEventListener("move", (function (that) { return that.execute_event.curry("onmove") })(this), true));
            }
        },
        {
            name: "#exit", code: function (event) {
                window.removeEventListener("click", this.getVar("listener_click"));
                window.removeEventListener("move", this.getVar("listener_move"));
            }
        },
        {
            name: "onclick", code: function (event) {
                this.collision["point"][1].x = event.clientX;
                this.collision["point"][1].y = event.clientY;
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
             name: "onmove", code: function (event) {
                 this.collision["point"][0].x = event.clientX;
                 this.collision["point"][0].y = event.clientY;
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
    collisions: {
        "point": [
            //Coordinates of the pointer
            { "x": 0, "y": 0 },
            //Coordinates of the click
            { "x": NaN, "y": NaN }
        ]
    }
}
];
