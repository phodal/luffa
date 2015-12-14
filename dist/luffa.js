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

luffa.VERSION = '@@version';

window.luffa = luffa;
var h = virtualDom.h;
var diff = virtualDom.diff;
var patch = virtualDom.patch;
var render = virtualDom.create;

var parser = require('html2hscript');

luffa.diff = function (originDOM, changeDOM) {
  var result = virtualDom.VNode("div"),
    expected = virtualDom.VNode("div");

  parser(originDOM, function (err, hscript) {
    result = eval(hscript);
  });
  parser(changeDOM, function (err, hscript) {
    expected = eval(hscript);
  });

  return diff(result, expected);
};

luffa.handleProps = function (patch) {
  console.log(patch.patch);
  var result = "";
  if (patch.className) {
    result = 'class="' + className + '"'
  }
  return result;
};

luffa.getDiffDom = function (patches) {
  var TYPE = ['NONE', 'VTEXT', 'VNODE', 'WIDGET', 'PROPS', 'ORDER', 'INSERT', 'REMOVE', 'THUNK'];
  var patchesKeys = Object.keys(patches);
  var results = [];
  for (var index in patchesKeys) {
    var key = patchesKeys[index];
    if (key === 'a') {
      break;
    }
    var result = {};
    result.type = TYPE[patches[key].type];
    result.html = render(patches[key].patch);
    if (result.type === 'PROPS') {
      result.html = luffa.handleProps(patches[key]);
    }
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

