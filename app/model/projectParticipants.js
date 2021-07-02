
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ProjectParticipantsSchema = new Schema({
    projectId: {             // 项目名称, 对应 _id
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    department: {
        type: String
    },
    occupation: {
        type: String
    },
    userRole: {
        type: Number
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

  return mongoose.model('ProjectParticipants', ProjectParticipantsSchema);
};