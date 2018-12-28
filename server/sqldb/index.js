/**
 * Sequelize initialization module
 */

'use strict';

import config from '../config/environment';
import Sequelize from 'sequelize';

var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// Insert models below
db.Doc = db.sequelize.import('../api/doc/doc.model');
db.User = db.sequelize.import('../api/user/user.model');
db.User.hasMany(db.Doc);
db.Doc.belongsTo(db.User);

module.exports = db;
