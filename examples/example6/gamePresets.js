// Preset for the Clockwork engine
// Arcadio Garcia Salvadores
var gamePresets = [
    {
        name: "light",
        events: [
            {
                name: "#setup", code: function (event) {
                    this.engine.execute_event("setLightPosition", { x: 100, y: 100 });
                }
            },
            {
                name: "pointer_move", code: function (event) {
                    this.engine.execute_event("setLightPosition", { x: event.x * this.engine.getEngineVar("#DOM").width, y: event.y * this.engine.getEngineVar("#DOM").height });
                }
            }
        ]
    },
    {
        name: "lightSystem",
        sprite: "light",
        events: [
            {
                name: "#setup", code: function (event) {
                    this.setVar("$walls", []);
                    this.setVar("wallId", 0);
                    
                    this.execute_event("addWall",{x0:0, y0:0, x1:800, y1:0});
                    this.execute_event("addWall",{x0:0, y0:400, x1:800, y1:400});
                    this.execute_event("addWall",{x0:0, y0:0, x1:0, y1:400});
                    this.execute_event("addWall",{x0:800, y0:0, x1:800, y1:400});
                    
                    this.execute_event("addWall",{x0:10, y0:10, x1:200, y1:200});
                    this.execute_event("addWall",{x0:200, y0:50, x1:400, y1:250});
                    this.execute_event("addWall",{x0:50, y0:300, x1:300, y1:300});
                }
            },
            {
                name: "addWall", code: function (event) {
                    event.id = this.getVar("wallId");
                    this.setVar("wallId", event.id+1);
                    this.getVar("$walls").push(event);
                    return event.id;
                }
            },
            {
                name: "removeWall", code: function (event) {
                    this.setVar("$walls",this.getVar("$walls").filter(function(x){return x.id!=event;}));
                }
            },
            {
                name: "setLightPosition", code: function (event) {
                    this.setVar("$x", event.x);
                    this.setVar("$y", event.y);
                    var angles=[];
                    var walls=this.getVar("$walls")||[];
                    var points=[];
                    walls.forEach(function(x){
                        var a0=Math.atan2(x.y0-event.y,x.x0-event.x);
                        var a1=Math.atan2(x.y1-event.y,x.x1-event.x);
                        angles.push(a0);
                        angles.push(a1);
                        angles.push(a0+0.00000001);
                        angles.push(a0-0.00000001);
                        angles.push(a1+0.00000001);
                        angles.push(a1-0.00000001);
                        // points.push({x:x.x0,y:x.y0,angle:a0});
                        // points.push({x:x.x1,y:x.y1,angle:a1});
                    });
                    angles.forEach(function(x){
                        var p=walls.map(collideDistance.bind(this, {angle:x,x:event.x,y:event.y})).reduce(function(x,y){return x.d>y.d?y:x;});
                        if(p.d<Infinity){
                            points.push(p);
                        }
                    });
                    points.sort(function(x,y) {return x.angle-y.angle});
                    this.setVar("$lightpath", points);
                    
                    function collideDistance(ray, segment){
                        ray.dx=Math.cos(ray.angle);
                        ray.dy=Math.sin(ray.angle);
                        segment.dx=segment.x1-segment.x0;
                        segment.dy=segment.y1-segment.y0;
                        var T2 = (ray.dx*(segment.y0-ray.y) + ray.dy*(ray.x-segment.x0))/(segment.dx*ray.dy - segment.dy*ray.dx);
                        var T1 = (segment.x0+segment.dx*T2-ray.x)/ray.dx;
                        if(T1>0 && T2>0 && T2<1){
                            return {d:T1, x:ray.x+T1*ray.dx,y:ray.y+T1*ray.dy,angle:ray.angle};
                        }else {
                            return {d:Infinity};
                        }
                    }
                }
            },
        ]
    }
];
