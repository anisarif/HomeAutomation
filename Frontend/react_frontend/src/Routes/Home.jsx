import { getUsers } from "../utils/api";
import { useState, useEffect } from "react";



const Home = () => {
   const [users, setUsers] = useState([])

   useEffect(() => {
      const fetchData = async () => {
         const loaded_users = await getUsers()
         setUsers(loaded_users)
      }
      fetchData().catch(console.error)
   }, [])

   return (
      <div>
         <h1>This is the homepage</h1>

         <div> {users.map((user) => (

            <div key={user.id}>
               <h1> {user.username} </h1>
            </div>

         ))}
         </div>

      </div>
   )
}

export default Home;