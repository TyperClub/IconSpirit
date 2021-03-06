
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
    slug: {
      type: String
    },
    tag_ids: {
      type: String
    },
    type: {         //来源类型，alibaba、iconspirit
      type: String,
      required: true,
    },
    public: { // 图标开放，图标私有
      type: Boolean,
      required: true,
      default: true,
    },
    iconColorType: { //0 官网, 1 个人, 2 单色，4 多色
      type: String,
    },
    guropType: {    //1 我的上传 2 图标库 3 阿里个人上传
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
    authorEmail: {
      type: String
    },
    createTime: {
      type: String,
    },
    content: {
      type: String,
    },
    isDeleted: {      // 是否已删除
      type: Boolean,
      default: false
    },
    deleted_at: {   // 删除时间
      type: Date
    }
  });

  return mongoose.model('Iconfont', IconfontSchema);
};
