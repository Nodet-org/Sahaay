import { Modal, Button } from "antd";
import Icon from "../../assets/cylinder.svg";
import Person from "../../assets/person.svg";
import Phone from "../../assets/phone.svg";
import Email from "../../assets/email.svg";
import Date from "../../assets/date.svg";
import Time from "../../assets/time.svg";
import Price from "../../assets/price.svg";


const ResourceCard = () => {
    return <Modal visible={true} >
        <div className="flex">
            <img src={Icon} />
            <p>Oxygen Tank</p>
        </div>
        <table>
            <tr>
                <td><img src={Person} /></td>
                <td>Name</td>
                <td>: &nbsp; John Doe</td>
            </tr>
            <tr>
                <td><img src={Phone} /></td>
                <td>Phone</td>
                <td>: &nbsp; 98765 43210</td>
            </tr>
            <tr>
                <td><img src={Email} /></td>
                <td>Email</td>
                <td>: &nbsp; john@doe.com</td>
            </tr>
            <tr>
                <td><img src={Date} /></td>
                <td>Posted At &nbsp; </td>
                <td>: &nbsp; 03/23/2020</td>
            </tr>
            <tr>
                <td><img src={Time} /></td>
                <td>Time</td>
                <td>: &nbsp; 01:20 PM</td>
            </tr>
            <tr>
                <td><img src={Price} /></td>
                <td>Price</td>
                <td>: &nbsp; N/A</td>
            </tr>
        </table>
    </Modal>
}

export default ResourceCard;