// Basic collisions for the Solaria engine
// Arcadio Garcia Salvadores

var SolariaCollisions = SolariaCollisions || {};

SolariaCollisions.pointsAndBoxes = {
    shapes:["point","box"],
    detectors: [
        {
            shape1: "point",
            shape2: "box",
            detector: function (p, b) {
                return (p.x >= b.x && p.y >= b.y && p.x <= b.x + b.w && p.y <= b.y + b.h);
            }
        }
    ]
};
