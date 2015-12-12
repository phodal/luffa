describe("A suite", function () {
  it("contains spec with an expectation", function () {
    var parser = require('html2hscript');
    var h = virtualDom.h;
    var fixtures = '<div><div><h1 foo="beep">Hello World</h1></div></div>';
    setFixtures(fixtures);
    parser(fixtures, function (err, hscript) {
      expect($(virtualDom.create(eval(hscript))).html()).toBe($(fixtures).html());
    });
  });
  it("should different", function () {
    var parser = require('html2hscript');
    var vDOM = virtualDom;
    var h = vDOM.h;

    var originDOM = '<div id="test"><div id="example"></div><h1 class="hello">Hello World</h1></div></div>';
    var changeDOM = '<div id="test"><div id="example"></div><h1 class="world">Hello World</h1></div></div>';

    var result, expected;
    parser(originDOM, function (err, hscript) {
      result = eval(hscript);
    });
    parser(changeDOM, function (err, hscript) {
      expected = eval(hscript);
    });
    var patches = vDOM.diff(result, expected);
    expect(patches[2].patch.className).toBe("world");
  });
});
