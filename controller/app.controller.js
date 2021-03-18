const assert = require("assert");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const Blogs = require("../model/blog.model");
const Users = require("../model/user.model");
const secretKey = require("../config.json").secret;

module.exports = {
  signUp: (req, res) => {
    if (req.body) {
      let userObj = new Users(req.body);

      userObj.save((err, user) => {
        if (err) {
          console.log(err.name);
          let count = 0;
          err_c;

          switch (err.name) {
            case "ValidationError":
              console.log(err.errors);
              for (field in err.errors) {
                if (count == 0) {
                  switch (err.errors[field].properties.type) {
                    case "invalid":
                      count++;
                      res.status(200).json({
                        error_code: 401,
                        property: field,
                        message: "Invalid Format",
                      });
                      break;
                    case "unique":
                      count++;
                      res.status(200).json({
                        error_code: 402,
                        property: field,
                        message: "Already Exists",
                      });
                      break;
                    case "user defined":
                      count++;
                      res.status(200).json({
                        error_code: 401,
                        property: field,
                        message: "Invalid Format",
                      });
                      break;
                    case "regexp":
                      count++;
                      res.status(200).json({
                        error_code: 301,
                        property: field,
                        message: "Register Expired",
                      });
                      break;
                    case "required":
                      count++;
                      res.status(200).json({
                        error_code: 201,
                        property: field,
                        message: "Required",
                      });
                      break;

                    default:
                      count++;
                      res.status(200).json({
                        error_code: 500,
                        property: field,
                        message: err,
                      });
                      break;
                  }
                }
              }
              break;

            default:
              res.status(200).json({ error_code: 500, message: err });
              break;
          }
        } else {
          res.status(200).json({ data: user, message: "success", code: 200 });
        }
      });
    } else {
      res.status(200).json({ error_code: 707, message: "values required" });
    }
  },
  login: (req, res) => {
    if ((req.body.username || req.body.email) && req.body.password) {
      var qry = {
        password: req.body.password,
        $or: [
          {
            email: req.body.email,
          },
          {
            username: req.body.username,
          },
        ],
      };

      Users.findOne(qry, "-new -password")
        .populate({
          path: "language",
          select: "name",
        })
        .exec((err, user) => {
          if (err) res.status(500).json({ error_code: 500, message: err });

          //user info validate username and password
          if (user !== undefined && user !== null) {
            // jwt token
            var token = jwt.sign(
              {
                email: user.email,
                password: user.password,
              },
              secretKey
            );
            // auth
            var authObject = {
              data: user,
              message: "Login Successful",
              error_code: 200,
              token: token,
            };
            res.status(200).json(authObject);
          } else {
            // exception
            res.status(200).json({
              error_code: 704,
              property: "user",
              message: "User not found",
            });
          }
        });
    }
  },
  getBlogs: (req, res) => {
    Blogs.find((err, response) => {
      if (err) assert.deepStrictEqual(err, null);
      res.json(response);
    });
  },
  createBlog: (req, res) => {
    let blog = new Blogs(req.body);
    blog
      .save()
      .then((result) => {
        res
          .status(200)
          .json({ error_code: 200, message: "Successfully saved" });
      })
      .catch((err) => {
        res.status(200).json({ error_code: 301, message: "Unable to save" });
      });
  },
  getSingleBlog: (req, res) => {
    let id = req.params.id;
    Blogs.findById({ _id: id }, (err, data) => {
      if (err) assert.deepStrictEqual(err, null);
      res.json(data);
    });
  },
  updateBlog: (req, res) => {
    let id = req.params.id;
    let data = new Blogs(req.body);
    Blogs.findByIdAndUpdate(
      { _id: id },
      {
        username: data.username,
        title: data.title,
        subTitle: data.subTitle,
        image: data.image,
        content: data.content,
      },
      { upsert: true }, // if id exists it ll update, if not it will create new collection
      (err, response) => {
        if (err) {
          assert.deepStrictEqual(err, null);
          res
            .status(200)
            .json({ error_code: 301, message: "Unable to Update" });
        } else {
          res
            .status(200)
            .json({ error_code: 200, message: "Successfully updated" });
        }
      }
    );
  },
  deleteBlog: (req, res) => {
    let id = req.params.id;
    Blogs.findByIdAndDelete({ _id: id }, (err, response) => {
      if (err) {
        assert.equal(err, null);
        res.status(200).json({ error_code: 301, message: "Unable to Delete" });
      } else {
        res
          .status(200)
          .json({ error_code: 200, message: "Successfully deleted" });
      }
    });
  },
};
