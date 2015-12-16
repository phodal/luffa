describe("Generator Change", function () {
  var parser, fixtures;
  beforeEach(function () {
    parser = require('html2hscript');
    fixtures = '<div id="test"><div id="example"><h1 class="hello">Hello World</h1></div></div>';
    setFixtures(fixtures);
  });
  it("should return changed class", function () {
    $(".hello").attr('class', 'hello world');
    parser($("#test").html(), function (err, hscript) {
      var changedDOM = virtualDom.create(eval(hscript)).outerHTML;
      var patches = luffa.diff($(fixtures).html(), changedDOM);
      var className = luffa.getDiffDom(patches)[0].prop;

      expect(className).toBe("hello world");
    });
  });
  it("should return append class", function () {
    var span = '<span>fsafaf</span>';
    $(".hello").append(span);
    parser($("#test").html(), function (err, hscript) {
      var changedDOM = virtualDom.create(eval(hscript)).outerHTML;
      var patches = luffa.diff($(fixtures).html(), changedDOM);
      var html = luffa.getDiffDom(patches)[0].prop;
      expect(html).toBe(span);
    });
  });
  it("should return remove change", function () {
    var change = '<div id="example"></div>';
    parser(change, function (err, hscript) {
      var changedDOM = virtualDom.create(eval(hscript)).outerHTML;
      var patches = luffa.diff($(fixtures).html(), changedDOM);
      var html = luffa.getDiffDom(patches)[0].prop;
      expect(html).toBe(null);
    });
  });
  it("should return remove change", function () {
    var change = '<div id="example"><h1 class="hello">World</h1></div>';
    parser(change, function (err, hscript) {
      var changedDOM = virtualDom.create(eval(hscript)).outerHTML;
      var patches = luffa.diff($(fixtures).html(), changedDOM);
      var html = luffa.getDiffDom(patches)[0].prop;
      expect(html).toBe('World');
    });
  });
  it("should return node change", function () {
    var change = '<div id="example"><h1 class="hello">Hello World</h1><h2 class="hello">Hello World</h2></div>';
    parser(change, function (err, hscript) {
      var changedDOM = virtualDom.create(eval(hscript)).outerHTML;
      var patches = luffa.diff($(fixtures).html(), changedDOM);
      var html = luffa.getDiffDom(patches)[0].prop;
      expect(html).toBe('<h2 class="hello">Hello World</h2>');
    });
  });
});

describe("Generator complicate Change", function () {
  var parser, fixtures;
  beforeEach(function () {
    parser = require('html2hscript');
    fixtures = '<div id="test"><div id="example"><h1 class="hello">Hello World</h1></div></div>';
    setFixtures(fixtures);
  });
  it("should return multi change", function () {
    var change = '<div id="example"><h1 class="world">Hello World</h1><h2 class="hello">Hello World</h2></div>';
    parser(change, function (err, hscript) {
      var changedDOM = virtualDom.create(eval(hscript)).outerHTML;
      var patches = luffa.diff($(fixtures).html(), changedDOM);
      var html = luffa.getDiffDom(patches)[0].prop;
      expect(html).toBe('<h2 class="hello">Hello World</h2>');
      var html = luffa.getDiffDom(patches)[1].prop;
      expect(html).toBe('world');
    });
  });
  it("should return multi change with Array", function () {
    fixtures = '<div id="test"><div id="example"><h1 class="hello">Hello World</h1></div><div id="example2">hello</div></div>';
    var change = '<div id="example"><h1 class="world">Hello World</h1><h2 class="hello">Hello World</h2><div id="example2">world</div></div>';
    parser(change, function (err, hscript) {
      var changedDOM = virtualDom.create(eval(hscript)).outerHTML;
      var patches = luffa.diff($(fixtures).html(), changedDOM);

      expect(luffa.getDiffDom(patches)[0][0].prop).toBe('example');
      expect(luffa.getDiffDom(patches)[0][1].prop).toBe('<h2 class="hello">Hello World</h2>');
      expect(luffa.getDiffDom(patches)[0][2].prop).toBe('<div id="example2">world</div>');
      expect(luffa.getDiffDom(patches)[1].prop).toBe('<h1 class="world">Hello World</h1>');
    });
  });
  it("should return multi change with Array 2", function () {
    fixtures = '<div id="test"><div id="example"><h1 class="hello">Hello World</h1></div><div id="example2">hello</div></div>';
    var change = '<div id="example"><p><h1 class="world">Hello World</h1></p><div id="example2"><h2 class="hello">world</h2></div></div>';
    parser(change, function (err, hscript) {
      var changedDOM = virtualDom.create(eval(hscript)).outerHTML;
      var patches = luffa.diff($(fixtures).html(), changedDOM);

      expect(luffa.getDiffDom(patches)[0][0].prop).toBe('example');
      expect(luffa.getDiffDom(patches)[0][1].prop).toBe('<h1 class="world">Hello World</h1>');
      expect(luffa.getDiffDom(patches)[0][2].prop).toBe('<p></p>');
      expect(luffa.getDiffDom(patches)[0][3].prop).toBe('<div id="example2"><h2 class="hello">world</h2></div>');
      expect(luffa.getDiffDom(patches)[1].prop).toBe('<p></p>');
    });
  });
});
