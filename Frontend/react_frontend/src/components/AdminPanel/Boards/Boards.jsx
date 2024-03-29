import { getBoards } from "../../../utils/api";
import { useState, useEffect } from "react";
import ButtonAddBoard from "./ButtonAddBoard";
import ButtonDeleteBoard from "./ButtonDeleteBoard";
import ButtonUpdateBoard from "./ButtonUpdateBoard";
import FilteredActuators from "../Actuators/FilteredActuators";
import "./Board.css"

const Boards = ({ userCount, boardCount, addBoardsCount, deleteBoardsCount, actuatorCount, addActuatorsCount, deleteActuatorsCount, setShowModal, setEdit, setShowAddModal, setAdd }) => {
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
                <h3 className=" text-slate-700 font-medium text-center text-3xl mb-8 col-start-2">Devices</h3>
            <div className=" bg-slate-300 rounded-lg py-2">
                <div className=" grid grid-cols-3 px-6">
                    <h1 className=" col-start-2 text-center font-medium text-3xl text-slate-500 mb-2">Boards</h1>
                    <ButtonAddBoard setShowAddModal={setShowAddModal} setAdd={setAdd} update={addBoardsCount} userCount={userCount} />
                </div>

                {boards.map((board) => (
                    <div key={board.id} className="grid grid-cols-12">
                        <div className="grid grid-cols-12 col-span-12 justify-evenly items-center text-center my-4 bg-slate-500 text-slate-200 m-4 rounded-lg">
                            <h4 className=" col-span-2">{board.id}</h4>
                            <h4 className=" col-span-4">{board.name}</h4>
                            <h4 className=" col-span-4">{board.privacy}</h4>
                            <div className=" flex flex-col col-span-2">
                                <ButtonUpdateBoard id={board.id} board={board} update={addBoardsCount} userCount={userCount} setShowModal={setShowModal} setEdit={setEdit} />
                                <ButtonDeleteBoard id={board.id} update={deleteBoardsCount} />
                            </div>
                        </div>
                        <div className=" col-start-2 col-end-12">
                            <FilteredActuators id={board.id} boardCount={boardCount} actuatorCount={actuatorCount} addActuatorsCount={addActuatorsCount} deleteActuatorsCount={deleteActuatorsCount} setShowModal={setShowModal} setEdit={setEdit} setShowAddModal={setShowAddModal} setAdd={setAdd} />
                        </div>
                    </div>

                ))}
            </div>
        </div>

    )

}


export default Boards;