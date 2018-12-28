'use strict';

describe('Filter: bytes', function() {
  // load the filter's module
  beforeEach(module('docSysApp.bytes'));

  // initialize a new instance of the filter before each test
  var bytes;
  beforeEach(inject(function($filter) {
    bytes = $filter('bytes');
  }));

  it('should return the input prefixed with "bytes filter:"', function() {
    var text = 'angularjs';
    expect(bytes(text)).to.equal('bytes filter: ' + text);
  });
});
