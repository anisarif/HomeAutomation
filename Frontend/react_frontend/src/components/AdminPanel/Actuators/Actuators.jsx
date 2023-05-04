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
                <div key={actuator.id} class="Board">
                    <h4>{actuator.id}</h4>
                    <h4>{actuator.name}</h4>
                    <h4>{actuator.board_id}</h4>
                    <h4>{actuator.type}</h4>
                    <h4>{actuator.state}</h4>
                    <ButtonDeleteActuator id={actuator.id} />
                </div>
            ))}
                <ButtonAddActuator />
            </div>
        </div>

    )

}


export default Actuators;