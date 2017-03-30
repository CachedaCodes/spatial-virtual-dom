/*
 * Element
 */

var sNavigator;

var spatial = function (config, force) {
  var SpatialNavigator = require('./spatial');

  config = config || {};

  if (sNavigator && !force) {
    sNavigator.setCollection(null);
  } else {
    sNavigator = new SpatialNavigator(null, config);
  }

  sNavigator.cfg = config;

  return H;
};

/**
 * General tree
 *
 * /** @jsx h * /
 *
 * @name h
 * @function
 * @access public
 */
var H = function (argv) {
  if (!(this instanceof H)) {
    if (!(argv instanceof H)) {
      if (typeof argv === 'function') {
        return argv.apply(argv, [].slice.call(arguments, 1, arguments.length));
      }

      if (typeof argv === 'object' && typeof argv.render === 'function') {
        if ('props' in argv) {
          for (var i in arguments[1]) {
            argv.props[i] = arguments[1][i];
          }
        } else {
          argv.props = arguments[1];
        }
        argv.props.children = [].slice.call(arguments, 2, arguments.length);
        return argv.render(argv.props);
      }
    }
    return new H(arguments);
  }

  if (argv[0] instanceof H) {
    return argv[0];
  }

  this.tag = argv[0].toLowerCase();
  this.props = argv[1] || {};

  if ('focusable' in this.props && this.props.focusable && !('tabindex' in this.props)) {
    this.props.tabindex = 0;
  }

  if (argv[2] === null || argv[2] === undefined) {
    return;
  }

  if (argv.length > 2) {
    if (typeof argv[2] !== 'object' && argv.length === 3) {
      this.children = [_createTextNode(argv[2])];
    } else if (Array.isArray(argv[2])) {
      this.children = argv[2];
    } else {
      this.children = [].concat.apply([], [].slice.call(argv, 2, argv.length))
        .filter(function (n) {
          return n !== null && n !== undefined && n !== false;
        })
        .map(function (n) {
          if (!(n instanceof H)) {
            return _createTextNode(n);
          } else {
            return n;
          }
        });
    }
  }
};

/**
 * Spatial renderer
 *
 * @name render
 * @function
 * @access public
 * @returns {Element} root element
 */
H.prototype.render = function () {
  var DOM = this.DOMrender.apply(this, arguments);

  if (sNavigator) {
    this.sn = sNavigator;
  }

  return DOM;
};

/**
 * Patch spatial removal
 *
 * @name removeSpatial
 * @function
 * @access public
 */
H.prototype.removeSpatial = function () {
  sNavigator.remove(this.el);
};

/**
 * Tree renderer
 *
 * @name render
 * @function
 * @access public
 * @param {Boolean} fasle - do not save DOM into tree
 */
H.prototype.DOMrender = function (node, parent) {
  node = node || this;

  node.el = createElement(node.tag ? node : this, parent);

  var children = node.children;

  if (typeof children === 'object') {
    for (var i = 0; i < children.length; i++) {
      node.el.appendChild(this.DOMrender(children[i], node.el));
    }
  }

  return node.el;
};

H.prototype.setProp = function (name, value) {
  if (typeof this.el !== 'undefined') {
    if (name === 'className') {
      this.el.setAttribute('class', value);
    } else if (name === 'style' && typeof value !== 'string') {
      this.el.setAttribute('style', _stylePropToString(value));
    } else if (name.match(/^on/)) {
      this.addEvent(name, value);
    } else if (name === 'ref') {
      if (typeof value === 'function') {
        value(this.el);
      }
    } else if (sNavigator && name === 'focusable') {
      if (value === true) {
        sNavigator.add(this.el);
      } else {
        sNavigator.remove(this.el);
      }
      this.el[name] = Boolean(value);
    } else if (typeof value === 'boolean' || value === 'true') {
      this.el.setAttribute(name, value);
      this.el[name] = Boolean(value);
    } else {
      this.el.setAttribute(name, value);
    }
  }

  this.props[name] = value;
};

H.prototype.setProps = function (props) {
  var propNames = Object.keys(props);

  for (var i = 0; i < propNames.length; i++) {
    var prop = propNames[i];
    this.setProp(prop, props[prop]);
  }
};

H.prototype.rmProp = function (name) {
  if (typeof this.el !== 'undefined') {
    if (name === 'className') {
      this.el.removeAttribute('class');
    } else if (name.match(/^on/)) {
      this.removeEvent(name);
    } else if (name === 'ref') {
      /* Nothing to do */
    } else if (sNavigator && name === 'focusable') {
      sNavigator.remove(this.el);
      delete this.el[name];
    } else if (typeof value === 'boolean') {
      this.el.removeAttribute(name);
      delete this.el[name];
    } else {
      this.el.removeAttribute(name);
    }
  }

  delete this.props[name];
};

H.prototype.addEvent = function (name, listener) {
  name = name.slice(2).toLowerCase();

  this.listeners = this.listeners || {};

  if (name in this.listeners) {
    this.removeEvent(name);
  }

  this.listeners[name] = listener;
  this.el.addEventListener(name, listener);
};

H.prototype.removeEvent = function (name) {
  name = name.replace(/^on/, '').toLowerCase();
  if (name in this.listeners) {
    this.el.removeEventListener(name, this.listeners[name]);
    delete this.listeners[name];
  }
};

H.prototype.clone = function () {
  var node = {
    tag: String(this.tag),
    props: _cloneProps(this.props)
  };

  if (typeof this.children !== 'undefined') {
    node.children = this.tag === 'text'
      ? String(this.children)
      : this.children.map(function (child) {
        return child.tag === 'text' ? _createTextNode(child.children) : child.clone();
      });
  }

  return H(node.tag, node.props, node.children);
};

var _cloneProps = function (props, keepRefs) {
  if (typeof keepRefs === 'undefined') {
    keepRefs = true;
  }

  var attrs = Object.keys(props);
  var i;
  var name;
  var cloned = {};

  for (i = 0; i < attrs.length; i++) {
    name = attrs[i];

    if (typeof props[name] === 'string') {
      cloned[name] = String(props[name]);
    } else if (typeof props[name] === 'function' && keepRefs === true) {
      cloned[name] = props[name];
    } else if (typeof props[name] === 'boolean') {
      cloned[name] = Boolean(props[name]);
    } else if (typeof props[name] === 'object') {
      cloned[name] = _cloneProps(props[name]);
    }
  }

  return cloned;
};

var _stylePropToString = function (props) {
  var out = '';
  var attrs = Object.keys(props);

  for (var i = 0; i < attrs.length; i++) {
    out += attrs[i].replace(/([A-Z])/g, '-$1').toLowerCase();
    out += ':';
    out += props[attrs[i]];
    out += ';';
  }

  return out;
};

var _createTextNode = function (text) {
  return {
    tag: 'text',
    children: String(text)
  };
};

var createElement = function (node, parent) {
  node.el = node.tag === 'text'
    ? document.createTextNode(node.children)
    : document.createElement(node.tag);

  if (typeof node.props !== 'undefined') {
    node.setProps(node.props);
  }

  if (typeof parent !== 'undefined') {
    parent.appendChild(node.el);
  }

  return node.el;
};

exports.h = H;
exports.spatial = spatial;
exports.createElement = createElement;
