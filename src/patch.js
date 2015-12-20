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
luffa.patch = function (rootNode, patches, renderOptions) {
  renderOptions = renderOptions || {};
  renderOptions.render = render;

  return patchRecursive(rootNode, patches, renderOptions)
};

luffa.ORIGIN_STYLE = 'background-color: #eee;';
luffa.CHANGE_STYLE = 'background-color: yellow;';
luffa.DELETE_STYLE = 'background-color: red;';
luffa.NEW_STYLE = 'background-color: green;';

function printInsert(applyNode) {
  console.log('%c' + $(applyNode.rootNode).prop('outerHTML').toString().replace('<luffa>', '%c').replace('</luffa>', '%c'), luffa.ORIGIN_STYLE, luffa.NEW_STYLE, luffa.ORIGIN_STYLE);
}

function printRemove(applyNode, originRootNodeHTML, patchIndex) {
  var newNode = $(applyNode.newNodes[patchIndex].newNode).prop('outerHTML');
  console.log('%c' + originRootNodeHTML.replace(newNode, '%c' + newNode + '%c'), luffa.ORIGIN_STYLE, luffa.DELETE_STYLE, luffa.ORIGIN_STYLE);
}

function printNode(applyNode, originRootNodeHTML, patchIndex) {
  var originNode = $(applyNode.newNodes[patchIndex].vNode).prop('outerHTML') || $(applyNode.newNodes[patchIndex].vNode).text();
  var newNode = $(applyNode.newNodes[patchIndex].newNode).prop('outerHTML');

  console.log('%c' + originRootNodeHTML.replace(originNode, '%c' + originNode + '%c') + ', %c' + newNode, luffa.ORIGIN_STYLE, luffa.CHANGE_STYLE, luffa.ORIGIN_STYLE, luffa.NEW_STYLE);
}

function printDefault(applyNode, originRootNodeHTML, patchIndex) {
  var newNode = $(applyNode.newNodes[patchIndex].newNode).prop('outerHTML');

  return console.log('%c' + originRootNodeHTML + ', %c' + newNode, luffa.ORIGIN_STYLE, luffa.CHANGE_STYLE);
}

function printString(applyNode, originRootNodeHTML, patchIndex) {
  var originHTML = $(render(applyNode.newNodes[patchIndex].vNode)).text();
  var changedHTML = $(applyNode.newNodes[patchIndex].newNode).text();

  return console.log('%c' + originRootNodeHTML.replace(originHTML, '%c' + originHTML + '%c') + ',%c' + changedHTML, luffa.ORIGIN_STYLE, luffa.CHANGE_STYLE, luffa.ORIGIN_STYLE, luffa.NEW_STYLE);
}

function printProp(applyNode, originRootNodeHTML, patchIndex) {
  var originHTML = $(render(applyNode.newNodes[patchIndex].vNode)).prop('outerHTML');
  var changedHTML = $(applyNode.newNodes[patchIndex].newNode).prop('outerHTML');

  return console.log('%c' + originRootNodeHTML.replace(originHTML, '%c' + originHTML + '%c') + ',%c' + changedHTML, luffa.ORIGIN_STYLE, luffa.CHANGE_STYLE, luffa.ORIGIN_STYLE, luffa.NEW_STYLE);
}

function printChange(originRootNodeHTML, applyNode) {
  var patchType;

  for (var patchIndex = 0; patchIndex < applyNode.newNodes.length; patchIndex++) {
    patchType = applyNode.newNodes[patchIndex].method;
    switch (patchType) {
      case 'insert':
        printInsert(applyNode);
        break;
      case 'node':
        printNode(applyNode, originRootNodeHTML, patchIndex);
        break;
      case 'remove':
        printRemove(applyNode, originRootNodeHTML, patchIndex);
        break;
      case 'string':
        printString(applyNode, originRootNodeHTML, patchIndex);
        break;
      case 'prop':
        printProp(applyNode, originRootNodeHTML, patchIndex);
        break;
      default:
        printDefault(applyNode, originRootNodeHTML, patchIndex);
    }
  }
}

function patchRecursive(rootNode, patches, renderOptions) {

  function patchIndices(patches) {
    var indices = [];
    for (var key in patches) {
      if (key !== "a") {
        indices.push(Number(key))
      }
    }

    return indices;
  }

  var indices = patchIndices(patches);
  if (indices.length === 0) {
    return rootNode
  }

  var index = domIndex(rootNode, patches.a, indices);
  var ownerDocument = rootNode.ownerDocument;
  var applyNode, originRootNodeHTML = $(rootNode.cloneNode(true)).prop("outerHTML");

  if (!renderOptions.document && ownerDocument !== document) {
    renderOptions.document = ownerDocument
  }

  for (var i = 0; i < indices.length; i++) {
    var nodeIndex = indices[i];
    applyNode = applyPatch(rootNode, index[nodeIndex], patches[nodeIndex], renderOptions);
    rootNode = applyNode.rootNode;
    printChange(originRootNodeHTML, applyNode);
  }

  return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
  if (!domNode) {
    return rootNode
  }

  var newNode;
  var newNodes = [];
  if (luffa.isArray(patchList)) {
    for (var i = 0; i < patchList.length; i++) {
      newNode = luffa.patchOp(patchList[i], domNode, renderOptions);
      newNodes.push(newNode);
      if (domNode === rootNode && newNode.parentNode !== null) {
        rootNode = newNode.parentNode
      }
    }
  } else {
    newNode = luffa.patchOp(patchList, domNode, renderOptions);
    newNodes.push(newNode);
    if (domNode === rootNode) {
      rootNode = newNode.parentNode
    }
  }

  return {
    rootNode: rootNode,
    newNodes: newNodes
  }
}
