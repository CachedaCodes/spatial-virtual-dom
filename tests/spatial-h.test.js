var expect = require('chai').expect;
var diff = require('../').diff;
var patch = require('../').patch;

window.jQuery = window.$ = require('jquery');
var syn = require('syn');

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
    c.sn.focus();
    expect(c.sn._focus).to.be.instanceof(window.HTMLDivElement);
    c.sn.unfocus();
    expect(c.sn._focus).to.be.null;
  });

  it('should focus item on click', function (done) {
    var h = require('../').spatial({ autofocus: true, keys: keys });
    var c = h('div', null, h('div', { focusable: true }, 'one'), h('div', { focusable: true }, 'two'));

    var dom = c.render();

    document.body.appendChild(dom);
    expect(c.sn._focus).to.be.null;
    syn.click(dom.childNodes[0], function () {
      expect(c.sn._focus).not.to.be.null;
      done();
    });
  });

  it('should focus item by navigating keys', function (done) {
    var h = require('../').spatial({ autofocus: false, keys: keys });
    var c = h('div', null, h('div', { focusable: true }, 'one'), h('div', { focusable: true }, 'two'));

    var dom = c.render();

    document.body.appendChild(dom);
    syn.type(dom, '[down]', function () {
      syn.type(dom, '[down]', function () {
        expect(c.sn._focus).to.be.equal(dom.childNodes[1]);
        done();
      });
    });
  });

  it('should fire focus events', function (done) {
    var h = require('../').spatial({ autofocus: true, keys: keys });
    var c = h('div', null, h('div', { focusable: true }, 'one'), h('div', { focusable: true }, 'two'));

    var dom = c.render();
    document.body.appendChild(dom);
    c.sn.focus();

    dom.childNodes[1].addEventListener('focussn', function () {
      done();
    });

    syn.type(dom, '[down]');
  });

  it('should fire unfocus events', function (done) {
    var h = require('../').spatial({ autofocus: true, keys: keys });
    var c = h('div', null, h('div', { focusable: true }, 'one'), h('div', { focusable: true }, 'two'));

    var dom = c.render();
    document.body.appendChild(dom);
    c.sn.focus();

    dom.childNodes[0].addEventListener('unfocussn', function () {
      done();
    });

    syn.type(dom, '[down]');
  });

  it('should fire unfocus events focused node', function (done) {
    var h = require('../').spatial({ autofocus: true, keys: keys });
    var c = h('div', null, h('div', { focusable: true }, 'one'), h('div', { focusable: true }, 'two'));

    var dom = c.render();
    document.body.appendChild(dom);
    c.sn.focus();

    dom.childNodes[0].addEventListener('unfocussn', function () {
      done();
    });

    syn.type(dom.childNodes[0], '[down]');
  });

  it('should fire enter events on focused node only', function (done) {
    var h = require('../').spatial({ autofocus: true, keys: keys });
    var c = h('div', null, h('div', { focusable: true }, 'one'), h('div', { focusable: true }, 'two'));

    var dom = c.render();
    document.body.appendChild(dom);

    dom.childNodes[0].addEventListener('entersn', function () {
      done();
    });

    syn.type(dom.childNodes[0], '[enter]');
  });

  it('should custon event postfix', function (done) {
    var h = require('../').spatial({ evtNamePostfix: 'xx', autofocus: true, keys: keys }, true);
    var c = h('div', null, h('div', { focusable: true }, 'one'), h('div', { focusable: true }, 'two'));

    var dom = c.render();
    document.body.appendChild(dom);

    dom.childNodes[0].addEventListener('enterxx', function () {
      done();
    });

    syn.type(dom.childNodes[0], '[enter]');
  });

  it('should fire click/enter events on focused node only', function (done) {
    var h = require('../').spatial({ evtNamePostfix: 'sn', autofocus: true, keys: keys }, true);
    var c = h('div', null, h('div', { focusable: true }, 'one'), h('div', { focusable: true }, 'two'));

    var dom = c.render();
    document.body.appendChild(dom);

    dom.childNodes[0].addEventListener('entersn', function () {
      done();
    });

    syn.click(dom.childNodes[0]);
  });

  it('should focusable has tabindex prop', function () {
    var h = require('../').spatial();
    var c = h('div', null, h('div', { focusable: true }, ''));
    var p = h('div', null, h('div', { focusable: false }, ''));

    var dom = c.render();

    expect(dom.childNodes[0].getAttribute('tabindex')).to.be.equal('0');
    patch(c, diff(c, p));
    expect(dom.childNodes[0].getAttribute('tabindex')).not.be.exists;
  });
});
