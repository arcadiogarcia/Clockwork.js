// Preset for the Clockwork engine
// Arcadio Garcia Salvadores


//Developing for Windows10? Check out the preset inside the W10 folder, it uses native storage 
//and syncs between devices, but it includes fallback to localStorage

var storage = [
{
    name: "storage",
    events: [
        {
            name: "putStorage", code: function (event) {
                        localStorage.setItem(event.property, event.value); 
             }
        },
         {
             name: "getStorage", code: function (event) {
                         return localStorage.getItem(event.property);
             }
         },
    ]
}
];
