/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import {Doc, User} from '../sqldb';
import config from './environment/';

export default function seedDatabaseIfNeeded() {
  if(config.seedDB) {
    User.destroy({ where: {} })
      .then(() => User.bulkCreate([{
        id: 1,
        provider: 'local',
        name: 'Test User',
        email: 'test@example.com',
        password: 'test'
      }, {
        id: 2,
        provider: 'local',
        role: 'admin',
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin'
      }, {
        id: 3,
        provider: 'local',
        name: 'aaa',
        email: 'aaa@aaa.aaa',
        password: 'aaa'
      }])
        .then(() => console.log('finished populating users'))
        .catch(err => console.log('error populating users', err)));

    Doc.destroy({ where: {} })
      .then(() => Doc.bulkCreate([{
        kind: 'file',
        parent: '/',
        name: 'aaa.txt',
        comment: 'テスト',
        size: 800,
        userId: 1,
      }, {
        kind: 'file',
        parent: '/',
        name: 'bbb.txt',
        comment: 'test',
        size: 2000,
        userId: 2,
      }, {
        kind: 'dir',
        parent: '/',
        name: 'ccc',
        comment: 'あああ',
      }, {
        kind: 'file',
        parent: '/ccc',
        name: 'ccc.txt',
        comment: 'あああ',
        size: 10000,
        userId: 3,
      }, {
        kind: 'dir',
        parent: '/',
        name: 'ddd',
        comment: 'あああ',
      }, {
        kind: 'dir',
        parent: '/ddd',
        name: 'ddd',
        comment: 'あああ',
      }, {
        kind: 'file',
        parent: '/ddd/ddd',
        name: 'ddd.txt',
        comment: 'いいい',
        size: 500000,
      }])
        .then(() => console.log('finished populating docs'))
        .catch(err => console.log('error populating docs', err)));
  }
}
