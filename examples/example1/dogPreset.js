// Preset for the Clockwork engine
// Arcadio Garcia Salvadores
var dog = [
{
    name: "dog",
    sprite: "paradog",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("#state", "IdleL");
				this.setVar("timer", 0);
            }
        },
        {
            name: "#collide", code: function (event) {
                if (event.shape2kind == "point" && this.engine.getObject(event.object).instanceOf("basicMouse")) {
					if(event.shape2id == 1){
						this.setVar("#state", "BarkL");
						this.setVar("timer", 14);
					}
					if(event.shape2id == 0 && this.getVar("timer")==0){
						this.setVar("#state", "SeeUL");
						this.setVar("timer", 14);
					}
                }
            }
        },
		{
            name: "#loop", code: function (event) {
                if (this.getVar("timer")>0) {
					this.setVar("timer", this.getVar("timer")-1);
					if (this.getVar("timer")==0) {
                    	this.setVar("#state", "IdleL");
					}
                }
            }
        }
    ],
    collision: {
        "box": [
            { "x": 0, "y": 0, "w": 120, "h": 120 },
        ]
    }
}
];
