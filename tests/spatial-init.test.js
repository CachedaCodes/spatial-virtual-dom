var expect = require('chai').expect;
var SN = require('../lib/spatial');

describe('Spatial tests', function () {
  function createElement (left, top) {
    var element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.width = element.style.height = '20px';
    element.style.top = top + 'px';
    element.style.left = left + 'px';

    return element;
  }

  it('should initialize SpatialNavigator', function () {
    expect(SN).to.be.a('function');
    var sp = new SN();
    expect(sp).to.be.instanceof(SN);
  });

  it('should navigate inside of a list', function () {
    var elements = [1, 2, 3, 4].map(function (e, i) {
      var el = document.createElement('div');
      el.setAttribute('class', 'focusable');
      el.style.width = '20px';
      el.style.height = '20px';
      el.textContent = 'el-' + i;
      document.body.appendChild(el);

      return el;
    });

    var sn = new SN(elements);

    sn.focus();
    expect(sn._focus).to.be.equal(elements[0]);
    sn.move('down');
    expect(sn._focus).to.be.equal(elements[1]);
    sn.move('down');
    expect(sn._focus).to.be.equal(elements[2]);
    sn.move('down');
    expect(sn._focus).to.be.equal(elements[3]);
    sn.move('down');
    expect(sn._focus).to.be.equal(elements[3]);
    sn.move('up');
    expect(sn._focus).to.be.equal(elements[2]);
    sn.move('up');
    expect(sn._focus).to.be.equal(elements[1]);
    sn.move('up');
    expect(sn._focus).to.be.equal(elements[0]);
    sn.move('up');
    expect(sn._focus).to.be.equal(elements[0]);
    sn.move('right');
    expect(sn._focus).to.be.equal(elements[0]);
    sn.move('left');
    expect(sn._focus).to.be.equal(elements[0]);

    elements.map(function (e) { document.body.removeChild(e); });
    sn.setCollection(null);
  });

  it('should navigate inside of layout', function () {
    var elements = [
      createElement(0, 0),
      createElement(0, 30),
      createElement(0, 60),
      createElement(30, 30),
      createElement(30, 60),
      createElement(30, 90),
      createElement(60, 60)
    ].map(function (e) { return document.body.appendChild(e); });

    var sn = new SN(elements);
    sn.focus();

    expect(sn._focus).to.be.equal(elements[0]);
    sn.move('right');
    expect(sn._focus).to.be.equal(elements[3]);
    sn.move('down');
    expect(sn._focus).to.be.equal(elements[4]);
    sn.move('right');
    expect(sn._focus).to.be.equal(elements[6]);
    sn.move('left');
    sn.move('left');
    expect(sn._focus).to.be.equal(elements[2]);
    sn.setCollection(null);
  });
});
