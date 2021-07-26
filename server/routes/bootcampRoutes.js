const express = require("express");
const router = express.Router();
const hotelControllers = require("../controllers/hotelControllers");

router
  .route("/")
  .get(hotelControllers.getAllHotels)
  .post(hotelControllers.addNewHotel);

router.route("/search").get(hotelControllers.searchController);

router
  .route("/:id")
  .put(hotelControllers.updateHotelById)
  .delete(hotelControllers.deleteHotelById);
module.exports = router;
