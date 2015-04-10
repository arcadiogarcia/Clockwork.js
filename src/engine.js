/// <reference path="/js/references.js" />


//0 -No alerts
//1- Errors
//2 -Errors+Alerts
var debugmode = 1;

var engine = {};
engine.body = [];
engine.levels = [];
engine.levelsnames = [];
engine.event = [];
engine.globalvars = [];
engine.eventqueue = [];
engine.loading = "0";
engine.started = false;
engine.fps = 0;

engine.start = function (fps) {
    engine.fps = fps;
    engine.started = true;
    engine.loadLevel(0);
}

engine.setup = function () {
    engine.event = [{ name: "setup" }];
    /* DEPRECATED
    for (var i in engine.body) {
        engine.body[i].event = [];
        for (var j = 0; j < engine.body[j].eventstart.length; j++) {
            engine.body[i].event.push(engine.body[i].eventstart[j]);
        }

    }*/
    engine.processEvents();
    engine.event = [];
    engine.checkLoadQueue();
}

engine.pause = function () {
    clearInterval(engine.intervalholder);
}
engine.checkLoadQueue = function () {
    if (engine.loading == 0 && engine.started == true) {
        engine.intervalholder = setInterval(engine.loop, Math.round(1000 / engine.fps));
        window.addEventListener("click", engine.onClick, true);
        loader.hide();
    }
}
engine.addLoadQueue = function () {
    engine.loading++;
};
engine.removeLoadQueue = function () {
    engine.loading--;
    engine.checkLoadQueue();
};

engine.addEvent = function (event) {
    engine.eventqueue.push(event);
};

engine.processEvents = function () {
    for (var i in engine.body) {
        var body = engine.body[i];
        for (var j in body.event) {
            if (body.execute_event(body.event[j].name, body.event[j].args) == "exit") {
                return "exit";
            }
        }
        for (var j in engine.event) {
            if (body.execute_event(engine.event[j].name, engine.event[j].args) == "exit") {
                return "exit";
            }
        }
    }
}

engine.execute_event = function (name, e_args) {
    for (var i in engine.body) {
        var body = engine.body[i];
        if (body.execute_event(name, e_args) == "exit") {
            return "exit";
        }
    }

}

engine.loop = function () {
    engine.event = [{ name: "loop" }];

    engine.event = engine.event.concat(engine.eventqueue);
    engine.eventqueue = [];

    for (var i in engine.body) {

        engine.body[i].event = [];
        for (var j = 0; j < engine.body[j].eventpreset.length; j++) {
            engine.body[i].event.push(engine.body[i].eventpreset[j]);
        }
        for (var j = 0; j < engine.body[j].eventqueue.length; j++) {
            engine.body[i].event.push(engine.body[i].eventqueue[j]);
        }
        engine.body[i].eventqueue = [];
    }

    //Collisions
    for (var i = 0; i < engine.body.length; i++) {
        for (var j = 0; j < engine.body.length; j++) {
            if (i != j) {
                var b1 = engine.body[i];
                var b2 = engine.body[j];
                for (var k = 0; k < b1.boundingbox.length; k++) {

                    for (var l = 0; l < b2.collisionpoint.length; l++) {
                        var box = { x: b1.boundingbox[k].x + b1.getX(), y: b1.boundingbox[k].y + b1.getY(), w: b1.boundingbox[k].w, h: b1.boundingbox[k].h };
                        var point = { x: b2.collisionpoint[l].x + b2.getX(), y: b2.collisionpoint[l].y + b2.getY() };
                        if (isPinsideB(point, box) == true) {
                            if (b1.execute_event("collideB", { object: j, box: k, point: l }) == "exit") {
                                return;
                            }
                            if (b2.execute_event("collideP", { object: i, box: k, point: l }) == "exit") {
                                return;
                            }
                        }
                    }
                }
            }
        }
    }

    engine.checkTimers();

    //events
    if (engine.processEvents() == "exit") {
        return;
    }


    //TODO:animation
    for (var i in engine.body) {
        if (engine.body[i].spriteholder != undefined) {
            anim_engine.setX(engine.body[i].spriteholder, +engine.body[i].x);
            anim_engine.setY(engine.body[i].spriteholder, +engine.body[i].y);
            anim_engine.setZindex(engine.body[i].spriteholder, engine.body[i].vars.z_index);
            var t = anim_engine.setState(engine.body[i].spriteholder, engine.body[i].state);
            if (!isNaN(t)) {

                if (engine.body[i].timeline_animtime == undefined) {
                    engine.body[i].timeline_animtime = [];
                }

                if (engine.getVar("timetravel") == true) {


                    if (engine.body[i].timeline_animtime[engine.getVar("time") + 1] != undefined) {
                        anim_engine.setObjectTimer(engine.body[i].spriteholder, engine.body[i].timeline_animtime[engine.getVar("time") + 1]);

                    }
                } else {
                    engine.body[i].timeline_animtime[engine.getVar("time")] = t;
                }
            }
            anim_engine.setText(engine.body[i].spriteholder, engine.body[i].text);
        }
    }



}

