import { useContext, useState, useEffect } from "react";
import { Context } from "../../../store/appContext";
import { getBoards } from "../../../utils/api";


const ButtonAddActuator = ({update, boardCount}) => {
    const { actions } = useContext(Context)
    const handleClick = () => {
        actions.addActuator(name, pin, board_id, type).then(() => {
            update();
            
        });
        setToggleIsOn(!toggleIsOn)
    }
    const [name, setName] = useState("")
    const [pin, setPin] = useState("")
    const [board_id, setBoard_id] = useState("")
    const [type, setType] = useState("")
    const [boards, setBoards] = useState([])


    const [toggleIsOn, setToggleIsOn] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const loaded_boards = await getBoards()
            if (loaded_boards && loaded_boards !== [])
                setBoards(loaded_boards)
        }
        fetchData().catch(console.error)
    }, [boardCount])




    return (
        <>
            {toggleIsOn ? (
                <div>
                    <button className=" text-center" onClick={() => { setToggleIsOn(!toggleIsOn) }} > + </button>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                    <input type="text" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Pin" />
                    <select value={board_id} onChange={(e) => setBoard_id(e.target.value)} placeholder="Board">
                        <option value="">-- Select --</option>
                        {boards.map((board) => (
                            <option key={board.id} value={board.id}>{board.name}</option>
                        ))}
                    </select>

                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="">-- Select --</option>
                        <option value="Light">Light</option>
                        <option value="Lock">Locker</option>
                        <option value="Sensor">Sensor</option>
                    </select>
                    <button type="submit" onClick={handleClick} > ADD </button>
                </div>
            ) : (
                <button onClick={() => { setToggleIsOn(!toggleIsOn) }} > + </button>
            )}

        </>
    )
}

export default ButtonAddActuator;