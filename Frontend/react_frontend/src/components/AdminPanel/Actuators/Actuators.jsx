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
                    <h5>{actuator.id}</h5>
                    <h5>{actuator.name}</h5>
                    <h5>{actuator.board_id}</h5>
                    <h5>{actuator.type}</h5>
                    <h5>{actuator.state}</h5>
                    <ButtonDeleteActuator id={actuator.id} />
                </div>
            ))}
                <ButtonAddActuator className="ButtonAddUser"/>
            </div>
        </div>

    )

}


export default Actuators;