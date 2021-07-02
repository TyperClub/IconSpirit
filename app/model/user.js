
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    userPass: {
      type: String,
    },
    userEmail: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
      required: true
    },
    occupation: {
      type: String
    },
    avatar: {
      type: String,
    },
    userRole: {
      type: Number,
      default: 1, // 1 创建者， 2，参入者，3，管理员
    },
    userCreate: {
      type: Date,
      default: Date.now,
    },
    department: {
      type: String
    },
    lastLoginTime: {
      type: Date,
    },
    lastLoginPlace: {
      type: String,
    },
  });

  return mongoose.model('User', UserSchema);
};
