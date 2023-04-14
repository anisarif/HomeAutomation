import { getUsers } from "../utils/api";
import { useState, useEffect } from "react";
import ButtonDelete from "./ButtonDeleteUser";
import ButtonAddUser from "./ButtonAddUser";





const Boards = () => {
    const [boards, setBoards] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const loaded_boards = await getUsers()
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
                    <ButtonDelete id={board.id} />
                </div>
            ))}
                <ButtonAddUser />
            </div>
        </div>

    )

}


export default Boards;