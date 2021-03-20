const mongoose = require("mongoose");
const uniqueValidate = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

let Blogs = new Schema(
  {
    
    username: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    subTitle: { type: String, required: true },
    image: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "blogs",
  }
);

Blogs.plugin(uniqueValidate, { message: " is already taken" });

module.exports = mongoose.model("Blogs", Blogs);
