import { useState } from "react";
import { Modal, Form, Input } from "antd";

import plusIcon from "../../assets/plus.svg";

import "antd/dist/antd.css";

const AddResource = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
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
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <Form layout="vertical">
          <Form.Item label="Name" requiredMark={false} name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Phone" requiredMark={false} name="phone">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddResource;
