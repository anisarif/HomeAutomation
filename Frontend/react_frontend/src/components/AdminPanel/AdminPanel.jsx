import { useState } from "react";
import UsersBoard from "./Users/UsersBoard";
import Boards from "./Boards/Boards";
import ActionsHistory from "../ActionsHistory"
import Modal from "../Modal";
import AddModal from "../AddModal";

const AdminPanel = () => {

   const [userCount, setUserCount] = useState(1)
   const [boardCount, setBoardCount] = useState(0)
   const [actuatorCount, setActuatorCount] = useState(0)
   const [showModal, setShowModal] = useState(false);
   const [showAddModal, setShowAddModal] = useState(false);
   const [edit, setEdit] = useState([]);
   const [add, setAdd] = useState("");

   const addUsersCount = () => {
      setUserCount(userCount + 1)
   }

   const addBoardsCount = () => {
      setBoardCount(boardCount + 1)
   }

   const addActuatorsCount = () => {
      setActuatorCount(actuatorCount + 1)
   }

   const deleteUsersCount = () => {
      setUserCount(userCount - 1)
   }

   const deleteBoardsCount = () => {
      setBoardCount(boardCount - 1)
   }

   const deleteActuatorsCount = () => {
      setActuatorCount(actuatorCount - 1)
   }


   return (
      <div className=" grid grid-col-2 gap-4 m-8 ">
         <div className="">
            <UsersBoard userCount={userCount} addUsersCount={addUsersCount} deleteUsersCount={deleteUsersCount} setShowModal={setShowModal} setEdit={setEdit} setShowAddModal={setShowAddModal} setAdd={setAdd} />
         </div>
         <div className="">
            <Boards userCount={userCount} boardCount={boardCount} addBoardsCount={addBoardsCount} deleteBoardsCount={deleteBoardsCount} actuatorCount={actuatorCount} addActuatorsCount={addActuatorsCount} deleteActuatorsCount={deleteActuatorsCount} setShowModal={setShowModal} setEdit={setEdit} setShowAddModal={setShowAddModal} setAdd={setAdd}/>
         </div>
         <div className=" col-span-2">
            <ActionsHistory />
         </div>
         {showModal ? (
            <Modal  edit={edit} setShowModal={setShowModal} addUsersCount={addUsersCount} addBoardsCount={addBoardsCount} addActuatorsCount={addActuatorsCount} userCount={userCount}/>
         ) : null
               }
         {showAddModal ? ( 
            <AddModal  add={add} setShowAddModal={setShowAddModal} addUsersCount={addUsersCount} addBoardsCount={addBoardsCount} addActuatorsCount={addActuatorsCount} userCount={userCount}/>
         ) : null
               }

      </div>
   )
}

export default AdminPanel;