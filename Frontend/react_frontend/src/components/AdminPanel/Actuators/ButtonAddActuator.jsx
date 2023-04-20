import { useContext, useState } from "react";
import { Context } from "../../../store/appContext";

const ButtonAddActuator = () => {
    const { actions } = useContext(Context)
    const handleClick = () => {
        actions.addActuator(name, pin, board_id, type)
        setToggleIsOn(!toggleIsOn)
    }
    const [name, setName] = useState("")
    const [pin, setPin] = useState("")
    const [board_id, setBoard_id] = useState("")
    const [type, setType] = useState("")

    const [toggleIsOn, setToggleIsOn] = useState(false)
    



    return (
        <>
        {toggleIsOn ? (
            <div>
                <button onClick={ () => {setToggleIsOn(!toggleIsOn)}} > + </button>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"/>
                <input type="text" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Pin"/>
                <input type="text" value={board_id} onChange={(e) => setBoard_id(e.target.value)} placeholder="Board"/>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">-- Select --</option>
                    <option value="Light">Light</option>
                    <option value="Lock">Locker</option>
                    <option value="Sensor">Sensor</option>
                </select>
                <button type="submit" onClick={handleClick} > ADD </button>
            </div>
            ) : (
            <button onClick={ () => {setToggleIsOn(!toggleIsOn)}} > + </button>
            )}
        
        </>
    )
}

export default ButtonAddActuator;