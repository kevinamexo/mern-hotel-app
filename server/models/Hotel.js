const mongoose = require("mongoose");

const hotelSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name to the bootcamp"],
    unique: true,
  },
  rating: {
    type: Number,
    required: [true, "Please provide a rating for a bootcamp"],
    min: 0,
    max: 5,
  },
  price: {
    type: Number,
    required: [true, "Please provide bootcamp with price"],
  },
  location: {
    type: String,
    required: [true, "Please provide a location"],
  },
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
