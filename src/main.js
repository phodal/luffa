var luffa = function () {
};

luffa.VERSION = '@@version';

window.luffa = luffa;
var h = virtualDom.h;
var diff = virtualDom.diff;
var patch = virtualDom.patch;
var render = virtualDom.create;
var parser = require('html2hscript');

luffa.compare = function (fixtures, change) {
  var leftNode = "", rightNode = "";
  parser(fixtures, function (err, hscript) {
    leftNode = eval(hscript);
  });

  parser(change, function (err, hscript) {
    rightNode = eval(hscript);
  });

  var patches = diff(leftNode, rightNode);
  var newRoot = luffa.patch(virtualDom.create(leftNode), patches);
  return newRoot;
};
