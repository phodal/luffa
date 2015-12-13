(function(global, factory) {
    "use strict";
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function(w) {
                if (!w.document) {
                    throw new Error("jQuery requires a window with a document");
                }
                return factory(w);
            };
    } else {
        factory(global);
    }

}(typeof window !== "undefined" ? window : this, function(window, noGlobal) {

  'use strict';


var luffa = function() {};

luffa.VERSION = '0.0.0';

window.lettuce = luffa;


if (typeof define === "function" && define.amd) {
    define("luffa", [], function () {
        return luffa;
    });
}
var strundefined = typeof undefined;
if (typeof noGlobal === strundefined) {
    window.luffa = luffa;
}
return luffa;
}));

