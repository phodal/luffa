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
