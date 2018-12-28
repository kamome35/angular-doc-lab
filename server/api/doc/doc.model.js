'use strict';

export default function(sequelize, DataTypes) {
  var Doc = sequelize.define('doc', {
    kind: {
      type: DataTypes.ENUM('file', 'dir')
    },
    parent: DataTypes.STRING,
    name: DataTypes.STRING,
    comment: DataTypes.STRING,
    size: DataTypes.INTEGER,
  }, {
    timestamps: true
  });

  return Doc;
}
