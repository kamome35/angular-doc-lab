'use strict';

import angular from 'angular';
import SignupController from './signup.controller';

export default angular.module('docManApp.signup', [])
  .controller('SignupController', SignupController)
  .name;
