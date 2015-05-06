//Basic DOM animation engine
//Look mom, no canvas!
var DOManimation = function () {

    function colorComponentFromString(inputString){
        var n = 0;
        if (inputString) {
            for (var i = 0; i < inputString.length; i++) {
                n *= 31;
                n += inputString.charCodeAt(i);
            }
        }
        return n%255;
    }


    var animationInterface = {};

    var maxid = 0;

    animationInterface.setX = function (id, value) {
        var div = document.getElementById("animation_" + id);
        div.style.left = value+"px";
    }

    animationInterface.setY = function (id, value) {
        var div = document.getElementById("animation_" + id);
        div.style.top = value + "px";
    }

    animationInterface.setZindex = function (id, value) {
        var div = document.getElementById("animation_" + id);
        div.style.zIndex = value;
    }

    animationInterface.setState = function (id, state) {
        var div = document.getElementById("animation_" + id);
        div.animation_color.g= colorComponentFromString(state);
        div.style.backgroundColor = "rgb(" + div.animation_color.r + "," + div.animation_color.g + "," + div.animation_color.b + ")";
    }

    animationInterface.setParameter = function (id, parameter, value) {
        var div = document.getElementById("animation_" + id);
        div.animation_parameters = div.animation_parameters || {};
        div.animation_parameters[parameter]=value
        div.animation_color.b = colorComponentFromString(JSON.stringify(div.animation_parameters));
        div.style.backgroundColor = "rgb(" + div.animation_color.r + "," + div.animation_color.g + "," + div.animation_color.b + ")";

    }

    animationInterface.clear = function () {
        for (var i = 0; i < maxid; i++) {
            var div = document.getElementById("animation_" + i);
            if (div) {
                div.parentNode.removeChild(div);
            }
        }
    }

    animationInterface.setCamera = function (x,y) {
        //?
    }

    animationInterface.addObject = function (spritesheet, state, x, y, zindex, isstatic, doesnottimetravel) {
        var div = document.createElement('div');
        div.id = "animation_" + (maxid);
        document.body.appendChild(div);
        div.style.display = "box";
        div.style.position = "absolute";
        switch (spritesheet) {
            case "background":
                div.style.width = "800px";
                div.style.height = "400px";
                break;
            case "pipe":
                div.style.width = "100px";
                div.style.height = "300px";
                break;
            case "button":
                div.style.width = "200px";
                div.style.height = "100px";
                break;
            case "text":
                div.style.width = "100px";
                div.style.height = "50px";
                break;
            case "paradog":
                div.style.width = "59px";
                div.style.height = "57px";
                break;
            default:
                div.style.width = "100px";
                div.style.height = "100px";
                break

        }
        div.style.left = x + "px";
        div.style.top = y+ "px";
        div.animation_color = { r: colorComponentFromString(spritesheet), g: colorComponentFromString(state), b: 0 };
        div.style.backgroundColor = "rgb(" + div.animation_color.r + "," + div.animation_color.g + "," + div.animation_color.b + ")";
        return maxid++;
    }

    animationInterface.deleteObject = function (id) {
        var div = document.getElementById("animation_" + id);
        if (div) {
            div.parentNode.removeChild(div);
        }
    }

    return animationInterface;
}