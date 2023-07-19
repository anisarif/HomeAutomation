import { getActuators } from "../../../utils/api";
import { useState, useEffect } from "react";
import ButtonAddActuator from "./ButtonAddActuator";
import ButtonDeleteActuator from "./ButtonDeleteActuator";
import ButtonUpdateActuator from "./ButtonUpdateActuator";





const Actuators = () => {
    const [actuators, setActuators] = useState([])
    const [actuatorsCount, setActuatorsCount] = useState(1)

    useEffect(() => {
        const fetchData = async () => {
            const loaded_actuators = await getActuators()
            setActuators(loaded_actuators)
        }
        fetchData().catch(console.error)
    }, [actuatorsCount])

    const updateState = () => {
        setActuatorsCount(actuatorsCount + 1)
    }
    const updateStateDelete = () => {
        setActuatorsCount(actuatorsCount - 1)
    }

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
                    <div>
                        <ButtonUpdateActuator id={actuator.id} actuator={actuator} update={updateState} />
                        <ButtonDeleteActuator id={actuator.id} update={updateStateDelete} />
                    </div>
                </div>
            ))}
                <ButtonAddActuator update={updateState} className="ButtonAddUser" />
            </div>
        </div>

    )

}


export default Actuators;