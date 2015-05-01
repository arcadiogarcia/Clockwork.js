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
        clockwork.getEngineVar("socket").emit('animation', {"action":"clear"});
    };

    animationInterface.setCamera = function (x,y) {
        animationEngine.setCamera(x,y);
        clockwork.getEngineVar("socket").emit('animation', {"action":"setCamera","x":x,"y":y});
    };

    animationInterface.addObject = function (spritesheet, state, x, y, zindex, isstatic, doesnottimetravel) {
        animationEngine.addObject(spritesheet, state, x, y, zindex, isstatic, doesnottimetravel);
        clockwork.getEngineVar("socket").emit('animation', {
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

    return animationInterface;
};