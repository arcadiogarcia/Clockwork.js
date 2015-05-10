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
                var animationBuffer=[];
                this.engine.setEngineVar("animationBuffer",animationBuffer);
                this.engine.getEngineVar("socket").on('event', function(data){
                        that.engine.execute_event(data.name, data.args);
                    });
                this.engine.getEngineVar("socket").on('animation', function(data){
                        var animationEngine=that.engine.getAnimationEngine();
                        switch(data.action){
                            case "setX":
                            case "setY":
                                if(animationBuffer[data.id]==undefined){
                                    animationBuffer[data.id]=[];
                                }
                                if(animationBuffer[data.id][data.action]==undefined){
                                    animationBuffer[data.id][data.action]={actual:data.value,last:data.value,actualTime:data.time,intervalHolder:[]};
                                }
                                var buffer=animationBuffer[data.id][data.action];
                                if(buffer.lastMessage==data.value && data.time>buffer.actualTime){
                                    window.clearInterval(buffer.intervalHolder);
                                    animationEngine.local[data.action](data.id,data.value);
                                }else if(data.time>buffer.actualTime){
                                buffer.last=buffer.actual;
                                buffer.lastTime=buffer.actualTime;
                                buffer.actual=data.value;
                                buffer.lastMessage=data.value;
                                buffer.actualTime=data.time;
                                buffer.timeouts=[];
                                var setter=function(data,vel,buffer){
                                    animationEngine.local[data.action](data.id,vel+buffer.actual);
                                    buffer.actual+=vel;
                                };
                                var dt=buffer.actualTime-buffer.lastTime;
                                var dx=buffer.actual-buffer.last;
                                if(dx/dt!=buffer.v){
                                    window.clearInterval(buffer.intervalHolder);
                                    buffer.intervalHolder=(window.setInterval(setter,1000/30,data,dx/dt,buffer));
                                    buffer.v=dx/dt;
                                }
                                }
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
                                animationEngine.local.addObject(data.id,data.spritesheet,data.state,data.state,data.x,data.y,data.zindex,data.isstatic,data.doesnottimetravel);
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
                 if(event.name[0]!="#"&&event.name[0]=="@"){
                    this.engine.getEngineVar("socket").emit('event', {"name":event.name,"args":event.args});
                 }
             }
         }
    ]
}
];
