import ambulance from "../assets/ambulance.svg";
import blood from "../assets/blood.svg";
import food from "../assets/food.svg";
import hospitalBed from "../assets/hospitalBed.svg";
import medicine from "../assets/medicine.svg";
import oxygenTank from "../assets/oxygenTank.svg";
import test from "../assets/test.svg";
import ventilator from "../assets/ventilator.svg";

export const getIcon = (resource, size) => {
    let icon = medicine;
    if (resource === "oxygen") icon = oxygenTank;
    else if (resource === "bed") icon = hospitalBed;
    else if (resource === "icu") icon = hospitalBed;
    else if (resource === "ventilator") icon = ventilator;
    else if (resource === "tests") icon = test;
    else if (["fabiflu", "remdesivir", "favipiravir", "tocilizumab"].includes(resource)) icon = medicine;
    else if (resource === "plasma") icon = blood;
    else if (resource === "food") icon = food;
    else if (resource === "ambulance") icon = ambulance;
    return <img src={icon} height={size} width={size} className="mr-1" alt={resource.toUpperCase()} />;
}

export const getUnit = (resource) => {
    if (resource === "oxygen") return "Litres"
    else if (resource === "bed") return "Beds"
    else if (resource === "icu") return "ICUs"
    else if (resource === "ventilator") return "Ventilators"
    else if (resource === "tests") return "Tests"
    else if (["fabiflu", "remdesivir", "favipiravir", "tocilizumab"].includes(resource)) return "Tablets"
    else if (resource === "plasma") return "milliLitres"
    else if (resource === "food") return "Packets"
    else if (resource === "ambulance") return "Units"

}
