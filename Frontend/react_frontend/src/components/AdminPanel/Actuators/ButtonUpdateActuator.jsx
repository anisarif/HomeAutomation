import { useContext, useState, useEffect } from "react";
import { Context } from "../../../store/appContext";
import { getBoards } from "../../../utils/api";


const UpdateActuator = ({id, actuator, update}) => {
    const { actions } = useContext(Context)
    const handleClick = () => {
        actions.updateActuator(id, name, pin, board_id, type).then(() => {
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
    }, [])

    useEffect(() => {
        setName(actuator.name)
        setPin(actuator.pin)
        setBoard_id(actuator.board_id)
        setType(actuator.type)
    }, [actuator])



    return (
        <>
            {toggleIsOn ? (
                <div>
                    <button onClick={() => { setToggleIsOn(!toggleIsOn) }} > close </button>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={actuator.name} />
                    <input type="text" value={pin} onChange={(e) => setPin(e.target.value)} placeholder={actuator.pin} />
                    <select value={board_id} onChange={(e) => setBoard_id(e.target.value)} placeholder={actuator.board_id}>
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
                    <button type="submit" onClick={handleClick} > update </button>
                </div>
            ) : (
                <button onClick={() => { setToggleIsOn(!toggleIsOn) }} > edit </button>
            )}

        </>
    )
}

export default UpdateActuator;