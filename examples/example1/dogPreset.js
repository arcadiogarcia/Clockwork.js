// Preset for the Solaria engine
// Arcadio Garcia Salvadores
var dog = [
{
    name: "dog",
    sprite: "paradog",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("_state", "Idle");
            }
        },
        {
            name: "collide", code: function (event) {
                if (shape2kind == "point" && shape2id == 1 && solaria.getObject(object).instanceOf("basicMouse")) {
                    this.setVar("_state", "Bark");
                }
            }
        }
    ],
    collisions: {
        "box": [
            { "x": 120, "y": 60 },
        ]
    }
}
];
