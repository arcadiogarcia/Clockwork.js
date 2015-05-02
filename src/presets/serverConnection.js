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
                this.engine.getEngineVar("socket").on('connection', function(socket){
                    socket.on('event', function(data){
                        this.engine.execute_event(data.name, data.args);
                    });
                     socket.on('animation', function(data){
                        var animationEngine=this.engine.getAnimationEngine();
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
                 this.engine.getEngineVar("socket").emit('event', {"name":event.name,"args":event.args});
             }
         }
    ]
}
];
