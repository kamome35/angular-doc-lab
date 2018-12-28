'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('doc', {
      url: '/doc/{path:.*}',
      template: '<doc></doc>'
    });
}
