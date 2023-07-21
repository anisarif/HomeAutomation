import { useState, useEffect, useContext } from "react";
import ButtonDeleteUser from "./ButtonDeleteUser";
import ButtonAddUser from "./ButtonAddUser";
import ButtonUpdateUser from "./ButtonUpdateUser";
import { Context } from "../../../store/appContext";

const UsersBoard = ({userCount, addUsersCount, deleteUsersCount }) => {
    const [users, setUsers] = useState([])
    const { actions } = useContext(Context);
    useEffect(() => {
        const fetchData = async () => {
            const loaded_users = await actions.getUsers()
            console.log(userCount)
            setUsers(JSON.parse(loaded_users))
        }
        fetchData().catch(console.error)
    }, [userCount])

    return (
        <div >
            <h3>Users</h3>
            <div > {users.map((user) => (
                <div key={user.id} className="Board" >
                    <h4>{user.id}</h4>
                    <h4>{user.username}</h4>
                    <h4>{user.role} </h4>
                    <div>
                        <ButtonUpdateUser user={user} id={user.id} update={addUsersCount} />
                        <ButtonDeleteUser id={user.id} update={deleteUsersCount} />
                    </div>
                </div>
            ))}
                <ButtonAddUser update={addUsersCount} className="ButtonAddUser" />
            </div>
        </div>

    )

}


export default UsersBoard