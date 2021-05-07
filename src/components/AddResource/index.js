import { useState, useEffect, useCallback } from "react";
import { Modal, Form, Input, Select, message, Button, Spin, Empty } from "antd";
import axios from "axios";
import debounce from "lodash/debounce";
import { states } from "../../utils/states.json";

import { db } from "../../utils/firebase";

import plusIcon from "../../assets/plus.svg";

const { Option } = Select;

const stateRaw = [];
states.map((doc) => stateRaw.push(doc.state));
const cityRaw = {};
states.map((doc) => (cityRaw[doc.state] = doc.districts));

const AddResource = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selected, setSelected] = useState("oxygen");
  const [scrollY, setScrollY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [value, setValue] = useState();
  const [search, setSearch] = useState([]);
  const [error, setError] = useState(false);
  const [state, setState] = useState(cityRaw["Kerala"]);
  const [district, setDistrict] = useState(cityRaw["Kerala"][0]);

  const [form] = Form.useForm();

  function logit() {
    setScrollY(window.pageYOffset);
  }

  useEffect(() => {
    function watchScroll() {
      window.addEventListener("scroll", logit);
    }
    watchScroll();
    return () => {
      window.removeEventListener("scroll", logit);
    };
  });

  const showModal = () => {
    setIsModalVisible(true);
  };

  // const getCity = async ({ value: cityOrPincode }) => {
  //   let city = "";
  //   if (!isNaN(+cityOrPincode)) {
  //     try {
  //       const response = await (
  //         await fetch("https://api.postalpincode.in/pincode/" + cityOrPincode)
  //       ).json();
  //       if (response[0].Status && response[0].PostOffice.length) {
  //         city = response[0].PostOffice[0].District;
  //       } else {
  //         return { inValid: "pincode" };
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       return { inValid: "pincode" };
  //     }
  //   } else {
  //     city = cityOrPincode;
  //   }
  //   return city.toLowerCase();
  // };

  const handleSubmit = async (value) => {
    setLoading(true);
    try {
      // const city = await getCity(value.city);
      const dbref = await db.ref(`feed/${value.district}/${selected}`).push();
      const newResource = {
        name: value.name,
        phone: value.phone,
        quantity: value.quantity,
        price: value.price,
        date: new Date().toLocaleDateString("en-IN"),
        time: new Date().toLocaleTimeString("en-IN"),
        reports: 0,
        id: dbref.key,
      };
      await dbref.set(newResource);
      form.resetFields();
      message.success(
        "Added Resource successfully! Thank you for your valuable contribution"
      );
      setLoading(false);
      setIsModalVisible(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      message.error(err);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Location search
  function onChange(value) {
    setFetching(false);
    setSearch([]);
    setValue(value.value);
  }

  const getLocation = (value) => {
    setError(false);
    let searchResults = [];
    let splitBy = ",";
    if (value.includes(" ")) splitBy = " ";
    else if (value.includes(",")) splitBy = ",";
    value.split(splitBy).map((val) => {
      val = val.trim();
      if (val !== "")
        states.map((state) => {
          if (state.state.toLowerCase().includes(val.toLowerCase())) {
            searchResults.push(state.state);
            state.districts.map((district) => {
              searchResults.push(`${district}, ${state.state}`);
            });
          } else {
            state.districts.map((district) => {
              if (district.toLowerCase().includes(val.toLowerCase())) {
                searchResults.push(`${district}, ${state.state}`);
              }
            });
          }
        });
    });
    searchResults.length === 0 && setError(true);
    setSearch(searchResults);
    setFetching(false);
    setValue(value);
  };

  const debounceSearch = useCallback(
    debounce((place) => getLocation(place), 200),
    []
  );

  const onSearch = (value) => {
    if (value.length !== 0) {
      setSearch([]);
      setFetching(true);
      debounceSearch(value);
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
    <>
      <div
        className={
          scrollY < 170
            ? `fixed flex items-center justify-center right-5 bottom-5 bg-theme-color rounded-full p-4 cursor-pointer w-52 addResourceButton`
            : `fixed flex items-center justify-center right-5 bottom-5 bg-theme-color rounded-full p-4 cursor-pointer transition-all delay-300 ease-in-out w-16 addResourceButton`
        }
        onClick={showModal}
      >
        <span
          className={
            scrollY < 170 ? "pr-3 text-lg font-medium text-white" : "hidden"
          }
        >
          Add Resource
        </span>
        <img
          src={plusIcon}
          alt="Add"
          height="32"
          width="32"
          className="h-8 w-8"
        />
      </div>
      <div>
        <Modal
          title="Add Resource"
          visible={isModalVisible}
          onCancel={handleCancel}
          centered
          footer={false}
        >
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValue={{
              resource: "oxygen",
            }}
            requiredMark={false}
            form={form}
          >
            <Form.Item
              label="Resource"
              requiredMark={false}
              name="resource"
              tooltip="This is a required field"
              rules={[
                {
                  required: true,
                  message: "Please select a resource",
                },
              ]}
              initialValue="oxygen"
            >
              <Select onChange={(val) => setSelected(val)}>
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
                <Option value="ambulance">Ambulance</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="State"
              requiredMark={false}
              name="state"
              tooltip={`Enter the state where ${selected} is available`}
              rules={[
                {
                  required: true,
                  message: `Please input the state where ${selected} is available`,
                },
              ]}
            >
              {/* <Input /> */}
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Select a state"
                optionFilterProp="children"
                onChange={onStateChange}
                size="medium"
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
            </Form.Item>
            <Form.Item
              label="District"
              requiredMark={false}
              name="district"
              tooltip={`Enter the district where ${selected} is available`}
              rules={[
                {
                  required: true,
                  message: `Please input the district where ${selected} is available`,
                },
              ]}
            >
              <Select
                showSearch
                style={{ width: "100%" }}
                // value={district}
                defaultValue={district}
                value={district}
                placeholder="Select a district"
                optionFilterProp="children"
                onChange={onDistrictChange}
                size="medium"
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
            </Form.Item>
            <Form.Item
              label="Quantity"
              requiredMark={false}
              name="quantity"
              tooltip={`Enter the quantity of available ${selected}`}
              rules={[
                {
                  required: true,
                  message: "Please input your the available quantity.",
                },
                {
                  pattern: new RegExp("^[1-9][0-9]*$"),
                  message: "Sorry, you can't add an unavailable resource !",
                },
              ]}
            >
              <Input placeholder={`The quantity of available ${selected}`} />
            </Form.Item>
            <Form.Item
              label="Price"
              requiredMark={false}
              name="price"
              tooltip="Enter the price. Enter 0 if for free"
              rules={[
                {
                  required: true,
                  message: "Please input your price. If free enter 0",
                },
              ]}
            >
              <Input placeholder="The price of the resource (0 would be a kindful act!)." />
            </Form.Item>
            <Form.Item
              label="Name"
              requiredMark={false}
              name="name"
              tooltip="Enter your name"
              rules={[
                {
                  required: true,
                  message: "Please input your name",
                },
              ]}
            >
              <Input placeholder="Your Name" />
            </Form.Item>
            <Form.Item
              label="Phone"
              requiredMark={false}
              name="phone"
              tooltip="Enter your phone number"
              rules={[
                {
                  required: true,
                  message: "Please input your phone",
                },
              ]}
            >
              <Input placeholder="Your number" />
            </Form.Item>
            <Button
              htmlType="submit"
              className="bg-theme-color text-white focus:bg-theme-color focus:text-white hover:bg-theme-color hover:text-white rounded font-semibold cursor-pointer"
              style={{ width: "100%" }}
              size="large"
              loading={loading}
            >
              Add Resource
            </Button>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default AddResource;
