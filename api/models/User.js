import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: {
    type: String
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});

userSchema.methods.checkPassword = function(password) {
  return password === this.password;
};

export const User = mongoose.model("User", userSchema);
