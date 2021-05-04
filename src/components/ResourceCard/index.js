import { useState, useEffect } from "react";
import { Modal, message } from "antd";
import { db } from "../../utils/firebase";

import warningIcon from "../../assets/warningLight.svg";
import phoneLightIcon from "../../assets/phoneLight.svg";
import closeIcon from "../../assets/close.svg";
import cylinderIcon from "../../assets/cylinder.svg";
import personIcon from "../../assets/person.svg";
import phoneIcon from "../../assets/phone.svg";
import timeIcon from "../../assets/time.svg";
import dateIcon from "../../assets/date.svg";
import emailIcon from "../../assets/email.svg";
import priceIcon from "../../assets/price.svg";

const ResourceCard = (props) => {
  const [isReported, setIsReported] = useState(false);

  const handleReportResource = async () => {
    if (localStorage.getItem(`isReported_${props.post.id}`)) {
      message.error(
        "You've already reported the unavailibilty of this resource !"
      );
      localStorage.setItem(`isReported_${props.post.id}`, true);
    } else {
      message.success("Resoure reported as unavailable !");
      localStorage.setItem(`isReported_${props.post.id}`, true);
      let updatedData = {};
      const dbref = db.ref(
        `feed/${props.location.toLowerCase()}/${props.resource}/${
          props.post.id
        }`
      );
      dbref.on("value", (data) => {
        if (data.exists())
          if (data.val()) {
            updatedData = { ...data.val() };
            updatedData.reports += 1;
          }
      });
      await dbref.set(updatedData);
    }
  };

  useEffect(() => {
    setIsReported(localStorage.getItem(`isReported_${props.post.id}`));
  }, [localStorage.getItem(`isReported_${props.post.id}`)]);

  return (
    <Modal
      closeIcon={
        <img
          src={closeIcon}
          onClick={props.handleCancel}
          className="outline-none"
        />
      }
      onCancel={props.handleCancel}
      visible={props.isModalVisible}
      footer={false}
      className="rounded-md"
      centered
    >
      <div className="flex items-center">
        <img src={cylinderIcon} alt="icon" />
        <p className="text-2xl pl-5">{props.resource.toUpperCase()}</p>
      </div>
      <div className="flex items-center justify-center text-base my-6">
        <table className="border-collapse">
          <tr>
            <td>
              <img src={personIcon} alt="name" />
            </td>
            <td className="font-semibold px-4">Name</td>
            <td>: &nbsp; {props.post.name}</td>
          </tr>
          <tr>
            <td>
              <img src={phoneIcon} alt="phone" />
            </td>
            <td className="font-semibold px-4">Phone</td>
            <td>: &nbsp; {props.post.phone}</td>
          </tr>
          {props.post.email && (
            <tr>
              <td>
                <img src={emailIcon} alt="email" />
              </td>
              <td className="font-semibold px-4">Email</td>
              <td>: &nbsp; {props.post.email}</td>
            </tr>
          )}
          <tr>
            <td>
              <img src={dateIcon} alt="date" />
            </td>
            <td className="font-semibold px-4">Posted At</td>
            <td>: &nbsp; {props.post.date}</td>
          </tr>
          <tr>
            <td>
              <img src={timeIcon} alt="time" />
            </td>
            <td className="font-semibold px-4">Time</td>
            <td>: &nbsp; {props.post.time}</td>
          </tr>
          <tr>
            <td>
              <img src={priceIcon} alt="price" />
            </td>
            <td className="font-semibold px-4">Price</td>
            <td>
              : &nbsp; {props.post.price === "0" ? "Free" : props.post.price}
            </td>
          </tr>
        </table>
      </div>
      <a
        className="w-full bg-theme-color flex items-center justify-center rounded-md h-10 my-5"
        href={`tel:${props.post.phone}`}
      >
        <img src={phoneLightIcon} className="pr-5 text-white" alt="call" />
        <span className="text-white font-bold">Call Now</span>
      </a>
      <button
        onClick={handleReportResource}
        className={
          isReported
            ? "w-full bg-danger-red flex items-center justify-center rounded-md h-10 cursor-not-allowed"
            : "w-full bg-danger-red flex items-center justify-center rounded-md h-10"
        }
      >
        <img src={warningIcon} className="pr-5" alt="report" />
        <span className="text-white font-bold">
          {isReported
            ? "Resource Reported !"
            : "Report if resource is unavailable"}
        </span>
      </button>
      <p className="text-center pt-2">
        {props.post.reports} people reported as resource is unavailable
      </p>
    </Modal>
  );
};

export default ResourceCard;
