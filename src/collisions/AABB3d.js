// Basic collisions for the Clockwork engine
// Arcadio Garcia Salvadores

var ClockworkCollisions = ClockworkCollisions || {};

ClockworkCollisions.AABB3d = {
    shapes: ["point", "square", "cube"],
    detectors: [
        {
            shape1: "point",
            shape2: "point",
            detector: function pointPointCollision(p1, p2, data) {
                return p1.x == p2.x && p1.y == p2.y && p1.z == p2.z;
            }
        },
        {
            shape1: "point",
            shape2: "square",
            detector: function pointSquareCollision(p, s, data) {
                switch (s.plane) {
                    case "z":
                        if (p.x >= s.x && p.y >= s.y && p.x <= s.x + s.w && p.y <= s.y + s.h) {
                            data.x = (p.x - s.x) / s.w;
                            data.y = (p.y - s.y) / s.h;
                            data.z = NaN;
                            return true;
                        } else {
                            return false;
                        }
                        break;
                    case "x":
                        if (p.z >= s.z && p.y >= s.y && p.z <= s.z + s.d && p.y <= s.y + s.h) {
                            data.z = (p.z - s.z) / s.d;
                            data.y = (p.y - s.y) / s.h;
                            data.x = NaN;
                            return true;
                        } else {
                            return false;
                        }
                        break;
                    case "y":
                        if (p.x >= s.x && p.z >= s.z && p.x <= s.x + s.w && p.z <= s.z + s.d) {
                            data.x = (p.x - s.x) / s.w;
                            data.z = (p.z - s.z) / s.d;
                            data.y = NaN;
                            return true;
                        } else {
                            return false;
                        }
                        break;
                }

            }
        },
        {
            shape1: "point",
            shape2: "cube",
            detector: function pointCubeCollision(p, c, data) {
                if (p.x >= c.x && p.y >= c.y && p.z >= c.z && p.x <= c.x + c.w && p.y <= c.y + c.h && p.z <= c.z + c.d) {
                    data.x = (p.x - c.x) / c.w;
                    data.y = (p.y - c.y) / c.h
                    data.z = (p.z - c.z) / c.d;
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            shape1: "square",
            shape2: "square",
            detector: function squareSquareCollision(s1, s2, data) {
                if (s1.plane == s2.plane) {
                    switch (s1.plane) {
                        case "z":
                            return !(s1.x + s1.w <= s2.x || s1.y + s1.h <= s2.y || s1.x >= s2.x + s2.w || s1.y >= s2.y + s2.h);
                            break;
                        case "y":
                            return !(s1.x + s1.w <= s2.x || s1.z + s1.d <= s2.z || s1.x >= s2.x + s2.w || s1.z >= s2.z + s2.d);
                            break;
                        case "x":
                            return !(s1.z + s1.d <= s2.z || s1.y + s1.h <= s2.y || s1.z >= s2.z + s2.d || s1.y >= s2.y + s2.h);
                            break;
                    }
                }
                function axisLength(a) {
                    if (a == "x") {
                        return "w";
                    }
                    if (a == "y") {
                        return "h";
                    }
                    if (a == "z") {
                        return "d";
                    }
                }

                var commonAxis = "xyz".replace(s1.plane, "").replace(s2.plane, "");

                return ((s1[s1.plane] >= s2[s1.plane] && s1[s1.plane] <= s2[s1.plane] + s2[axisLength(s1.plane)]) &&
                    (s2[s2.plane] >= s1[s2.plane] && s2[s2.plane] <= s1[s2.plane] + s1[axisLength(s2.plane)]) &&
                    (s1[commonAxis] + s1[axisLength(commonAxis)] >= s2[commonAxis] && s1[commonAxis] + s1[axisLength(commonAxis)] <= s2[commonAxis]));
            }
        },
         {
             shape1: "square",
             shape2: "cube",
             detector: function squareCubeCollision(s, c, data) {
                 var axises = "xyz".replace(s.plane, "");
                 function axisLength(a) {
                     if (a == "x") {
                         return "w";
                     }
                     if (a == "y") {
                         return "h";
                     }
                     if (a == "z") {
                         return "d";
                     }
                 }
                 return !(c[axises[0]] + c[axisLength(axises[0])] <= s[axises[0]] || c[axises[1]] + c[axisLength(axises[1])] <= s[axises[1]] || c[s.plane] + c[axisLength(s.plane)] < s[s.plane] || c[axises[0]] >= s[axises[0]] + s[axisLength(axises[0])] || c[axises[1]] >= s[axises[1]] + s[axisLength(axises[1])] || c[s.plane] > s[s.plane] /*No axis length for the plane*/);
             }
         },
       {
            shape1: "cube",
            shape2: "cube",
            detector: function cubeCubeCollision(c1, c2, data) {
                var x1 = c1.x;
                var y1 = c1.y;
                var z1 = c1.z;
                var x2 = c2.x;
                var y2 = c2.y;
                var z2 = c2.z;
                return !(x1 + c1.w <= x2 ||y1 + c1.h <= y2 || z1 + c1.d <= z2 || x1 >= x2 + c2.w || y1 >= y2 + c2.h || z1 >= z2 + c2.d);
            }
        },
    ]
};
