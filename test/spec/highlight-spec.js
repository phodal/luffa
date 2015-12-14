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
  it("should diff result with append dom", function () {
    $(".hello").append("<p>Test</p>");
    parser($("#test").html(), function (err, hscript) {
      tmpDIV.appendChild(virtualDom.create(eval(hscript)));
      var patches = luffa.diff($(fixtures).html(), $(tmpDIV).html(), eval(hscript));
      var text = $(virtualDom.create(patches[1].patch)).prop("outerHTML");
      console.log('%c ' + $(fixtures).html(), 'background: #222; color: #bada55');
      console.log('%c ' + $(tmpDIV).html().replace($(text).prop("outerHTML"), '%c' + text + '%c'), 'background: #222; color: #bada55', 'color: red', 'background: #222; color: #bada55');
      expect(true).toBe(true);
    });
  });

  it("should diff result with replace dom", function () {
    fixtures = '<div id="test"><div id="example"><h1 class="hello">Hello World</h1></div></div>';
    setFixtures(fixtures);
    var newFixtures = '<div id="test"><div id="example"><h2><span>zero</span>h2</h2></div></div>';
    parser(newFixtures, function (err, hscript) {
      tmpDIV.appendChild(virtualDom.create(eval(hscript)));
      var patches = luffa.diff($(fixtures).prop("outerHTML"), $(tmpDIV).html());
      var text = $(virtualDom.create(patches[2].patch)).prop("outerHTML");
      console.log('%c ' + $(fixtures).prop("outerHTML"), 'background: #222; color: #bada55');
      console.log('%c ' + $(tmpDIV).html().replace($(text).prop("outerHTML"), '%c' + text + '%c'), 'background: #222; color: #bada55', 'color: red', 'background: #222; color: #bada55');
      expect(true).toBe(true);
    });
  });

  it("should diff result with multi dom", function () {
    fixtures = '<div id="test"><div id="example"><h1 class="hello">Hello World</h1></div></div>';
    setFixtures(fixtures);
    var newFixtures = '<div id="test"><div id="example"><h2><span>zero</span>h2</h2><h3>fsaf</h3></div></div>';
    parser(newFixtures, function (err, hscript) {
      tmpDIV.appendChild(virtualDom.create(eval(hscript)));
      var patches = luffa.diff($(fixtures).prop("outerHTML"), $(tmpDIV).html());
      var text = $(virtualDom.create(patches[1].patch)).prop("outerHTML");
      var text2 = $(virtualDom.create(patches[2].patch)).prop("outerHTML");
      console.log('%c ' + $(fixtures).prop("outerHTML"), 'background: #222; color: #bada55');
        console.log('%c ' + $(tmpDIV).html().replace($(text).prop("outerHTML"), '%c' + text + '%c').replace($(text2).prop("outerHTML"), '%c' + text2 + '%c'), 'background: #222; color: #bada55', 'color: red', 'background: #222; color: #bada55', 'color: 000', 'background: #222; color: #bada55');
      expect(true).toBe(true);
    });
  });
});