engine.loadLevelByName = function (name) {
    for (var i = 0; i < engine.levelsnames.length; i++) {
        if (name == engine.levelsnames[i]) {
            engine.loadLevel(i);
            return;
        }
    }
}

engine.loadLevel = function (n) {
    engine.currentLevel = n;
    for (var j in engine.body) {
        engine.body[j].execute_event("_exit", []);
    }
    anim_engine.clear();
    engine.setVar("currentlevel", n);
    engine.pause();
    loader.show();
    engine.deleteSprites();
    engine.body = engine.loadthislevel(engine.levels[n]).objects;
    //engine.body = engine.levels[n].objects;
    engine.assignSprites();
    engine.setup();

};

engine.parseLevels = function (text) {

    var xmlDoc = new Windows.Data.Xml.Dom.XmlDocument();
    xmlDoc.loadXml(text);

    for (var i = 0; i < xmlDoc.getElementsByTagName("level").length; i++) {
        engine.levels.push(xmlDoc.getElementsByTagName("level")[i]);
        engine.levelsnames.push(xmlDoc.getElementsByTagName("level")[i].getAttributeNode("id").innerText);
    }
    //vars are the same pointer


};
engine.asyncload = function (url, funcion) {
    var xmlDoc = new Windows.Data.Xml.Dom.XmlDocument();
    var uri = new Windows.Foundation.Uri(url);
    Windows.Storage.StorageFile.getFileFromApplicationUriAsync(uri).then(function (file) {
        return Windows.Storage.FileIO.readTextAsync(file).then(function (result) {
            engine.parseLevels(result);
            funcion();
        });
    });

};

engine.deleteSprites = function () {
    for (var i = 0; i < engine.body.length; i++) {
        if (engine.body[i].spriteholder != undefined) {
            anim_engine.deleteObject(engine.body[i].spriteholder);
        }
    }
};

engine.assignSprites = function () {
    anim_engine.setCamera(0, 0);
    for (var i = 0; i < engine.body.length; i++) {
        if (engine.body[i].sprite != undefined) {
            if (engine.body[i].sprite != undefined) {
                engine.body[i].spriteholder = anim_engine.addObject(engine.body[i].sprite, undefined, engine.body[i].x, engine.body[i].y, engine.body[i].vars.z_index, engine.body[i].isstatic, engine.body[i].vars["_doesnottimetravel"]);
            }
        }
    }
};


engine.addEvent = function (event) {
    engine.eventqueue.push(event);
}

engine.addEventBody = function (i, event) {
    engine.body[i].eventqueue.push(event);
}

engine.getVar = function (variable) {
    return engine.globalvars[variable];
}

engine.getBody = function (variable) {
    return engine.body[variable];
}

engine.setVar = function (variable, value) {
    engine.globalvars[variable] = value;
}

//Level=1 Error
//Level=2 Alert
function debuglog(text, level) {
    if ((level || 2) <= debugmode) {
        console.log(text);
    }
}

engine.addBodyLive = function (body) {
    if (body.sprite != undefined) {
        body.spriteholder = anim_engine.addObject(body.sprite, undefined, body.x, body.y, body.vars.z_index, body.vars.isstatic, body.vars["_doesnottimetravel"]);
    }
    body.execute_event("setup");
    engine.body.push(body);

}

engine.animationBackwards = function (value) {
    anim_engine.setBackwards(value);
}


engine.addAnimationParameter = function (object, variable, value) {
    anim_engine.setParameter(object.spriteholder, variable, value);
}

