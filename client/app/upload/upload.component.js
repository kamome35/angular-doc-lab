'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');
const path = require('path');

import routes from './upload.routes';

export class UploadComponent {
  /*@ngInject*/
  constructor($scope, $rootScope, $location) {
    $scope.uploader = $rootScope.uploader;
    this.path = path;
    this.$location = $location;
  }
  $onInit() {
  }
  
}

export default angular.module('docSysApp.upload', [uiRouter])
  .config(routes)
  .component('upload', {
    template: require('./upload.html'),
    controller: UploadComponent,
  })
  .name;
