var isObject = require("is-object");
var h = virtualDom.h;
var diff = virtualDom.diff;
var patch = virtualDom.patch;

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}
function isHook(hook) {
  return hook &&
    (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
    typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

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
