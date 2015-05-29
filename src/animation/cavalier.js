//It executes the 'real' animation engine, but modifying the positions to achieve the cavalier effect


var cavalier = function (animationEngine) {

    var objects = {};

    var angle = Math.PI / 4;
    var xunit = Math.cos(angle);
    var yunit = Math.sin(angle);

    var animationInterface = {};

    animationInterface.setX = function (id, value) {
        objects[id].x = value;
        animationEngine.setX(id, value - objects[id].z * xunit);
    };

    animationInterface.setY = function (id, value) {
        objects[id].y = value;
        animationEngine.setY(id, value + objects[id].z * yunit);
    };

    animationInterface.setZindex = function (id, value) {
        objects[id].z = value;
        animationEngine.setX(id, objects[id].x - objects[id].z * xunit);
        animationEngine.setY(id, objects[id].y + objects[id].z * yunit);
        animationEngine.setZindex(id, value);
    };

    animationInterface.setState = function (id, state) {
        animationEngine.setState(id, state);
    };

    animationInterface.setParameter = function (id, parameter, value) {
        animationEngine.setParameter(id, parameter, value);
    };

    animationInterface.clear = function () {
        animationEngine.clear();
    };

    animationInterface.setCamera = function (x, y) {
        animationEngine.setCamera(x, y);
    };

    animationInterface.addObject = function (spritesheet, state, x, y, zindex, isstatic, doesnottimetravel) {
        var id = animationEngine.addObject(spritesheet, state, x, y, zindex, isstatic, doesnottimetravel);
        objects[id] = { x: x, y: y, z: zindex };
        return id;
    };

    animationInterface.deleteObject = function (id) {
        animationEngine.deleteObject(id);
    };

    animationInterface.moveCameraX = function (x) {
        animationEngine.moveCameraX(x);
    };

    animationInterface.moveCameraY = function (y) {
        animationEngine.moveCameraY(y);
    };

    animationInterface.setCamera = function (x, y) {
        animationEngine.setCamera(x, y);
    };

    animationInterface.setAnglePoint = function (alpha) {
        angle = alpha;
        xunit = Math.cos(angle);
        yunit = Math.sin(angle);
    };

    return animationInterface;
};