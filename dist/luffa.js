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


luffa.isObject = function (x) {
  return typeof x === "object" && x !== null;
};

luffa.isArray = Array.isArray || function (arr) {
    return toString.call(arr) == '[object Array]';
  };



//Copyright (c) 2014 Matt-Esch.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//THE SOFTWARE.

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

function VirtualPatch(type, vNode, patch) {
  this.type = Number(type)
  this.vNode = vNode
  this.patch = patch
}

VirtualPatch.prototype.type = "VirtualPatch";

var noChild = {};
function domIndex(rootNode, tree, indices, nodes) {
  if (!indices || indices.length === 0) {
    return {}
  } else {
    indices.sort(ascending)
    return recurse(rootNode, tree, indices, nodes, 0)
  }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
  nodes = nodes || {};
  if (rootNode) {
    if (indexInRange(indices, rootIndex, rootIndex)) {
      nodes[rootIndex] = rootNode
    }
    var vChildren = tree.children;
    if (vChildren) {
      var childNodes = rootNode.childNodes;
      for (var i = 0; i < tree.children.length; i++) {
        rootIndex += 1;

        var vChild = vChildren[i] || noChild;
        var nextIndex = rootIndex + (vChild.count || 0);

        // skip recursion down the tree if there are no nodes down here
        if (indexInRange(indices, rootIndex, nextIndex)) {
          recurse(childNodes[i], vChild, indices, nodes, rootIndex)
        }
        rootIndex = nextIndex
      }
    }
  }

  return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
  if (indices.length === 0) {
    return false
  }

  var minIndex = 0;
  var maxIndex = indices.length - 1;
  var currentIndex;
  var currentItem;

  while (minIndex <= maxIndex) {
    currentIndex = ((maxIndex + minIndex) / 2) >> 0;
    currentItem = indices[currentIndex];

    if (minIndex === maxIndex) {
      return currentItem >= left && currentItem <= right
    } else if (currentItem < left) {
      minIndex = currentIndex + 1
    } else if (currentItem > right) {
      maxIndex = currentIndex - 1
    } else {
      return true
    }
  }

  return false;
}

function ascending(a, b) {
  return a > b ? 1 : -1
}

luffa.patch = function (rootNode, patches, renderOptions) {
  renderOptions = renderOptions || {};
  renderOptions.patch = patchRecursive;
  renderOptions.render = render;

  return renderOptions.patch(rootNode, patches, renderOptions)
};

function patchRecursive(rootNode, patches, renderOptions) {
  var indices = patchIndices(patches);

  if (indices.length === 0) {
    return rootNode
  }

  var index = domIndex(rootNode, patches.a, indices);
  var ownerDocument = rootNode.ownerDocument;

  if (!renderOptions.document && ownerDocument !== document) {
    renderOptions.document = ownerDocument
  }

  for (var i = 0; i < indices.length; i++) {
    var nodeIndex = indices[i];
    rootNode = applyPatch(rootNode,
      index[nodeIndex],
      patches[nodeIndex],
      renderOptions)
  }

  return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
  if (!domNode) {
    return rootNode
  }

  var newNode;
  if (luffa.isArray(patchList)) {
    for (var i = 0; i < patchList.length; i++) {
      newNode = luffa.patchOp(patchList[i], domNode, renderOptions);

      if (domNode === rootNode) {
        rootNode = newNode
      }
    }
  } else {
    newNode = luffa.patchOp(patchList, domNode, renderOptions);

    if (domNode === rootNode) {
      rootNode = newNode
    }
  }

  return rootNode
}

function patchIndices(patches) {
  var indices = [];

  for (var key in patches) {
    if (key !== "a") {
      indices.push(Number(key))
    }
  }

  return indices
}



//Copyright (c) 2014 Matt-Esch.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//THE SOFTWARE.

luffa.patchOp = function (vpatch, domNode, renderOptions) {
  var type = vpatch.type;
  var vNode = vpatch.vNode;
  var patch = vpatch.patch;
  var VPatch = VirtualPatch;

  switch (type) {
    case VPatch.REMOVE:
      return removeNode(domNode, vNode);
    case VPatch.INSERT:
      return insertNode(domNode, patch, renderOptions);
    case VPatch.VTEXT:
      return stringPatch(domNode, vNode, patch, renderOptions);
    case VPatch.WIDGET:
      return widgetPatch(domNode, vNode, patch, renderOptions);
    case VPatch.VNODE:
      return vNodePatch(domNode, vNode, patch, renderOptions);
    case VPatch.ORDER:
      reorderChildren(domNode, patch);
      return domNode;
    case VPatch.PROPS:
      applyProperties(domNode, patch, vNode.properties);
      return domNode;
    case VPatch.THUNK:
      return replaceRoot(domNode,
        renderOptions.patch(domNode, patch, renderOptions));
    default:
      return domNode
  }
};

