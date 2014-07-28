
/**
 * Module dependencies.
 */

var findWithin = require('find-within');
var getDocument = require('get-document');

/**
 * Module exports.
 */

module.exports = unwrap;

/**
 * Unwraps the given `source` DOM element by prepending all of its child nodes
 * into `target` before finally removing `source` from the DOM. Returns a Range
 * instance with its boundaries set to before the first child node and after the
 * last child node.
 *
 * See `wrap-range` for the conceptual inverse action.
 *
 * @param {Element} source - DOM element to unwrap and then remove from the DOM
 * @param {Element} [target] - Optional DOM element where `sources` children
 *   should be inserted. Defaults to `source.parentNode`
 * @param {Document} [doc] - Optional `document` instance to create the Range from
 * @return {Range} Returns a Range instance with its boundaries set to contain
 *   the child nodes from `source`
 * @public
 */

function unwrap (source, target, doc) {
  if (!target) target = source.parentNode;
  if (!doc) doc = getDocument(source) || document;

  var range, start, first, end, el;

  // Initialize the Range to wrap the `source` element.
  // This handles the case when the `source` node has no childNodes.
  range = doc.createRange();
  range.setStartBefore(source);
  range.setEndAfter(source);

  // if the first child is a TextNode with the 0-width space inside of it,
  // then we can safely remove it from the `source`, so that we don't end
  // up transferring it to the `target` element
  el = source.firstChild;
  if (el && el.nodeType === Node.TEXT_NODE && el.nodeValue === '\u200B') {
    source.removeChild(el);
    el = null;
  }

  // transfer child nodes to *before* the `source` element in the `target` DOM
  // element
  while (source.childNodes.length > 0) {
    el = source.childNodes[0];
    if (!start) start = el;
    end = el;
    target.insertBefore(el, source);
  }

  // remove `source` from the DOM
  source.parentNode.removeChild(source);

  // set Range "start" to deepest `firstChild` textNode
  first = true;
  start = findWithin(start, Node.TEXT_NODE, first);
  if (start) {
    range.setStart(start, 0)
    range.setEnd(start, 0);
  }

  // set Range "end" to deepest `lastChild` textNode
  first = false;
  end = findWithin(end, Node.TEXT_NODE, first);
  if (end) {
    range.setEnd(end, end.nodeValue.length);
  }

  return range;
}
