import { getActuators } from "../../../utils/api";
import { useState, useEffect } from "react";
import ButtonAddActuator from "./ButtonAddActuator";
import ButtonDeleteActuator from "./ButtonDeleteActuator";
import ButtonUpdateActuator from "./ButtonUpdateActuator";





const Actuators = ({ id, boardCount, actuatorCount, addActuatorsCount, deleteActuatorsCount, setShowModal, setEdit }) => {
    const [actuators, setActuators] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const loaded_actuators = await getActuators()
            const filtered_actuators = loaded_actuators.filter(actuator => actuator.board_id === id)
            setActuators(filtered_actuators)
            console.log(actuatorCount)
        }
        fetchData().catch(console.error)
    }, [actuatorCount, id])

    return (
        <div className=" bg-slate-200 rounded-md">
            <h1 className=" text-center font-medium text-xl text-slate-500 my-4">Actuators</h1>
            <div className=" grid grid-col-4"> {actuators.map((actuator) => (
                <div key={actuator.id} className="grid grid-cols-12 justify-evenly text-center col-span-4 items-center">
                    <h5 className=" col-span-2">{actuator.id}</h5>
                    <h5 className=" col-span-4">{actuator.name}</h5>
                    <h5 className=" col-span-4">{actuator.type}</h5>
                    <div className=" flex flex-col col-span-2">
                        <ButtonUpdateActuator id={actuator.id} actuator={actuator} update={addActuatorsCount} setShowModal={setShowModal} setEdit={setEdit} />
                        <ButtonDeleteActuator id={actuator.id} update={deleteActuatorsCount} />
                    </div>
                </div>
            ))}
                <div className=" col-span-4 text-center items-center bg-slate-400 m-4 mx-20 rounded-lg">
                    <ButtonAddActuator update={addActuatorsCount} boardCount={boardCount}  />
                </div>
            </div>
        </div>

    )

}


export default Actuators;