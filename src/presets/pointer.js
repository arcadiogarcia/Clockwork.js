// Preset for the Clockwork engine
// Arcadio Garcia Salvadores
var pointerAPI = [
{
    name: "pointerAPI",
    events: [
        {
            name: "#setup", code: function (event) {
                var eventstoken = [];


                var pointers = [];
                this.setVar("pointers", pointers);
                var names = ["pointerdown",
                           "pointerover",
                           "pointerup",
                           "pointerout",
                           "pointercancel",
                           "lostpointercapture",
                           "pointermove",
                           "wheel"];
                for (var i in names) {
                    eventstoken[i] = this.engine.getEngineVar("#DOM").addEventListener(names[i], this.execute_event.bind(this, names[i]), true);
                }

                this.setVar("eventstoken", eventstoken);

                this.setVar("thresholdx", this.engine.getEngineVar("#DOM").width / 10);
                this.setVar("thresholdy", this.engine.getEngineVar("#DOM").height / 10);
                this.setVar("swipex", this.engine.getEngineVar("#DOM").width / 9);
                this.setVar("swipey", this.engine.getEngineVar("#DOM").height / 8);
            }
        },
        {
            name: "#exit", code: function (event) {
                var tokens = this.getVar("eventstoken");
                var names = ["pointerdown",
                           "pointerover",
                           "pointerup",
                           "pointerout",
                           "pointercancel",
                           "lostpointercapture",
                           "pointermove",
                           "wheel"];
                for (var i in names) {
                    this.engine.getEngineVar("#DOM").removeEventListener(names[i], tokens[i]);
                }
            }
        },
        {
            name: "pointerdown", code: function (event) {
                this.getVar("pointers").push({ id: event.pointerId, x: event.clientX, y: event.clientY});
                this.engine.execute_event("pointer_down", { id: event.pointerId, x: event.clientX / this.engine.getEngineVar("#DOM").width, y: event.clientY / this.engine.getEngineVar("#DOM").height });
            }
        },
         {
             name: "pointermove", code: function (event) {
                 var pointer = searchWhere(this.getVar("pointers"), "id", event.pointerId);
                 if (pointer != null) {
                     pointer.lx = pointer.x;
                     pointer.ly = pointer.y;
                     pointer.x = event.clientX;
                     pointer.y = event.clientY;

                         this.engine.execute_event("pointer_move", { id: event.pointerId,x: pointer.x / this.engine.getEngineVar("#DOM").width, y: pointer.y / this.engine.getEngineVar("#DOM").height, lx: pointer.lx / this.engine.getEngineVar("#DOM").width, ly: pointer.ly / this.engine.getEngineVar("#DOM").height });

                 }
             }
         },
         {
             name: "pointerup", code: function (event) {
                 var pointer = searchWhere(this.getVar("pointers"), "id", event.pointerId);
                 if (pointer != null)  {
                     this.engine.execute_event("pointer_up", { id: event.pointerId, x: event.clientX / this.engine.getEngineVar("#DOM").width, y: event.clientY / this.engine.getEngineVar("#DOM").height });
                 }
                 deleteWhere(this.getVar("pointers"), "id", event.pointerId);

             }
         },
         {
             name: "pointerout", code: function (event) {
                 this.execute_event("pointerup",event);
             }
         }

        
    ]
}
];


//These are useful!

function searchWhere(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] == value) {
            return array[i];
        }
    }
    return null;
}

function deleteWhere(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] == value) {
            array.splice(i, 1);
            i--;
        }
    }
    return null;
}