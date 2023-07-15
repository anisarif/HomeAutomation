import { getBoards } from "../../../utils/api";
import { useState, useEffect } from "react";
import ButtonAddBoard from "./ButtonAddBoard";
import ButtonDeleteBoard from "./ButtonDeleteBoard";
import "./Board.css"

const Boards = () => {
    const [boards, setBoards] = useState([])
    const [boardsCount, setBoardsCount] = useState(1)
    const updateState = () => {
        setBoardsCount(boardsCount+1)
    }
    const updateStateDelete = () => {
        setBoardsCount(boardsCount-1)
    }

    useEffect(() => {
        const fetchData = async () => {
            const loaded_boards = await getBoards()
            if (loaded_boards && loaded_boards !== [])
            setBoards(loaded_boards)
        }
        fetchData().catch(console.error)
    }, [boardsCount])

    return (
        <div>
            <h1>Boards</h1>
            <div> {boards.map((board) => (
                <div key={board.id} class="Board">
                    <h4>{board.id}</h4>
                    <h4>{board.name}</h4>
                    <ButtonDeleteBoard id={board.id} update={updateStateDelete} />
                </div>
            ))}
                <ButtonAddBoard update={updateState} className="ButtonAddBoard"/>
            </div>
        </div>

    )

}


export default Boards;