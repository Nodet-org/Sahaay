import { Checkbox, Form, message, Select, Button } from "antd";
import { useState } from "react";

import { API_URL } from "../../utils/constants";

const { Option } = Select;

const Header = ({ setTweets, setLink, setQuery }) => {
  const [search, setSearch] = useState("");
  const [searchSelect, setSearchSelect] = useState("oxygen");
  const [verified, setVerified] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTweets([]);
    setLoading(true);
    console.log("here");
    let query = {
      cityOrPincode: search,
      resource: searchSelect,
      verified: verified,
    };

    const response = await (
      await fetch(`${API_URL}/api/scrape`, {
        method: "post",
        body: JSON.stringify(query),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
    console.log(response);
    if (response.success) {
      query = {
        city: response.city,
        resource: searchSelect,
        verified: verified,
      };
      message.success("Loaded tweets");
      setQuery(query);
      setTweets(response?.tweets);
      setLink(response?.link);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col py-4">
      <div className="flex items-center justify-center mx-5 my-2">
        <div className="font-semibold text-2xl">Sahaay</div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="bg-white mx-5 rounded-full h-9 flex items-center justify-between px-4 my-4">
          <label htmlFor="search" className="hidden">
            Search
          </label>
          <input
            type="text"
            id="search"
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
            htmlFor="verified"
          >
            <Checkbox
              onChange={(e) => setVerified(e.target.checked)}
              checked={verified}
              id="verified"
            />
          </Form.Item>
          <Button
            type="submit"
            className="cursor-pointer py-2 px-4 flex-1 w-full bg-theme-color focus:bg-theme-color focus:text-white hover:bg-theme-color text-white hover:text-white rounded"
            size="large"
            loading={loading}
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Header;
