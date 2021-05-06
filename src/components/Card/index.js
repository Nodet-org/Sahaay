import { useState } from "react";
import { Tag } from "antd";

import Medicine from "../../assets/medicine.svg";

import ResourceCard from "../ResourceCard";
import { getIcon } from "../../utils/helpers";

const Card = ({ post, resource, location }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [modalPost, ]
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <ResourceCard
        handleCancel={handleCancel}
        isModalVisible={isModalVisible}
        post={post}
        resource={resource}
        location={location}
      />
      <div
        onClick={showModal}
        className="flex flex-col bg-white shadow-md rounded-lg px-8 py-4 my-2 w-4/5 lg:w-3/5 cursor-pointer"
      >
        <div className="flex justify-between w-full flex-row-reverse items-center">
          <p className="text-right">
            {/* <span className="text-gray-500">Posted at: </span> */}
            {post?.time.split(":")[0]}:{post?.time.split(":")[1]} {String(post?.time.slice(-2)).toUpperCase()}
          </p>
          <div className="flex items-center">
            {getIcon(resource, 35)}
            <p className="font-bold text-xl pl-2">{resource.toUpperCase()}</p>
          </div>
        </div>
        <div className="my-2 w-full">
          <div className="flex flex-row justify-start items-center">
            <p className="font-semibold text-base w-16">Name</p>
            <div className="flex flex-row mx-2">
              <p className="mx-2">:</p>
              <p>{post?.name}</p>
            </div>
          </div>
          <div className="flex flex-row justify-start items-center">
            <p className="font-semibold text-base w-16">Phone</p>
            <div className="flex flex-row mx-2">
              <p className="mx-2">:</p>
              <p>{post?.phone}</p>
            </div>
          </div>
          <div className="flex flex-row justify-start items-center">
            <p className="font-semibold text-base w-16">Location</p>
            <div className="flex flex-row mx-2">
              <p className="mx-2">:</p>
              <p>{location.charAt(0).toUpperCase() + location.slice(1)}</p>
            </div>
          </div>
        </div>
        {post?.price == "0" && (
          <div className="flex justify-end">
            <Tag color="green">FREE</Tag>
          </div>
        )}
      </div>
    </>
  );
};

export default Card;
