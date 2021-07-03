
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ProjectIconsSchema = new Schema({
    projectIconsId: {             // 项目名称, 对应 _id
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true,
    },
    iconsId: {
        type: String,
        required: true
    },
    unicode: {
        type: Number,
        required: true,
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
    content: {
        type: String,
    },
    createDate: {      // 添加时间
      type: Date,
      default: Date.now,
    },
    isDeleted: {      // 是否已删除
        type: Boolean,
        default: false
    },
    updated_at: {    // 更新时间
        type: Date
    },
    deleted_at: {   // 删除时间
        type: Date
    }
  });

  return mongoose.model('ProjectIcons', ProjectIconsSchema);
};