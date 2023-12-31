import RestaurantCard, { withPromotedLabel } from "./RestaurantCard";
import { useState, useEffect, useContext } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utils/useOnlineStatus";
import UserContext from "../utils/UserContext";
const Body = () => {
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchRes, setSearchRes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const { user, setUser } = useContext(UserContext);
  const RestaurantCardWithLabel = withPromotedLabel(RestaurantCard);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await fetch(
      "https://www.swiggy.com/dapi/restaurants/list/v5?lat=12.9351929&lng=77.62448069999999&page_type=DESKTOP_WEB_LISTING"
    );

    x = await data.json();
    setFilteredRestaurants(
      x?.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );
    setSearchRes(
      x?.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );
  };

  const status = useOnlineStatus();
  if (status === false) {
    return <h1>Check your Internet Connection!!!</h1>;
  }

  return filteredRestaurants.length === 0 ? (
    <Shimmer />
  ) : (
    <div className="body">
      <div className="flex justify-between">
        <div className="m-3 p-3">
          <input
            type="text"
            className="border border-solid border-orange-200 mx-2 rounded-lg shadow-lg"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <button
            className="px-3 py-1 mx-2 bg-orange-200 rounded-lg"
            onClick={() => {
              const searchResult = filteredRestaurants.filter((res) =>
                res.data.name.toLowerCase().includes(searchText.toLowerCase())
              );
              setSearchRes(searchResult);
            }}
          >
            Search
          </button>
        </div>
        <div className="m-3 p-3">
          <input
            className="border border-solid border-orange-200 mx-2 rounded-lg shadow-lg"
            value={user.name}
            onChange={(e) => {
              setUser({ name: e.target.value, email: "newmail@gmail.com" });
            }}
          ></input>
        </div>
        <div className="m-3 p-3">
          <button
            className="px-3 py-1 mx-2 bg-orange-200 rounded-lg"
            onClick={() => {
              const filteredList = filteredRestaurants.filter(
                (x) => x.info.avgRating > 4
              );
              setSearchRes(filteredList);
            }}
          >
            Top Rated Restaurants
          </button>
          <button
            className="px-3 py-1 mx-3 bg-orange-200 rounded-lg"
            onClick={() => {
              setSearchRes(
                x?.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle
                  ?.restaurants
              );
            }}
          >
            Back
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 justify-items-center">
        {searchRes.map((x) => (
          <Link key={x.info.id} to={"/restaurants/" + x.info.id}>
            {x?.info.promoted ? (
              <RestaurantCardWithLabel resData={x?.info} />
            ) : (
              <RestaurantCard resData={x?.info} />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Body;
