
/**
 * Module dependencies.
 */

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

  var range = doc.createRange();
  var start, end;

  // Initialize the Range to wrap the `source` element.
  // This handles the case when the `source` node has no childNodes.
  range.setStartBefore(source);
  range.setEndAfter(source);

  // if the first child is a TextNode with the 0-width space inside of it,
  // then we can safely remove it from the `source`, so that we don't end
  // up transferring it to the `target` element
  var first = source.firstChild;
  if (first && first.nodeType === Node.TEXT_NODE && first.nodeValue === '\u200B') {
    source.removeChild(first);
    first = null;
  }

  while (source.childNodes.length > 0) {
    var el = source.childNodes[0];
    if (!start) start = el;
    end = el;
    target.insertBefore(el, source);
  }

  // remove from DOM
  source.parentNode.removeChild(source);

  // set Range "start"
  // find deepest firstChild textNode
  while (start && start.nodeType !== Node.TEXT_NODE) {
    start = start.firstChild;
  }
  if (start) {
    range.setStart(start, 0)
    range.setEnd(start, 0);
  }

  // set Range "end"
  // find deepest lastChild textNode
  while (end && end.nodeType !== Node.TEXT_NODE) {
    end = end.lastChild;
  }
  if (end) {
    range.setEnd(end, end.nodeValue.length);
  }

  return range;
}
