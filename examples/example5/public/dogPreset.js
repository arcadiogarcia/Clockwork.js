// Preset for the Clockwork engine
// Arcadio Garcia Salvadores
var dog = [
{
    name: "dogSpawner",
    events: [
        {
            name: "#setup", code: function (event) {
                var x=Math.round(Math.random()*600+100);
                var dog=this.engine.addObjectLive("playerDog","dog" + this.engine.getEngineVar("dogSkin"),x,240);
                this.engine.getAnimationEngine().setCamera(x-355,0);
            }
        },
         {
            name: "createDog", code: function (event) {
                var dog=this.engine.addObjectLive("remoteDog"+event.id,"dogRemote" + event.skin,event.x,240);
                dog.setVar("id",event.id);
                dog.setVar("$text",event.name);
            }
        }
    ]
},
{
    name: "chatText",
    sprite: "text",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("timer", 0);
            }
        },
         {
            name: "#loop", code: function (event) {
                this.setVar("timer", this.getVar("timer")+1);
                if(this.getVar("timer")>700){
                    
                }
            }
        }
    ]
},
{
    name: "dogController",
    events: [
        {
            name: "#collide", code: function (event) {
                if (event.shape2kind == "point" && this.engine.getObject(event.object).instanceOf("basicMouse")) {
					if(event.shape2id == 1){
                       this.engine.find("playerDog").execute_event("setGoingTo",event.data.x*800-400);
                       this.engine.execute_event("@moveDog", {x:event.data.x*800-400});
					}
                }
            }
        },
    ],
    collision: {
        "box": [
            { "x": 0, "y": -0, "w": 800, "h": 400 },
        ]
    }
},
{
    name: "dog1",
    sprite: "paradog1",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("#state", "IdleL");
				this.setVar("timer", 0);
                this.setVar("goingto", this.getVar("#x"));
                this.setVar("lookto", "L");
                this.setVar("$text",this.engine.getEngineVar("dogName"));
                //this.setVar("$%stream%",true);
                this.engine.execute_event("@createDog", {name:this.engine.getEngineVar("dogName"),skin:this.engine.getEngineVar("dogSkin"),x:this.getVar("#x"),"%keep%":true});
            }
        },
         {
            name: "setGoingTo", code: function (event) {
                this.setVar("goingto", event+this.getVar("#x")-55);
            }
        },
		{
            name: "#loop", code: function (event) {
                 var gt=this.getVar("goingto");
                 var x=this.getVar("#x");
                 if(gt > x+6){
                     this.engine.getAnimationEngine().moveCameraX(6);
                     this.setVar("#x",this.getVar("#x")+6);
                     this.setVar("#state", "RunR");
                     this.setVar("lookto", "R");
                 } else if (gt < x-6){
                     this.engine.getAnimationEngine().moveCameraX(-6);
                     this.setVar("#x",this.getVar("#x")-6);
                     this.setVar("#state", "RunL");
                     this.setVar("lookto", "L");
                 }else{
                     this.setVar("#state", "Idle"+this.getVar("lookto"));
                 }
               
            }
        }
    ]
    
},

{
    name: "dog2",
    sprite: "paradog2",
    inherits:"dog1"
},
{
    name: "dog3",
    sprite: "paradog3",
    inherits:"dog1"
},
{
    name: "dog4",
    sprite: "paradog4",
    inherits:"dog1"
},
{
    name: "dog5",
    sprite: "paradog5",
    inherits:"dog1"
},
{
    name: "dog6",
    sprite: "paradog6",
    inherits:"dog1"
},
{
    name: "dog7",
    sprite: "paradog7",
    inherits:"dog1"
},
{
    name: "dog8",
    sprite: "paradog8",
    inherits:"dog1"
},
{
    name: "dog9",
    sprite: "paradog9",
    inherits:"dog1"
},
{
    name: "dog10",
    sprite: "paradog10",
    inherits:"dog1"
},

