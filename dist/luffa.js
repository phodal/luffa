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
  return patch.patch.className;
};

luffa.handleInsert = function (html) {
  return $(html).prop("outerHTML");
};

luffa.handleRemove = function (html) {
  return null;
};

luffa.handleVText = function (patch) {
  return patch.patch.text;
};

function createResult(patches, key) {
  var result = {};
  var TYPE = ['NONE', 'VTEXT', 'VNODE', 'WIDGET', 'PROPS', 'ORDER', 'INSERT', 'REMOVE', 'THUNK'];
  result.type = TYPE[patches[key].type];
  result.html = render(patches[key].patch);
  if (result.type === 'PROPS') {
    result.prop = luffa.handleProps(patches[key]);
  }
  if (result.type === 'INSERT') {
    result.prop = luffa.handleInsert(result.html);
  }
  if (result.type === 'REMOVE') {
    result.prop = luffa.handleRemove(result.html);
  }
  if (result.type === 'VTEXT') {
    result.prop = luffa.handleVText(patches[key]);
  }

  return result;
}

luffa.getDiffDom = function (patches) {
  var patchesKeys = Object.keys(patches);
  var results = [];
  for (var index in patchesKeys) {
    var patch = patchesKeys[index];
    var subResult = {};
    // is one node have many diff
    if (luffa.isArray(patch)) {
      var subKeys = Object.keys(patch);
      for(var subKey in subKeys){
        subResult.push(createResult(patches[patch], subKey))
      }
      results.push(subResult);
    }
    if (patch === 'a') {
      break;
    }
    results.push(createResult(patches, patch));
  }
  return results;
};


luffa.isObject = function (x) {
  return typeof x === "object" && x !== null;
};

luffa.isArray = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
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

