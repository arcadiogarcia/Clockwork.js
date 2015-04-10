/// <reference path="/js/references.js" />

var engine_presets = {
    list: {},
    new: function (name) {
        engine_presets.list[name] = {
            eventfunction: {},
            vars: {},
            boundingbox: [],
            collisionpoint: [],
            timeline: [],
            timeline_engine: [],
            x: 0,
            y: 0,
            eventpreset: new Array(),
            eventstart: new Array(),
            setX: function(x){
                if (this.vars.passivetimetravel == 1) {
                    if (this.timeline_engine.x == undefined) {
                        this.timeline_engine.x = [{ t: 0, v: this.x }];
                    }
                    if (this.timeline_engine.x[this.timeline_engine.x.length-1].v != x) {
                        this.timeline_engine.x.push({ t: engine.getVar("time"), v: x });
                    }
                }
                    this.x = x;
            },
            setY: function (y) {
                if (this.vars.passivetimetravel == 1) {
                    if (this.timeline_engine.y == undefined) {
                        this.timeline_engine.y = [{ t: 0, v: this.y }];
                    }
                
                    if (this.timeline_engine.y[this.timeline_engine.y.length - 1].v != y) {
                        this.timeline_engine.y.push({ t: engine.getVar("time"), v: y });
                    }
                    
                }
                    this.y = y;
            },
            setState: function (state) {
                if (this.vars.passivetimetravel == 1) {
                    if (this.timeline_engine.state == undefined) {
                        this.timeline_engine.state = [{ t: 0, v: this.state }];
                    }
                    if (this.timeline_engine.state[this.timeline_engine.state.length - 1].v != state) {
                        this.timeline_engine.state.push({ t: engine.getVar("time"), v: state });
                    }
                }
                    this.state = state;
            },
            getX: function () {
                return this.x;
            },
            getY: function () {
                return this.y;
            },
            getState: function () {
                return this.state;
            },
            setVar: function (variable, value) {
                if (this.vars.passivetimetravel == 1) {
                    if (this.timeline[variable] == undefined) {
                        this.timeline[variable] = [{ t: 0, v: this.vars[variable] }];
                    }
                    if (this.timeline[variable][this.timeline[variable].length-1].v != value) {
                        this.timeline[variable].push({ t: engine.getVar("time"), v: value });
                    }
                }
                    this.vars[variable] = value;
            },
            setVarP: function (variable, value) {
                this.vars[variable] = value;
            },
            getVar: function (variable) {
                return this.vars[variable];
            },
            execute_event: function (name, args) {
                if (this.eventfunction[name] != undefined) {
                    return (this.eventfunction[name].bind(this))(args);
                } else {
                    debuglog("eventfunction " + name + " does not exist in " + this.name,2);
                }
            }
        }
    },
    inherit: function (name, parent) {
        engine_presets.list[name] = inheritObject(engine_presets.list[parent]);
        engine_presets.list[name].vars = inheritObject(engine_presets.list[parent].vars);
        engine_presets.list[name].eventfunction = inheritObject(engine_presets.list[parent].eventfunction);
        engine_presets.list[name].boundingbox = inheritObject(engine_presets.list[parent].boundingbox);
        engine_presets.list[name].collisionpoint = inheritObject(engine_presets.list[parent].collisionpoint);
        engine_presets.list[name].eventpreset = inheritObject(engine_presets.list[parent].eventpreset);
    },
    addEvent: function (name, event, functiontext) {
        try{
            engine_presets.list[name].eventfunction[event] = new Function("event", functiontext);
        }catch(e){
            debuglog("Error de sintaxis en el objeto "+name+", evento "+event,1)
        }
    },
    addEventFunction: function (name, event, functiontext) {

            engine_presets.list[name].eventfunction[event] = functiontext;

    },
    addVar: function (name, variable, value) {
        engine_presets.list[name].vars[variable] = value;
    },
    setSprite: function (name, sprite) {
        engine_presets.list[name].sprite = sprite;
    },
   
    addPoint: function (name, x, y) {
        engine_presets.list[name].collisionpoint.push({ x: x, y: y });
    },
    addBox: function (name, x, y, w, h) {
        engine_presets.list[name].boundingbox.push({ x: x, y: y, w: w, h: h });
    },
    addEventPreset: function (name, event) {
        engine_presets.list[name].eventpreset.push({ name: event });
    },
    addEventStart: function (name, event) {
        engine_presets.list[name].eventstart.push({ name: event });
    },
    implement: function (name, type) {
        var newone = inheritObject(engine_presets.list[type]);
        newone.vars["name"] = name;
        newone.renderId = -1;
        return newone;
    },
    parse: function (text) {

        var xmlDoc = new Windows.Data.Xml.Dom.XmlDocument();
        xmlDoc.loadXml(text);

        for (var i = 0; i < xmlDoc.getElementsByTagName("preset").length; i++) {
            var thispreset = xmlDoc.getElementsByTagName("preset")[i];
            console.log(engine_presets.list);
            if (thispreset.getAttributeNode("inherits") == undefined) {
                engine_presets.new(thispreset.getAttributeNode("name").innerText);
            } else {
                engine_presets.inherit(thispreset.getAttributeNode("name").innerText, thispreset.getAttributeNode("inherits").innerText);
            }
            if (thispreset.getAttributeNode("sprite") != undefined) {
                engine_presets.setSprite(thispreset.getAttributeNode("name").innerText, thispreset.getAttributeNode("sprite").innerText);
            } else {
                engine_presets.setSprite(thispreset.getAttributeNode("name").innerText, undefined);
            }
           
            for (var j = 0; j < thispreset.getElementsByTagName("event").length; j++) {
                engine_presets.addEvent(thispreset.getAttributeNode("name").innerText, thispreset.getElementsByTagName("event")[j].getAttributeNode("name").innerText, thispreset.getElementsByTagName("event")[j].innerText);
            }
            for (var j = 0; j < thispreset.getElementsByTagName("var").length; j++) {
                engine_presets.addVar(thispreset.getAttributeNode("name").innerText, thispreset.getElementsByTagName("var")[j].getAttributeNode("name").innerText, +thispreset.getElementsByTagName("var")[j].innerText);
            }
            for (var j = 0; j < thispreset.getElementsByTagName("point").length; j++) {
                engine_presets.addPoint(thispreset.getAttributeNode("name").innerText, +thispreset.getElementsByTagName("point")[j].getAttributeNode("x").innerText, +thispreset.getElementsByTagName("point")[j].getAttributeNode("y").innerText);
            }
            for (var j = 0; j < thispreset.getElementsByTagName("box").length; j++) {
                engine_presets.addBox(thispreset.getAttributeNode("name").innerText, +thispreset.getElementsByTagName("box")[j].getAttributeNode("x").innerText, +thispreset.getElementsByTagName("box")[j].getAttributeNode("y").innerText, +thispreset.getElementsByTagName("box")[j].getAttributeNode("w").innerText, +thispreset.getElementsByTagName("box")[j].getAttributeNode("h").innerText);
            }
            for (var j = 0; j < thispreset.getElementsByTagName("loopevent").length; j++) {
                engine_presets.addEventPreset(thispreset.getAttributeNode("name").innerText, thispreset.getElementsByTagName("loopevent")[j].getAttributeNode("name").innerText);
            }
            for (var j = 0; j < thispreset.getElementsByTagName("startevent").length; j++) {
                engine_presets.addEventStart(thispreset.getAttributeNode("name").innerText, thispreset.getElementsByTagName("startevent")[j].getAttributeNode("name").innerText);
            }
        }

    },
    asyncload: function (url, funcion) {
        var xmlDoc = new Windows.Data.Xml.Dom.XmlDocument();
        var uri = new Windows.Foundation.Uri(url);
        Windows.Storage.StorageFile.getFileFromApplicationUriAsync(uri).then(function (file) {
            return Windows.Storage.FileIO.readTextAsync(file).then(function (result) {
                engine_presets.parse(result);
                funcion();
            });
        });

    },
    nativeload: function (presets,funcion) {
        for (var i = 0; i < presets.length; i++) {
            var thispreset = presets[i];
           
            if (thispreset.inherits != undefined) {
                engine_presets.inherit(thispreset.name, thispreset.inherits);
            } else {
                engine_presets.new(thispreset.name);
            }
            engine_presets.setSprite(thispreset.name, thispreset.sprite);
           

            if (typeof thispreset.vars != "undefined") {
                for (var j = 0; j < thispreset.vars.length; j++) {
                    engine_presets.addVar(thispreset.name, thispreset.vars[j].name, thispreset.vars[j].value);
                }
            }

            if (typeof thispreset.points != "undefined") {
                for (var j = 0; j < thispreset.points.length; j++) {
                    engine_presets.addPoint(thispreset.name, thispreset.points[j].x, thispreset.points[j].y);
                }
            }

            if (typeof thispreset.boxes != "undefined") {
                for (var j = 0; j < thispreset.boxes.length; j++) {
                    engine_presets.addBox(thispreset.name, thispreset.boxes[j].x, thispreset.boxes[j].y, thispreset.boxes[j].w, thispreset.boxes[j].h);
                }
            }

            if (typeof thispreset.events != "undefined") {
                for (var j = 0; j < thispreset.events.length; j++) {
                    engine_presets.addEventFunction(thispreset.name, thispreset.events[j].name, thispreset.events[j].code);
                }
            }
        }
        //callback
        funcion();
    }
}
