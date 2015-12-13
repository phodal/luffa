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

