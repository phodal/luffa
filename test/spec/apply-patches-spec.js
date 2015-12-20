describe("Apply Patches", function () {
  var parser, fixtures;
  beforeEach(function () {
    parser = require('html2hscript');
  });
  it("should return multi change", function () {
    var leftNode = "", rightNode = "";
    fixtures = '<div id="example"><h1 class="hello">Hello World</h1></div>';
    var change = '<div id="example"><h2 class="world">Hello World</h2></div>';
    parser(fixtures, function (err, hscript) {
      leftNode = eval(hscript);
    });

    parser(change, function (err, hscript) {
      rightNode = eval(hscript);
    });

    function createElementCustom(vnode) {
      var created = virtualDom.create(vnode);
      created.customCreation = true;
      return created
    }

    var root = createElementCustom(leftNode);
    var patches = diff(leftNode, rightNode);
    var newRoot = luffa.patch(root, patches, {render: createElementCustom});
    expect($(newRoot).prop("outerHTML")).toBe('<div id="example"><h2 class="world">Hello World</h2></div>');
  });
  it("should able patch insert", function () {
    var leftNode = "", rightNode = "";
    fixtures = '<div id="example"><h1 class="hello">Hello World</h1></div>';
    var change = '<div id="example"><h1 class="hello">Hello World</h1><h2>fs</h2></div>';
    parser(fixtures, function (err, hscript) {
      leftNode = eval(hscript);
    });

    parser(change, function (err, hscript) {
      rightNode = eval(hscript);
    });

    var patches = diff(leftNode, rightNode);
    var newRoot = luffa.patch(virtualDom.create(leftNode), patches);
    expect($(newRoot).prop("outerHTML")).toBe('<div id="example"><h1 class="hello">Hello World</h1><luffa><h2>fs</h2></luffa></div>');
  });
  it("should able patch remove", function () {
    var leftNode = "", rightNode = "";
    fixtures = '<div id="example"><h1 class="hello">Hello World</h1><h2>fs</h2></div>';
    var change = '<div id="example"><h1 class="hello">Hello World</h1></div>';
    parser(fixtures, function (err, hscript) {
      leftNode = eval(hscript);
    });

    parser(change, function (err, hscript) {
      rightNode = eval(hscript);
    });

    var patches = diff(leftNode, rightNode);
    var newRoot = luffa.patch(virtualDom.create(leftNode), patches);
    expect($(newRoot).prop("outerHTML")).toBe('<div id="example"><h1 class="hello">Hello World</h1></div>');
  });
  it("should able patch props", function () {
    var leftNode = "", rightNode = "";
    fixtures = '<div id="example"><h1 class="hello">Hello World</h1><h2>fs</h2></div>';
    var change = '<div id="example"><h1 class="hello" data-title="world" style="display:none">Hello World</h1><h2>fs</h2></div>';
    parser(fixtures, function (err, hscript) {
      leftNode = eval(hscript);
    });

    parser(change, function (err, hscript) {
      rightNode = eval(hscript);
    });

    var patches = diff(leftNode, rightNode);
    var newRoot = luffa.patch(virtualDom.create(leftNode), patches);
    expect($(newRoot).prop("outerHTML")).toBe('<div id="example"><h1 class="hello" data-title="world" style="display: none;">Hello World</h1><h2>fs</h2></div>');
  });
  it("should able patch remove props", function () {
    var leftNode = "", rightNode = "";
    fixtures = '<div id="example"><h1 class="hello" style="display:none">Hello World</h1><h2>fs</h2></div>';
    var change = '<div id="example"><h1 class="hello">Hello World</h1><h2>fs</h2></div>';
    parser(fixtures, function (err, hscript) {
      leftNode = eval(hscript);
    });

    parser(change, function (err, hscript) {
      rightNode = eval(hscript);
    });

    var patches = diff(leftNode, rightNode);
    var newRoot = luffa.patch(virtualDom.create(leftNode), patches);
    expect($(newRoot).prop("outerHTML")).toBe('<div id="example"><h1 class="hello">Hello World</h1><h2>fs</h2></div>');
  });
  it("should able patch text", function () {
    var leftNode = "", rightNode = "";
    fixtures = '<div id="example"><h1 class="hello">Hello World</h1><h2>FSSSSS</h2></div>';
    var change = '<div id="example"><h1 class="hello">Hello</h1><h2>fs</h2></div>';
    parser(fixtures, function (err, hscript) {
      leftNode = eval(hscript);
    });

    parser(change, function (err, hscript) {
      rightNode = eval(hscript);
    });

    var patches = diff(leftNode, rightNode);
    var newRoot = luffa.patch(virtualDom.create(leftNode), patches);
    expect($(newRoot).prop("outerHTML")).toBe('<div id="example"><h1 class="hello">Hello</h1><h2>fs</h2></div>');
  });
  it("should able patch text", function () {
    var leftNode = "", rightNode = "";
    fixtures = '<div id="example"><select name="select" id="select"><option value="1">1</option><option value="2">2</option></select></div>';
    var change = '<div id="example"><select name="select" id="select"><option value="2">2</option><option value="1">1</option></select></div>';
    parser(fixtures, function (err, hscript) {
      leftNode = eval(hscript);
    });

    parser(change, function (err, hscript) {
      rightNode = eval(hscript);
    });

    var patches = diff(leftNode, rightNode);
    var newRoot = luffa.patch(virtualDom.create(leftNode), patches);
    expect($(newRoot).prop("outerHTML")).toBe('<div id="example"><select name="select" id="select"><option value="2">2</option><option value="1">1</option></select></div>');
  });
  it("should able check multi change", function () {
    var leftNode = "", rightNode = "";
    fixtures = '<div id="test"><div id="example"><h1 class="hello">Hello World</h1></div><div id="example2">world</div></div>';
    var change = '<div id="test"><div id="example"><h1 class="world">World</h1></div><div id="example2"><h2 class="hello">world</h2></div></div>';
    parser(fixtures, function (err, hscript) {
      leftNode = eval(hscript);
    });

    parser(change, function (err, hscript) {
      rightNode = eval(hscript);
    });

    var patches = diff(leftNode, rightNode);
    var newRoot = luffa.patch(virtualDom.create(leftNode), patches);
    expect($(newRoot).prop("outerHTML")).toBe('<div id="test"><div id="example"><h1 class="world">World</h1></div><div id="example2"><h2 class="hello">world</h2></div></div>');
  });
});
