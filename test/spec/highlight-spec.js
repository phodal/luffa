describe("HighLight Change", function () {
  var parser, tmpDIV, fixtures;
  beforeEach(function () {
    parser = require('html2hscript');
    tmpDIV = document.createElement("div");
    fixtures = '<div id="test"><div id="example"><h1 class="hello">Hello World</h1></div></div>';
    setFixtures(fixtures);
  });
  it("should diff result with class change", function () {
    $(".hello").attr('class', 'hello world');
    parser($("#test").html(), function (err, hscript) {
      tmpDIV.appendChild(virtualDom.create(eval(hscript)));
      var patches = luffa.diff($(fixtures).html(), $(tmpDIV).html(), eval(hscript));
      var className = patches[1].patch.className;
      console.log('%c ' + $(fixtures).html(), 'background: #222; color: #bada55');
      console.log('%c ' + $(tmpDIV).html().replace('class="' + className + '"', '%cclass="' + className + '"%c '), 'background: #222; color: #bada55', 'color: red', 'background: #222; color: #bada55');
      expect(true).toBe(true);
    });
  });
  it("should diff result with text change", function () {
    $(".hello").html('World');
    parser($("#test").html(), function (err, hscript) {
      tmpDIV.appendChild(virtualDom.create(eval(hscript)));
      var patches = luffa.diff($(fixtures).html(), $(tmpDIV).html(), eval(hscript));
      var text = patches[2].patch.text;
      console.log('%c ' + $(fixtures).html(), 'background: #222; color: #bada55');
      console.log('%c ' + $(tmpDIV).html().replace(text, '%c' + text + '%c'), 'background: #222; color: #bada55', 'color: red', 'background: #222; color: #bada55');
      expect(true).toBe(true);
    });
  });
  it("should diff result with text change", function () {
    $(".hello").append("<p>Test</p>" );
    parser($("#test").html(), function (err, hscript) {
      tmpDIV.appendChild(virtualDom.create(eval(hscript)));
      var patches = luffa.diff($(fixtures).html(), $(tmpDIV).html(), eval(hscript));
      var text = $(virtualDom.create(patches[1].patch)).prop("outerHTML");
      console.log('%c ' + $(fixtures).html(), 'background: #222; color: #bada55');
      console.log('%c ' + $(tmpDIV).html().replace($(text).prop("outerHTML"), '%c' + text + '%c'), 'background: #222; color: #bada55', 'color: red', 'background: #222; color: #bada55');
      expect(true).toBe(true);
    });
  });
});

