//It executes the 'real' animation engine, but also sends updates to the proxy


var animationProxy = function (animationEngine,clockwork) {

    var animationInterface = {};

    animationInterface.setX = function (id, value) {
        animationEngine.setX(id, value);
        clockwork.getEngineVar("socket").emit('animation', {"action":"setX","id":id,"value":value});
    };

    animationInterface.setY = function (id, value) {
        animationEngine.setY(id,value);
        clockwork.getEngineVar("socket").emit('animation', {"action":"setY","id":id,"value":value});
    };

    animationInterface.setZindex = function (id, value) {
        animationEngine.setZindex(id,value);
        clockwork.getEngineVar("socket").emit('animation', {"action":"setZindex","id":id,"value":value});
    };

    animationInterface.setState = function (id, state) {
        animationEngine.setState(id,state);
        clockwork.getEngineVar("socket").emit('animation', {"action":"setState","id":id,"state":state});
    };

    animationInterface.setParameter = function (id, parameter, value) {
        animationEngine.setParameter(id,parameter,value);
        clockwork.getEngineVar("socket").emit('animation', {"action":"setParameter","parameter":parameter,"value":value});
    };

    animationInterface.clear = function () {
        animationEngine.clear();
        if(clockwork.getEngineVar("socket")){
            clockwork.getEngineVar("socket").emit('animation', {"action":"clear"});
        }
    };

    animationInterface.setCamera = function (x,y) {
        animationEngine.setCamera(x,y);
        if(clockwork.getEngineVar("socket")){
            clockwork.getEngineVar("socket").emit('animation', {"action":"setCamera","x":x,"y":y});
        }
    };

    animationInterface.addObject = function (spritesheet, state, x, y, zindex, isstatic, doesnottimetravel) {
        var id= animationEngine.addObject(spritesheet, state, x, y, zindex, isstatic, doesnottimetravel);
        clockwork.getEngineVar("socket").emit('animation', {
            "id":id,
            "action":"addObject",
            "spritesheet":spritesheet,
            "state":state,
            "x":x,
            "y":y,
            "zindex":zindex,
            "isstatic":isstatic,
            "doesnottimetravel":doesnottimetravel
            });
    };

    animationInterface.deleteObject = function (id) {
        animationEngine.deleteObject(id);
        clockwork.getEngineVar("socket").emit('animation', {"action":"deleteObject","id":id});
    };
    
    var hashMapID ={};
    
    animationInterface.local = {};
    
     animationInterface.local.setX = function (id, value) {
        animationEngine.setX(hashMapID[id], value);
    };

    animationInterface.local.setY = function (id, value) {
        animationEngine.setY(hashMapID[id],value);
    };

    animationInterface.local.setZindex = function (id, value) {
        animationEngine.setZindex(hashMapID[id],value);
    };

    animationInterface.local.setState = function (id, state) {
        animationEngine.setState(hashMapID[id],state);
    };

    animationInterface.local.setParameter = function (id, parameter, value) {
        animationEngine.setParameter(hashMapID[id],parameter,value);
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
        animationEngine.deleteObject(hashMapID[id]);
    };

    return animationInterface;
};