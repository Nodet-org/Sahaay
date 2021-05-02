import { Modal } from "antd";
import Icon from "../../assets/cylinder.svg";
import Person from "../../assets/person.svg";
import Phone from "../../assets/phone.svg";
import Email from "../../assets/email.svg";
import Date from "../../assets/date.svg";
import Time from "../../assets/time.svg";
import Price from "../../assets/price.svg";
import WarningLight from "../../assets/warningLight.svg";
import PhoneLight from "../../assets/phoneLight.svg";


const ResourceCard = () => {
    return <Modal visible={true} footer={null} className="rounded-md">
        <div className="flex items-center">
            <img src={Icon} alt="icon" className="" />
            <p className="text-2xl pl-5">Oxygen Tank</p>
        </div>
        <div className="flex items-center justify-center text-base my-6">
            <table className="border-collapse">
                <tr>
                    <td><img src={Person} alt="name" /></td>
                    <td className="px-4">Name</td>
                    <td className="font-semibold">: &nbsp; John Doe</td>
                </tr>
                <tr>
                    <td><img src={Phone} alt="phone" /></td>
                    <td className="px-4">Phone</td>
                    <td className="font-semibold">: &nbsp; 98765 43210</td>
                </tr>
                <tr>
                    <td><img src={Email} alt="email" /></td>
                    <td className="px-4">Email</td>
                    <td className="font-semibold">: &nbsp; john@doe.com</td>
                </tr>
                <tr>
                    <td><img src={Date} alt="date" /></td>
                    <td className="px-4">Posted At</td>
                    <td className="font-semibold">: &nbsp; 03/23/2020</td>
                </tr>
                <tr>
                    <td><img src={Time} alt="time" /></td>
                    <td className="px-4">Time</td>
                    <td className="font-semibold">: &nbsp; 01:20 PM</td>
                </tr>
                <tr>
                    <td><img src={Price} alt="price" /></td>
                    <td className="px-4">Price</td>
                    <td className="font-semibold">: &nbsp; N/A</td>
                </tr>
            </table>
        </div>
        <a className="w-full bg-theme-green flex items-center justify-center rounded-md h-10 my-5" 
            href="tel:9188750806">
            <img src={PhoneLight} className="pr-5 text-white" alt="call" />
            <span className="text-white font-bold">Call Now</span>
        </a>
        <button className="w-full bg-danger-red flex items-center justify-center rounded-md h-10">
            <img src={WarningLight} className="pr-5" alt="report" />
            <span className="text-white font-bold">Report if resource is unavailable</span>
        </button>
        <p className="text-center">10 people reported as resource is unavailable</p>
    </Modal>
}

export default ResourceCard;