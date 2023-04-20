import { getActuators } from "../../../utils/api";
import { useState, useEffect } from "react";
import ButtonAddActuator from "./ButtonAddActuator";
import ButtonDeleteActuator from "./ButtonDeleteActuator";





const Actuators = () => {
    const [actuators, setActuators] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const loaded_actuators = await getActuators()
            setActuators(loaded_actuators)
        }
        fetchData().catch(console.error)
    }, [])


    return (
        <div>
            <h1>Actuators</h1>
            <div> {actuators.map((actuator) => (
                <div key={actuator.id}>
                    <h4>{actuator.id}</h4>
                    <h1>{actuator.name}</h1>
                    <h1>{actuator.pin}</h1>
                    <h1>{actuator.board_id}</h1>
                    <h1>{actuator.type}</h1>
                    <h1>{actuator.state}</h1>
                    <ButtonDeleteActuator id={actuator.id} />
                </div>
            ))}
                <ButtonAddActuator />
            </div>
        </div>

    )

}


export default Actuators;