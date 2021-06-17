
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const IconListSchema = new Schema({
    id: {
      type: String,
      unique: true,
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
    createTime: {
      type: String,
    },
    content: {
      type: String,
    }
  });

  return mongoose.model('IconList', IconListSchema);
};
