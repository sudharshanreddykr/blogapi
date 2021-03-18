const mongoose = require("mongoose");
const uniqueValidate = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    _id: {type: Schema.ObjectId},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
      sparse: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      max: 10,
    },
    password: { type: String, required: true, select: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "users",
  }
);

UserSchema.plugin(uniqueValidate, { message: " is already taken" });

module.exports = mongoose.model("Users", UserSchema);
