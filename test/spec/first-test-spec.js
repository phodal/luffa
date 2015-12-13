describe("A suite", function () {
  it("contains spec with an expectation", function () {
    var parser = require('html2hscript');
    var fixtures = '<div><div><h1 foo="beep">Hello World</h1></div></div>';
    setFixtures(fixtures);
    parser(fixtures, function (err, hscript) {
      expect($(virtualDom.create(eval(hscript))).html()).toBe($(fixtures).html());
    });
  });
  it("should different id", function () {
    var originDOM = '<div id="test"><div id="example1"></div><h1 class="world">Hello World</h1></div></div>';
    var changeDOM = '<div id="test"><div id="example2"></div><h1 class="world">Hello World</h1></div></div>';

    var patches = luffa.diff(originDOM, changeDOM);

    expect(patches[1].patch.id).toBe("example2");
  });
  it("should different class", function () {
    var originDOM = '<div id="test"><div id="example"></div><h1 class="hello">Hello World</h1></div></div>';
    var changeDOM = '<div id="test"><div id="example"></div><h1 class="world">Hello World</h1></div></div>';

    var patches = luffa.diff(originDOM, changeDOM);

    expect(patches[2].patch.className).toBe("world");
  });
});
