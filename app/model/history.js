'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const HistorySchema = new Schema({
    projectId: {    // 项目名称, 对应 _id
        type: String,
        required: true
    },
    creater: {
      required: true,
      type: String,
    },
    createrEmail: {
        required: true,
        type: String,
    },
    operationType: {
      type: String,
      required: true, // 删除、新增、编辑、创建
    },
    applicationType: {
      type: String,
      required: true, // 项目、图标
    },
    content: {
        type: String,
    },
    updated_at: { // 时间
        type: Date,
        default: Date.now,
    }
  }, {
    versionKey: false,
  });

  return mongoose.model('History', HistorySchema);
};