{
    name: "dogRemote1",
    sprite: "paradog1",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("goingto", this.getVar("#x"));
                this.setVar("lookto", "L");
            }
        },
         {
            name: "moveDog", code: function (event) {
                if(event.id==this.getVar("id")){
                this.setVar("goingto", event.x+this.getVar("#x")-55);
                }
            }
        },
		{
            name: "#loop", code: function (event) {
                 var gt=this.getVar("goingto");
                 var x=this.getVar("#x");
                 if(gt > x+6){
                     this.setVar("#x",this.getVar("#x")+6);
                     this.setVar("#state", "RunR");
                     this.setVar("lookto", "R");
                 } else if (gt < x-6){
                     this.setVar("#x",this.getVar("#x")-6);
                     this.setVar("#state", "RunL");
                     this.setVar("lookto", "L");
                 }else{
                     this.setVar("#state", "Idle"+this.getVar("lookto"));
                 }
               
            }
        }
    ]
    
},

{
    name: "dogRemote2",
    sprite: "paradog2",
    inherits:"dogRemote1"
},
{
    name: "dogRemote3",
    sprite: "paradog3",
    inherits:"dogRemote1"
},
{
    name: "dogRemote4",
    sprite: "paradog4",
    inherits:"dogRemote1"
},
{
    name: "dogRemote5",
    sprite: "paradog5",
    inherits:"dogRemote1"
},
{
    name: "dogRemote6",
    sprite: "paradog6",
    inherits:"dogRemote1"
},
{
    name: "dogRemote7",
    sprite: "paradog7",
    inherits:"dogRemote1"
},
{
    name: "dogRemote8",
    sprite: "paradog8",
    inherits:"dogRemote1"
},
{
    name: "dogRemote9",
    sprite: "paradog9",
    inherits:"dogRemote1"
},
{
    name: "dogRemote10",
    sprite: "paradog10",
    inherits:"dogRemote1"
},


{
    name: "dog_menu1",
    sprite: "paradog1",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("#state", "IdleL");
				this.setVar("timer", 0);
                this.setVar("$text","");
            }
        },
        {
            name: "#collide", code: function (event) {
                if (event.shape2kind == "point" && this.engine.getObject(event.object).instanceOf("basicMouse")) {
					if(event.shape2id == 1){
                        if(this.getVar("#state")!= "BarkL"){
                        var name=window.prompt("Write your name","Max");
                        if(name!=null){
                        this.engine.setEngineVar("dogName",name);
						this.setVar("#state", "BarkL");
						this.setVar("timer", 14);
                        window.setTimeout(function(that){
                            that.engine.setEngineVar("dogSkin",that.getVar("skin"));
                            that.engine.loadLevel(that.engine.getEngineVar("#currentlevel")+1);
                        },400,this);
                        }
                        }
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
    },
    vars:[
        {"name":"skin","value":1}
    ]
},
{
    name: "dog_menu2",
    sprite: "paradog2",
    inherits:"dog_menu1",
    vars:[
        {"name":"skin","value":2}
    ]
},
{
    name: "dog_menu3",
    sprite: "paradog3",
    inherits:"dog_menu1",
    vars:[
        {"name":"skin","value":3}
    ]
},
{
    name: "dog_menu4",
    sprite: "paradog4",
    inherits:"dog_menu1",
    vars:[
        {"name":"skin","value":4}
    ]
},
{
    name: "dog_menu5",
    sprite: "paradog5",
    inherits:"dog_menu1",
    vars:[
        {"name":"skin","value":5}
    ]
},
{
    name: "dog_menu6",
    sprite: "paradog6",
    inherits:"dog_menu1",
    vars:[
        {"name":"skin","value":6}
    ]
},
{
    name: "dog_menu7",
    sprite: "paradog7",
    inherits:"dog_menu1",
    vars:[
        {"name":"skin","value":7}
    ]
},
{
    name: "dog_menu8",
    sprite: "paradog8",
    inherits:"dog_menu1",
    vars:[
        {"name":"skin","value":8}
    ]
},
{
    name: "dog_menu9",
    sprite: "paradog9",
    inherits:"dog_menu1",
    vars:[
        {"name":"skin","value":9}
    ]
},
{
    name: "dog_menu10",
    sprite: "paradog10",
    inherits:"dog_menu1",
    vars:[
        {"name":"skin","value":10}
    ]
}
];
