import { useState } from "react";
import UsersBoard from "./Users/UsersBoard";
import Boards from "./Boards/Boards";
import ActionsHistory from "../ActionsHistory"

const AdminPanel = () => {

   const [userCount, setUserCount] = useState(1)
   const [boardCount, setBoardCount] = useState(0)
   const [actuatorCount, setActuatorCount] = useState(0)

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
            <UsersBoard userCount={userCount} addUsersCount={addUsersCount} deleteUsersCount={deleteUsersCount} />
         </div>
         <div className="">
            <Boards userCount={userCount} boardCount={boardCount} addBoardsCount={addBoardsCount} deleteBoardsCount={deleteBoardsCount} actuatorCount={actuatorCount} addActuatorsCount={addActuatorsCount} deleteActuatorsCount={deleteActuatorsCount} />
         </div>
         <div className=" col-span-2">
            <ActionsHistory />
         </div>
      </div>
   )
}

export default AdminPanel;