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
