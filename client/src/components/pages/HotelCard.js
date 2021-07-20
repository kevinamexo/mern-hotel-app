import React from "react";
import { MdLocationOn } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import Rating from "./Rating";
import "./HotelCard.css";

const HotelCard = ({ hotel }) => {
  return (
    <>
      <div className="hotelCard">
        <div className="hotelCard__image-container" alt={hotel.name}>
          <img src="hotel.jpg" />
        </div>
        <div className="hotelCard__info">
          <p className="hotelCard__name">{hotel.name}</p>
          <span className="hotelCard__location">
            <MdLocationOn />
            <p>{hotel.location}</p>
          </span>
          <div className="hotelCard__footer">
            <span>
              <p>Price</p>
              <h3>{hotel.price}</h3>
            </span>
            <span className="hotelCard__rating">
              <p>Rating:</p>
              <Rating rating={hotel.rating} />
            </span>
            <button className="hotelCard__book">BOOK</button>
          </div>
        </div>
        <div className="hotelCard__favourite-btn-container">
          <FcLike className="hotelCard__favourite-btn" />
        </div>
      </div>
    </>
  );
};

export default HotelCard;