engine.loadthislevel = function level(thislevel) {
    var level = {};
    level.objects = [];
    for (var j = 0; j < thislevel.getElementsByTagName("object").length; j++) {
        var thisobject = thislevel.getElementsByTagName("object")[j];
        var object = engine_presets.implement(thisobject.getAttributeNode("name").innerText, thisobject.getAttributeNode("type").innerText);
        if (thisobject.getAttributeNode("static") != undefined) {
            if (thisobject.getAttributeNode("static").innerText == "true") {
                object.isstatic = true;
            } else {
                object.isstatic = false;
            }
        } else {
            object.isstatic = false;
        }
        object.x = +thisobject.getAttributeNode("x").innerText;
        object.y = +thisobject.getAttributeNode("y").innerText;
        if (thisobject.getAttributeNode("vars")) {
            addJSONparameters(object.vars, thisobject.getAttributeNode("vars").innerText);
        }
        object.eventqueue = [];
        if (thisobject.getAttributeNode("zindex") != undefined) {
            object.vars.z_index = +(thisobject.getAttributeNode("zindex").innerText);
        } else {
            object.vars.z_index = 0;
        }
        level.objects.push(object);
    }
    return level;
}

engine.onClick = function (e) {
    for (var i = 0; i < engine.body.length; i++) {

        var b1 = engine.body[i];

        for (var k = 0; k < b1.boundingbox.length; k++) {
            var box = { x: b1.boundingbox[k].x + b1.x, y: b1.boundingbox[k].y + b1.y, w: b1.boundingbox[k].w, h: b1.boundingbox[k].h };
            var point = { x: e.clientX / window.innerWidth * 1366, y: (e.clientY - (window.innerHeight - 768 * window.innerWidth / 1366) / 2) * 1366 / window.innerWidth };

            if (isPinsideB(point, box) == true) {
                b1.execute_event("click", { x: point.x - box.x, y: point.y - box.y, box: k });
            }
        }
    }
}


engine.timers = [];
engine.addTimer = function (callback, t) {
    engine.timers.push({ f: callback, t: t });
}
engine.checkTimers = function () {
    for (var i = 0; i < engine.timers.length; i++) {
        if (engine.timers[i].t <= 0) {
            engine.timers[i].f();
            engine.timers.splice(i, 1);
            i--;
        } else {
            engine.timers[i].t -= 1000 / engine.fps;
        }
    }
}

engine.setUpStorage = function () {

    var roamingSettings = Windows.Storage.ApplicationData.current.roamingSettings;
    if (!roamingSettings.values["HighPriority"]) {

        var storage = new Windows.Storage.ApplicationDataCompositeValue();
        roamingSettings.values["HighPriority"] = storage;
    }
    engine.roamingstorage = roamingSettings.values["HighPriority"];
}

engine.getStorage = function (name) {
    if (engine.roamingstorage == undefined) {
        engine.setUpStorage();
    }
    return engine.roamingstorage.lookup(name);
}

engine.setStorage = function (name, value) {
    if (engine.roamingstorage == undefined) {
        engine.setUpStorage();
    }
    engine.roamingstorage.insert(name, value);
    Windows.Storage.ApplicationData.current.roamingSettings.values["HighPriority"] = engine.roamingstorage;
}

engine.collideWithLine = function (line) {
    var bodies = [];
    for (var j = 0; j < engine.body.length; j++) {
        var b = engine.body[j];
        for (var k = 0; k < b.boundingbox.length; k++) {
            var box = { x: b.boundingbox[k].x + b.x, y: b.boundingbox[k].y + b.y, w: b.boundingbox[k].w, h: b.boundingbox[k].h };
            var lines = getLines(box);
            for (var i = 0; i < lines.length; i++) {
                if (doLinesCross(line, lines[i]) == true) {
                    bodies.push(b);
                }
            }
        }
    }
    return bodies;
}


engine.achievement = function (name, text) {
    if (engine.getStorage("_ACHIEVEMENT_" + name) != "_ACHIEVED") {
        engine.setStorage("_ACHIEVEMENT_" + name, "_ACHIEVED");
        var notifications = Windows.UI.Notifications;
        var template = notifications.ToastTemplateType.toastText02;
        var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
        var toastTextElements = toastXml.getElementsByTagName("text");
        toastTextElements[0].appendChild(toastXml.createTextNode(name));
        toastTextElements[1].appendChild(toastXml.createTextNode(text));
        toastXml.selectSingleNode("/toast").setAttribute("launch", '{"type":"toast","param1":"achievement","param2":"' + name + '"}');
        var toast = new notifications.ToastNotification(toastXml);
        var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
        toastNotifier.show(toast);
    }
}