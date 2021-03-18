const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const mongoose = require("mongoose");
const assert = require("assert");
const appRoute = require("./route/app.route");
const mongoConfig = require("./db/dbconfig");
const PORT = Number(process.env.PORT || require("./config.json").port);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

mongoose.Promise = global.Promise;
mongoose
  .connect(mongoConfig.prod, { useNewUrlParser: true })
  .then((result) => {
    console.log("Database connected");
  })
  .catch((err) => console.log(err));

app.use(
  expressSession({
    secret: process.env.SECRET || require("./config.json").secret,
    saveUninitialized: true,
    resave: true,
  })
);

app.use("/", appRoute);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
