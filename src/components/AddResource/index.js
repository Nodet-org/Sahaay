import { useState } from "react";
import { Modal, Form, Input, Select } from "antd";

import plusIcon from "../../assets/plus.svg";

const { Option } = Select;

const AddResource = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleSubmit = (value) => {
    console.log(value);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className="absolute right-0 bottom-2 bg-green-500 rounded-full p-2 cursor-pointer">
        <img src={plusIcon} alt="Add" className="h-7" onClick={showModal} />
      </div>
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
          >
            <Select>
              <Option value="oxygen">Oxygen Cylinder</Option>
              <Option value="bed">Beds</Option>
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
          <Input type="submit" />
        </Form>
      </Modal>
    </>
  );
};

export default AddResource;
