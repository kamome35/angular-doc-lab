'use strict';

import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import angularFileUpload from 'angular-file-upload';

import {
  routeConfig
} from './app.config';

import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import DocComponent from './doc/doc.component';
import UploadComponent from './upload/upload.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import bytes from './bytes/bytes.filter';

import './app.scss';

angular.module('docSysApp', [ngAnimate, ngCookies, ngResource, ngSanitize, uiRouter, uiBootstrap, 'angularFileUpload',
  navbar, footer, main, DocComponent, UploadComponent, constants, util, bytes
])
  .config(routeConfig)
  .run(function($rootScope, $cookies, $http, $location, FileUploader, Util) {
    'ngInject';

    /* ファイルアップローダー初期化 */
    var uploader = $rootScope.uploader = new FileUploader({
      url: '/api/uploads'  // アップロードAPI
    });

    /* アップロードファイル選択時の重複ファイル名除去 */
    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
          for (var i = 0; i < uploader.queue.length; i++) {
            if (uploader.queue[i].file.name === item.name)
              return false; // 同一ファイル名が既に選択されている場合は無効
          }
          return true;
        }
    });
    uploader.onAfterAddingFile = function(item) {
    };
    uploader.onBeforeUploadItem = function (item) {
      /* CSRF設定 */
      if ($cookies.get('XSRF-TOKEN')) {
        item.headers = item.headers || {};
        item.headers['X-XSRF-TOKEN'] = $cookies.get('XSRF-TOKEN');
      }
      /* アップロード先パス */
      item.formData.push({
        type: "file",
        path: $location.path(),
      });
    };
    uploader.onCompleteAll = function() {
      $route.reload();
    };
    
  });

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['docSysApp'], {
      strictDi: true
    });
  });
