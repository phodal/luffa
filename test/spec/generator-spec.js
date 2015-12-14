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
});

