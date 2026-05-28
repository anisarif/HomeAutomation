import Locks from "./Lockers/Locks"
import Lights from "./Lights/Lights"
import RGBLights from "./RGBLights/RGBLights"
import Weather from "./Weather/Weather"
import Sensor from "./Weather/Sensor"

const Dashboard = () => {

    return (
        <div className="grid grid-cols-2 gap-4 m-8 mx-24">
            <Locks />
            <Lights />
            <RGBLights />
            <Weather />
            <Sensor />
        </div>
    )
}

export default Dashboard