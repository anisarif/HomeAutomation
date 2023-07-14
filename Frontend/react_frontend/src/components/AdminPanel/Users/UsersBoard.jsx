import { getUsers } from "../../../utils/api";
import { useState, useEffect } from "react";
import ButtonDeleteUser from "./ButtonDeleteUser";
import ButtonAddUser from "./ButtonAddUser";

const UsersBoard = () => {
    const [users, setUsers] = useState([])
    const [usersCount, setUsersCount] = useState(0)
    const updateState = () => {
        setUsersCount(usersCount+1)
    }

    useEffect(() => {
        const fetchData = async () => {
            const loaded_users = await getUsers()
            setUsers(loaded_users)
        }
        fetchData().catch(console.error)
    }, [usersCount])

    return (
        <div >
            <h1>Users</h1>
            <div > {users.map((user) => (
                <div key={user.id} className="Board" >
                    <h4>{user.id}</h4>
                    <h4>{user.username}</h4>
                    <h4>{user.role} </h4>
                    <ButtonDeleteUser id={user.id} />
                </div>
            ))}
                <ButtonAddUser update={updateState} className="ButtonAddUser"/>
            </div>
        </div>

    )

}


export default UsersBoard