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
        },
        {
            name: "incomingBark", code: function (event) {
                this.engine.execute_event("newmessage");
                var chat=this.engine.addObjectLive("someChatBox","chatBox",event.x,140);
                chat.setVar("$text",event.text);
                chat.setVar("$color",event.color);
            }
        }
    ]
},
{
    name: "chatBox",
    sprite: "text",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("timer", 0);
                this.setVar("ytarget", this.getVar("#y"));
            }
        },
         {
            name: "#loop", code: function (event) {
                if(this.getVar("ytarget")<this.getVar("#y")){
                    this.setVar("#y",this.getVar("#y")-2);
                }
                this.setVar("timer", this.getVar("timer")+1);
                if(this.getVar("timer")>700){
                    
                }
            }
        },
         {
            name: "newmessage", code: function (event) {
                    this.setVar("ytarget",this.getVar("ytarget")-20);
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
                        if(event.shape1id == 1){
                            this.engine.execute_event("bark");
                            this.setVar("bark",true);
                            this.setVar("moveCounter",undefined);
                        }else if(event.shape1id == 0){
                            this.setVar("move",event.data.x);
                            this.setVar("moveCounter",2);
                        }
					}
                }
            }
        },
         {
            name: "#loop", code: function (event) {
                this.setVar("moveCounter",this.getVar("moveCounter")-1);
                if(this.getVar("moveCounter")==0&&!this.getVar("bark")){
                    this.engine.find("playerDog").execute_event("setGoingTo",this.getVar("move")*800-400);
                    this.engine.execute_event("@moveDog", {x:this.getVar("move")*800-400});
                    this.setVar("moveCounter",undefined);
                }
                this.setVar("bark",false);
            }
        },
    ],
    collision: {
        "box": [
            { "x": 0, "y": -0, "w": 800, "h": 400 },
            { "x": 355, "y": 270, "w": 120, "h": 120 },
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
            name: "bark", code: function (event) {
                        if(this.getVar("timer")==0){
                        var name=window.prompt("Write a message","Bark!");
                        if(name!=null){
                            var color="#FFF";
                            switch(this.engine.getEngineVar("dogSkin")){
                                case 1:
                                color="#d09d3a";
                                break;
                                case 2:
                                color="#aa785f";
                                break;
                                case 3:
                                color="#768993";
                                break;
                                case 4:
                                color="#fff";
                                break;
                                case 5:
                                color="#959595";
                                break;
                                case 6:
                                color="#43434a";
                                break;
                                case 7:
                                color="#6c9d80";
                                break;
                                case 8:
                                color="#d68ac6";
                                break;
                                case 9:
                                color="#bfe0ff";
                                break;
                                case 10:
                                color="#b3aa56";
                                break;
                            }
                             this.engine.execute_event("newmessage");
                            var chat=this.engine.addObjectLive("someChatBox","chatBox",this.getVar("#x")+55,this.getVar("#y")-100);
                            chat.setVar("$text",name);
                            chat.setVar("$color",color);
                            this.engine.execute_event("@incomingBark", {x:this.getVar("#x")+55,text:name,color:color});
						this.setVar("#state", "Bark"+this.getVar("lookto"));
						this.setVar("timer", 30);
                        }
                        }
            }
        
         },
		{
            name: "#loop", code: function (event) {
                if(this.getVar("timer")==0){
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
                }else{
                    this.setVar("timer",this.getVar("timer")-1);
                }
               
            }
        }
    ],

    
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
