import { useState, useEffect, useCallback } from "react";
import { Modal, Form, Input, Select, message, Button, Spin, Empty } from "antd";
import axios from "axios";
import debounce from "lodash/debounce";
import { states } from "../../utils/states.json";

import { db } from "../../utils/firebase";

import plusIcon from "../../assets/plus.svg";

const { Option } = Select;

const AddResource = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selected, setSelected] = useState("oxygen");
  const [scrollY, setScrollY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [value, setValue] = useState();
  const [search, setSearch] = useState([]);
  const [error, setError] = useState(false);

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

  const getCity = async ({ value: cityOrPincode }) => {
    let city = "";
    if (!isNaN(+cityOrPincode)) {
      try {
        const response = await (
          await fetch("https://api.postalpincode.in/pincode/" + cityOrPincode)
        ).json();
        if (response[0].Status && response[0].PostOffice.length) {
          city = response[0].PostOffice[0].District;
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
    return city.toLowerCase();
  };

  const handleSubmit = async (value) => {
    setLoading(true);
    try {
      const city = await getCity(value.city);
      const dbref = await db.ref(`feed/${city}/${selected}`).push();
      const newResource = {
        name: value.name,
        phone: value.phone,
        email: value.email || "",
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
              label="City"
              requiredMark={false}
              name="city"
              tooltip={`Enter the city where ${selected} is available`}
              rules={[
                {
                  required: true,
                  message: `Please input the city where ${selected} is available`,
                },
              ]}
            >
              {/* <Input /> */}
              <Select
                labelInValue
                value={value?.display_place}
                showSearch
                placeholder={`The location of availablity of ${selected}`}
                notFoundContent={
                  fetching ? (
                    <Spin size="small" />
                  ) : error ? (
                    <Empty />
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
                size="medium"
              >
                {search?.map((d, id) => (
                  <Option key={id} value={d.split(",")[0].toLowerCase()}>
                    {d}
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
            <Form.Item
              label={[
                "Email",
                <span className="text-gray-400 pl-1">(Optional)</span>,
              ]}
              requiredMark={false}
              name="email"
              tooltip="Enter your email (Optional)"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
              ]}
            >
              <Input placeholder="Your email id" />
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
