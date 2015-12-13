var h = virtualDom.h;
var diff = virtualDom.diff;
var patch = virtualDom.patch;

isObject = luffa.isObject;

function diffProps(a, b) {
  var diff;

  for (var aKey in a) {
    if (!(aKey in b)) {
      diff = diff || {};
      diff[aKey] = undefined
    }

    var aValue = a[aKey];
    var bValue = b[aKey];

    if (aValue === bValue) {
      continue
    } else if (isObject(aValue) && isObject(bValue)) {
      if (getPrototype(bValue) !== getPrototype(aValue)) {
        diff = diff || {};
        diff[aKey] = bValue
      } else if (isHook(bValue)) {
        diff = diff || {};
        diff[aKey] = bValue
      } else {
        var objectDiff = diffProps(aValue, bValue);
        if (objectDiff) {
          diff = diff || {};
          diff[aKey] = objectDiff
        }
      }
    } else {
      diff = diff || {};
      diff[aKey] = bValue
    }
  }

  for (var bKey in b) {
    if (!(bKey in a)) {
      diff = diff || {};
      diff[bKey] = b[bKey]
    }
  }

  return diff
}
