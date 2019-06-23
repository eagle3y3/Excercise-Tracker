const mongoose = require("mongoose");
const Schema = mongoose.Schema;


//Excercise Schema
const excersiceSchema = new Schema({
  description : {
    type: String,
    maxlength:[40, "description too long"],
    },
  duration: Number,
  date:{
    type: Date,
    default: Date.now
    },
  userId: {
    type: String,
    index: true
  }
});

const descOfExcer = mongoose.model("excercises", excersiceSchema)

module.exports = descOfExcer;
