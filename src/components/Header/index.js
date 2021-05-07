import { Checkbox, Form, message, Select, Button, Spin, Empty } from "antd";
import { useState } from "react";
import { states } from "../../utils/states.json";

import { API_URL } from "../../utils/constants";

import logo from "../../assets/logo.svg";

const { Option } = Select;

const stateRaw = [];
states.map((doc) => stateRaw.push(doc.state));
const cityRaw = {};
states.map((doc) => (cityRaw[doc.state] = doc.districts));

const Header = ({ setTweets, setLink, setQuery }) => {
  const [searchSelect, setSearchSelect] = useState("oxygen");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(cityRaw["Kerala"]);
  const [district, setDistrict] = useState(cityRaw["Kerala"][0]);

  const handleSubmit = async (e) => {
    if (district) {
      setTweets([]);
      setLoading(true);
      let query = {
        cityOrPincode: district,
        resource: searchSelect,
        verified: true,
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
        if (response.success) {
          query = {
            city: response.city,
            resource: searchSelect,
            verified: true,
          };
          message.success("Loaded tweets", 3);
          setQuery(query);
          setTweets(response?.tweets);
          setLink(response?.link);
        } else if (response?.message) message.error(response.message);
      } catch (error) {
        if (error?.message) message.error(error.message);
        else message.error(error.toString());
      }
      setLoading(false);
    } else {
      message.error(`Enter a City/Pincode to search for ${searchSelect}`, 3);
    }
  };

  function onStateChange(value) {
    setState(cityRaw[value]);
    setDistrict(cityRaw[value][0]);
  }

  function onDistrictChange(value) {
    setDistrict(value);
  }

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
        <div className="mx-5  h-9 flex items-center justify-between  my-4">
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select a state"
            optionFilterProp="children"
            onChange={onStateChange}
            size="large"
            defaultValue="Kerala"
            filterOption={(input, option) =>
              option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {stateRaw.map((doc, id) => (
              <Option key={id} value={doc}>
                {doc}
              </Option>
            ))}
          </Select>
          <div style={{ width: "20%" }}></div>
          <Select
            showSearch
            style={{ width: "100%" }}
            value={district}
            placeholder="Select a district"
            optionFilterProp="children"
            onChange={onDistrictChange}
            size="large"
            filterOption={(input, option) =>
              option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {state.map((doc, id) => (
              <Option key={id} value={doc}>
                {doc}
              </Option>
            ))}
          </Select>
        </div>
        <div className="mx-5 h-9 flex items-center justify-between  my-4">
          <Select
            defaultValue={searchSelect}
            onChange={(e) => setSearchSelect(e)}
            // className="flex-1"
            style={{ width: "100%" }}
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
          <div style={{ width: "20%" }}></div>
          <Button
            className="cursor-pointer  items-center justify-center py-2 px-4 bg-theme-color focus:bg-theme-color focus:text-white hover:bg-theme-color text-white hover:text-white rounded"
            style={{ width: "100%" }}
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
