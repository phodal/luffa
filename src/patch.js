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

luffa.patch = function (rootNode, patches, renderOptions) {
  renderOptions = renderOptions || {};
  renderOptions.render = render;

  return patchRecursive(rootNode, patches, renderOptions)
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
    rootNode = applyPatch(rootNode, index[nodeIndex], patches[nodeIndex], renderOptions)
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
        rootNode = newNode.parentNode
      }
    }
  } else {
    newNode = luffa.patchOp(patchList, domNode, renderOptions);
    if (domNode === rootNode) {
      rootNode = newNode.parentNode
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
