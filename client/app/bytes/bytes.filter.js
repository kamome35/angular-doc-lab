'use strict';
const angular = require('angular');

/*@ngInject*/
export function bytesFilter() {
  return function(bytes, precision) {
    if (bytes == 0) { return '0 bytes' }
    if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
    if (typeof precision === 'undefined') precision = 1;
    var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
      number = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
  };
}


export default angular.module('docSysApp.bytes', [])
  .filter('bytes', bytesFilter)
  .name;
