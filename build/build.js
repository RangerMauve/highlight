;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("jkroso-computed-style/index.js", function(exports, require, module){

/**
 * Get the computed style of a DOM element
 * 
 *   style(document.body) // => {width:'500px', ...}
 * 
 * @param {Element} element
 * @return {Object}
 */

// Accessing via window for jsDOM support
module.exports = window.getComputedStyle

// Fallback to elem.currentStyle for IE < 9
if (!module.exports) {
	module.exports = function (elem) {
		return elem.currentStyle
	}
}

});
require.register("jkroso-position/index.js", function(exports, require, module){
var style = require('computed-style')

exports = module.exports = position
exports.container = containerBox
exports.offsetParent = offsetParent
exports.relative = 
exports.offset = offset 

/**
 * Get the location of the element relative to the top left of the documentElement
 *
 * @param {Element} element
 * @return {Object} {top, right, bottom, left} in pixels
 */

function position (element) {
	var box = element.getBoundingClientRect()
	  , scrollTop = window.scrollY
	  , scrollLeft = window.scrollX
	// Has to be copied since ClientRects is immutable
	return {
		top: box.top + scrollTop,
		right: box.right + scrollLeft,
		left: box.left + scrollLeft,
		bottom: box.bottom + scrollTop,
		width: box.width,
		height: box.height
	}
}

/**
 * Get the position of one element relative to another
 *
 *   offset(child)
 *   offset(child, parent)
 *   
 * @param {Element} child the subject element
 * @param {Element} [parent] offset will be calculated relative to this element. 
 *   This parameter is optional and will default to the offsetparent of the 
 *   `child` element
 * @return {Object} {x, y} in pixels
 */

function offset (child, parent) {
	// default to comparing with the offsetparent
	parent || (parent = offsetParent(child))
	if (!parent) {
		parent = position(child)
		return {
			x: parent.left,
			y: parent.top
		}
	}

	var offset = position(child)
	  , parentOffset = position(parent)
	  , css = style(child)

	// Subtract element margins
	offset.top  -= parseFloat(css.marginTop)  || 0
	offset.left -= parseFloat(css.marginLeft) || 0

	// Allow for the offsetparent's border
	offset.top  -= parent.clientTop
	offset.left -= parent.clientLeft

	return {
		x: offset.left - parentOffset.left,
		y:  offset.top  - parentOffset.top
	}
}

// Alternative way of calculating offset perhaps its cheaper
// function offset (el) {
// 	var x = el.offsetLeft, y = el.offsetTop
// 	while (el = el.offsetParent) {
// 		x += el.offsetLeft + el.clientLeft
// 		y += el.offsetTop + el.clientTop
// 	}
// 	return {left: x, top: y}
// }

/**
 * Determine the perimeter of an elements containing block. This is the box that
 * determines the childs positioning. The container cords are relative to the 
 * document element not the viewport; so take into account scrolling.
 *
 * @param {Element} child
 * @return {Object}
 */

function containerBox (child) {
	var container = offsetParent(child)

	if (!container) {
		container = child.ownerDocument.documentElement
		// The outer edges of the document
		return {
			top   : 0,
			left  : 0,
			right : container.offsetWidth,
			bottom: container.offsetHeight,
			width : container.offsetWidth,
			height: container.offsetHeight
		}
	}

	var offset = position(container)
	  , css = style(container)

	// Remove its border
	offset.top    += parseFloat(css.borderTopWidth) || 0
	offset.left   += parseFloat(css.borderLeftWidth)|| 0
	offset.right  -= parseFloat(css.borderRightWidth) || 0
	offset.bottom -= parseFloat(css.borderBottomWidth) || 0
	offset.width   = offset.right - offset.left
	offset.height  = offset.bottom - offset.top

	return offset
}

/**
 * Get the element that serves as the base for this ones positioning.
 * If no parents are postioned it will return undefined which isn't 
 * what you might expect if you know the offsetparent spec or have 
 * used `jQuery.offsetParent`
 * 
 * @param {Element} element
 * @return {Element} if a positioned parent exists
 */

function offsetParent (element) {
	var parent = element.offsetParent
	while (parent && style(parent).position === "static") parent = parent.offsetParent
	return parent
}

});
require.register("highlight/index.js", function(exports, require, module){
// Get dependencies
var position = require('position');
var style = require('computed-style');

module.exports = function (element) {
	if (element) highlight(element);
	else hide_highlighter();
}

function hide_highlighter() {
	var highlighter = fetch_highlighter();
	highlighter.classList.add("rm-highlight-hidden");
}

function fetch_highlighter() {
	var highlighter;
	if (!(highlighter = document.querySelector(".rm-highlight"))) {
		highlighter = document.createElement("div");
		highlighter.classList.add("rm-highlight");
		highlighter.classList.add("rm-highlight-hidden");
	}
	return highlighter;
}


function highlight(element) {
	var highlighter = fetch_highlighter();;

	document.body.insertBefore(highlighter, document.body.childNodes[0]);

	var pos = position(element);
	var s = style(highlighter);
	var off_x = parseInt(s.getPropertyValue('border-left-width'));
	var off_y = parseInt(s.getPropertyValue('border-top-width'));
	highlighter.classList.remove("rm-highlight-hidden");
	highlighter.style.top = pos.top - off_y + "px";
	highlighter.style.top = pos.top - off_y + "px";
	highlighter.style.height = pos.height + "px";
	highlighter.style.left = pos.left - off_x + "px";
	highlighter.style.width = pos.width + "px";
}

});




require.alias("jkroso-computed-style/index.js", "highlight/deps/computed-style/index.js");
require.alias("jkroso-computed-style/index.js", "computed-style/index.js");

require.alias("jkroso-position/index.js", "highlight/deps/position/index.js");
require.alias("jkroso-position/index.js", "position/index.js");
require.alias("jkroso-computed-style/index.js", "jkroso-position/deps/computed-style/index.js");

require.alias("highlight/index.js", "highlight/index.js");if (typeof exports == "object") {
  module.exports = require("highlight");
} else if (typeof define == "function" && define.amd) {
  define([], function(){ return require("highlight"); });
} else {
  this["highlight"] = require("highlight");
}})();