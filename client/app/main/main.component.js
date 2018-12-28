import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {

  /*@ngInject*/
  constructor($location) {
    this.$location = $location;
  }
  $onInit() {
    this.$location.path('/doc/');
  }
}

export default angular.module('docSysApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
