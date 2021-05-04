import { useState, useEffect } from "react";

import { db } from "../../utils/firebase";

import Card from "../Card";

const Feed = ({ query, setCurrentTab, city }) => {
  const [feed, setFeed] = useState([]);
  const [resource, setResource] = useState();

  useEffect(() => {
    if (query.city) {
      fetchFromDB();
    } else if (city) {
      fetchCityData();
    }
  }, [query, city]);

  const fetchCityData = async () => {
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

  if (Object.keys(query).length === 0 && feed.length === 0)
    return <p className="text-center my-4">Search to get results...</p>;

  return (
    <div className="flex flex-col items-center feedContainer">
      {Object.keys(feed).length > 0 ? (
        Object.keys(feed).map((post) => (
          <Card
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
            className="py-2 px-4 bg-green-500 text-white rounded text-base font-bold my-4 cursor-pointer"
          >
            Checkout the tweets section
          </span>
        </>
      )}
    </div>
  );
};

export default Feed;
