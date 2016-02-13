// Preset for the Clockwork engine
// Arcadio Garcia Salvadores
var gamePresets = [
    {
        name: "light",
        events: [
            {
                name: "#setup", code: function (event) {
                    this.setVar("light",this.engine.execute_event("addLight", { x: 100, y: 50 })[0]);
                    this.setVar("light2",this.engine.execute_event("addLight", { x: 200, y: 150 })[0]);
                }
            },
            {
                name: "pointer_move", code: function (event) {
                    this.engine.execute_event("setLightPosition", { id: this.getVar("light"), x: event.x * this.engine.getEngineVar("#DOM").width, y: event.y * this.engine.getEngineVar("#DOM").height });
                    this.engine.execute_event("setLightPosition", { id: this.getVar("light2"), x: event.x * this.engine.getEngineVar("#DOM").width+100, y: event.y * this.engine.getEngineVar("#DOM").height+100 });
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
                    this.setVar("$lights", []);
                    this.setVar("wallId", 0);
                    this.setVar("lightId", 0);
                    
                    this.execute_event("addWall",{x0:10, y0:10, x1:790, y1:10});
                    this.execute_event("addWall",{x0:10, y0:390, x1:790, y1:390});
                    this.execute_event("addWall",{x0:10, y0:10, x1:10, y1:390});
                    this.execute_event("addWall",{x0:790, y0:10, x1:790, y1:390});
                    
                    this.execute_event("addWall",{x0:10, y0:10, x1:200, y1:200});
                    this.execute_event("addWall",{x0:200, y0:50, x1:400, y1:250});
                    this.execute_event("addWall",{x0:50, y0:300, x1:300, y1:300});
                    
                    this.execute_event("addWall",{x0:500, y0:10, x1:500, y1:20});
                    this.execute_event("addWall",{x0:500, y0:30, x1:500, y1:40});
                    this.execute_event("addWall",{x0:500, y0:50, x1:500, y1:60});
                    this.execute_event("addWall",{x0:500, y0:70, x1:500, y1:100});
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
                name: "addLight", code: function (event) {
                    event.id = this.getVar("lightId");
                    this.setVar("lightId", event.id+1);
                    this.getVar("$lights").push(event);
                    this.execute_event("updateLights");
                    return event.id;
                }
            },
            {
                name: "setLightPosition", code: function (event) {
                    var l=this.getVar("$lights").filter(function(x){return x.id==event.id;})[0];
                    l.x=event.x;
                    l.y=event.y;
                    this.execute_event("updateLights");                   
                }
            },
            {
                name:"updateLights", code:function(event){
                    var paths=[];
                    var that=this;
                    this.getVar("$lights").forEach(function(l){
                    var angles=[];
                    var walls=that.getVar("$walls")||[];
                    var points=[];
                    walls.forEach(function(x){
                        var a0=Math.atan2(x.y0-l.y,x.x0-l.x);
                        var a1=Math.atan2(x.y1-l.y,x.x1-l.x);
                        angles.push(a0);
                        angles.push(a1);
                        angles.push(a0+0.00000001);
                        angles.push(a0-0.00000001);
                        angles.push(a1+0.00000001);
                        angles.push(a1-0.00000001);
                    });
                    angles.forEach(function(x){
                        var p=walls.map(collideDistance.bind(this, {angle:x,x:l.x,y:l.y})).reduce(function(x,y){return x.d>y.d?y:x;});
                        if(p.d<Infinity){
                            points.push(p);
                        }
                    });
                    points.sort(function(x,y) {return x.angle-y.angle});
                    paths.push(points);
                    
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
                    });
                    this.setVar("$lightpath", paths);
                }
            }
        ]
    }
];
