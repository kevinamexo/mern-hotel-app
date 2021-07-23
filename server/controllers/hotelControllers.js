const Hotel = require("../models/Hotel");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");

exports.getAllHotels = asyncHandler(async (req, res, next) => {
  let reqQuery;
  let uiValues = {
    filtering: {},
    sorting: {},
  };
  reqQuery = { ...req.query };

  //FILTER THEN SORT
  const removeBeforeFilter = ["sort"];
  const filterKeys = ["price"];
  removeBeforeFilter.forEach((r) => delete reqQuery[r]);

  ///check if all filters are allowed

  // console.log(reqQuery);
  let queryKeys = Object.keys(reqQuery);
  let queryValues = Object.values(reqQuery);

  console.log(queryKeys);
  console.log(queryValues);

  let invalidQueryKeys;
  // console.log(queryKeys);

  queryKeys.forEach((q, idx) => {
    if (!filterKeys.includes(q)) {
      invalidQueryKeys = true;
    }
    uiValues.filtering[q] = queryValues[idx];
  });
  console.log(uiValues);

  if (invalidQueryKeys === true) {
    return next(new ErrorResponse("Filter parameter Not found", 404));
  } else {
    let queryStr = JSON.stringify(reqQuery);
    console.log(queryStr);

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // console.log(queryStr);
    query = Hotel.find(JSON.parse(queryStr));

    if (req.query.sort) {
      let sortQuery = req.query.sort.split(",");
      let order;
      sortQuery.forEach((val) => {
        if (val[0] === "-") {
          console.log("descending");
          order = "descrating";
        } else {
          console.log("ascending");
          order = "ascrating";
        }
        uiValues.sorting[val.replace("-", "")] = order;
      });
      sortQueryString = sortQuery.join(" ");
      console.log(sortQueryString);

      query = query.sort(sortQueryString);
    } else {
      query = query.sort("-rating");
    }

    const hotels = await query;

    const maxPrice = await Hotel.find()
      .sort({ price: -1 })
      .limit(1)
      .select("-_id price");
    const minPrice = await Hotel.find()
      .sort({ price: 1 })
      .limit(1)
      .select("-_id price");

    uiValues.maxPrice = maxPrice[0].price;
    uiValues.minPrice = minPrice[0].price;

    console.log(uiValues);

    res.status(200).json({
      success: true,
      data: hotels,
      uiValues,
    });
  }
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
      new ErrorResponse(`Hotel with id ${req.params.id} was not found`, 404)
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
