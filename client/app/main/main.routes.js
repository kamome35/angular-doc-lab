'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('main', {
    url: '/docs/{parent:.*}',
    template: '<main></main>'
  });
}
