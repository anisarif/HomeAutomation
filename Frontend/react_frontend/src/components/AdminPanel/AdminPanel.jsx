import UsersBoard from "./Users/UsersBoard";
import Boards from "./Boards/Boards";
import Actuators from "./Actuators/Actuators";

const AdminPanel = () => {

   return (
      <div>
        <div>
            <h1>Admin Panel</h1>
        </div>
        <UsersBoard/>
        <Boards/>
        <Actuators/>
     </div>
   )
}

export default AdminPanel;