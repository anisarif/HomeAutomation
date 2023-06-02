import UsersBoard from "./Users/UsersBoard";
import Boards from "./Boards/Boards";
import Actuators from "./Actuators/Actuators";
import './AdminPanel.css'

const AdminPanel = () => {

   return (
      <div >
         <div class="AdminPanel_title">
            <h1>Admin Panel</h1>
         </div>
         <div class="grid-container">
            <UsersBoard />
            <Boards />
            <Actuators />
         </div>
      </div>
   )
}

export default AdminPanel;