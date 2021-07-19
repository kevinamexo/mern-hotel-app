exports.getAllHotels = (req, res, next) => {
  res.send("Get all hotels");
};

exports.addNewHotel = (req, res, next) => {
  res.send("Add new hotel");
};

exports.deleteHotelById = (req, res, next) => {
  res.send("Delete hotel by id");
};

exports.updateHotelById = (req, res, next) => {
  res.send("Update hotel by id");
};
