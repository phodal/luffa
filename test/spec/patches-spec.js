describe("Patches Test", function () {
  var parser, tmpDIV, fixtures;
  beforeEach(function () {
    parser = require('html2hscript');
    tmpDIV = document.createElement("div");
    fixtures = '<div id="test"><div id="example"><h1 class="hello">Hello World</h1></div></div>';
    setFixtures(fixtures);
  });

  it("should diff result with insert change", function () {
    var newDIV = '<div id="test"><div id="example"><h2 class="hello"><span>Hello World</span></h2><h2 class="hello"><span>Hello World</span></h2></div></div>';
    parser($("#test").html(), function (err, hscript) {
      tmpDIV.appendChild(virtualDom.create(eval(hscript)));
      var patches = luffa.diff($(fixtures).html(), $(newDIV).html());

      var compareDIV = document.createElement("div");
      compareDIV.appendChild(luffa.getDiffDom(patches)[0].html);
      expect($(compareDIV).html()).toBe('<h2 class="hello"><span>Hello World</span></h2>');
      expect(luffa.getDiffDom(patches)[0].type).toBe('INSERT');

      var compareDIV2 = document.createElement("div");
      compareDIV2.appendChild(luffa.getDiffDom(patches)[1].html);
      expect($(compareDIV2).html()).toBe('<h2 class="hello"><span>Hello World</span></h2>');
      expect(luffa.getDiffDom(patches)[1].type).toBe('VNODE');
    });
  });

  it("should diff result with class change", function () {
    var newDIV = '<div id="test"><div id="example"><h1 class="world">Hello World</h1></div></div>';
    parser($("#test").html(), function (err, hscript) {
      tmpDIV.appendChild(virtualDom.create(eval(hscript)));
      var patches = luffa.diff($(fixtures).html(), $(newDIV).html());
      expect(luffa.getDiffDom(patches)[0].type).toBe('PROPS');
    });
  });

  it("should return empty dom", function () {
    var newDIV = '<div id="test"><div id="example"><h1 class="hello">Hello World</h1></div></div>';
    parser($("#test").html(), function (err, hscript) {
      tmpDIV.appendChild(virtualDom.create(eval(hscript)));
      var patches = luffa.diff($(fixtures).html(), $(newDIV).html());
      expect(luffa.getDiffDom(patches).length).toBe(0);
    });
  });

  it("should return VTEXT dom", function () {
    var newDIV = '<div id="test"><div id="example"><h1 class="hello">World</h1></div></div>';
    parser($("#test").html(), function (err, hscript) {
      tmpDIV.appendChild(virtualDom.create(eval(hscript)));
      var patches = luffa.diff($(fixtures).html(), $(newDIV).html());
      expect(luffa.getDiffDom(patches)[0].type).toBe('VTEXT');
    });
  });

  it("should return REMOVE dom", function () {
    fixtures = '<div id="test"><select id="select"><option value="1">1</option><option value="2">2</option></select></div>';
    setFixtures(fixtures);
    var newDIV = '<div id="test"><select id="select"><option value="1">1</option></select></div>';
    parser($("#test").html(), function (err, hscript) {
      tmpDIV.appendChild(virtualDom.create(eval(hscript)));
      var patches = luffa.diff($(fixtures).html(), $(newDIV).html());
      expect(luffa.getDiffDom(patches)[0].type).toBe('REMOVE');
    });
  });
});


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
    expect($(newRoot).prop("outerHTML")).toBe('<div id="example"><h1 class="hello">Hello World</h1><h2>fs</h2></div>');
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
    fixtures = '<div id="example"><h1 class="hello">Hello World</h1><h2>fs</h2></div>';
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
});
