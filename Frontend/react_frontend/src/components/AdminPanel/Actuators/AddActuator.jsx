import { useContext, useState, useEffect } from "react";
import { Context } from "../../../store/appContext";
import { getBoards } from "../../../utils/api";

const AddActuator = ({ update, boardCount, setShowAddModal, setAdd }) => {
    const { actions } = useContext(Context)
    const [name, setName] = useState("")
    const [pin, setPin] = useState("")
    const [board_id, setBoard_id] = useState("")
    const [type, setType] = useState("")
    const [boards, setBoards] = useState([])

    const handleClick = () => {
        if (!name || !pin || !board_id || !type) {
            alert('Please fill all fields');
            return;
        }

        if (!['Light', 'Lock', 'Sensor'].includes(type)) {
            alert('Invalid type');
            return;
        }

        actions.addActuator(name, pin, board_id, type).then(() => {
            update();
            setShowAddModal(false)
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            const loaded_boards = await getBoards()
            if (loaded_boards && loaded_boards !== [])
                setBoards(loaded_boards)
        }
        fetchData().catch(console.error)
    }, [boardCount])



    return (
        <div className='flex flex-col items-center justify-center align-middle content-around place-content-center'>
            <h1 classname=' font-medium text-2xl text-slate-400'>New Actuator</h1>
            <input className='flex mt-10 text-slate-700 rounded-lg items-center justify-center' type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <input className='flex mt-10 text-slate-700 rounded-lg items-center justify-center' type="text" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Pin" />
            <select className='mt-10 text-slate-700 rounded-lg' value={board_id} onChange={(e) => setBoard_id(e.target.value)} placeholder="Board">
                <option value="">-- Select --</option>
                {boards.map((board) => (
                    <option key={board.id} value={board.id}>{board.name}</option>
                ))}
            </select>

            <select className='mt-10 text-slate-700 rounded-lg' value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">-- Select --</option>
                <option value="Light">Light</option>
                <option value="Lock">Locker</option>
                <option value="Sensor">Sensor</option>
            </select>
            <button className='mt-10 bg-slate-300 text-slate-800 rounded-lg px-3 py-1' type="submit" onClick={handleClick} > ADD </button>
        </div>
    )
}

export default AddActuator;
