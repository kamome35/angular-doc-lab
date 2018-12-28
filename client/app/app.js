'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
//import fileUpload from 'angular-file-upload';
import 'angular-validation-match';

import {
  routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import UploadComponent from './upload/upload.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import bytes from './bytes/bytes.filter';

import './app.scss';

angular.module('docManApp', [ngCookies, ngResource, ngSanitize, uiRouter, uiBootstrap, _Auth, 'angularFileUpload',
  account, admin, 'validation.match', navbar, footer, main, UploadComponent, constants, util, bytes
])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth, FileUploader, Util) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in

    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });

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
    angular.bootstrap(document, ['docManApp'], {
      strictDi: true
    });
  });
