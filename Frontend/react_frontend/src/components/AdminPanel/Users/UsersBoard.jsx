import { getUsers } from "../../../utils/api";
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
        <div >
            <h1>Users</h1>
            <div > {users.map((user) => (
                <div key={user.id} >
                    <h4>{user.id}</h4>
                    <h4>{user.username}</h4>
                    <h4>{user.role} </h4>
                    <ButtonDeleteUser id={user.id} />
                </div>
            ))}
                <ButtonAddUser class="ButtonAddUser"/>
            </div>
        </div>

    )

}


export default UsersBoard