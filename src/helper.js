luffa.isObject = function (x) {
  return typeof x === "object" && x !== null;
};

luffa.isArray = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};
