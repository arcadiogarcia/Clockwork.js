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
                this.setVar("state", "idle");
                this.setVar("#x",Math.round(Math.random()*600+100));
            }
        },
        {
            name: "keyboard_down", code: function (event) {
               switch(event.key){
                   case 32:
                   this.setVar("state", "bark");
                    this.setVar("timer", 30);
                     this.setVar("#state", "BarkL");
                   break;
                   case 37:
                   this.setVar("state", "left");
                   this.setVar("#state", "RunL");
                   break;
                   case 39:
                   this.setVar("state", "right");
                   this.setVar("#state", "RunR");
                   break;
               }
            }
        },
          {
            name: "keyboard_up", code: function (event) {
               switch(event.key){
                   case 37:
                        this.setVar("#state", "IdleL");
                        this.setVar("state", "idle");
                   break;
                   case 39:
                        this.setVar("#state", "IdleR");
                        this.setVar("state", "idle");
                   break;
               }
            }
        },
		{
            name: "#loop", code: function (event) {
                 switch(this.getVar("state")){
                     case "idle":
                     
                     break;
                     case "left":
                        this.setVar("#x",this.getVar("#x")-4);
                     break;
                     case "right":
                        this.setVar("#x",this.getVar("#x")+4);
                     break;
                     case "bark":
                        if (this.getVar("timer")>0) {
					       this.setVar("timer", this.getVar("timer")-1);
					       if (this.getVar("timer")==0) {
                    	       this.setVar("#state", "IdleL");
					       }
                        }
                     break;
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
