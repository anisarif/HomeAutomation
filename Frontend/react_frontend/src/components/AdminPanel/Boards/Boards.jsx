import { getBoards } from "../../../utils/api";
import { useState, useEffect } from "react";
import ButtonAddBoard from "./ButtonAddBoard";
import ButtonDeleteBoard from "./ButtonDeleteBoard";
import UpdateBoard from "./ButtonUpdateBoard";
import FilteredActuators from "../Actuators/FilteredActuators";
import "./Board.css"

const Boards = ({ userCount, boardCount, addBoardsCount, deleteBoardsCount, actuatorCount, addActuatorsCount, deleteActuatorsCount }) => {
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
        <div className="p-4 bg-slate-200 rounded-md mb-6">
            <div>
                <h3 className=" text-slate-700 font-medium text-center text-3xl mb-8">Devices</h3>
                <ButtonAddBoard update={addBoardsCount} userCount={userCount} className="ButtonAddBoard" />
            </div>
            <div className=" bg-slate-300 rounded-lg py-2"> {boards.map((board) => (
                <div key={board.id} className="grid grid-cols-12">
                    <div className="grid grid-cols-12 col-span-12 justify-evenly text-center my-4">
                        <h4 className=" col-span-2">{board.id}</h4>
                        <h4 className=" col-span-4">{board.name}</h4>
                        <h4 className=" col-span-4">{board.privacy}</h4>
                        <div className=" col-span-2">
                            <UpdateBoard id={board.id} board={board} update={addBoardsCount} userCount={userCount} />
                            <ButtonDeleteBoard id={board.id} update={deleteBoardsCount} />
                        </div>
                    </div>
                    <div className=" col-start-2 col-end-12">
                        <FilteredActuators id={board.id} boardCount={boardCount} actuatorCount={actuatorCount} addActuatorsCount={addActuatorsCount} deleteActuatorsCount={deleteActuatorsCount} />
                    </div>
                </div>

            ))}
            </div>
        </div>

    )

}


export default Boards;