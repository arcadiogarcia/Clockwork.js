// Preset for the Clockwork engine
// Arcadio Garcia Salvadores

//VERY IMPORTANT
//The socket.io client library must also be included!

var serverConnection = [
{
    name: "serverConnection",
    events: [
         {
             name: "#setup", code: function (event) {
                this.engine.setEngineVar("socket",io());
                var that=this;
                this.engine.getEngineVar("socket").on('event', function(data){
                        that.engine.execute_event(data.name, data.args);
                    });
                this.engine.getEngineVar("socket").on('animation', function(data){
                        var animationEngine=that.engine.getAnimationEngine();
                        switch(data.action){
                            case "setX":
                                animationEngine.local.setX(data.id,data.value);
                                break;
                            case "setY":
                                animationEngine.local.setY(data.id,data.value);
                                break;
                            case "setZindex":
                                animationEngine.local.setZindex(data.id,data.value);
                                break;
                            case "setState":
                                animationEngine.local.setState(data.id,data.state);
                                break;
                            case "setParameter":
                                animationEngine.local.setParameter(data.id,data.parameter,data.value);
                                break;
                            case "clear":
                                animationEngine.local.clear();
                                break;
                            case "setCamera":
                                animationEngine.local.setCamera(data.x,data.y);
                                break;
                            case "addObject":
                                animationEngine.local.addObject(data.id,data.spritesheet,data.spritesheet,data.state,data.x,data.y,data.zindex,data.isstatic,data.doesnottimetravel);
                                break;
                            case "deleteObject":
                                animationEngine.local.deleteObject(data.id);
                                break;
                        }
                    });
             this.engine.loadLevel(this.engine.getEngineVar("#currentlevel")+1);
             }
         }
    ]
},
{
    name: "serverEventHandler",
    events: [
          {
             name: "#", code: function (event) {
                 if(event.name[0]!="#"&&event.name[0]!="@"){
                    this.engine.getEngineVar("socket").emit('event', {"name":event.name,"args":event.args});
                 }
             }
         }
    ]
}
];
