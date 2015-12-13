describe("VirtualDOM Test", function () {
  it("should different id", function () {
    var originDOM = '<div id="test"><div id="example1"><h1 class="world">Hello World</h1></div></div>';
    var changeDOM = '<div id="test"><div id="example2"><h1 class="world">Hello World</h1></div></div>';

    var patches = luffa.diff(originDOM, changeDOM);

    expect(patches[1].patch.id).toBe("example2");
  });
  it("should different class", function () {
    var originDOM = '<div id="test"><div id="example"><h1 class="hello">Hello World</h1></div></div>';
    var changeDOM = '<div id="test"><div id="example"><h1 class="world">Hello World</h1></div></div>';

    var patches = luffa.diff(originDOM, changeDOM);

    expect(patches[2].patch.className).toBe("world");
  });
  it("should different multi patches", function () {
    var originDOM = '<div id="test"><div id="example"><h1 class="hello">Hello World</h1></div></div>';
    var changeDOM = '<div id="test"><div id="example2"><h1 class="world">Hello World</h1></div></div>';

    var patches = luffa.diff(originDOM, changeDOM);

    expect(patchCount(patches)).toBe(2);
    expect(patches[1].patch.id).toBe("example2");
    expect(patches[2].patch.className).toBe("world");
  });
  it("should different add dom patches", function () {
    var originDOM = '<div id="test"><div id="example"><h1 class="hello">Hello World</h1></div></div>';
    var changeDOM = '<div id="test"><div id="example2"><h1 class="world"><span>Hello World</span></h1></div></div>';

    var patches = luffa.diff(originDOM, changeDOM);

    expect(patchCount(patches)).toBe(3);
    expect(patches[1].patch.id).toBe("example2");
    expect(patches[2].patch.className).toBe("world");
    expect(patches[3].patch.tagName).toBe("SPAN");
  });
});

describe("Fixtures Test", function () {
  var parser, tmpDIV, fixtures;
  beforeEach(function () {
    parser = require('html2hscript');
    tmpDIV = document.createElement("div");
    fixtures = '<div id="test"><div id="example"><h1 class="hello">Hello World</h1></div></div>';
    setFixtures(fixtures);
    $("#example").hide();
  });
  it("should diff result with style change", function () {
    parser($("#test").html(), function (err, hscript) {
      tmpDIV.appendChild(virtualDom.create(eval(hscript)));
      var patches = luffa.diff($(fixtures).html(), $(tmpDIV).html());

      expect(patches[0].patch.style.display).toBe("none");
    });
  });

  it("should diff result with class change", function () {
    $(".hello").attr('class', 'world');
    parser($("#test").html(), function (err, hscript) {
      tmpDIV.appendChild(virtualDom.create(eval(hscript)));
      var patches = luffa.diff($(fixtures).html(), $(tmpDIV).html());

      expect(patches[1].patch.className).toBe("world");
    });
  });

  it("should diff result with id change", function () {
    $("#example").attr('id', 'example1');
    parser($("#test").html(), function (err, hscript) {
      tmpDIV.appendChild(virtualDom.create(eval(hscript)));
      var patches = luffa.diff($(fixtures).html(), $(tmpDIV).html());

      expect(patches[0].patch.id).toBe("example1");
    });
  });
});

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

      console.log(patches);
      expect(luffa.getDiffDom(patches)[0].type).toBe('PROPS');
    });
  });
});
