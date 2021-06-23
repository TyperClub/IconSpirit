
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    fontFamily: {
        type: String,
        required: true
    },
    fontFormat: {
        type: Array,
        required: true
    },
    prefix: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    department: {
        type: String
    },
    userEmail: {
      type: String,
      required: true
    },
    userRole: {
      type: Number,
      default: 1
    },
    createDate: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    updated_at: {
        type: Date
    },
    deleted_at: {
        type: Date
    }
  });

  return mongoose.model('Project', ProjectSchema);
};