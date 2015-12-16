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
  if (patch.patch.className) {
    return patch.patch.className;
  } else if (patch.patch.id) {
    return patch.patch.id;
  }
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
  switch (result.type) {
    case 'PROPS':
      result.prop = luffa.handleProps(patches[key]);
      break;
    case 'INSERT':
      result.prop = luffa.handleInsert(result.html);
      break;
    case 'VNODE':
      result.prop = luffa.handleInsert(result.html);
      break;
    case 'REMOVE':
      result.prop = luffa.handleRemove(result.html);
      break;
    case 'VTEXT':
      result.prop = luffa.handleVText(patches[key]);
      break;
    default:
      result.prop = null;
  }

  return result;
}

function getSubResults(patchIndex, patches) {
  var subPatchesKeys = Object.keys(patches[patchIndex]);
  var subResults = [];
  for (var subIndex in subPatchesKeys) {
    subResults.push(createResult(patches[patchIndex], subIndex))
  }
  return subResults
}

luffa.getDiffDom = function (patches) {
  var patchesKeys = Object.keys(patches);
  var results = [];
  for (var index in patchesKeys) {
    var patchIndex = patchesKeys[index];
    if (patchIndex !== 'a') {
      var result;

      if (luffa.isArray(patches[patchIndex])) {
        result = getSubResults(patchIndex, patches);
      } else {
        result = createResult(patches, patchIndex);
      }
      results.push(result);
    }
  }
  return results;
};
