const dbConfig = require("../config.json").dbUri;

module.exports = {
  prod: dbConfig || process.env.MONGOURI,
  dev: "mongodb://localhost:27017/blog",
};
