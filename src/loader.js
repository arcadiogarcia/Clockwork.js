// Default loader for the clockwork engine
//Arcadio Garcia Salvadores


var defaultLoader = (function (DOMelement) {
    this.show = function () {
        DOMelement.style.visibility = "visible";
    }
    this.hide = function () {
        DOMelement.style.visibility = "hidden";
    }
});