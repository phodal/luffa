(function (global, factory) {
  "use strict";
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = global.document ?
      factory(global, true) :
      function (w) {
        if (!w.document) {
          throw new Error("jQuery requires a window with a document");
        }
        return factory(w);
      };
  } else {
    factory(global);
  }

}(typeof window !== "undefined" ? window : this, function (window, noGlobal) {

  'use strict';


var luffa = function () {
};

luffa.VERSION = '0.0.0';

window.luffa = luffa;
var h = virtualDom.h;
var diff = virtualDom.diff;
var patch = virtualDom.patch;
var render = virtualDom.create;

var parser = require('html2hscript');

luffa.diff = function (originDOM, changeDOM) {
  var result, expected;
  parser(originDOM, function (err, hscript) {
    result = eval(hscript);
  });
  parser(changeDOM, function (err, hscript) {
    expected = eval(hscript);
  });
  return diff(result, expected);
};

luffa.getDiffDom = function (patches) {
  //var PATCH_TYPE = {
  //  NONE: 0,
  //  VTEXT: 1,
  //  VNODE: 2,
  //  WIDGET: 3,
  //  PROPS: 4,
  //  ORDER: 5,
  //  INSERT: 6,
  //  REMOVE: 7,
  //  THUNK: 8
  //};
  var TYPE = ['NONE', 'VTEXT', 'VNODE', 'WIDGET', 'PROPS', 'ORDER', 'INSERT', 'REMOVE', 'THUNK'];
  var patchesKeys = Object.keys(patches);
  var results = [], index = 0;
  for (var patchKey in patchesKeys) {
    if (patchKey === 'a') {
      return;
    }
    var result = {};
    result.type = TYPE[patches[index].type];
    result.html = render(patches[index].patch);
    results.push(result);
  }
  return results;
};


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

