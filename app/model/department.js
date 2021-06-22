'use strict';


module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const DepartmentSchema = new Schema({
    deptFullName: {
      required: true,
      type: String,
    },
    deptShortName: {
      type: String,
      required: true,
    },
  }, {
    versionKey: false,
  });

  return mongoose.model('Department', DepartmentSchema);
};
