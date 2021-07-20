import React from "react";
import { AiFillStar } from "react-icons/ai";
import "./Rating.css";

const Rating = ({ rating }) => {
  let starsLeft = 5 - rating;

  return (
    <div className="star-rating-container">
      <span className="star-rating">
        <p>{rating.toFixed(1)}</p>
        {[...Array(rating)].map((star, index) => (
          <AiFillStar key={index} />
        ))}
        {[...Array(starsLeft)].map((star, index) => (
          <AiFillStar key={index} color="grey" />
        ))}
      </span>
    </div>
  );
};

export default Rating;
