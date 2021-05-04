import { Checkbox, Form, Select } from "antd";
import { useState } from "react";
import axios from "axios";

import { db } from "../../utils/firebase";

const { Option } = Select;

const Header = ({ setTweets, setLink, setQuery }) => {
  const [search, setSearch] = useState("");
  const [searchSelect, setSearchSelect] = useState("oxygen");
  const [verified, setVerified] = useState(true);

  const parseSearchParameters = (resource) => {
    const parameters = {
      oxygen: ["oxygen"],
      icu: ["icu"],
      bed: ["bed", "beds"],
      ventilator: ["ventilator", "ventilators"],
      test: ["test", "tests", "testing"],
      fabiflu: ["fabiflu"],
      remdesivir: ["remdesivir"],
      favipiravir: ["favipiravir"],
      tocilizumab: ["tocilizumab"],
      plasma: ["plasma"],
      food: ["food", "foods", "tiffin", "tiffins"],
      ambulance: ["ambulance", "ambulances"],
    };

    if (parameters[resource]) {
      let searchParameter =
        "%28" + parameters[resource].map((query) => query).join("+OR+") + "%29";
      return searchParameter;
    }
    return "";
  };

  const parseCity = async (cityOrPincode) => {
    let city = "";
    if (!isNaN(parseInt(cityOrPincode))) {
      try {
        const response = await (
          await fetch("https://api.postalpincode.in/pincode/" + cityOrPincode)
        ).json();
        if (response[0].Status && response[0].PostOffice.length) {
          city = response[0].PostOffice[0].Region;
        } else {
          return { inValid: "pincode" };
        }
      } catch (err) {
        console.log(err);
        return { inValid: "pincode" };
      }
    } else {
      city = cityOrPincode;
    }
    return city;
  };

  const generateLink = async ({ cityOrPincode, verified, resource }) => {
    const url = "https://twitter.com/search?q=";
    let search = verified ? "verified" : "";
    let city = await parseCity(cityOrPincode);
    if (city?.inValid) return city;
    let parameters = parseSearchParameters(resource);
    let twitterAPIParams = `${search} ${city} ${resource} -"any" -"requirement" -"requirements" -"requires" -"require" -"required" -"request" -"requests" -"requesting" -"needed" -"needs" -"need" -"seeking" -"seek" -"not verified" -"notverified" -"looking" -"unverified" -"urgent" -"urgently" -"urgently required" -"sending" -"send" -"help" -"dm" -"get" -"year" -"old" -"male" -"female" -"saturation" -is:reply -is:retweet -is:quote&max_results=20&tweet.fields=created_at,public_metrics&expansions=author_id`;
    search += `+${city}+${parameters}&f=live`;
    const link = url + search;
    return { link, twitterAPIParams, city: city.toLowerCase() };
  };

  const getTweets = async (parameter, city, resource) => {
    const url = "https://api.twitter.com/2/tweets/search/recent";
    const data = await db.ref(`tweets/${city}/${resource}`).once("value");
    try {
      const twitterUrl = `${url}?${
        data.val()?.sinceId ? `since_id=${data.val()?.sinceId}&` : ""
      }query=${parameter}`;
      let response;
      if (
        data.val() === null ||
        new Date(
          new Date(data.val()?.lastUpdated).setMinutes(
            new Date(data.val()?.lastUpdated).getMinutes() + 5
          )
        ).getTime() -
          new Date().getTime() <
          0
      ) {
        console.log("Fetching, data is old...", data.val()?.lastUpdated);
        response = await axios.get(twitterUrl, {
          headers: {
            Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
          },
        });
      }
      console.log(response?.data);
      if (response?.data?.meta?.result_count > 0) {
        console.log("Fetching from api :(");
        const tweets = response.data?.data?.map((tweet) => tweet.id);
        return { tweets, sinceId: response.data.meta.newest_id };
      } else {
        console.log("Fetching from db..");
        return { tweets: [], sinceId: "" };
      }
    } catch (err) {
      console.log(err, "ERROR");
      return { tweets: [], sinceId: "" };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    let query = {
      cityOrPincode: search,
      resource: searchSelect,
      verified: verified,
    };
    const { twitterAPIParams, link, city } = await generateLink(query);
    const dbref = db.ref(`tweets/${city}/${query.resource}`);

    const { tweets, sinceId } = await getTweets(
      twitterAPIParams,
      city,
      query.resource
    );

    if (link) {
      let payload = {};
      await dbref.once("value", (snapshot) => {
        if (snapshot.exists()) {
          if (snapshot.val()) {
            let totalTweets = [...tweets, ...snapshot.val().tweets];
            payload = {
              tweets: totalTweets,
              lastUpdated: new Date().toISOString(),
              sinceId: sinceId || snapshot.val().sinceId,
            };
          }
        } else {
          if (sinceId)
            payload = {
              tweets,
              lastUpdated: new Date().toISOString(),
              sinceId: sinceId,
            };
        }
      });
      if (Object.keys(payload).length > 0) await dbref.set(payload);
      response = {
        success: true,
        city: city,
        link: link,
        tweets: payload.tweets,
      };
    }

    if (response.success) {
      query = {
        city: response.city,
        resource: searchSelect,
        verified: verified,
      };
      setQuery(query);
      setTweets(response?.tweets);
      setLink(response?.link);
    }
  };

  return (
    <div className="flex flex-col py-4">
      <div className="flex items-center justify-center mx-5 my-2">
        <div className="font-semibold text-2xl">COVID-19 Resources</div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="bg-white mx-5 rounded-full h-9 flex items-center justify-between px-4 my-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none flex-1"
            placeholder="Search by Pincode/City"
          />
        </div>
        <div className="mb-2 mx-5 flex flex-col sm:flex-row items-center">
          <Select
            defaultValue={searchSelect}
            onChange={(e) => setSearchSelect(e)}
            className="flex-2 w-full"
            size="large"
          >
            <Option value="oxygen">Oxygen</Option>
            <Option value="bed">Beds</Option>
            <Option value="icu">ICU</Option>
            <Option value="ventilator">Ventilator</Option>
            <Option value="tests">Tests</Option>
            <Option value="fabiflu">Fabiflu</Option>
            <Option value="remdesivir">Remdesivir</Option>
            <Option value="favipiravir">Favipiravir</Option>
            <Option value="tocilizumab">Tocilizumab</Option>
            <Option value="plasma">Plasma</Option>
            <Option value="food">Food</Option>
            <Option value="Ambulance">Ambulance</Option>
          </Select>
          <Form.Item
            label="Verified"
            tooltip="Currently only works on tweet tab"
            className="flex-1 w-full flex items-center h-full my-0 sm:px-4 py-1 verified"
          >
            <Checkbox
              onChange={(e) => setVerified(e.target.checked)}
              checked={verified}
            />
          </Form.Item>
          <input
            type="submit"
            value="Search"
            className="cursor-pointer py-2 px-4 flex-1 w-full bg-theme-color text-white rounded"
          />
        </div>
      </form>
    </div>
  );
};

export default Header;
