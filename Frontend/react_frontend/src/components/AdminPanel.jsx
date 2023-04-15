import UsersBoard from "./UsersBoard";
import Boards from "./Boards";
import Actuators from "./Actuators";

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