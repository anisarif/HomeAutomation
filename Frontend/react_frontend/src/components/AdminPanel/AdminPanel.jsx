import { useState } from "react";
import UsersBoard from "./Users/UsersBoard";
import Boards from "./Boards/Boards";
import ActionsHistory from "../ActionsHistory"

const AdminPanel = () => {

   const [ userCount, setUserCount ] = useState(1)
   const [ boardCount, setBoardCount ] = useState(0)
   const [ actuatorCount, setActuatorCount ] = useState(0)

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
      <div className=" flex flex-row justify-items-center justify-evenly ">
         <div className=" flex flex-row justify-items-center justify-evenly ">
            <h1>Admin Panel</h1>
         </div>
         <div className=" grid p-10 ">
            <UsersBoard userCount={userCount} addUsersCount={addUsersCount} deleteUsersCount={deleteUsersCount}  />
            <Boards userCount={userCount} boardCount={boardCount} addBoardsCount={addBoardsCount} deleteBoardsCount={deleteBoardsCount} actuatorCount={actuatorCount} addActuatorsCount={addActuatorsCount} deleteActuatorsCount={deleteActuatorsCount} />
         </div>
         <ActionsHistory />
      </div>
   )
}

export default AdminPanel;