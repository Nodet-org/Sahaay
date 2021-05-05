import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, message, Button } from "antd";

import { db } from "../../utils/firebase";

import plusIcon from "../../assets/plus.svg";

const { Option } = Select;

const AddResource = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selected, setSelected] = useState("oxygen");
  const [scrollY, setScrollY] = useState(0);
  const [loading, setLoading] = useState(false);

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

  const getCity = async (cityOrPincode) => {
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
        price: value.price,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
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
              <Input />
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
              <Input />
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
              <Input />
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
              <Input />
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
              <Input />
            </Form.Item>
            {/* <Input
              type="submit"
              value="Add Resource"
              className="bg-theme-color text-white font-semibold cursor-pointer"
              size="large"
            /> */}
            <Button
              htmlType="submit"
              className="bg-theme-color text-white font-semibold cursor-pointer"
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
