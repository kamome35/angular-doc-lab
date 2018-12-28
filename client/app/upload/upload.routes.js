'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('upload', {
      //url: '/upload',
      template: '<upload></upload>',
      authenticate: true
    });
}
