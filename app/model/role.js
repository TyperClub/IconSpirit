'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const RoleSchema = new Schema({
    id: {
      required: true,
      type: Number,
    },
    roleName: {
      type: String,
      required: true,
    },
  });

  return mongoose.model('Role', RoleSchema);
};
