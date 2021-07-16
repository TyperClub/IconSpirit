
'use strict';
const config = require('../config/oss_config');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  
  const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    creater: {
        type: String,
        required: true
    },
    font: {
      website: {
        type: String,
        default: config[app.env].website
      },
      cssFile: {
        type: String,
      },
      fontIsOld: {
        type: Boolean,
        default: true
      }
    },
    fontFamily: {
        type: String,
        required: true,
        default: "iconfont"
    },
    fontFormat: {
        type: Array,
        required: true,
        default: ["WOFF2", "WOFF", "TTF", "SVG"]
    },
    prefix: {
        type: String,
        required: true,
        default: "icon-"
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
    icons: {
      type: Array,
      default: [],
    },
    createDate: {
      type: Date,
      default: Date.now,
    },
    deletedPerson: {
      type: String
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