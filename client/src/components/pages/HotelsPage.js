import React, { useState, useEffect } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useSearchContext } from "../../context/SearchContext";
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
  const [uiValues, setUiValues] = useState();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const [priceRange, setPriceRange] = useState([25, 200]);
  const [sliderMax, setSliderMax] = useState(1000);
  const location = useLocation();
  const history = useHistory();
  const params = location.search ? location.search : null;
  const url = location.search;

  const [sortBy, setSortBy] = useState("");
  const [sortString, setSortString] = useState("");

  const { searchValue } = useSearchContext();
  const updateUIValues = (uiValues) => {
    setSliderMax(uiValues.maxPrice);

    if (uiValues.filtering.price) {
      let priceFilter = uiValues.filtering.price;

      setPriceRange([Number(priceFilter.gte), Number(priceFilter.lte)]);
    }

    if (uiValues.sorting.rating) {
      let ratingSort = uiValues.sorting.rating;
      setSortString(ratingSort);
    }
  };

  useEffect(() => {
    let query = "";

    const source = axios.CancelToken.source();
    let cancel;
    const fetchHotelsData = async () => {
      const parsed = queryString.parse(location.search);
      console.log(parsed);
      console.log(location.search);
      setLoading(true);
      try {
        if (location.search && !filter) {
          query = location.search;
        } else {
          query = filter;
        }

        let parsedQuery;
        if (sortBy) {
          if (query.length === 0) {
            query = `?sort=${sortBy}`;
          } else {
            parsedQuery = queryString.parse(query);

            if (parsedQuery["sort"]) {
              console.log("sort already applied");
              parsedQuery["sort"] = sortBy;
              query = `?${queryString.stringify(parsedQuery)}`;
            } else {
              query = query + `&sort=${sortBy}`;
            }
          }
        }

        history.push("/hotels" + query);

        /**https://stackoverflow.com/questions/54181169/how-to-update-query-param-in-url-in-react**/

        let url = `http://localhost:8000/api/v1/hotels${
          parsed.search_query
            ? "/search" + location.search
            : "" + location.search
        }`;
        console.log(url);
        console.log(location.search);

        const { data } = await axios.get(url, {
          cancelToken: source.token,
        });

        setHotels(data.data);
        updateUIValues(data.uiValues);
        console.log(priceRange);
        setLoading(false);
        console.log(data.uiValues);
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
  }, [filter, sortBy, url]);

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

  return (
    <>
      <div className="hotels-filter-sort">
        <div className="hotels__price-filter">
          <p>Filter by Price:</p>
          <Slider
            min={0}
            max={sliderMax}
            value={priceRange}
            valueLabelDisplay="auto"
            disabled={loading}
            onChange={(e, newValue) => setPriceRange(newValue)}
            onChangeCommitted={handleSliderCommitted}
            className="hotels__price-filter-slider"
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
          <p>Sort By:</p>
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
