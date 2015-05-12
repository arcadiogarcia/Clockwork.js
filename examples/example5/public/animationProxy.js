//It executes the 'real' animation engine, but also sends updates to the proxy


var animationProxy = function (animationEngine,clockwork) {

    var animationInterface = {};

    var sendStopSignal=[];
    
    var objects={};
    
    var time=0;
    
    animationInterface.tick = function (dt) {
        time += dt;   
    };

    animationInterface.setX = function (id, value) {
        animationEngine.setX(id, value);
        if(clockwork.getEngineVar("socket")){
        clockwork.getEngineVar("socket").emit('animation', {"action":"setX","id":id,"value":value,"time":time});
        sendStopSignal[id]=sendStopSignal[id]||{};
        sendStopSignal[id].x=value;
        window.setTimeout(function(id,sendStopSignal,value){
            if(sendStopSignal[id].x==value){
                clockwork.getEngineVar("socket").emit('animation', {"action":"setX","id":id,"value":value,"time":time});
            }
        },50,id,sendStopSignal,value);
        }
    };

    animationInterface.setY = function (id, value) {
        animationEngine.setY(id,value);
        if(clockwork.getEngineVar("socket")){
        clockwork.getEngineVar("socket").emit('animation', {"action":"setY","id":id,"value":value,"time":time});
        sendStopSignal[id]=sendStopSignal[id]||{};
        sendStopSignal[id].y=value;
        window.setTimeout(function(id,sendStopSignal,value){
            if(sendStopSignal[id].y==value){
                clockwork.getEngineVar("socket").emit('animation', {"action":"setX","id":id,"value":value,"time":time});
            }
        },50,id,sendStopSignal,value);
        }
    };

    animationInterface.setZindex = function (id, value) {
        animationEngine.setZindex(id,value);
        if(clockwork.getEngineVar("socket")){
        clockwork.getEngineVar("socket").emit('animation', {"action":"setZindex","id":id,"value":value});
        }
    };

    animationInterface.setState = function (id, state) {
        animationEngine.setState(id,state);
        if(clockwork.getEngineVar("socket")){
        clockwork.getEngineVar("socket").emit('animation', {"action":"setState","id":id,"state":state});
        }
    };

    animationInterface.setParameter = function (id, parameter, value) {
        animationEngine.setParameter(id,parameter,value);
        if(clockwork.getEngineVar("socket")){
             if(parameter=="$%stream%"&&value==true){
        clockwork.getEngineVar("socket").emit('animation', objects[id]);
        }
        clockwork.getEngineVar("socket").emit('animation', {"action":"setParameter","parameter":parameter,"value":value,"id":id});
        }
    };

    animationInterface.clear = function () {
        animationEngine.clear();
        if(clockwork.getEngineVar("socket")){
            //clockwork.getEngineVar("socket").emit('animation', {"action":"clear"});
        }
    };

    animationInterface.setCamera = function (x,y) {
        animationEngine.setCamera(x,y);
        if(clockwork.getEngineVar("socket")){
            //clockwork.getEngineVar("socket").emit('animation', {"action":"setCamera","x":x,"y":y});
        }
    };

    animationInterface.addObject = function (spritesheet, state, x, y, zindex, isstatic, doesnottimetravel) {
        var id= animationEngine.addObject(spritesheet, state, x, y, zindex, isstatic, doesnottimetravel);
        objects[id]={
            "id":id,
            "action":"addObject",
            "spritesheet":spritesheet,
            "state":state,
            "x":x,
            "y":y,
            "zindex":zindex,
            "isstatic":isstatic,
            "doesnottimetravel":doesnottimetravel
            };
            return id;
    };

    animationInterface.deleteObject = function (id) {
        animationEngine.deleteObject(id);
        if(clockwork.getEngineVar("socket")){
        clockwork.getEngineVar("socket").emit('animation', {"action":"deleteObject","id":id});
        }
    };
    
    animationInterface.moveCameraX= function (x) {
            animationEngine.moveCameraX(x);
    };
    
    var hashMapID ={};
    
    animationInterface.local = {};
    
     animationInterface.local.setX = function (id, value) {
         if(hashMapID[id]!=undefined){
        animationEngine.setX(hashMapID[id], value);
         }
    };

    animationInterface.local.setY = function (id, value) {
         if(hashMapID[id]!=undefined){
        animationEngine.setY(hashMapID[id],value);
        }
    };

    animationInterface.local.setZindex = function (id, value) {
         if(hashMapID[id]!=undefined){
        animationEngine.setZindex(hashMapID[id],value);
         }
    };

    animationInterface.local.setState = function (id, state) {
        if(hashMapID[id]!=undefined){
        animationEngine.setState(hashMapID[id],state);
        }
    };

    animationInterface.local.setParameter = function (id, parameter, value) {
        if(hashMapID[id]!=undefined){
        animationEngine.setParameter(hashMapID[id],parameter,value);
        }
    };

    animationInterface.local.clear = function () {
        animationEngine.clear();
    };

    animationInterface.local.setCamera = function (x,y) {
        animationEngine.setCamera(x,y);
    };

    animationInterface.local.addObject = function (id,spritesheet, state, x, y, zindex, isstatic, doesnottimetravel) {
        hashMapID[id]=animationEngine.addObject(spritesheet, state, x, y, zindex, isstatic, doesnottimetravel);
    };

    animationInterface.local.deleteObject = function (id) {
        if(hashMapID[id]!=undefined){
        animationEngine.deleteObject(hashMapID[id]);
        }
    };

    return animationInterface;
};