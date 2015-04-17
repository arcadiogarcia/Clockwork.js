// Preset for the Clockwork engine
// Arcadio Garcia Salvadores
var gamePresets = [
{
    name: "dog",
    sprite: "paradog",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("#state", "RunR");
                this.setVar("timer", 0);
                this.setVar("vy", 0);
                this.setVar("ay", 0.5);
                this.setVar("alive", true);
            }
        },
        {
            name: "#collide", code: function (event) {
                if (this.getVar("alive") == true) {
                    if (event.shape2kind == "point" && this.engine.getObject(event.object).instanceOf("basicMouse")) {
                        if (event.shape2id == 1) {
                            this.setVar("#state", "BarkR");
                            this.setVar("vy", -8);
                            this.setVar("timer", 28);
                        }
                    }
                }
            }
        },
		{
		    name: "#loop", code: function (event) {
		        if (this.getVar("#x") < 100) {
		            this.setVar("#x", this.getVar("#x") + 5);
		        }
		        if (this.getVar("alive") == true) {
		            if (this.getVar("#y") < 0 || this.getVar("#y") > 400) {
		                this.engine.execute_event("gameover");
		            }
		            if (this.getVar("timer") > 0) {
		                this.setVar("timer", this.getVar("timer") - 1);
		                if (this.getVar("timer") == 0) {
		                    this.setVar("#state", "RunR");
		                }
		            }
		        } else {
		            if (this.getVar("#y") > 420) {
		                this.engine.loadLevelByID("menu");
		            }
		        }
                if (this.getVar("vy")<5) {
                    this.setVar("vy", this.getVar("vy") + this.getVar("ay"));
                }
                this.setVar("#y", this.getVar("#y") + this.getVar("vy"));
            }
		},
        {
            name: "gameover", code: function (event) {
                this.setVar("alive", false);
                this.setVar("vy", 0);
                this.setVar("#state", "ScareR");
            }
        }
    ],
    collision: {
        "box": [
            //All the screen
            { "x": -1000, "y": -1000, "w": 2000, "h": 2000 },
        ],
        "point": [
            //Front
           { "x": 57, "y": 28 },
           //Top
           { "x": 28, "y": 0 },
           //Bottom
           { "x": 28, "y": 57 },
        ]
    }
},
{
    name: "pipe",
    sprite: "pipe",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("#x", 830);
                this.setVar("moving", true);
            }
        },
        {
            name: "#collide", code: function (event) {
                if (this.getVar("moving") == true && event.shape2kind == "point" && this.engine.getObject(event.object).instanceOf("dog")) {
                    this.engine.execute_event("gameover");
                }
            }
        },
        {
            name: "gameover", code: function (event) {
                this.setVar("moving", false);
            }
        },
		{
		    name: "#loop", code: function (event) {
		        if (this.getVar("moving") == true) {
		            this.setVar("#x", this.getVar("#x") - 10);
		            if (this.getVar("#x") < -100) {
		                this.setVar("#x", 830);
		                var y = 195 + Math.random()*150;
		                this.setVar("#y", y);
		                this.engine.execute_event("movepipe", { "y": y });
		                this.engine.execute_event("addpoints", { "points":1 });
		            }
		        }
		    }
		}
    ],
    collision: {
        "box": [
            { "x": 0, "y": 0, "w": 100, "h": 300 },
        ]
    }
},
{
    name: "pipe_reverse",
    inherits: "pipe",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("moving", true);
                this.setVar("#state", "reverse");
                this.setVar("#x", 830);
            }
        },
         {
             name: "movepipe", code: function (event) {
                 this.setVar("#y", event.y - 430);
                 this.setVar("#x", 830);
             }
         },
         {
             name: "#loop", code: function (event) {
                 if (this.getVar("moving") == true) {
                     this.setVar("#x", this.getVar("#x") - 10);
                 }
             }
         }
    ],
    collision: {
        "box": [
            { "x": 0, "y": 0, "w": 100, "h": 300 },
        ]
    }
},
{
    name: "background",
    sprite: "background"
},
{
    name: "static_background",
    inherits: "background",
    events: [
       {
           name: "#setup", code: function (event) {
               this.setVar("#state", "idle");
           }
       }
    ],
},
{
    name: "button",
    sprite: "button",
    events: [
       {
           name: "#collide", code: function (event) {
               if (event.shape2kind == "point" && this.engine.getObject(event.object).instanceOf("basicMouse")) {
                   if(event.shape2id == 1){
                       this.engine.loadLevelByID("game");
                   }
               }
           }
       }
    ],
    collision: {
        "box": [
            { "x": 0, "y": 0, "w": 200, "h": 200 },
        ]
    }
},
{
    name: "score",
    sprite: "text",
    events: [
       {
           name: "#setup", code: function (event) {
               this.setVar("points", 0);
               this.setVar("$text", "Score: " + this.getVar("points"));
               this.setVar("$color", "#F00");
           }
       },
        {
            name: "addpoints", code: function (event) {
                this.setVar("points", this.getVar("points") + event.points);
                this.setVar("$text", "Score: " + this.getVar("points"));
                if (this.getVar("points") >= +(this.engine.find("mystorage").execute_event("getStorage", { "property": "maxscore" }) || 0)) {
                    this.engine.find("mystorage").execute_event("putStorage", { "property": "maxscore", "value": this.getVar("points") });
                    this.setVar("$color", "#0F0");
                }
            }
        }
    ]
},
{
    name: "maxscore",
    sprite: "text",
    events: [
       {
           name: "#setup", code: function (event) {
               this.setVar("$text", "High score: " + (this.engine.find("mystorage").execute_event("getStorage", { "property": "maxscore" }) || 0));
               this.setVar("$color", "#FF0");
           }
       }
    ]
}
];
