const path = require('path');

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {

  docs = [];
  newThing = '';

  /*@ngInject*/
  constructor($http, $location, $stateParams) {
    this.$http = $http;
    this.$location = $location;
    this.$stateParams = $stateParams;
    this.path = path;
  }

  $onInit() {
    let api = path.join('/api/docs', this.$stateParams.parent);
    this.$http.get(api)
      .then(response => {
        console.log(response.data);
        this.docs = response.data;
      });
  }

  isFile(item) {
    return item.kind === 'file';
  }

  isDir(item) {
    return item.kind === 'dir';
  }

  href(item) {
    if(item.kind === 'file') {
      return path.join('docs/download', item.parent, item.name);
    } else { // kind === dir
      return path.join('docs', item.parent, item.name);
    }
  }
}

export default angular.module('docManApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
