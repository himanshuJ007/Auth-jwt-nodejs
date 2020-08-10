var mongoose = require('mongoose');
var SignupSchema = new mongoose.Schema({
  UserName: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    unique: true,
    required: true
  },
  Password: {
    type: String,
    required: true
  }
});

var Signup = mongoose.model("Signup", SignupSchema);
module.exports = Signup;
