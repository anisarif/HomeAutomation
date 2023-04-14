import { getUsers } from "../utils/api";
import { useState, useEffect } from "react";
import ButtonDeleteUser from "./ButtonDeleteUser";
import ButtonAddUser from "./ButtonAddUser";





const UsersBoard = () => {
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
            <h1>Users</h1>
            <div> {users.map((user) => (
                <div key={user.id}>
                    <h4>{user.id}</h4>
                    <h1>{user.username}</h1>
                    <h3>{user.role} </h3>
                    <ButtonDeleteUser id={user.id} />
                </div>
            ))}
                <ButtonAddUser />
            </div>
        </div>

    )

}


export default UsersBoard