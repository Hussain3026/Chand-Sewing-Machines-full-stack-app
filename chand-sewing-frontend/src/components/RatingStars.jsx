import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function RatingStars({ rating = 0, count, size = 14 }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <span className="rating-stars" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: full }).map((_, i) => (
        <FaStar key={`f${i}`} size={size} color="#FFA41C" />
      ))}
      {hasHalf && <FaStarHalfAlt size={size} color="#FFA41C" />}
      {Array.from({ length: empty }).map((_, i) => (
        <FaRegStar key={`e${i}`} size={size} color="#FFA41C" />
      ))}
      {typeof count === "number" && (
        <span className="rating-count">({count})</span>
      )}
    </span>
  );
}
