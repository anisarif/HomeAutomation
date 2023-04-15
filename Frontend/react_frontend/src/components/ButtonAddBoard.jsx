import { useContext, useState } from "react";
import { Context } from "../store/appContext";

const ButtonAddBoard = () => {
    const { actions } = useContext(Context)
    const handleClick = () => {
        actions.addBoard(name, privacy)
        setToggleIsOn(!toggleIsOn)
    }
    const [name, setName] = useState([])
    const [privacy, setPrivacy] = useState([])
    const [toggleIsOn, setToggleIsOn] = useState(false)
    



    return (
        <>
        {toggleIsOn ? (
            <div>
                <button onClick={ () => {setToggleIsOn(!toggleIsOn)}} > + </button>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"/>
                <input type="text" value={privacy} onChange={(e) => setPrivacy(e.target.value)} placeholder="Privacy"/>
                <button type="submit" onClick={handleClick} > ADD </button>
            </div>
            ) : (
            <button onClick={ () => {setToggleIsOn(!toggleIsOn)}} > + </button>
            )}
        
        </>
    )
}

export default ButtonAddBoard;