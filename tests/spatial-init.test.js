var expect = require('chai').expect;
var SN = require('../lib/spatial');

describe('Spatial tests', function () {
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
  });
});
