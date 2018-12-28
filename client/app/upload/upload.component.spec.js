'use strict';

describe('Component: UploadComponent', function() {
  // load the controller's module
  beforeEach(module('docSysApp.upload'));

  var UploadComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    UploadComponent = $componentController('upload', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
