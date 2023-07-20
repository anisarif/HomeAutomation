import { getBoards } from "../../../utils/api";
import { useState, useEffect } from "react";
import ButtonAddBoard from "./ButtonAddBoard";
import ButtonDeleteBoard from "./ButtonDeleteBoard";
import UpdateBoard from "./ButtonUpdateBoard";
import "./Board.css"

const Boards = ({ userCount, boardCount, addBoardsCount, deleteBoardsCount }) => {
    const [boards, setBoards] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const loaded_boards = await getBoards()
            if (loaded_boards && loaded_boards !== [])
                setBoards(loaded_boards)
        }
        fetchData().catch(console.error)
    }, [boardCount])

    return (
        <div>
            <h1>Boards</h1>
            <div> {boards.map((board) => (
                <div key={board.id} class="Board">
                    <h4>{board.id}</h4>
                    <h4>{board.name}</h4>
                    <div>
                        <UpdateBoard id={board.id} board={board} update={addBoardsCount} userCount={userCount} />
                        <ButtonDeleteBoard id={board.id} update={deleteBoardsCount} />
                    </div>
                </div>
            ))}
                <ButtonAddBoard update={addBoardsCount} userCount={userCount} className="ButtonAddBoard" />
            </div>
        </div>

    )

}


export default Boards;