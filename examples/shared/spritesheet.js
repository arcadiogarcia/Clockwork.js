//Spritesheet.js animation engine
//Arcadio García Salvadores

var Spritesheet = (function () {

    //This canvas will be used as a buffer to store the image off-screen
    var buffercanvas = document.createElement("canvas");
    buffercanvas.width = 1366;
    buffercanvas.height = 768;
    //The context of the screen buffer
    //Everything should be written here
    //The 'real' context will only be modified when copying the buffer to the screen
    var context = buffercanvas.getContext('2d');


    //Here the 'real' canvas and context will be stored
    var canvas, realcontext;
    //Here we store the handler returned by the setInterval function
    var intervalholder;


    //The camera allows to move the view without moving the individual sprites
    var camera = { x: 0, y: 0 };


    //Here we store the list of spritesheets
    var spritesheets = [];
    //Here we store the list of objects
    var objects = [];
    //This array is used to store the rendering order specified by the zindex of each object
    var objectsorder = [];
    //This variable stores the frames per second
    var fps;

    //This is the default rendermode, it just scales the buffer and prints it on the canvas
    var rendermode_default = function (contextinput, contextoutput) { contextoutput.clearRect(0, 0, contextoutput.canvas.width, contextoutput.canvas.height); contextoutput.drawImage(contextinput.canvas, 0, (contextoutput.canvas.height - contextinput.canvas.height * contextoutput.canvas.width / contextinput.canvas.width) / 2, contextoutput.canvas.width, (contextinput.canvas.height * contextoutput.canvas.width / contextinput.canvas.width)); };
    //It makes sense to set rendermode_default as the default rendermode!
    var rendermode = rendermode_default;

    //This variable allows to reverse all the animations
    var goesbackwards = false;

    //Holds the spritesheet: Player, enemy1...
    function spritesheet() {
        this.name = "";
        this.img;
        this.states = [];
        this.layers = [];
        this.frames = [];
    }

    //Holds a 'state': Idle, jumping...
    function state() {
        this.name = "Name";
        this.layers = [];
    }

    //Holds a layer: Body, arms...
    function layer() {
        this.frames = [];
        this.x;
        this.y;
        this.t = 0;
    }

    //Holds a single frame
    function frame(x, y, w, h, t) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.t = t;
    }

    //This function is executed as many times per second as possible (using requestAnimationFrame)
    //It renders all the objects on the buffer
    //And then it copies it to the screen using the rendermode
    function renderdraw() {
        //First we clear the context
        context.clearRect(0, 0, canvas.width, canvas.height);
        //For each object
        for (var i = 0; i < objectsorder.length; i++) {
            //We get the object in that position acoording to the zindex
            var object = objects[objectsorder[i].v];
          
            //We get its spritesheet
            var spritesheet = searchWhere(spritesheets, "name", object.spritesheet);
            var state = spritesheet.states[0];
            //We get the current state
            if (object.state != undefined) {
                state = searchWhere(spritesheet.states, "name", object.state);
            }
            //We loop over the layers of its current state
            for (var j in state.layers) {
                //In case it was modified before, we reset the alpha
                context.globalAlpha = 1;
                //We get the data corresponding to that layer
                var layer_n = state.layers[j];
                var layer = spritesheet.layers[layer_n];

                //We calculate which frame should be drawn
                //We set k to the first frame of the layer
                //And we add the duration of the frames until we reach current t
                var tempt = spritesheet.frames[layer.frames[0]].t, k = 0;
                while (tempt < superModulo(object.t, layer.t)) {
                    var thisframe = spritesheet.frames[layer.frames[k]];
                    //If the duration of a frame is set to 0 it stops there
                    if (thisframe.t == 0) {
                        break;
                    }
                    k++;
                    //If we have reached exactly the end of the animation we set the first frame
                    if (k == layer.frames.length) {
                        k = 0;
                        break;
                    }
                    //We add the duration of this frame to the counter
                    tempt += thisframe.t;

                }

                //We finally have the frame that must be drawn
                var frame = spritesheet.frames[layer.frames[k]];


                //If the object is static we dont take into account camera movements
                if (object.isstatic == true) {
                    var xposition = (+layer.x(object.t)) + (+object.x);
                    var yposition = (+layer.y(object.t)) + (+object.y);
                } else {
                    var xposition = (+layer.x(object.t)) + (+object.x) - camera.x;
                    var yposition = (+layer.y(object.t)) + (+object.y) - camera.y;
                }

                //Maybe the image must be flipped in some axis
                var flipoffsetx = 0;
                var flipoffsety = 0;
                switch (state.flip) {
                    case 1:
                        context.save();
                        flipoffsetx = -2 * xposition - frame.w;
                        context.scale(-1, 1);
                        break;
                    case 2:
                        context.save();
                        flipoffsety = -2 * yposition - frame.h;
                        context.scale(1, -1);
                        break;
                    case 3:
                        context.save();
                        flipoffsetx = -2 * xposition - frame.w;
                        flipoffsety = -2 * yposition - frame.h;
                        context.scale(-1, -1);
                        break;
                    default:
                        break;
                }



                if (frame.code == undefined) {
                    //If it is a frame from a file we draw it on the buffer
                    //But first we check if the frame is out of the screen
                    var skip = false;
                    if ((state.flip == 0 || state.flip == 2) && (xposition > buffercanvas.width || xposition + frame.w < 0)) {
                        skip = true;
                    }
                    if ((state.flip == 0 || state.flip == 1) && (yposition > buffercanvas.height || yposition + frame.h < 0)) {
                        skip = true;
                    }
                    if ((state.flip == 1 || state.flip == 3) && (xposition + flipoffsetx > 0 || xposition + flipoffsetx + frame.w < -buffercanvas.width)) {
                        skip = true;
                    }
                    if ((state.flip == 2 || state.flip == 3) && (yposition + flipoffsety > 0 || yposition + flipoffsety + frame.h < -buffercanvas.height)) {
                        skip = true;
                    }
                    if (!skip) {
                        context.drawImage(spritesheet.img, frame.x, frame.y, frame.w, frame.h, xposition + flipoffsetx, yposition + flipoffsety, frame.w, frame.h);
                    }
                    
                    //If we flipped before then we restore everything
                    switch (state.flip) {
                             case 1:
                             case 2:
                             case 3:
                                context.restore();
                             break;
                             default:
                              break;
                    }
                } else {
                     //Code shouldnt flip?
                     switch (state.flip) {
                             case 1:
                             case 2:
                             case 3:
                                context.restore();
                             break;
                             default:
                              break;
                     }
                    
                    //If it is a 'custom' frame, we execute the code
                    frame.code(xposition, yposition, object.t, context, object.vars);
                    
                }

                //If we flipped before then we restore everything
                switch (state.flip) {
                    case 1:
                    case 2:
                    case 3:
                        context.restore();
                        break;
                    default:
                        break;
                }
            }

        }

        //Finally we draw the buffer on the screen
        rendermode(context, realcontext);

    }

    //This function is executed as many times as the fps specify
    //It just increments each object timer if needed
    function renderprocess() {
        for (var i = 0; i < objects.length; i++) {
            var object = objects[objectsorder[i].v];

            if (object.pause != true) {
                if (goesbackwards == true && object.doesnottimetravel == false) {
                    object.t -= 1000 / fps;
                } else {
                    object.t += 1000 / fps;
                }
            }
        }
    }

    //This function loads the xml doument data
    function realparse(xmlDoc) {


        for (var k = 0; k < xmlDoc.getElementsByTagName("spritesheet").length; k++) {

            var newspritesheet = new spritesheet();
            newspritesheet.name = xmlDoc.getElementsByTagName("spritesheet")[k].getAttributeNode("name").value;

            var thisspritesheet = xmlDoc.getElementsByTagName("spritesheet")[k];

            if (thisspritesheet.getAttributeNode("src") != undefined) {
                newspritesheet.img = new Image()
                newspritesheet.img.src = (thisspritesheet.getAttributeNode("src").value);
            }

            var framesxml = thisspritesheet.getElementsByTagName("frames")[0];
            for (var i = 0; i < framesxml.getElementsByTagName("frame").length; i++) {
                var newframexml = framesxml.getElementsByTagName("frame")[i];
                var newframe = new frame();
                newframe.name = newframexml.getAttributeNode("name").value;
                if (newframexml.getAttributeNode("code") == undefined) {
                    newframe.x = +newframexml.getAttributeNode("x").value;
                    newframe.y = +newframexml.getAttributeNode("y").value;
                    newframe.w = +newframexml.getAttributeNode("w").value;
                    newframe.h = +newframexml.getAttributeNode("h").value;
                } else {
                    newframe.code = new Function("x", "y", "t", "context", "vars", newframexml.getAttributeNode("code").value);
                }
                newframe.t = +newframexml.getAttributeNode("t").value;
                newspritesheet.frames.push(newframe);
            }

            var layersxml = thisspritesheet.getElementsByTagName("layers")[0];
            for (var i = 0; i < layersxml.getElementsByTagName("layer").length; i++) {
                var newlayerxml = layersxml.getElementsByTagName("layer")[i];
                var newlayer = new layer();
                newlayer.name = newlayerxml.getAttributeNode("name").value;
                newlayer.x = new Function("t", "return " + newlayerxml.getAttributeNode("x").value);
                newlayer.y = new Function("t", "return " + newlayerxml.getAttributeNode("y").value);
                for (var j = 0; j < newlayerxml.getElementsByTagName("frame").length; j++) {
                    var framexml = newlayerxml.getElementsByTagName("frame")[j];
                    newlayer.frames.push(findwhere(newspritesheet.frames, "name", framexml.getAttributeNode("name").value));
                }
                newlayer.t = getlayerduration(newlayer, newspritesheet);
                newspritesheet.layers.push(newlayer);
            }


            var statesxml = thisspritesheet.getElementsByTagName("states")[0];
            for (var i = 0; i < statesxml.getElementsByTagName("state").length; i++) {
                var newstatexml = statesxml.getElementsByTagName("state")[i];
                var newstate = new state();
                newstate.name = newstatexml.getAttributeNode("name").value;
                for (var j = 0; j < newstatexml.getElementsByTagName("layer").length; j++) {
                    var layerxml = newstatexml.getElementsByTagName("layer")[j];
                    newstate.layers.push(findwhere(newspritesheet.layers, "name", layerxml.getAttributeNode("name").value));
                }
                if (newstatexml.getAttributeNode("flip") != null) {
                    switch (newstatexml.getAttributeNode("flip").value) {
                        case "h":
                            newstate.flip = 1;
                            break;
                        case "v":
                            newstate.flip = 2;
                            break;
                        case "hv":
                            newstate.flip = 3;
                            break;
                        case "vh":
                            newstate.flip = 3;
                            break;
                        default:
                            newstate.flip = 0;
                            break;
                    }
                } else {
                    newstate.flip = 0;
                }

                newspritesheet.states.push(newstate);
            }

            spritesheets.push(newspritesheet);
        }
    }

    //This function sorts the objects according to its z index
    function sortZindex() {
        objectsorder = [];
        for (var i = 0; i < objects.length; i++) {
            if (objects[i] != null) {
                objectsorder.push({ v: i, z: objects[i].zindex });
            }
        }
        objectsorder.sort(function (a, b) { return a.z - b.z; });
    }

    //This functions are public and are the only ones that should be used to control the engine
    return {
        /**
        * The user must call this function before starting to use the instance of the library
        * @param {Canvas} canvas - The canvas that will be used
        * @param {Number} nfps - The number of frames per second to be used
        */
        setUp: function (mycanvas, nfps) {
            canvas = mycanvas;
            realcontext = canvas.getContext('2d');
            //We loop renderprocess and renderdraw
            intervalholder = window.setInterval(renderprocess, Math.round(1000 / nfps));
            requestAnimationFrame(function renderdrawrequest() { renderdraw(); requestAnimationFrame(renderdrawrequest) });
            fps = nfps;
        },
        /**
       * Call this function to make the canvas fullscreen
       */
        setFullScreen: function () {
            canvas.style = "position:absolute;top:0px;left:0px;margin:0px;";
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            window.onresize = function () {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };
        },
        /**
      * This function pauses the 'time'... but it does no stop drawing
      */
        pauseAll: function () {
            window.clearInterval(intervalholder);
        },
        /**
        *This function continues playing the animation after calling {@link pauseAll}
        */
        restart: function () {
            intervalholder = window.setInterval(renderprocess, Math.round(1000 / nfps));
        },
        /**
        *Set the camera position
        * @param {Number} x - The x position of the camera
        * @param {Number} y - The y position of the camera
        */
        setCamera: function (x, y) {
            camera.x = x;
            camera.y = y;
        },
        /**
        *Move the camera in the x axis
        * @param {Number} x - The variation of the x position of the camera
        */
        moveCameraX: function (x) {
            camera.x += x;
        },
        /**
        *Move the camera in the y axis
        * @param {Number} y - The variation of the y position of the camera
        */
        moveCameraY: function (y) {
            camera.y += y;
        },
        /**
        *Load the XML with the data (async)
        * @param {String} url - The url of the XML file
        * @param {Function} funcion - A callback function
        */
        asyncLoad: function (url, funcion) {
            loadXMLFile(url, realparse, funcion);
        },
        /**
        *Add an object to the engine
        * @param {String} ss - The name of the spritesheet instantiated
        * @param {String} st - The starting state of the object
        * @param {Number} x - The x position of the object
        * @param {Number} y - The y position of the object
        * @param {Number} zindex - The z position of the object, indicates the rendering order
        * @param {Boolean} isstatic - Whether the object is affected by camera movements
        * @param {Boolean} doesnottimetravel - Whether the object animation can be played backwards
        * @return {Number} The object identifier
        */
        addObject: function (ss, st, x, y, zindex, isstatic, doesnottimetravel) {
            objects.push({ vars: {}, spritesheet: ss, state: st, x: x, y: y, t: 0, zindex: zindex || 0, isstatic: isstatic || false, doesnottimetravel: doesnottimetravel || false });
            sortZindex();
            return objects.length - 1;
        },
        /**
        *Delete the object specified by the identifier
        * @param {Number} id - The id of the object
        */
        deleteObject: function (id) {
            objects[id] = null;
            sortZindex();
        },
        /**Remove all the objects
        */
        clear: function () {
            objects = [];
        },
        /**
        *Pause the animation of an specific object
        * @param {Number} id - The id of the object
        */
        pause: function (id) {
            objects[id].pause = true;
        },
        /**
        *Unpause the animation of an specific object
        * @param {Number} id - The id of the object
        */
        unpause: function (id) {
            objects[id].pause = false;
        },
        /**
        *Set the X coordinate of an object
        * @param {Number} id - The id of the object
        * @param {Number} x - The x coordinate
        */
        setX: function (id, x) {
            objects[id].x = x;
        },
        /**
        *Set the Y coordinate of an object
        * @param {Number} id - The id of the object
        * @param {Number} iy - The y coordinate
        */
        setY: function (id, y) {
            objects[id].y = y;
        },
        /**
        *Set a custom parameter of an object
        * @param {Number} id - The id of the object
        * @param {String} variable - The name of the parameter
        * @param {Object} value - The value of the parameter
        */
        setParameter: function (id, variable, value) {
            objects[id].vars[variable] = value;
        },
        /**
        *Set the Z index of an object
        * @param {Number} id - The id of the object
        * @param {Number} z - The zindex of the object
        */
        setZindex: function (id, z) {
            if (objects[id].zindex != z) {
                objects[id].zindex = z;
                sortZindex();
            }
        },
        /**
        *Set the state of an object
        * @param {Number} id - The id of the object
        * @param {String} s - The state of an object
        * @return {Number} The timer of the animation that was being played, or NaN if this was already the current state
        */
        setState: function (id, s) {
            if (objects[id].state != s) {
                objects[id].state = s;
                var temp = objects[id].t;
                objects[id].t = 0;
                return temp;
            }
            return NaN;
        },
        /**
        *Set the spritesheet of an object
        * @param {Number} id - The id of the object
        * @param {String} s - The spritesheet of an object
        */
        setSpritesheet: function (id, s) {
            objects[id].spritesheet = s;
        },
        /**
        *Set the time (inside its current animation) of an object
        * @param {Number} id - The id of the object
        * @param {Number} t - The timer
        */
        setObjectTimer: function (id, t) {
            objects[id].t = t;
        },
        /**
        *Get the time (inside its current animation) of an object
        * @param {Number} id - The id of the object
        * @returns The timer of the animation being played
        */
        getObjectTimer: function (id) {
            return objects[id].t;
        },
        /**
        *Reverse all the animations if set to true, restore them to normal if set to false
        * @param {Boolean} value - Whether the animations should be reversed
        */
        setBackwards: function (value) {
            goesbackwards = value;
        },
        /**
        *Specify a new render mode
        * @param {Function} mode - The new render mode
        */
        setRenderMode: function (mode) {
            rendermode = mode;
        },
        /**
        *Use the default render mode 
        */
        setRenderModeDefault: function () {
            rendermode = rendermode_default;
        },
        /**
        *Set the size of the buffer canvas
        * @param {Number} w - The width
        * @param {Number} h - The height
        */
        setBufferSize: function (w, h) {
            buffercanvas.width = w;
            buffercanvas.height = h;
        }
    };

    //Those are auxiliar functions

    function findwhere(array, property, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][property] == value) {
                return i;
            }
        }
        return -1;
    }

    function searchWhere(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] == value) {
                return array[i];
            }
        }
        return null;
    }

    function getlayerduration(layer, spritesheet) {
        var d = 0;
        for (var i = 0; i < layer.frames.length; i++) {
            d += spritesheet.frames[layer.frames[i]].t;
            if (spritesheet.frames[layer.frames[i]].t == 0) {
                d += Infinity; //If i dont do this the modulo may reset before reaching the t=0 layer
            }
        }
        return d;
    }

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

    function superModulo(a, b) {
        if (a >= 0) {
            return a % b;
        } else {
            return b + a % b;
        }
    }

});