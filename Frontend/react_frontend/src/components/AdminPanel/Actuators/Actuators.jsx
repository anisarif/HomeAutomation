import { getActuators } from "../../../utils/api";
import { useState, useEffect } from "react";
import ButtonAddActuator from "./ButtonAddActuator";
import ButtonDeleteActuator from "./ButtonDeleteActuator";
import ButtonUpdateActuator from "./ButtonUpdateActuator";





const Actuators = ({boardCount, actuatorCount, addActuatorsCount, deleteActuatorsCount, setShowModal, setEdit} ) => {
    const [actuators, setActuators] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const loaded_actuators = await getActuators()
            setActuators(loaded_actuators)
            console.log(actuatorCount)
        }
        fetchData().catch(console.error)
    }, [actuatorCount])

    return (
        <div>
            <div> {actuators.map((actuator) => (
                <div key={actuator.id}>
                    <h5>{actuator.id}</h5>
                    <h5>{actuator.name}</h5>
                    <h5>{actuator.board_id}</h5>
                    <h5>{actuator.type}</h5>
                    <h5>{actuator.state}</h5>
                    <div className=" flex flex-col">
                        <ButtonUpdateActuator id={actuator.id} actuator={actuator} setShowModal={setShowModal} setEdit={setEdit} />
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