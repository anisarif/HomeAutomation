import { useState } from "react";
import UsersBoard from "./Users/UsersBoard";
import Boards from "./Boards/Boards";
import Actuators from "./Actuators/Actuators";
import './AdminPanel.css'

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
      <div >
         <div class="AdminPanel_title">
            <h1>Admin Panel</h1>
         </div>
         <div class="grid-container">
            <UsersBoard userCount={userCount} addUsersCount={addUsersCount} deleteUsersCount={deleteUsersCount}  />
            <Boards userCount={userCount} boardCount={boardCount} addBoardsCount={addBoardsCount} deleteBoardsCount={deleteBoardsCount} />
            <Actuators boardCount={boardCount} actuatorCount={actuatorCount} addActuatorsCount={addActuatorsCount} deleteActuatorsCount={deleteActuatorsCount} />
         </div>
      </div>
   )
}

export default AdminPanel;