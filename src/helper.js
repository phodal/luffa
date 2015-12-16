luffa.isObject = function (x) {
  return typeof x === "object" && x !== null;
};

luffa.isArray = Array.isArray || function (arr) {
    return toString.call(arr) == '[object Array]';
  };

luffa.isHook = function (hook) {
  hook &&
  (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
  typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
};
