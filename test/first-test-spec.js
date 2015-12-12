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
})
