import { getUsers } from "../utils/api";
import { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";



const Home = () => {
   const [users, setUsers] = useState([])
   const { store, actions } = useContext(Context)

   useEffect(() => {
      if (store.token && store.token !="" && store.token !=undefined) actions.getMessage()
      },
      [store.token])

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