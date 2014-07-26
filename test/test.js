
var assert = require('assert');
var unwrap = require('../');


describe('unwrap-node', function () {
  var div;

  afterEach(function () {
    if (div) {
      // clean up...
      document.body.removeChild(div);
      div = null;
    }
  });

  it('should unwrap a basic use-case', function () {
    div = document.createElement('div');
    div.innerHTML = '<b>hello worl</b>d';
    document.body.appendChild(div);

    var b = div.firstChild;

    var range = unwrap(b);

    // test that <b> has been removed from the DOM
    assert(!b.parentNode);

    // test that the parent <div> has been modified
    assert.equal(div.innerHTML, 'hello world');

    // test that the Range contains the <b> children contents
    assert.equal(range.toString(), 'hello worl');

    // test that the Range starts and ends with a TextNode
    assert.equal(range.startContainer.nodeType, Node.TEXT_NODE);
    assert.equal(range.endContainer.nodeType, Node.TEXT_NODE);
  });

  it('should remove a 0-width space child node', function () {
    div = document.createElement('div');
    div.innerHTML = 'te<b>\u200B</b>st';
    document.body.appendChild(div);

    var b = div.childNodes[1];

    var range = unwrap(b);

    // test that <b> has been removed from the DOM
    assert(!b.parentNode);

    // test that the parent <div> has been modified
    assert.equal(div.innerHTML, 'test');

    // test that the Range is collapsed, with no contents
    assert.equal(range.toString(), '');
    assert.equal(range.collapsed, true);

    // test that the Range starts and ends with the parent <div>
    assert.equal(range.startContainer, div);
    assert.equal(range.startOffset, 1);
    assert.equal(range.endContainer, div);
    assert.equal(range.endOffset, 1);
  });

});
