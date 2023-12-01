const 
  validator = require('mongoose-unique-validator'),
  random = require('../utils/random'),
  mongoose = require('mongoose');

const 
  schema = mongoose.Schema({
    full: {
      type: String,
      unique: true,
      required: true
    },
    short: {
      type: String,
      unique: true,
      required: true,
      default: random
    },
    clicks: {
      type: Number,
      required: true,
      default: 0
    }
  });

schema.plugin(validator, { message: "This url/short url is already shortened!" });

module.exports = mongoose.model('urls', schema);