//Solaria engine
//Arcadio Garcia Salvadores

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
    var started = false;

    //The number of pending assets to load
    var loading = 0;

    //The animation engine used
    var animationEngine;

    //Holds the setInterval return value
    var intervalholder;

    var collisions = {};
    collisions.shapes = [];
    collisions.detect = {};

    //A reference to the loader
    solaria.loader;


    //...................................
    //   Engine control
    //...................................


    /**
   *Starts the engine and loads the firt level
   * @param {Number} fps - The frames per second 
   */
    solaria.start = function (fps) {
        fps = fps;
        started = true;
        solaria.loadLevel(0);
    }

    /**
*Starts (or restarts) the engine execution with the data loaded
*
*/
    solaria.setup = function () {
        engine.event = [{ name: "setup" }];
        engine.processEvents();
        engine.event = [];
        engine.checkLoadQueue();
    }

    /**
  *Pauses the execution of the engine
  *
  */
    solaria.pause = function () {
        clearInterval(intervalholder);
    }

    /**
   *Gets the value of a globar variable
   * @param {String} variable - The name of the variable
   */
    solaria.getEngineVar = function (variable) {
        return engine.globalvars[variable];
    }


    /**
 *Sets the value of a globar variable
 @param {String} variable - The name of the variable
 * @param {Object} value - The value of the variable
 */
    solaria.setEngineVar = function (variable, value) {
        engine.globalvars[variable] = value;
    }


    /**
*Gets an object
*@param {Object} variable - The object handler
*/
    solaria.getObject = function (variable) {
        return engine.body[variable];
    }


    /**
*Sets the animation engine
*@param {Object} engine - The animation engine
*/
    solaria.setAnimationEngine = function (engine) {
        animationEngine = engine;
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
            collision: [],
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
        presets.list[name].collision = inheritObject(engine_presets.list[parent].collision);
    }


    function addPresetHandler(name, event, somefunction) {
        presets.list[name].eventfunction[event] = somefunction;
    }

    //Not used anymore, slower and less secure than just addPreset
    //But needed if implementing loading presets from a file != .js
    function addPresetHandlerFromText(name, event, functiontext) {
        try {
            addPresetEvent(name, event, new Function("event", functiontext));
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

    function addPresetCollision(name, type, object) {
        presets.list[name].collision[type].push(object);
    };

    function implementPreset(name, type) {
        var newone = inheritObject(presets.list[type]);
        newone.vars["name"] = name;
        newone.spriteholder = -1;
        return newone;
    };

    /**
     *Loads the presets from a JavaScript object
     * @param {Object} presets - The object holding the presets
     * @param {Function} callback - A callback to be called after the presets are loaded
     */
    solaria.loadPresets = function (presets, callback) {
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

            if (typeof thispreset.collision != "undefined") {
                for (var j = 0; j < collisions.shapes.length; j++) {
                    var thistype = thispreset.collision["collision-" + collisions.shapes[j]];
                    presets.list[thispreset.name].collision[collisions.shapes[j]] = [];
                    for (var k = 0; k < thistype.length; k++) {
                        addPresetCollision(thispreset.name, collisions.shapes[j],thispreset.points[k]);
                    }
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

    /**
    * Loads a level
    * @param {Number} n - The level number
    */
    solaria.loadLevel = function (n) {
        currentLevel = n;
        for (var j in engine.body) {
            objects[j].execute_event("#exit", []);
        }
        setEngineVar("currentlevel", n);
        solaria.pause();
        solaria.loader.show();
        deleteSprites();
        //Just in case?
        animationEngine.clear();
        objects = loadLevelObjects(engine.levels[n]).objects;
        assignSprites();
        solaria.setup();
    };

    /**
 * Loads a level
 * @param {String} name - The level id
 */
    solaria.loadLevelByID = function (name) {
        for (var i = 0; i < engine.levelsnames.length; i++) {
            if (name == engine.levelsnames[i]) {
                engine.loadLevel(i);
                return;
            }
        }
    }


    /**
 * Loads the levels data from a XML file
 * @param {String} url - The url of the .xml
  * @param {Function} callback - A callback function
 */

    solaria.loadLevelsFromXML = function (url, callback) {
        loadXMLFile(url, function (xmlDoc) {
            for (var i = 0; i < xmlDoc.getElementsByTagName("level").length; i++) {
                levels.push(xmlDoc.getElementsByTagName("level")[i]);
                levelsNames.push(xmlDoc.getElementsByTagName("level")[i].getAttributeNode("id").value);
            }
        }, callback);
    };

    function loadLevelObjects(thislevel) {
        var level = {};
        level.objects = [];
        for (var j = 0; j < thislevel.getElementsByTagName("object").length; j++) {
            var thisobject = thislevel.getElementsByTagName("object")[j];
            var object = implementPreset(thisobject.getAttributeNode("name").value, thisobject.getAttributeNode("type").value);
            if (thisobject.getAttributeNode("static") != undefined) {
                if (thisobject.getAttributeNode("static").value == "true") {
                    object.isstatic = true;
                } else {
                    object.isstatic = false;
                }
            } else {
                object.isstatic = false;
            }
            object.vars["_x"] = +thisobject.getAttributeNode("x").value;
            object.vars["_y"] = +thisobject.getAttributeNode("y").value;
            if (thisobject.getAttributeNode("z") != undefined) {
                object.vars["_z"] = +(thisobject.getAttributeNode("z").value);
            } else {
                object.vars["_z"] = 0;
            }
            if (thisobject.getAttributeNode("vars")) {
                addJSONparameters(object.vars, thisobject.getAttributeNode("vars").value);
            }
            level.objects.push(object);
        }
        return level;
    }
    //The load queue is like a semaphore in C!
    //It starts as 0, and it is incremented (wait) for each resource that must be loaded
    //Then it is increased for each loaded resource (signal), and if it is 0 again the engine continues
    //This avoids to start beofre every asset is loaded
    function addLoadQueue  () {
        loading++;
    };
    function removeLoadQueue () {
        loading--;
        checkLoadQueue();
    };
    function checkLoadQueue () {
        if (loading == 0 && started == true) {
            intervalholder = setInterval(loop, Math.round(1000 / fps));
            solaria.loader.hide();
        }
    }

    //...................
    //     Sprites
    //...................

    function assignSprites() {
        animationEngine.setCamera(0, 0);
        for (var i = 0; i < objects.length; i++) {
            if (objects[i].sprite != undefined) {
                if (objects[i].sprite != undefined) {
                    objects[i].spriteholder = animEngine.addObject(objects[i].vars["_sprite"], undefined, objects[i].vars["_x"], objects[i].vars["_y"], objects[i].vars["_z"], objects[i].vars["_isstatic"], objects[i].vars["_doesnottimetravel"]);
                }
            }
        }
    }

    function deleteSprites() {
        for (var i = 0; i < objects.length; i++) {
            if (objects[i].spriteholder != -1) {
                animationEngine.deleteObject(objects[i].spriteholder);
            }
        }
    };

    //......................
    //    Main loop and events
    //......................

    function loop() {

        if (processCollisions() == "#exit") {
            return;
        }

        if (solaria.execute_event("loop") == "#exit") {
            return;
        }


        //animation
        for (var i in objects) {
            if (objects[i].spriteholder != undefined) {
                animationEngine.setX(objects[i].spriteholder, objects[i].vars["_x"]);
                animationEngine.setY(objects[i].spriteholder, objects[i].vars["_y"]);
                animationEngine.setZindex(objects[i].spriteholder, objects[i].vars["_z"]);
            }
        }



    }

    solaria.execute_event = function (name, e_args) {
        for (var i in objects) {
            var body = objects[i];
            if (body.execute_event(name, e_args) == "#exit") {
                return "#exit";
            }
        }

    }

    //..........................
    //     Colisions
    //...........................


    solaria.registerShape = function (shapename) {
        collisions.shapes.push(shapename);
    }

    solaria.registerCollisionDetector = function (shape1, shape2, detector) {
        if(collisions.detect[shape1]==undefined){
            collisions.detect[shape1] = {};
        }
        collisions.detect[shape1][shape2] = detctor;
    }

    function processCollisions() {
        //For every pair of (different) objects
        for (var i = 0; i < objects.length; i++) {
            for (var j = 0; j < objects.length; j++) {
                if (i != j) {
                    var b1 = objects[i];
                    var b2 = objects[j];
                    //For every kind of shape for each object
                    for (var type1 = 0; type1 < collisions.shapes.length; type1++) {
                        for (var type2 = 0; type2 < collisions.shapes.length; type2++) {
                            var shape1 = collisions.shapes[type1];
                            var shape2 = collisions.shapes[type2];
                            //For every shape of that kind in this object
                            for (var k = 0; k < b1.collision[shape1].length; k++) {
                                for (var l = 0; l < b2.collision[shape2].length; l++) {
                                    //Check if they collide
                                    if (collisions.detect[shape1][shape2](b1.collision[shape1][k], b2.collision[shape2][l]) == true) {
                                        //Send the info to the #collide event handlers
                                        if (b1.execute_event("#collide", { object: j, shape1kind: shape1, shape2kind:shape2, shape1id:k, shape2id:l }) == "#exit") {
                                            return "#exit";
                                        }
                                        if (b2.execute_event("#collide", { object: i, shape1kind: shape2, shape2kind: shape1, shape1id: l, shape2id: k }) == "#exit") {
                                            return "#exit";
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return solaria;
});