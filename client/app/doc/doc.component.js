'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');
const path = require('path');

import routes from './doc.routes';

export class DocComponent {
  /*@ngInject*/
  constructor($scope, $http, $location, $stateParams) {
    this.$scope = $scope;
    this.$http = $http;
    this.$location = $location;
    this.$stateParams = $stateParams;
    this.parentPath = $stateParams.path;
    this.path = path;
    $scope.alerts = [];
  }

  $onInit() {
    var doc_view_api = path.join('/api/doc', this.$stateParams.path);
    this.$http.get(doc_view_api).then(response => {this.list = response.data;});
    /* responseフォーマット
      { '$': { kind: 'file' },
      name: 'aaa.txt',
      size: '0',
      commit: 
      { '$': [Object],
        author: 'kamome',
        date: '2017-06-10T05:57:04.086319Z' } },
    */
  }

  isFile(item) {
    if (item.$.kind === 'file')
      return true;
    else
      return false;
  }

  onCreateFolder(folder) {
    this.$http.post("/api/uploads", {
      type: "mkdir",
      path: this.$stateParams.path,
      name: folder.name,
    }).then(response => {
      var doc_view_api = path.join('/api/doc', this.$stateParams.path);
      this.$http.get(doc_view_api).then(response => {this.list = response.data;});
      this.$scope.alerts.push({type: 'success', msg: folder.name + 'を作成しました'});
      folder.isOpen = false;
    }, function(data, status, headers, config) {
      this.$scope.alerts.push({type: 'danger', msg: 'フォルダの作成に失敗しました'});
    });
  }
}


export default angular.module('docSysApp.doc', [uiRouter])
  .config(routes)
  .component('doc', {
    template: require('./doc.html'),
    controller: DocComponent
  })
  .name;
