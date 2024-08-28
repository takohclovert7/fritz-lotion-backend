const mongoose = require('mongoose');

const productItemSchema = new mongoose.Schema({
  cover: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  buyname: {
    type: String,
    required: true,
  },
  buyeremail: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address'],
  }
}, {
  timestamps: true
});

const  ProductOderModel = mongoose.model('ProductOderModel', productItemSchema);

module.exports = ProductOderModel;
