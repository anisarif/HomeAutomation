import { getActuators } from "../../../utils/api";
import { useState, useEffect } from "react";
import ButtonAddActuator from "./ButtonAddActuator";
import ButtonDeleteActuator from "./ButtonDeleteActuator";
import ButtonUpdateActuator from "./ButtonUpdateActuator";





const Actuators = ({id, boardCount, actuatorCount, addActuatorsCount, deleteActuatorsCount} ) => {
    const [actuators, setActuators] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const loaded_actuators = await getActuators()
            const filtered_actuators = loaded_actuators.filter(actuator => actuator.board_id === id)
            setActuators(filtered_actuators)
            console.log(actuatorCount)
        }
        fetchData().catch(console.error)
    }, [actuatorCount])

    return (
        <div>
            <div> {actuators.map((actuator) => (
                <div key={actuator.id} class="Board">
                    <h5>{actuator.id}</h5>
                    <h5>{actuator.name}</h5>
                    <h5>{actuator.board_id}</h5>
                    <h5>{actuator.type}</h5>
                    <h5>{actuator.state}</h5>
                    <div>
                        <ButtonUpdateActuator id={actuator.id} actuator={actuator} update={addActuatorsCount} />
                        <ButtonDeleteActuator id={actuator.id} update={deleteActuatorsCount} />
                    </div>
                </div>
            ))}
                <ButtonAddActuator update={addActuatorsCount} boardCount={boardCount} className="ButtonAddUser" />
            </div>
        </div>

    )

}


export default Actuators;