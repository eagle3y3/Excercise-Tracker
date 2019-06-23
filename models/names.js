const mongoose = require("mongoose");
const shortid = require("shortid");
const Schema = mongoose.Schema;

//User Schema
const userSchema = new Schema({
  _id: {
  'type': String,
  'default': shortid.generate
  },
  username : String
});

const Names = mongoose.model("names", userSchema);

module.exports = Names;
/*****/
