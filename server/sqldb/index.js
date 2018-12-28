/**
 * Sequelize initialization module
 */

'use strict';

import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';

var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// Insert models below
db.Doc = db.sequelize.import('../api/doc/doc.model');
db.Upload = db.sequelize.import('../api/upload/upload.model');

module.exports = db;
