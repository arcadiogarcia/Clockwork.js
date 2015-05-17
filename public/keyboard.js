// Preset for the Clockwork engine
// Arcadio Garcia Salvadores
var keyboard = [
{
    name: "keyboard",
    events: [
        {
            name: "#setup", code: function (event) {
                var names = ["keyup", "keydown"];
                var tokens = [];

                for (var i in names) {
                    tokens[i] = this.execute_event.bind(this, names[i]);
                    window.addEventListener(names[i], tokens[i], false);
                }
                this.setVar("eventstoken", tokens);
            }
        },
        {
            name: "#exit", code: function (event) {
                   var tokens = this.getVar("eventstoken");
                   var names = ["keyup", "keydown"];
                   for (var i in names) {
                       window.removeEventListener(names[i], tokens[i], false);
                   }
            }
        },
        {
              name: "keydown", code: function (event) {
                  this.engine.execute_event("keyboard_down",  { key: event.keyCode } );

              }
          },
          {
              name: "keyup", code: function (event) {
                  this.engine.execute_event( "keyboard_up", { key: event.keyCode } );
              }
          }
    ]
}
];
