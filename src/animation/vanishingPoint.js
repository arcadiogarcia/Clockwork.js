//It executes the 'real' animation engine, but modifying the positions to achieve the vanishing point effect


var vanishingPointAnimation = function (animationEngine) {

    var objects = {};

    var vanishingPoint = { x: 0, y: 0, z: 200 };

    var animationInterface = {};

    animationInterface.setX = function (id, value) {
        objects[id].x = value;
        animationEngine.setX(id, value - (vanishingPoint.x - value) * objects[id].z / vanishingPoint.z);
    };

    animationInterface.setY = function (id, value) {
        objects[id].y = value;
        animationEngine.setY(id, value - (vanishingPoint.y - value) * objects[id].z / vanishingPoint.z);
    };

    animationInterface.setZindex = function (id, value) {
        objects[id].z = value;
        animationEngine.setX(id, objects[id].x - (vanishingPoint.x - objects[id].x) * objects[id].z / vanishingPoint.z);
        animationEngine.setY(id, objects[id].y - (vanishingPoint.y - objects[id].y) * objects[id].z / vanishingPoint.z);
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

    animationInterface.setVanishingPoint = function (x, y, z) {
        vanishingPoint.x = x;
        vanishingPoint.y = y;
        vanishingPoint.z = z;
    };

    return animationInterface;
};