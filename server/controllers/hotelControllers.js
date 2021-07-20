const Hotel = require("../models/Hotel");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");

exports.getAllHotels = asyncHandler(async (req, res, next) => {
  const hotels = await Hotel.find();

  res.status(200).json({
    success: true,
    data: hotels,
  });
});

exports.addNewHotel = asyncHandler(async (req, res, next) => {
  const { name, rating, price, location } = req.body;
  console.log(req.body);
  let hotel = await Hotel.findOne({ name });

  if (hotel) {
    return res.status(409).json({
      success: false,
      message: "This hotel already exists",
    });
  }

  try {
    hotel = await Hotel.create({ name, rating, price, location });
    console.log("Added new hotel:" + hotel);

    res.status(200).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
});

exports.deleteHotelById = asyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    return next(
      new ErrorResponse(`Hotel with id ${req.params.id} was not found`, 404)
    );
  }
  await hotel.remove();

  res.status(200).json({
    success: true,
    message: `${hotel.name} removed`,
  });
});

exports.updateHotelById = asyncHandler(async (req, res, next) => {
  let hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    return next(
      ErrorResponse(`Hotel with id ${req.params.id} was not found`, 404)
    );
  }
  hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    message: `${hotel.name} updated`,
    data: hotel,
  });
});
