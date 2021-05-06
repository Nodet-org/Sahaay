import { Checkbox, Form, message, Select, Button, Tooltip, Spin } from "antd";
import axios from "axios";
import { useCallback, useState } from "react";
import debounce from "lodash/debounce";

import { API_URL } from "../../utils/constants";

import logo from "../../assets/logo.svg";

const { Option } = Select;

const Header = ({ setTweets, setLink, setQuery }) => {
  const [search, setSearch] = useState([]);
  const [searchSelect, setSearchSelect] = useState("oxygen");
  const [verified, setVerified] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [value, setValue] = useState();
  const [pin, setPin] = useState();
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    if (pin) {
      setTweets([]);
      setLoading(true);
      let query = {
        cityOrPincode: pin,
        resource: searchSelect,
        verified: verified,
      };

      try {
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
          message.success("Loaded tweets", 3);
          setQuery(query);
          setTweets(response?.tweets);
          setLink(response?.link);
        } else if (response?.message) message.error(response.message);
      } catch (error) {
        console.log(error);
        if (error?.message) message.error(error.message);
        else message.error(error.toString());
      }
      setLoading(false);
    } else {
      message.error(`Enter a City/Pincode to search for ${searchSelect}`, 3);
    }
  };

  // Location search
  function onChange(value) {
    // this.setState({ fetching: false, search: [], value: value });
    setPin(value.value);
    setFetching(false);
    setSearch([]);
    setValue(value);
    // console.log("on change", value);
  }

  const getLocation = (value) => {
    axios
      .get(
        `https://api.locationiq.com/v1/autocomplete.php?key=80c6277b4fd80d&q=${value}&countrycodes=IN&limit=5&normalizecity=1&normalizestate=1&tag=place:city,place:town,place:village`
      )
      .then(function (response) {
        // handle success
        if (response.data) {
          const newSearch = response.data.map((loc) => ({
            name: [
              loc.address.name,
              loc.address.state,
              loc.address.country,
            ].join(", "),
            search: loc.display_place,
            lat: loc.lat,
            lon: loc.lon,
            id: loc.place_id,
            address: loc.address,
          }));
          // console.log(newSearch);
          setSearch(newSearch);
          setFetching(false);
          setValue(newSearch);
        }
      })
      .catch((err) => {
        console.log(err.toString());
        setFetching(false);
        setError(true);
      });
  };

  const debounceSearch = useCallback(
    debounce((place) => getLocation(place), 200),
    []
  );

  const onSearch = (value) => {
    // console.log("fetching data", value);

    if (value.length !== 0) {
      setSearch([]);
      setFetching(true);
      debounceSearch(value);
      // if (navigator.geolocation) {
      // navigator.geolocation.getCurrentPosition((pos) => {

      // });
      // } else {
      // console.log("not suppprted");
      // x.innerHTML = "Geolocation is not supported by this browser.";
      // setFetching(false);
      // }
    }
  };

  return (
    <div className="flex flex-col py-4">
      <div className="flex items-center justify-center mx-5 my-2">
        <div className="flex justify-center items-center">
          <img
            src={logo}
            alt="Helping hand"
            height="56"
            width="56"
            className="h-14 w-14 pr-4"
          />
          <p className="font-semibold text-2xl">Sahaay</p>
        </div>
      </div>
      <Form onFinish={handleSubmit} id="searchForm">
        <div className="bg-white mx-5  h-9 flex items-center justify-between  my-4">
          <Select
            // mode="multiple"
            labelInValue
            value={value?.display_place}
            // showArrow
            showSearch
            placeholder="Search for your city..."
            notFoundContent={
              fetching ? (
                <Spin size="small" />
              ) : error ? (
                "No results found"
              ) : (
                "Search for your location."
              )
            }
            filterOption={false}
            onSearch={onSearch}
            onChange={onChange}
            style={{ width: "100%" }}
            suffixIcon={false}
            className="customSelect"
            size="large"
          >
            {search?.map(
              (d, id) =>
                d.address.postcode &&
                d.address?.postcode?.length === 6 && (
                  <Option key={id} value={d.address.postcode}>
                    {d.name}
                  </Option>
                )
            )}
          </Select>
        </div>
        <div className="mb-2 mx-5 flex flex-col justify-around sm:flex-row items-center">
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
            className="cursor-pointer flex items-center justify-center py-2 px-4 flex-1 w-full bg-theme-color focus:bg-theme-color focus:text-white hover:bg-theme-color text-white hover:text-white rounded"
            size="large"
            loading={loading}
            form="searchForm"
            onClick={() => handleSubmit()}
          >
            Search
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Header;
