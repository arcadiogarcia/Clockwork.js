//The client-server connection is done using express+socket.io

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Here we can return the game .html file if we are building a web app!
app.get('/', function(req, res){
  res.send('<h1>Clockwork.js server is running!</h1>');
});

http.listen(3000, function(){
  console.log('Clockwork.js listening on *:3000');
});

io.on('connection', function(socket){
    console.log('A clockwork.js client connected');
    socket.on('event', function (data) { 
        ClockworkServer.execute_event(data.name, data.args);
        socket.broadcast.emit('event', data); 
    }); 
     socket.on('animation', function(data){               
       data.id=socket.id+">>>"+data.id;
       data.socketId=socket.id;
       socket.broadcast.emit('animation', data); 
     });
});


var ClockworkServer = Clockwork();
ClockworkServer.setAnimationEngine((function (clockwork) {

    var animationInterface = {};
    var maxid=0;
  
    animationInterface.setX = function (id, value) {
        clockwork.getEngineVar("socket").emit('animation', {"action":"setX","id":id,"value":value});
    };

    animationInterface.setY = function (id, value) {
        clockwork.getEngineVar("socket").emit('animation', {"action":"setY","id":id,"value":value});
    };

    animationInterface.setZindex = function (id, value) {
        clockwork.getEngineVar("socket").emit('animation', {"action":"setZindex","id":id,"value":value});
    };

    animationInterface.setState = function (id, state) {
        clockwork.getEngineVar("socket").emit('animation', {"action":"setState","id":id,"state":state});
    };

    animationInterface.setParameter = function (id, parameter, value) {
        clockwork.getEngineVar("socket").emit('animation', {"action":"setParameter","parameter":parameter,"value":value});
    };

    animationInterface.clear = function () {
        clockwork.getEngineVar("socket").emit('animation', {"action":"clear"});
    };

    animationInterface.setCamera = function (x,y) {
        clockwork.getEngineVar("socket").emit('animation', {"action":"setCamera","x":x,"y":y});
    };

    animationInterface.addObject = function (spritesheet, state, x, y, zindex, isstatic, doesnottimetravel) {
        var id= maxid++;
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
        clockwork.getEngineVar("socket").emit('animation', {"action":"deleteObject","id":id});
    };
    
})(ClockworkServer));