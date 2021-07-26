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
  const [sliderActive, setSliderActive] = useState(false);

  const location = useLocation();
  const history = useHistory();
  const params = location.search ? location.search : null;
  const url = location.search;
  const searchTerm = queryString.parse(params).search_query;

  const [sortBy, setSortBy] = useState("");
  const [sortString, setSortString] = useState("");

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
    const parsed = queryString.parse(location.search);

    let searchQuery = "";
    let filterQuery = "";
    let sortQuery = "";
    let finalQuery = "";

    //check seartch
    if (searchTerm) {
      // setFilter("");
      finalQuery = `?search_query=${searchTerm}`;
      setSliderActive(false);
    }
    //check filter

    if (filter && finalQuery.length > 0) {
      finalQuery = finalQuery + `&${filter}`;
    } else if (finalQuery.length === 0 && filter) {
      finalQuery = `?${filter}`;
    }

    //check sorting
    if (sortBy && finalQuery.length > 0) {
      finalQuery = finalQuery + `&sort=${sortBy}`;
    } else if (finalQuery.length === 0 && sortBy) {
      finalQuery = `?sort=${sortBy}`;
    }

    console.log(finalQuery);
    let query = "";

    const source = axios.CancelToken.source();
    let cancel;
    const fetchHotelsData = async () => {
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

        history.push("/hotels" + finalQuery);

        /**https://stackoverflow.com/questions/54181169/how-to-update-query-param-in-url-in-react**/

        let url = `http://localhost:8000/api/v1/hotels/search${finalQuery}`;

        const { data } = await axios.get(url, {
          cancelToken: source.token,
        });

        setHotels(data.data);
        updateUIValues(data.uiValues);
        setLoading(false);
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
      setPriceRange(newRange);
    }
    if (type === "upper") {
      newRange = [...priceRange];
      newRange[1] = Number(e.target.value);
      setPriceRange(newRange);
    }
  };

  const handleSliderCommitted = (e, newValue) => {
    buildPriceRangeFilter(newValue);
  };
  const buildPriceRangeFilter = (newValue) => {
    let urlFilter = `price[gte]=${newValue[0]}&price[lte]=${newValue[1]}`;
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

  const handleClearFilters = () => {
    setFilter("");
    setSortString("");
    history.push("/");
  };
  return (
    <>
      <div className="hotels-filter-sort">
        <div className="hotels__price-filter">
          <div className="hotels__priceFilter-header">
            <p>Filter by Price:</p>
            <input
              type="checkbox"
              className="activatePriceSlider"
              checked={sliderActive}
              onChange={() => setSliderActive(!sliderActive)}
            />
          </div>
          <Slider
            min={0}
            max={400}
            value={priceRange}
            valueLabelDisplay="auto"
            disabled={!sliderActive}
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
        <button onClick={handleClearFilters}>Clear</button>
      </div>
      <div className="hotels-list">
        {searchTerm && hotels.length === 0 && !loading && (
          <h3 className="hotels-list__noResults">
            No results found for {`${searchTerm}`}
          </h3>
        )}

        {!loading && searchTerm && hotels.length > 0 && (
          <h3>{`Showing results for: "${searchTerm}"`}</h3>
        )}

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
