import { useState, useEffect } from "react";
import { Modal, message, Button } from "antd";
import { db } from "../../utils/firebase";

import warningIcon from "../../assets/warningLight.svg";
import phoneLightIcon from "../../assets/phoneLight.svg";
import closeIcon from "../../assets/close.svg";
import personIcon from "../../assets/person.svg";
import phoneIcon from "../../assets/phone.svg";
// import whatsappIcon from "../../assets/whatsapp.svg";
import timeIcon from "../../assets/time.svg";
import dateIcon from "../../assets/date.svg";
import emailIcon from "../../assets/email.svg";
import priceIcon from "../../assets/price.svg";

import { getIcon } from "../../utils/helpers";

const ResourceCard = (props) => {
  const [isReported, setIsReported] = useState(false);
  const [reports, setReports] = useState();
  const [loading, setLoading] = useState(false);

  const handleReportResource = async () => {
    setLoading(true);
    if (localStorage.getItem(`isReported_${props.post.id}`)) {
      message.error(
        "You've already reported the unavailibilty of this resource !"
      );
      // localStorage.setItem(`isReported_${props.post.id}`, true);
      setLoading(false);
    } else {
      let updatedData;
      const dbref = db.ref(
        `feed/${props.location.toLowerCase()}/${props.resource}/${
          props.post.id
        }/reports`
      );
      try {
        await dbref.once("value", (data) => {
          if (data.exists())
            if (data.val() >= 0) {
              updatedData = data.val() + 1;
            }
        });
        setReports(updatedData);
        dbref.set(updatedData);
        message.success("Resoure reported as unavailable !");
        localStorage.setItem(`isReported_${props.post.id}`, true);
        setLoading(false);
      } catch (error) {
        message.error(error.toString());
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setIsReported(localStorage.getItem(`isReported_${props.post.id}`));
  }, [localStorage.getItem(`isReported_${props.post.id}`)]);

  useEffect(() => {
    setReports(props?.post.reports);
  }, []);

  return (
    <Modal
      closeIcon={
        <img
          src={closeIcon}
          onClick={props.handleCancel}
          className="outline-none"
          alt="x"
        />
      }
      onCancel={props.handleCancel}
      visible={props.isModalVisible}
      footer={false}
      className="rounded-md"
      centered
    >
      <div className="flex items-center">
        {/* <img src={() => getIcon(props.resource)} alt="icon" /> */}
        {getIcon(props.resource, 36)}
        <p className="text-xl pl-5">{props.resource.toUpperCase()}</p>
      </div>
      <div className="flex items-center justify-center text-base my-6">
        <table className="border-collapse">
          <tr>
            <td className="hidden sm:flex items-center justify-center">
              <img src={personIcon} alt="name" />
            </td>
            <td className="text-sm sm:text-base font-semibold pr-2 sm:px-4">
              Name
            </td>
            <td className="text-sm sm:text-base font-semibold sm:px-4">
              : &nbsp; {props.post.name}
            </td>
          </tr>
          <tr>
            <td className="hidden sm:flex items-center justify-center">
              <img src={phoneIcon} alt="phone" />
            </td>
            <td className="text-sm sm:text-base font-semibold pr-2 sm:px-4">
              Phone
            </td>
            <td className="text-sm sm:text-base font-semibold sm:px-4">
              : &nbsp; {props.post.phone}
            </td>
          </tr>
          {props.post.email && (
            <tr>
              <td className="hidden sm:flex items-center justify-center">
                <img src={emailIcon} alt="email" />
              </td>
              <td className="text-sm sm:text-base font-semibold pr-2 sm:px-4">
                Email
              </td>
              <td className="text-sm sm:text-base font-semibold sm:px-4">
                : &nbsp; {props.post.email}
              </td>
            </tr>
          )}
          <tr>
            <td className="hidden sm:flex items-center justify-center">
              <img src={dateIcon} alt="date" />
            </td>
            <td className="text-sm sm:text-base font-semibold pr-2 sm:px-4">
              Posted At
            </td>
            <td className="text-sm sm:text-base font-semibold sm:px-4">
              : &nbsp; {props.post.date}
            </td>
          </tr>
          <tr>
            <td className="hidden sm:flex items-center justify-center">
              <img src={timeIcon} alt="time" />
            </td>
            <td className="text-sm sm:text-base font-semibold pr-2 sm:px-4">
              Time
            </td>
            <td className="text-sm sm:text-base font-semibold sm:px-4">
              : &nbsp; {props.post.time}
            </td>
          </tr>
          <tr>
            <td className="hidden sm:flex items-center justify-center">
              <img src={priceIcon} alt="price" />
            </td>
            <td className="text-sm sm:text-base font-semibold pr-2 sm:px-4">
              Price
            </td>
            <td className="text-sm sm:text-base font-semibold sm:px-4">
              : &nbsp; {props.post.price === "0" ? "Free" : props.post.price}
            </td>
          </tr>
        </table>
      </div>
      <div className="flex justify-between">
        <a
          className="w-full bg-theme-color flex items-center justify-center rounded-md h-10 my-5"
          href={`tel:${props.post.phone}`}
        >
          <img src={phoneLightIcon} className="pr-5 text-white" alt="call" />
          <span className="text-white font-bold">Call Now</span>
        </a>
        {/* <a
            className="w-1/2 bg-green-500 flex items-center justify-center rounded-md h-10 my-5 ml-2"
            href={`https://api.whatsapp.com/send/?phone=91${props.post.phone}&text&app_absent=0`}
          >
            <img src={whatsappIcon} height={40} width={40} className="pr-4 text-white" alt="call" />
            <span className="text-white font-bold">Send Message</span>
          </a> */}
      </div>
      <Button
        onClick={handleReportResource}
        loading={loading}
        className={`w-full bg-danger-red flex items-center justify-center rounded-md h-10 focus:bg-danger-red focus:text-white hover:bg-danger-red text-white hover:text-white  ${
          isReported && `cursor-not-allowed`
        }`}
      >
        <img src={warningIcon} className="pr-5" alt="report" />
        <span className="text-white font-bold">
          {isReported
            ? "Resource Reported !"
            : "Report if resource is unavailable"}
        </span>
      </Button>
      <p className="text-center pt-2">
        {reports} people reported as resource is unavailable
      </p>
    </Modal>
  );
};

export default ResourceCard;
