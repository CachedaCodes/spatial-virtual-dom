var expect = require('chai').expect;
var diff = require('../').diff;
var patch = require('../').patch;

var keys = require('./fixtures/keys');

describe('H spatial tests', function () {
  it('should handle focusable spatial dom items', function () {
    var h = require('../').spatial();
    var c = h('div', null, h('div', { focusable: true }, ''));
    var p = h('div', null, h('div', { focusable: false }, ''));

    c.render();
    expect(c.sn._collection.length).to.be.equal(1);

    patch(c, diff(c, p));

    expect(c.sn._collection.length).to.be.equal(0);
  });

  it('should patch spatial elements existens', function () {
    var h = require('../').spatial();
    var c = h('div', null, h('div', { focusable: true }, ''));
    var p = h('div', null, '');

    c.render();
    expect(c.sn._collection.length).to.be.equal(1);

    patch(c, diff(c, p));

    expect(c.sn._collection.length).to.be.equal(0);
  });

  it('should focus default element', function () {
    var h = require('../').spatial({ autofocus: true });
    var c = h('div', null, h('div', { focusable: true }, ''));

    c.render();
    expect(c.sn._focus).to.be.instanceof(window.HTMLDivElement);
    c.sn.unfocus();
    expect(c.sn._focus).to.be.null;
  });

  it('should handle general keys', function () {
    var h = require('../').spatial({ autofocus: true, keys: keys });
    var c = h('div', null, h('div', { focusable: true }, 'one'), h('div', { focusable: true }, 'two'));

    var dom = c.render();

  });
});
