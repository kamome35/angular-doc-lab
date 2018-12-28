'use strict';

import angular from 'angular';
import {
  UtilService
} from './util.service';

export default angular.module('docSysApp.util', [])
  .factory('Util', UtilService)
  .name;
