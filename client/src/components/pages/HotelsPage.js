import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import HotelCard from "./HotelCard";
import {
  Slider,
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
} from "@material-ui/core";
import "./HotelsPage.css";
const HotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [priceRange, setPriceRange] = useState([25, 200]);
  const history = useHistory();
  const location = useLocation();
  const params = location.search ? location.search : null;
  useEffect(() => {
    let cancel;
    const fetchHotelsData = async () => {
      setLoading(true);
      try {
        let query;
        if (params && !filter) {
          query = params;
        } else {
          query = filter;
        }
        const { data } = await axios({
          method: "GET",
          url: `http://localhost:8000/api/v1/hotels${query}`,
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        });
        console.log(data);
        setLoading(false);
        setHotels(data.data);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchHotelsData();

    return () => cancel();
  }, [filter]);

  const handlePriceInputChange = (e, type) => {
    let newRange;

    if (type === "lower") {
      newRange = [...priceRange];
      newRange[0] = Number(e.target.value);
    }
    if (type === "upper") {
      newRange = [...priceRange];
      newRange[1] = Number(e.target.value);
    }

    setPriceRange(newRange);
  };

  const handleSliderCommitted = (e, newValue) => {
    buildPriceRangeFilter(newValue);
  };
  const buildPriceRangeFilter = (newValue) => {
    let urlFilter = `?price[gte]=${newValue[0]}&price[lte]=${newValue[1]}`;
    setFilter(urlFilter);
    history.push(urlFilter);
  };

  return (
    <>
      <div className="hotels-filter-sort">
        <div className="hotels__price-filter">
          <Slider
            min={0}
            max={1000}
            value={priceRange}
            valueLabelDisplay="auto"
            disabled={loading}
            onChange={(e, newValue) => setPriceRange(newValue)}
            onChangeCommitted={handleSliderCommitted}
          />
          <span>
            <TextField
              size="small"
              id="lower"
              label="Min Price"
              variant="outlined"
              type="number"
              disabled={loading}
              value={priceRange[0]}
              onChange={(e) => handlePriceInputChange(e, "lower")}
              onBlur={handlePriceInputChange}
            />

            <TextField
              size="small"
              id="upper"
              label="Max Price"
              variant="outlined"
              type="number"
              disabled={loading}
              value={priceRange[1]}
              onChange={(e) => handlePriceInputChange(e, "upper")}
              onBlur={handlePriceInputChange}
            />
          </span>
        </div>
        <div>s</div>
      </div>
      <div className="hotels-list">
        {hotels.map((hotel) => (
          <HotelCard key={hotel._id} hotel={hotel} />
        ))}
      </div>
    </>
  );
};

export default HotelsPage;