function removeNode(domNode, vNode) {
  var parentNode = domNode.parentNode;

  if (parentNode) {
    parentNode.removeChild(domNode)
  }

  destroyWidget(domNode, vNode);

  return null
}

function insertNode(parentNode, vNode, renderOptions) {
  var newNode = renderOptions.render(vNode, renderOptions);

  if (parentNode) {
    parentNode.appendChild(newNode)
  }

  return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
  var newNode;

  if (domNode.nodeType === 3) {
    domNode.replaceData(0, domNode.length, vText.text);
    newNode = domNode
  } else {
    var parentNode = domNode.parentNode;
    newNode = renderOptions.render(vText, renderOptions);

    if (parentNode && newNode !== domNode) {
      parentNode.replaceChild(newNode, domNode)
    }
  }

  return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
  var updating = updateWidget(leftVNode, widget);
  var newNode;

  if (updating) {
    newNode = widget.update(leftVNode, domNode) || domNode
  } else {
    newNode = renderOptions.render(widget, renderOptions)
  }

  var parentNode = domNode.parentNode;

  if (parentNode && newNode !== domNode) {
    parentNode.replaceChild(newNode, domNode)
  }

  if (!updating) {
    destroyWidget(domNode, leftVNode)
  }

  return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
  var parentNode = domNode.parentNode;
  var newNode = renderOptions.render(vNode, renderOptions);

  if (parentNode && newNode !== domNode) {
    parentNode.replaceChild(newNode, domNode)
  }

  return newNode
}

function destroyWidget(domNode, w) {
  if (typeof w.destroy === "function" && isWidget(w)) {
    w.destroy(domNode)
  }
}

function reorderChildren(domNode, moves) {
  var childNodes = domNode.childNodes;
  var keyMap = {};
  var node;
  var remove;
  var insert;

  for (var i = 0; i < moves.removes.length; i++) {
    remove = moves.removes[i];
    node = childNodes[remove.from];
    if (remove.key) {
      keyMap[remove.key] = node
    }
    domNode.removeChild(node)
  }

  var length = childNodes.length;
  for (var j = 0; j < moves.inserts.length; j++) {
    insert = moves.inserts[j];
    node = keyMap[insert.key];
    // this is the weirdest bug i've ever seen in webkit
    domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to]);
  }
}

function replaceRoot(oldRoot, newRoot) {
  if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
    oldRoot.parentNode.replaceChild(newRoot, oldRoot)
  }

  return newRoot;
}

function applyProperties(node, props, previous) {
  for (var propName in props) {
    var propValue = props[propName]

    if (propValue === undefined) {
      removeProperty(node, propName, propValue, previous);
    } else if (isHook(propValue)) {
      removeProperty(node, propName, propValue, previous)
      if (propValue.hook) {
        propValue.hook(node,
          propName,
          previous ? previous[propName] : undefined)
      }
    } else {
      if (isObject(propValue)) {
        patchObject(node, props, previous, propName, propValue);
      } else {
        node[propName] = propValue
      }
    }
  }
}


function isHook(hook) {
  return hook &&
    (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
    typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

function removeProperty(node, propName, propValue, previous) {
  if (previous) {
    var previousValue = previous[propName]

    if (!isHook(previousValue)) {
      if (propName === "attributes") {
        for (var attrName in previousValue) {
          node.removeAttribute(attrName)
        }
      } else if (propName === "style") {
        for (var i in previousValue) {
          node.style[i] = ""
        }
      } else if (typeof previousValue === "string") {
        node[propName] = ""
      } else {
        node[propName] = null
      }
    } else if (previousValue.unhook) {
      previousValue.unhook(node, propName, propValue)
    }
  }
}

function patchObject(node, props, previous, propName, propValue) {
  var previousValue = previous ? previous[propName] : undefined

  // Set attributes
  if (propName === "attributes") {
    for (var attrName in propValue) {
      var attrValue = propValue[attrName]

      if (attrValue === undefined) {
        node.removeAttribute(attrName)
      } else {
        node.setAttribute(attrName, attrValue)
      }
    }

    return
  }

  if(previousValue && isObject(previousValue) &&
    getPrototype(previousValue) !== getPrototype(propValue)) {
    node[propName] = propValue
    return
  }

  if (!isObject(node[propName])) {
    node[propName] = {}
  }

  var replacer = propName === "style" ? "" : undefined

  for (var k in propValue) {
    var value = propValue[k]
    node[propName][k] = (value === undefined) ? replacer : value
  }
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}


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

