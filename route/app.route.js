const express = require("express");
const appController = require("../controller/app.controller");
const appRoute = express.Router();

appRoute.route("/signUp").post(appController.signUp); // signup
appRoute.route("/login").post(appController.login); // login

appRoute.route("/").get(appController.getBlogs); // to read all blogs
appRoute.route("/").post(appController.createBlog); // to create new blog
appRoute.route("/:id").get(appController.getSingleBlog); // to read single blog
appRoute.route("/:id").patch(appController.updateBlog); // to update existing blog
appRoute.route("/:id").delete(appController.deleteBlog); //  to delete existing blog

module.exports = appRoute;
