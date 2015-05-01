// Preset for the Clockwork engine
// Arcadio Garcia Salvadores

//VERY IMPORTANT
//The socket.io client library must also be included!

var serverConnection = [
{
    name: "serverConnection",
    events: [
         {
             name: "#setup", code: function (event) {
                this.setVar("socket",io());
                io.on('connection', function(socket){
                    socket.on('event', function(data){
                        this.engine.execute_event(data.name, data.args);
                    });
                });
             }
         },
          {
             name: "#", code: function (event) {
                 this.getVar("socket").emit('event', {"name":event.name,"args":event.args});
             }
         }
    ]
}
];
