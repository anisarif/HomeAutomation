import { getBoards } from "../utils/api";
import { useState, useEffect } from "react";
import ButtonAddBoard from "./ButtonAddBoard";
import ButtonDeleteUser from "./ButtonDeleteUser";

const Boards = () => {
    const [boards, setBoards] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const loaded_boards = await getBoards()
            setBoards(loaded_boards)
        }
        fetchData().catch(console.error)
    }, [])

    return (
        <div>
            <h1>Boards</h1>
            <div> {boards.map((board) => (
                <div key={board.id}>
                    <h4>{board.id}</h4>
                    <h1>{board.name}</h1>
                    <ButtonDeleteUser id={board.id} />
                </div>
            ))}
                <ButtonAddBoard />
            </div>
        </div>

    )

}


export default Boards;