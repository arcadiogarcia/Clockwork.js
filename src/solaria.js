//Solaria engine
//Arcadio García Salvadores

var Solaria = (function () {
    //This object stores the public functions
    var solaria = {};
    //The list of presets loaded
    var presets = {};
    //The objects in the current level
    var objects = {};
    
    var levels = [];
    var levelsNames = [];
    var currentLevel = 0;

    var fps = 0;

    //The animation engine used
    var animationEngine = new Spritesheet();



    //...................................
    //   Engine control
    //...................................


    /**
   *Starts the engine and loads the firt level
   * @param {Number} fps - The frames per second 
   */
    solaria.start = function (fps) {
        this.fps = fps;
        this.started = true;
        solaria.loadLevel(0);
    }

    //....................
    //     JS Tools
    //....................

    function inheritObject(o) {
        var F = function () { };
        F.prototype = o;
        var nuevo = new F();
        for (var name in o) {
            if (typeof o[name] == 'object') {
                nuevo[name] = inheritObject(o[name]);
            }
        }
        return nuevo;
    }

    Function.prototype.method = function (name, func) {
        this.prototype[name] = func;
        return this;
    };

    Function.method('curry', function () {
        var slice = Array.prototype.slice, args = slice.apply(arguments), that = this;
        return function () {
            return that.apply(null, args.concat(slice.apply(arguments)));
        };
    });

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

    function addJSONparameters(object, string) {
        var temp = JSON.parse(string);
        for (var attrname in temp) {
            object[attrname] = temp[attrname];
        }

    }


    /**
   * @Private
   *@return A XMLHttpRequest object
   */
    function getXMLHttpRequest() {
        if (window.XMLHttpRequest && !(window.ActiveXObject && isFileProtocol)) {
            return new (XMLHttpRequest);
        } else {
            try {
                return new (ActiveXObject)("MSXML2.XMLHTTP.3.0");
            } catch (e) {
                log("browser doesn't support AJAX.");
                return null;
            }
        }
    }


    /**
     * @Private
     *Loads an xml file, runs the parser function and then executes the callback
     * @param {String} url - The url of the xml file
     * @param {Function} parser - The function that will read data from the xml
     * @param {Function} callback - A function that will be executed after the parser has finished
     */
    function loadXMLFile(url, parser, callback) {

        var xmlhttp = getXMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                parser(xmlhttp.responseXML);
                callback();
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send();

    }

    //....................
    //     Logger
    //....................

    /**
     * @Private
     *Sends a mesage to the logger, and it may print it on the console depending on the current value of debugMode
     * @param {String} text - The mesage to log
     * @param {Number} level - The priority level of the message (1 is error, 2 is warning) (see {@link setDebugMode})
     */
    function debugLog(text, level) {
        if ((level || 2) <= enginePrivate.debugMode) {
            console.log(text);
        }
    }

    /**
     *Sets the debug mode, which specifies what kind of log messages should be printed
     * @param {Number} level - The mode to set
     * When mode is set to 0, nothing will be shown in the console
     * When mode is set to 1, only errors will be shown in the console
     * When mode is set to 2, both errors and alerts will be shown in the console
     * The default mode is 2
     */
    solaria.setDebugMode = function (level) {
        enginePrivate.debugMode = level;
    }


  


    //...................
    //      Presets
    //...................


    function createPreset(name) {
        presets[name] = {
            eventfunction: {},
            vars: {},
            boundingbox: [],
            collisionpoint: [],
            setVar: function (variable, value) {
                this.vars[variable] = value;
            },
            getVar: function (variable) {
                return this.vars[variable];
            },
            execute_event: function (name, args) {
                if (this.eventfunction[name] != undefined) {
                    return (this.eventfunction[name].bind(this))(args);
                } else {
                    debugLog("Event handler " + name + " does not exist in " + this.name, 2);
                }
            }
        };
    }

    function inheritPreset(name, parent) {
        presets.list[name] = inheritObject(presets.list[parent]);
        presets.list[name].vars = inheritObject(presets.list[parent].vars);
        presets.list[name].eventfunction = inheritObject(engine_presets.list[parent].eventfunction);
        presets.list[name].boundingbox = inheritObject(engine_presets.list[parent].boundingbox);
        presets.list[name].collisionpoint = inheritObject(engine_presets.list[parent].collisionpoint);
    }


    function addPresetHandler(name, event, somefunction) {
        presets.list[name].eventfunction[event] = somefunction;
    }

    //Not used anymore, slower and less secure than just addPreset
    //But needed if implementing loading presets from a file != .js
    function addPresetHandlerFromText(name, event, functiontext) {
        try {
            addPresetEvent(name,event, new Function("event", functiontext));
        } catch (e) {
            debugLog("Syntax error in object " + name + ", event " + event, 1)
        }
    };

    function addPresetVar(name, variable, value) {
        presets.list[name].vars[variable] = value;
    };

    function setPresetSprite(name, sprite) {
        presets.list[name].sprite = sprite;
    };

    function addPresetPoint(name, x, y) {
        presets.list[name].collisionpoint.push({ x: x, y: y });
    };

    function addPresetBox(name, x, y, w, h) {
        presets.list[name].boundingbox.push({ x: x, y: y, w: w, h: h });
    };

    function implementPreset(name, type) {
        var newone = inheritObject(presets.list[type]);
        newone.vars["name"] = name;
        newone.renderId = -1;
        return newone;
    };

    /**
     *Loads the presets from a JavaScript object
     * @param {Object} presets - The object holding the presets
     * @param {Function} callback - A callback to be called after the presets are loaded
     */
    solaria.loadPresets= function(presets,callback) {
        for (var i = 0; i < presets.length; i++) {
            var thispreset = presets[i];
           
            if (thispreset.inherits != undefined) {
                inheritPreset(thispreset.name, thispreset.inherits);
            } else {
                createPreset(thispreset.name);
            }
            setPresetSprite(thispreset.name, thispreset.sprite);
           

            if (typeof thispreset.vars != "undefined") {
                for (var j = 0; j < thispreset.vars.length; j++) {
                    addPresetVar(thispreset.name, thispreset.vars[j].name, thispreset.vars[j].value);
                }
            }

            if (typeof thispreset.points != "undefined") {
                for (var j = 0; j < thispreset.points.length; j++) {
                    addPresetPoint(thispreset.name, thispreset.points[j].x, thispreset.points[j].y);
                }
            }

            if (typeof thispreset.boxes != "undefined") {
                for (var j = 0; j < thispreset.boxes.length; j++) {
                    addPresetBox(thispreset.name, thispreset.boxes[j].x, thispreset.boxes[j].y, thispreset.boxes[j].w, thispreset.boxes[j].h);
                }
            }

            if (typeof thispreset.events != "undefined") {
                for (var j = 0; j < thispreset.events.length; j++) {
                    addPresetHandler(thispreset.name, thispreset.events[j].name, thispreset.events[j].code);
                }
            }
        }
        //callback
        callback();
    };

    //...................
    //      Levels
    //...................

    function loadLevel(n) {
        currentLevel = n;
        for (var j in engine.body) {
            objects[j].execute_event("_exit", []);
        }
        animationEngine.clear();
        setEngineVar("currentlevel", n);
        pause();
        loader.show();
        deleteSprites();
        objects = loadLevelObjects(engine.levels[n]).objects;
        assignSprites();
        setup();

    };

     function loadLevelObjects(thislevel) {
        var level = {};
        level.objects = [];
        for (var j = 0; j < thislevel.getElementsByTagName("object").length; j++) {
            var thisobject = thislevel.getElementsByTagName("object")[j];
            var object = engine_presets.implement(thisobject.getAttributeNode("name").value, thisobject.getAttributeNode("type").value);
            if (thisobject.getAttributeNode("static") != undefined) {
                if (thisobject.getAttributeNode("static").value == "true") {
                    object.isstatic = true;
                } else {
                    object.isstatic = false;
                }
            } else {
                object.isstatic = false;
            }
            object.x = +thisobject.getAttributeNode("x").value;
            object.y = +thisobject.getAttributeNode("y").value;
            if (thisobject.getAttributeNode("vars")) {
                addJSONparameters(object.vars, thisobject.getAttributeNode("vars").value);
            }
            object.eventqueue = [];
            if (thisobject.getAttributeNode("zindex") != undefined) {
                object.vars.z_index = +(thisobject.getAttributeNode("zindex").value);
            } else {
                object.vars.z_index = 0;
            }
            level.objects.push(object);
        }
        return level;
    }

    return solaria;
});