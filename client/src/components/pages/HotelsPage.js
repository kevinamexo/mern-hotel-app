import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import HotelCard from "./HotelCard";
import queryString from "query-string";
import {
  Slider,
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import "./HotelsPage.css";
const HotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const [priceRange, setPriceRange] = useState([25, 200]);

  const history = useHistory();
  const location = useLocation();
  const { search } = useLocation;
  const params = location.search ? location.search : null;
  const values = queryString.parse(params);

  const [sortBy, setSortBy] = useState("");
  const [sortString, setSortString] = useState("");
  useEffect(() => {
    console.log(values);
    let query = "";
    const source = axios.CancelToken.source();
    let cancel;
    const fetchHotelsData = async () => {
      setLoading(true);
      try {
        // console.log(params);
        if (params && !filter) {
          query = params;
        } else {
          query = filter;
        }

        if (sortBy) {
          if (query.length === 0) {
            query = `?sort=${sortBy}`;
          } else {
            query = query + "&sort=" + sortBy;
          }
        }

        history.push(query);

        const { data } = await axios.get(
          `http://localhost:8000/api/v1/hotels${query}`,
          {
            cancelToken: source.token,
          }
        );

        setHotels(data.data);
        setLoading(false);
        console.log(values);
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.log(error);
        setLoading(false);
      }
    };

    fetchHotelsData();

    return () => {
      source.cancel();
    };
  }, [filter, sortBy]);

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

  const handleSortChange = (e) => {
    setSortString(e.target.value);
    if (e.target.value === "ascrating") {
      console.log("Ratings in ascending order");
      setSortBy("rating");
    } else if (e.target.value === "descrating") {
      console.log("Ratings in descending order");
      setSortBy("-rating");
    }
  };


  {
    /** IF SORT (from parsed url) ===SORTBY* return, then return, else remove sort from query params, and update with new sort from radio  button */
  
    https://stackoverflow.com/questions/54181169/how-to-update-query-param-in-url-in-react
  }
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
        <div className="sort-section">
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="Sort-by"
              value={sortString}
              name="sort-by"
              onChange={handleSortChange}
            >
              <FormControlLabel
                value="descrating"
                name="desc-ratings"
                control={<Radio />}
                label="Sort by Ratings: High-Low"
              />
              <FormControlLabel
                value="ascrating"
                name="asc-ratings"
                control={<Radio />}
                label="Sort by Ratings: Low-High"
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
      <div className="hotels-list">
        {loading ? (
          <h1>Loading...</h1>
        ) : (
          hotels.map((hotel) => <HotelCard key={hotel._id} hotel={hotel} />)
        )}
      </div>
    </>
  );
};

export default HotelsPage;
