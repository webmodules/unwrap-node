
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

    // test that the Range contains the <b> children contents
    assert.equal(range.toString(), 'hello worl');

    // test that the parent <div> has been modified
    assert.equal(div.innerHTML, 'hello world');
    console.log(range.startContainer);
  });

});
