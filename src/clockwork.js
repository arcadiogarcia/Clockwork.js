//Clockwork engine
//Arcadio Garcia Salvadores
/**
*@class
*/
var Clockwork = (function () {
    /**This object stores the public functions*/
    var clockwork = this;
    //The list of presets loaded
    var presets = {};
    //The array of objects in the current level
    var objects = [];
    //The engine global variables
    var globalvars = {};

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

    var collisionCache = [];

    function isEmpty(x) {
        for (var k in x) {
            return false;
        }
        return true;
    }

    //The algorithm used to when detecting the collisions
    var collisionAlgorithm = function (objects, calculate) {
        var moved = [];
        for (var i = 0; i < objects.length; i++) {
            if (objects[i] != undefined && !isEmpty(objects[i].collision)) {
                moved[i] = objects[i].vars["#moveflag"];
                objects[i].vars["#moveflag"] = false;
                if (collisionCache[i] === undefined) {
                    collisionCache[i] = [];
                }
                var thisCache = collisionCache[i];
                for (var j = 0; j < objects.length; j++) {
                    var secondObject = objects[j];
                    if (i != j && objects[j] != undefined && !isEmpty(objects[j].collision) && objects[i] != undefined) {
                        if (!(moved[i] == false && (moved[j] || objects[j].vars["#moveflag"]) == false)) {
                            thisCache[j] = calculate(i, j);
                            if (thisCache[j] == "#exit") {
                                return "#exit";
                            }
                        } else {
                            var cache = thisCache[j];
                            for (var k = 0; k < cache.length; k++) {
                                if (objects[i].execute_event("#collide", cache[k].a) == "#exit") {
                                    return "#exit";
                                }
                                if (objects[j].execute_event("#collide", cache[k].b) == "#exit") {
                                    return "#exit";
                                }
                            }
                        }
                    }
                }
            }
        }

    };

    //A reference to the loader
    clockwork.loader;

    this.setLoader = function (loader) {
        clockwork.loader = loader;
    }

    var debugMode = 1;


    //...................................
    //   Engine control
    //...................................


    /**
   *Starts the engine and loads the firt level
   * @param {Number} fps - The frames per second 
   *@public
   */
    this.start = function (newfps, DOMelement) {
        fps = newfps;
        started = true;
        this.setEngineVar("#DOM", DOMelement);
        clockwork.loadLevel(0);
    };

    /**
*Starts (or restarts) the engine execution with the data loaded
*
*/
    this.setup = function () {
        clockwork.execute_event("#setup");
        checkLoadQueue();
    };

    /**
  *Pauses the execution of the engine
  *
  */
    this.pause = function () {
        clearInterval(intervalholder);
    };

    /**
   *Gets the value of a global variable
   * @param {String} variable - The name of the variable
   */
    this.getEngineVar = function (variable) {
        return globalvars[variable];
    };


    /**
 *Sets the value of a globar variable
 *@param {String} variable - The name of the variable
 * @param {Object} value - The value of the variable
 */
    this.setEngineVar = function (variable, value) {
        globalvars[variable] = value;
    };


    /**
*Gets an object
*@param {Object} variable - The object handler
*/
    this.getObject = function (variable) {
        return objects[variable];
    };

    /**
*Gets an object
*@param {Object} variable - The object name
*/
    this.find = function (variable) {
        return searchWhereDeep(objects, ["vars", "name"], variable);
    };

    /**
*Sets the animation engine
*@param {Object} engine - The animation engine
*/
    this.setAnimationEngine = function (engine) {
        animationEngine = engine;
    };


    /**
  *Gets the animation engine
  *@return {Object} engine - The animation engine
  */
    this.getAnimationEngine = function () {
        return animationEngine;
    };



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

    Function.method('curryThis', function () {
        var slice = Array.prototype.slice, args = slice.apply(arguments), that = this;
        var caller = args.splice(0, 1)[0];
        return function () {
            return that.apply(caller, args.concat(slice.apply(arguments)));
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

    function searchWhereDeep(array, keys, value) {
        for (var i = 0; i < array.length; i++) {
            var object = array[i];
            for (var j = 0; j < keys.length; j++) {
                if (typeof object == "undefined") {
                    continue;
                }
                object = object[keys[j]];
            }
            if (object == value) {
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
   * 
   *@return A XMLHttpRequest object
   *@Private
   */
    function getXMLHttpRequest() {
        if (window.XMLHttpRequest && !(window.ActiveXObject && isFileProtocol)) {
            return new (XMLHttpRequest);
        } else {
            try {
                return new (ActiveXObject)("MSXML2.XMLHTTP.3.0");
            } catch (e) {
                debugLog("browser doesn't support AJAX.");
                return null;
            }
        }
    }


    /**
     * 
     *Loads an xml file, runs the parser function and then executes the callback
     * @param {String} url - The url of the xml file
     * @param {Function} parser - The function that will read data from the xml
     * @param {Function} callback - A function that will be executed after the parser has finished
     * @Private
     *
     */
    function loadXMLFile(url, parser, callback) {

        var xmlhttp = getXMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                parser(xmlhttp.responseXML);
                callback();
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();

    }

    function cloneObject(o) {
        return JSON.parse(JSON.stringify(o));
    }

    //....................
    //     Logger
    //....................

    /**
     * 
     *Sends a mesage to the logger, and it may print it on the console depending on the current value of debugMode
     * @param {String} text - The mesage to log
     * @param {Number} level - The priority level of the message (1 is error, 2 is warning) (see {@link setDebugMode})
     *@Private
     */
    function debugLog(text, level) {
        if ((level || 2) <= debugMode) {
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
    this.setDebugMode = function (level) {
        debugMode = level;
    }





    //...................
    //      Presets
    //...................


    function createPreset(name) {
        presets[name] = {
            eventfunction: {},
            vars: {},
            name: name,
            engine: clockwork,
            collision: {},
            setVar: function (variable, value) {
                switch (variable) {
                    case "#x":
                        this.vars["#moveflag"] = true;
                        if (this.spriteholder != undefined) {
                            animationEngine.setX(this.spriteholder, value);
                        }
                        for (var shape in this.collision) {
                            var shapesBody = this.collision[shape];
                            for (var k = 0; k < shapesBody.length; k++) {
                                shapesBody[k].x += value - (this.vars["#x"] || 0);
                            }
                        }
                        break;
                    case "#y":
                        this.vars["#moveflag"] = true;
                        if (this.spriteholder != undefined) {
                            animationEngine.setY(this.spriteholder, value);
                        }
                        for (var shape in this.collision) {
                            var shapesBody = this.collision[shape];
                            for (var k = 0; k < shapesBody.length; k++) {
                                shapesBody[k].y += value - (this.vars["#y"] || 0);
                            }
                        }
                        break;
                    case "#z":
                        this.vars["#moveflag"] = true;
                        if (this.spriteholder != undefined) {
                            animationEngine.setZindex(this.spriteholder, value);
                        }
                        for (var shape in this.collision) {
                            var shapesBody = this.collision[shape];
                            for (var k = 0; k < shapesBody.length; k++) {
                                shapesBody[k].z += value - (this.vars["#z"] || 0);
                            }
                        }
                        break;
                    case "#state":
                        if (this.spriteholder != undefined) {
                            animationEngine.setState(this.spriteholder, value);
                        }
                        break;
                    default:
                        if (variable[0] == "$" && this.spriteholder != undefined) {
                            animationEngine.setParameter(this.spriteholder, variable, value);
                        }
                        break;
                }
                this.vars[variable] = value;
            },
            getVar: function (variable) {
                return this.vars[variable];
            },
            setCollider: function (tag, value) {
                for (var shape in this.collision) {
                    var shapesBody = this.collision[shape];
                    for (k = 0; k < shapesBody.length; k++) {
                        if (shapesBody[k]["#tag"] == tag) {
                            shapesBody[k] = value;
                            shapesBody[k].x += this.vars["#x"];
                            shapesBody[k].y += this.vars["#y"];
                            shapesBody[k]["#tag"] = tag;
                        }
                    }
                }
            },
            execute_event: function (name, args) {
                if (this.eventfunction[name] != undefined) {
                    return this.eventfunction[name].call(this, args);
                } else {
                    debugLog("Event handler " + name + " does not exist in " + this.name, 2);
                }
            },
            instanceOf: function (name) {
                if (this.name == name) {
                    return true;
                }
                if (this.prototypes != undefined) {
                    for (var i = 0; i < this.prototypes.length; i++) {
                        if (this.prototypes[i].name == name) {
                            return true;
                        }
                        if (this.prototypes[i].instanceOf != undefined) {
                            if (this.prototypes[i].instanceOf(name) == true) {
                                return true;
                            }
                        }

                    }
                }
                if (this.prototype != undefined && this.prototype.instanceOf != undefined) {
                    return this.prototype.instanceOf(name);
                }
                return false;
            },
            //Mark as dirty
            collisionChanged: function (name) {
                this.vars["#moveflag"] = true;
            },
            getVarKeys:function(){
                var keys=[];
                for(var k in this.vars){
                    keys.push(k);
                }
                return keys;
            }
        };
    }

    function inheritPreset(name, parent) {
        presets[name] = inheritObject(presets[parent]);
        presets[name].name = name;
        presets[name].prototypes = [presets[parent]];
        presets[name].vars = inheritObject(presets[parent].vars);
        presets[name].eventfunction = inheritObject(presets[parent].eventfunction);
        presets[name].collision = inheritObject(presets[parent].collision);
    }

    function inheritMultiplePresets(name, parents) {
        var parentsPresets = parents.map(function (x) { return presets[x]; });
        createPreset(name);
        presets[name].prototypes = parentsPresets;
        for (var i = 0; i < parentsPresets.length; i++) {
            if (parentsPresets[i].sprite) {
                presets[name].sprite = parentsPresets[i].sprite;
            }
        }
        presets[name].vars = parentsPresets.reduce(function (previousValue, currentValue, index, array) {
            for (var attrname in currentValue.vars) { previousValue[attrname] = currentValue.vars[attrname]; }
            return previousValue;
        }, {});
        presets[name].collision = parentsPresets.reduce(function (previousValue, currentValue, index, array) {
            for (var attrname in currentValue.collision) {
                previousValue[attrname] = previousValue[attrname] || [];
                previousValue[attrname] = previousValue[attrname].concat(currentValue.collision[attrname]);
            }
            return previousValue;
        }, {});
        presets[name].eventfunctionArray = parentsPresets.reduce(function (previousValue, currentValue, index, array) {
            for (var attrname in currentValue.eventfunction) {
                previousValue[attrname] = previousValue[attrname] || [];
                previousValue[attrname].push(currentValue.eventfunction[attrname]);
            }
            return previousValue;
        }, {});
        for (key in presets[name].eventfunctionArray) {
            var functionArray = presets[name].eventfunctionArray[key];
            presets[name].eventfunction[key] = (function (functionArray) {
                return function (args) {
                    for (var i = 0; i < functionArray.length; i++) {
                        functionArray[i].call(this, args);
                    };
                };
            })(functionArray);
        }
    }



    function addPresetHandler(name, event, somefunction) {
        if (presets[name].eventfunctionArray && presets[name].eventfunctionArray[event]) {
            var functionArray = presets[name].eventfunctionArray[event];
            functionArray.push(somefunction);
            presets[name].eventfunction[event] = (function (functionArray) {
                return function (args) {
                    for (var i = 0; i < functionArray.length; i++) {
                        functionArray[i].call(this, args);
                    };
                };
            })(functionArray);
        } else {
            presets[name].eventfunction[event] = somefunction;
        }
    }


    function addPresetVar(name, variable, value) {
        presets[name].vars[variable] = value;
    };

    function setPresetSprite(name, sprite) {
        presets[name].sprite = sprite;
    };

    function addPresetCollision(name, type, object) {
        presets[name].collision[type].push(object);
    };

    function implementPreset(name, type) {
        var newone = inheritObject(presets[type]);
        newone.vars["name"] = name;
        newone.spriteholder = undefined;
        return newone;
    };

    function implementMultiplePresets(name, types) {
        inheritMultiplePresets("@dynamic_" + name, types);
        var newone = inheritObject(presets["@dynamic_" + name]);
        newone.vars["name"] = name;
        newone.spriteholder = undefined;
        return newone;
    };


    /**
     *Loads the presets from a JavaScript object
     * @param {Object} presets - The object holding the presets
     */
    this.loadPresets = function (newpresets) {
        for (var i = 0; i < newpresets.length; i++) {
            var thispreset = newpresets[i];

            if (thispreset.inherits != undefined) {
                if (thispreset.inherits instanceof Array) {
                    inheritMultiplePresets(thispreset.name, thispreset.inherits);
                } else {
                    inheritPreset(thispreset.name, thispreset.inherits);
                }
            } else {
                createPreset(thispreset.name);
            }
            if (thispreset.sprite != undefined) {
                setPresetSprite(thispreset.name, thispreset.sprite);
            }


            if (typeof thispreset.vars != "undefined") {
                for (var j = 0; j < thispreset.vars.length; j++) {
                    addPresetVar(thispreset.name, thispreset.vars[j].name, thispreset.vars[j].value);
                }
            }

            if (typeof thispreset.collision != "undefined") {
                for (var j = 0; j < collisions.shapes.length; j++) {
                    var thistype = thispreset.collision[collisions.shapes[j]];
                    if (thistype != undefined) {
                        presets[thispreset.name].collision[collisions.shapes[j]] = [];
                        for (var k = 0; k < thistype.length; k++) {
                            addPresetCollision(thispreset.name, collisions.shapes[j], thistype[k]);
                        }
                    }
                }
            }


            if (typeof thispreset.events != "undefined") {
                for (var j = 0; j < thispreset.events.length; j++) {
                    addPresetHandler(thispreset.name, thispreset.events[j].name, thispreset.events[j].code);
                }
            }
        }
    };

    //...................
    //      Levels
    //...................

    /**
    * Loads an object when the level is already loaded
    * @param {String} kind - The preset used
    * @param {String} name - The name of the new object
    * @returns The object
    */
    this.addObjectLive = function (name, kind, x, y, z, isStatic, timeTravels, vars) {
        var object = implementPreset(name, kind);
        object.setVar("#x", x || 0);
        object.setVar("#y", y || 0);
        object.setVar("#z", z || 0);
        if (object.sprite != undefined) {
            object.spriteholder = animationEngine.addObject(object.sprite, object.getVar("#state"), x || 0, y || 0, z || 0, isStatic || false, timeTravels || false);
        }
        for (var name in vars) {
            object.setVar(name, vars[name]);
        }
        object.execute_event("#setup");
        objects.push(object);
        return object;
    }




    this.deleteObjectLive = function (object) {
        object.execute_event("#exit", []);
        animationEngine.deleteObject(object.spriteholder);
        for (var i = 0; i < objects.length; i++) {
            if (objects[i] == object) {
                objects[i] = undefined;
            }
        }
    }

    this.listObjects = function () {
        return objects.map(function(x){return x.getVar("#name")});
    }

    /**
    * Loads a level
    * @param {Number} n - The level number
    */
    this.loadLevel = function (n) {
        currentLevel = n;
        for (var j = 0; j < objects.length; j++) {
            if (objects[j] != null) {
                objects[j].execute_event("#exit", []);
            }
        }
        clockwork.setEngineVar("#currentlevel", n);
        clockwork.pause();
        if (clockwork.loader) {
            clockwork.loader.show();
        }
        setTimeout(function () {
            deleteSprites();
            //Just in case?
            animationEngine.clear();
            objects = loadLevelObjects(levels[n]).objects;
            assignSprites();
            clockwork.setup();
        }, 5);
    };

    /**
    * Loads a level
    * @param {String} name - The level id
    */
    this.loadLevelByID = function (name) {
        for (var i = 0; i < levelsNames.length; i++) {
            if (name == levelsNames[i]) {
                clockwork.loadLevel(i);
                return;
            }
        }
    };


    /**
    * Loads the levels data from a XML file
    * @param {String} url - The url of the .xml
    * @param {Function} callback - A callback function
    */

    this.loadLevelsFromXML = function (url, callback) {
        loadXMLFile(url, function (xmlDoc) {
            for (var i = 0; i < xmlDoc.getElementsByTagName("level").length; i++) {
                levels.push(xmlDoc.getElementsByTagName("level")[i]);
                levelsNames.push(xmlDoc.getElementsByTagName("level")[i].getAttributeNode("id").value);
            }
        }, callback);
    };

    /**
   * Loads the levels data from a XML string
   * @param {String} data - The xml string
   * @param {Function} callback - A callback function
   * @param {String array} names- Names to be used for the levels
   */

    this.loadLevelsFromXMLString = function (data, callback, names) {
        var xmlDoc = (new DOMParser()).parseFromString(data, "text/xml");
        names = names || [];
        for (var i = 0; i < xmlDoc.getElementsByTagName("level").length; i++) {
            levels.push(xmlDoc.getElementsByTagName("level")[i]);
            levelsNames.push(names[i] || xmlDoc.getElementsByTagName("level")[i].getAttributeNode("id").value);
        }
        callback();
    };

    function loadLevelObjects(thislevel) {
        var level = {};
        level.objects = [];
        for (var j = 0; j < thislevel.getElementsByTagName("object").length; j++) {
            var thisobject = thislevel.getElementsByTagName("object")[j];
            var object;
            if (thisobject.getElementsByTagName("type").length > 0) {
                var names = [];
                for (var k = 0; k < thisobject.getElementsByTagName("type").length; k++) {
                    names.push(thisobject.getElementsByTagName("type")[k].getAttributeNode("id").value);
                }
                object = implementMultiplePresets(thisobject.getAttributeNode("name").value, names);
            } else {
                object = implementPreset(thisobject.getAttributeNode("name").value, thisobject.getAttributeNode("type").value);
            }
            if (thisobject.getAttributeNode("spritesheet") != undefined) {
                object.sprite = thisobject.getAttributeNode("spritesheet").value;
            }
            if (thisobject.getAttributeNode("static") != undefined) {
                if (thisobject.getAttributeNode("static").value == "true") {
                    object.isstatic = true;
                } else {
                    object.isstatic = false;
                }
            } else {
                object.isstatic = false;
            }
            object.setVar("#x", +thisobject.getAttributeNode("x").value);
            object.setVar("#y", +thisobject.getAttributeNode("y").value);
            if (thisobject.getAttributeNode("z") != undefined) {
                object.setVar("#z", +(thisobject.getAttributeNode("z").value));
            } else {
                object.setVar("#z", 0);
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
    function addLoadQueue() {
        loading++;
    };
    function removeLoadQueue() {
        loading--;
        checkLoadQueue();
    };
    function checkLoadQueue() {
        if (loading == 0 && started == true) {
            intervalholder = setInterval(loop, Math.round(1000 / fps));
            if (clockwork.loader) {
                clockwork.loader.hide();
            }
        }
    }

    /**
    *Gets an object using its handler
    *@param {Object} i - The handler
    * @returns The object
    */
    this.getObject = function (i) {
        return objects[i];
    };
    //...................
    //     Sprites
    //...................

    function assignSprites() {
        animationEngine.setCamera(0, 0);
        for (var i = 0; i < objects.length; i++) {
            if (objects[i].sprite != undefined) {
                if (objects[i].sprite != undefined) {
                    objects[i].spriteholder = animationEngine.addObject(objects[i].sprite, undefined, objects[i].vars["#x"], objects[i].vars["#y"], objects[i].vars["#z"], objects[i].isstatic, objects[i].doesnottimetravel);
                }
            }
        }
    }

    function deleteSprites() {
        for (var i = 0; i < objects.length; i++) {
            if (objects[i] != undefined && objects[i].spriteholder != -1) {
                animationEngine.deleteObject(objects[i].spriteholder);
            }
        }
    };

    //......................
    //    Main loop and events
    //......................

    function loop() {

        if (animationEngine.tick != undefined) {
            animationEngine.tick(1000 / fps);
        }

        if (processCollisions() == "#exit") {
            return;
        }

        if (clockwork.execute_event("#loop") == "#exit") {
            return;
        }


    }

    /**
    *Executes and events in all the objects that support it
    *@param {String} name - The name of the event
    * @param {Object} e_args - The arguments that the handler will receive
    */

    this.execute_event = function (name, e_args) {
        var r, result = [];
        for (var i = 0; i < objects.length; i++) {
            var body = objects[i];
            if (body != undefined) {
                if (body.execute_event("#", { "name": name, "args": e_args }) == "#exit") {
                    return "#exit";
                }
                r = body.execute_event(name, e_args);
                if (r == "#exit") {
                    return "#exit";
                }
                result.push(r);
            }
        }
        return result.filter(function (x) { return x !== undefined });
    };

    //..........................
    //     Colisions
    //...........................


    function registerShape(shapename) {
        collisions.shapes.push(shapename);
    }

    function registerCollisionDetector(shape1, shape2, detector) {
        if (collisions.detect[shape1] == undefined) {
            collisions.detect[shape1] = {};
        }
        collisions.detect[shape1][shape2] = detector;
    }

    /**
    *Registers more shapes and collisions detectors in the engine
    *@param {Object} collisionPackage - The object containing the shapes and collisions, see the structure in the examples at src/presets
    */

    this.registerCollision = function (collisionPackage) {
        for (var i = 0; i < collisionPackage.shapes.length; i++) {
            registerShape(collisionPackage.shapes[i]);
        }
        for (i = 0; i < collisionPackage.detectors.length; i++) {
            registerCollisionDetector(collisionPackage.detectors[i].shape1, collisionPackage.detectors[i].shape2, collisionPackage.detectors[i].detector);
        }
    };

    function processCollisions() {
        return collisionAlgorithm(objects, checkCollision);
    }

    this.setCollisionAlgorithm = function (algorithm) {
        return collisionAlgorithm = algorithm;
    };

    /**
    *Checks if a given collider collides with any objects in the level
    *@param {String} type - The collider type
    *@param {Object} collider - The collider
    */
    var collisionData = {};
    this.collisionQuery = function (type, collider) {
        var result = [];
        var shape2 = type;
        for (var i = 0; i < objects.length; i++) {
            b1 = objects[i];
            if (b1 != undefined) {
                //For each kind of shape
                for (var shape1 in b1.collision) {
                    shapesBody1 = b1.collision[shape1];
                    //For each shape of that kind
                    for (var k = 0; k < shapesBody1.length; k++) {
                        bodyShape1 = shapesBody1[k];
                        //Check if they collide
                        if (collisions.detect[shape1] != undefined && collisions.detect[shape1][shape2] != undefined && collisions.detect[shape1][shape2](bodyShape1, collider, collisionData) == true) {
                            result.push(i);
                        }
                    }
                }
            }
        }
        return result;
    };

    //Outside for optimization purposes
    var emptyCache = [];
    var cache;
    var b1;
    var b2;
    var x1;
    var y1;
    var z1;
    var x2;
    var y2;
    var z2;
    var shapesBody1;
    var shapesBody2;
    var bodyShape1;
    var bodyShape2;
    var collisionData = {};
    var shape1, shape2, k, l;
    function checkCollision(i, j) {
        cache = emptyCache;
        b1 = objects[i];
        b2 = objects[j];
        //For each kind of shape
        for (shape1 in b1.collision) {
            for (shape2 in b2.collision) {
                shapesBody1 = b1.collision[shape1];
                shapesBody2 = b2.collision[shape2];
                //For each shape of that kind
                for (k = 0; k < shapesBody1.length; k++) {
                    for (l = 0; l < shapesBody2.length; l++) {
                        bodyShape1 = shapesBody1[k];
                        bodyShape2 = shapesBody2[l];
                        //Check if they collide
                        if (collisions.detect[shape1] != undefined && collisions.detect[shape1][shape2] != undefined && collisions.detect[shape1][shape2](bodyShape1, bodyShape2, collisionData) == true) {
                            //Send the info to the #collide event handlers
                            if (b1.execute_event("#collide", { object: j, shape1kind: shape1, shape2kind: shape2, shape1id: k, shape2id: l, data: collisionData, shape1tag: bodyShape1["#tag"], shape2tag: bodyShape2["#tag"] }) == "#exit") {
                                return "#exit";
                            }
                            if (b2.execute_event("#collide", { object: i, shape1kind: shape2, shape2kind: shape1, shape1id: l, shape2id: k, data: collisionData, shape1tag: bodyShape2["#tag"], shape2tag: bodyShape1["#tag"] }) == "#exit") {
                                return "#exit";
                            }
                            if (cache.length == 0) {
                                cache = [];
                                cache.push({ a: { object: j, shape1kind: shape1, shape2kind: shape2, shape1id: k, shape2id: l, data: collisionData, shape1tag: bodyShape1["#tag"], shape2tag: bodyShape2["#tag"] }, b: { object: i, shape1kind: shape2, shape2kind: shape1, shape1id: l, shape2id: k, data: collisionData, shape1tag: bodyShape1["#tag"], shape2tag: bodyShape2["#tag"] } });
                            }
                        }
                    }
                }
                if (!b2) {
                    break;
                }
                if (!b1) {
                    return;
                }
            }
        }
        return cache;
    }

});

