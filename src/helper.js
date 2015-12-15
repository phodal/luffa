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


luffa.applyPatch = function (vpatch, domNode, renderOptions) {
  var type = vpatch.type
  var vNode = vpatch.vNode
  var patch = vpatch.patch
  var VPatch = VirtualPatch;

  switch (type) {
    case VPatch.REMOVE:
      return removeNode(domNode, vNode)
    case VPatch.INSERT:
      return insertNode(domNode, patch, renderOptions)
    case VPatch.VTEXT:
      return stringPatch(domNode, vNode, patch, renderOptions)
    case VPatch.WIDGET:
      return widgetPatch(domNode, vNode, patch, renderOptions)
    case VPatch.VNODE:
      return vNodePatch(domNode, vNode, patch, renderOptions)
    case VPatch.ORDER:
      reorderChildren(domNode, patch)
      return domNode
    case VPatch.PROPS:
      applyProperties(domNode, patch, vNode.properties)
      return domNode
    case VPatch.THUNK:
      return replaceRoot(domNode,
        renderOptions.patch(domNode, patch, renderOptions))
    default:
      return domNode
  }
}

function removeNode(domNode, vNode) {
  var parentNode = domNode.parentNode

  if (parentNode) {
    parentNode.removeChild(domNode)
  }

  destroyWidget(domNode, vNode);

  return null
}

function insertNode(parentNode, vNode, renderOptions) {
  var newNode = renderOptions.render(vNode, renderOptions)

  if (parentNode) {
    parentNode.appendChild(newNode)
  }

  return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
  var newNode

  if (domNode.nodeType === 3) {
    domNode.replaceData(0, domNode.length, vText.text)
    newNode = domNode
  } else {
    var parentNode = domNode.parentNode
    newNode = renderOptions.render(vText, renderOptions)

    if (parentNode && newNode !== domNode) {
      parentNode.replaceChild(newNode, domNode)
    }
  }

  return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
  var updating = updateWidget(leftVNode, widget)
  var newNode

  if (updating) {
    newNode = widget.update(leftVNode, domNode) || domNode
  } else {
    newNode = renderOptions.render(widget, renderOptions)
  }

  var parentNode = domNode.parentNode

  if (parentNode && newNode !== domNode) {
    parentNode.replaceChild(newNode, domNode)
  }

  if (!updating) {
    destroyWidget(domNode, leftVNode)
  }

  return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
  var parentNode = domNode.parentNode
  var newNode = renderOptions.render(vNode, renderOptions)

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
  var childNodes = domNode.childNodes
  var keyMap = {}
  var node
  var remove
  var insert

  for (var i = 0; i < moves.removes.length; i++) {
    remove = moves.removes[i]
    node = childNodes[remove.from]
    if (remove.key) {
      keyMap[remove.key] = node
    }
    domNode.removeChild(node)
  }

  var length = childNodes.length
  for (var j = 0; j < moves.inserts.length; j++) {
    insert = moves.inserts[j]
    node = keyMap[insert.key]
    // this is the weirdest bug i've ever seen in webkit
    domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
  }
}

function replaceRoot(oldRoot, newRoot) {
  if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
    oldRoot.parentNode.replaceChild(newRoot, oldRoot)
  }

  return newRoot;
}
