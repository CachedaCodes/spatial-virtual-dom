var expect = require('chai').expect;

var h = require('../../').h;
var diff = require('../../').diff;
var patch = require('../../').patch;

describe('HyperFn Tests', function () {
  it('should handle composer function', function () {
    var composer = function (props, children) {
      return h('div', props, children);
    };

    var a = h('span', null, h(composer, { className: 'hello-composer' }, h('a', null, 'hello')));

    expect(a.tag).to.be.equal('span');
    expect(a.children[0].tag).to.be.equal('div');
    expect(a.children[0].props.className).to.be.equal('hello-composer');
    expect(a.children[0].children[0].tag).to.be.equal('a');
  });

  it('shoud diff/patch composer function', function () {
    var composer = function (props, children) {
      return h('div', props, children);
    };

    var composer1 = function (props, children) {
      return h('section', props, children);
    };

    var a = h('span', null, h(composer, { className: 'hello-composer' }, h('a', null, 'hello')));
    var b = h('span', null, h(composer1, { className: 'composer-section' }, h('a', null, 'hello')));

    patch(a, diff(a, b));

    expect(a.tag).to.be.equal('span');
    expect(a.children[0].tag).to.be.equal('section');
    expect(a.children[0].props.className).to.be.equal('composer-section');
    expect(a.children[0].children[0].tag).to.be.equal('a');
  });
});

