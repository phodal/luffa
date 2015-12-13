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
