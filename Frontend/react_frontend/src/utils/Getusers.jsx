import { useState, useEffect } from "react";
import { getUsers } from "./api";


const Getusers = () => {
    const [users, setUsers] = useState([])
    
    useEffect(() => {
        const fetchData = async () => {
            const loaded_users = await getUsers().Object.values()
            setUsers(loaded_users)
        }
        fetchData().catch(console.error)
    }, [users])

    return (
    <div> {users.map((user) => (

        <div key={user.id}> 
            <h1> 1{ user.username } </h1> 
        </div>

        ))}

    </div>    
    )
}

export default Getusers;