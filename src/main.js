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
  var prop = "";
  if (patch.patch && patch.patch.className) {
    prop = patch.patch.className;
  }
  return prop;
};

luffa.handleInsert = function (html) {
  return $(html).prop("outerHTML");
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
      result.prop = luffa.handleProps(patches[key]);
    }
    if (result.type === 'INSERT') {
      result.prop = luffa.handleInsert(result.html);
    }
    results.push(result);
  }
  return results;
};
