
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const IconfontCollectionSchema = new Schema({
    collectionId: {
      type: Number,
      unique: true,
      required: true,
    },
    description: {
      type: String
    },
    type: {         //来源类型，alibaba、zhangmen
      type: String,
      required: true,
    },
    public: { // 图标开放，图标私有
      type: Boolean,
      required: true,
      default: true,
    },
    iconColorType: { // 单色，多色
      type: String,
    },
    guropType: {    //1 我的上传 2 图标库
      type: String,
      required: true,
    },
    gurop: {
      type: String,
      required: true,
    },
    author: {
        type: String,
    },
    createTime: {
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

  return mongoose.model('IconfontCollection', IconfontCollectionSchema);
};
