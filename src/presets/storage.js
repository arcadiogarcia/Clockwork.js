// Preset for the Clockwork engine
// Arcadio Garcia Salvadores
var storage = [
{
    name: "storage",
    events: [
        {
            name: "#setup", code: function (event) {
                if (typeof Windows != "undefined") {
                    this.setVar("platform", "Windows");
                    var roamingSettings = Windows.Storage.ApplicationData.current.roamingSettings;
                    if (!roamingSettings.values["HighPriority"]) {

                        var storage = new Windows.Storage.ApplicationDataCompositeValue();
                        roamingSettings.values["HighPriority"] = storage;
                    }
                    this.setVar("storage", roamingSettings.values["HighPriority"]);
                }
            }
        }, 
        {
            name: "putStorage", code: function (event) {
                switch (this.getVar("platform")) {
                    case "Windows":
                        var storage=this.getVar("storage");
                        storage.insert(event.property, event.value);
                        Windows.Storage.ApplicationData.current.roamingSettings.values["HighPriority"] = storage;
                        break;
                    default:
                        localStorage.setItem(event.property, event.value);
                        break;
                }
             }
        },
         {
             name: "getStorage", code: function (event) {
                 switch (this.getVar("platform")) {
                     case "Windows":
                         return this.getVar("storage").lookup(event.property);
                     default:
                         return localStorage.getItem(event.property);
                         break;
                 }
             }
         },
    ]
}
];
