const { model, Schema } = require("mongoose");

// User Model

const userSchema = new Schema({
  first_name: String,
  last_name: String,
  password: String,
  email: String,
  createdOn: String,
});

module.exports = model("User", userSchema);
