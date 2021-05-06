import { useState, useEffect } from "react";
import axios from "axios";

import { db } from "../../utils/firebase";

import Card from "../Card";
import CenteredSpinner from "../CenteredSpinner";
import { message, Button } from "antd";

const Feed = ({ query, setCurrentTab, askLocation }) => {
  const [feed, setFeed] = useState([]);
  const [resource, setResource] = useState();
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState();

  const [limit, setLimit] = useState(5);
  const [feedLoading, setFeedLoading] = useState(false);

  useEffect(() => {
    if (askLocation) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((pos) => {
          axios
            .get(
              `https://us1.locationiq.com/v1/reverse.php?key=80c6277b4fd80d&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
            )
            .then(function (response) {
              setCity(response.data.address.state.toLowerCase());
            });
        });
      } else {
        message.error("Location fetching not suppprted");
      }
    }
    if (query.city) {
      fetchFromDB();
    } else if (city) {
      fetchCityData();
    }
    // react-hooks/exhaustive-deps
  }, [query, city]);

  const fetchCityData = async () => {
    setLoading(true);
    const dbref = db.ref(`feed/${city}`);
    await dbref.once("value", (snapshot) => {
      if (snapshot.exists()) {
        if (snapshot.val()) {
          let newFeed = [];
          let res;
          Object.keys(snapshot.val()).map((docs) => {
            // setResource(docs);
            res = docs;
            Object.values(snapshot.val()).map((value) => {
              newFeed = value || [];
            });
          });
          setResource(res);
          setFeed(newFeed);
        }
      } else {
        setFeed([]);
      }
    });
    setLoading(false);
  };

  const fetchFromDB = async () => {
    setResource(query.resource);
    const dbref = db.ref(`feed/${query.city}/${query.resource}`);
    await dbref.once("value", (snapshot) => {
      if (snapshot.exists()) {
        if (snapshot.val()) setFeed(snapshot.val());
      } else {
        setFeed([]);
      }
    });
  };

  if (Object.keys(query).length === 0 && Object.keys(feed).length === 0)
    return loading ? (
      <CenteredSpinner text="Hold on fetching you data.." />
    ) : (
      <p className="text-center">Search to get feeds</p>
    );

  return (
    <div className="flex flex-col items-center feedContainer">
      {Object.keys(feed).length > 0 ? (
        Object.keys(feed)
          .reverse()
          .slice(0, limit)
          .map((post, i) => (
            <Card
              key={i}
              post={feed[post]}
              resource={resource}
              location={query.city || city}
            />
          ))
      ) : (
        <>
          <p>
            No leads found for{" "}
            {query.resource.charAt(0).toUpperCase() + query.resource.slice(1)}{" "}
            in the region{" "}
            {query.city.charAt(0).toUpperCase() + query.city.slice(1)}
          </p>
          <span
            onClick={() => setCurrentTab("2")}
            className="py-2 px-4 bg-theme-color text-white rounded text-base font-bold my-4 cursor-pointer"
          >
            Checkout the tweets section
          </span>
        </>
      )}
      {feed && limit < Object.keys(feed).length && (
        <Button
          onClick={() => {
            setFeedLoading(true);
            setLimit((prev) => prev + 5);
            setFeedLoading(false);
          }}
          className="py-2 my-4 px-4 bg-theme-color text-white rounded font-bold text-base focus:bg-theme-color focus:text-white hover:bg-theme-color hover:text-white"
          loading={feedLoading}
          size="large"
        >
          Load More resources
        </Button>
      )}
    </div>
  );
};

export default Feed;
