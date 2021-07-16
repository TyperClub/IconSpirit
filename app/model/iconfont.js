
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const IconfontSchema = new Schema({
    id: {
      type: String,
      unique: true,
      required: true,
    },
    unicode: {
      type: Number,
      required: true,
    },
    unicodeAlibaba: {
      type: String
    },
    description: {
      type: String
    },
    collectionId: {
      type: Number
    },
    likes_count: {  // 4：单色 2 多色 1：官方 0 所有
      type: Number
    },
    type: {
      type: String,
      required: true,
    },
    gurop: {
      type: String,
      required: true,
    },
    CH_Name: {
      type: String,
      required: true,
    },
    ENG_Name: {
      type: String,
    },
    author: {
        type: String,
    },
    createTime: {
      type: String,
    },
    content: {
      type: String,
    },
  });

  return mongoose.model('Iconfont', IconfontSchema);
};
