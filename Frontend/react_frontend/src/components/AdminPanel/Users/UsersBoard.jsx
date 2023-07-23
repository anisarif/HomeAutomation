import { useState, useEffect, useContext } from "react";
import ButtonDeleteUser from "./ButtonDeleteUser";
import ButtonAddUser from "./ButtonAddUser";
import ButtonUpdateUser from "./ButtonUpdateUser";
import { Context } from "../../../store/appContext";

const UsersBoard = ({ userCount, addUsersCount, deleteUsersCount, setShowModal, setEdit }) => {
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
        <div className="p-4 bg-slate-200 rounded-md" >
            <div className=" grid grid-cols-3">
                <div></div>
                <h3 className=" text-slate-700 font-medium text-center text-3xl mb-8">Users</h3>
                <ButtonAddUser update={addUsersCount} className="ButtonAddUser" />
            </div>
            <div className=" justify-center"> {users.map((user) => (
                <div key={user.id} className="grid grid-cols-4 items-center my-4 text-center" >
                    <h4>{user.id}</h4>
                    <h4>{user.username}</h4>
                    <h4>{user.role} </h4>
                    <div className=" flex flex-col">
                        <ButtonUpdateUser  id={user.id} user={user} setShowModal={setShowModal()} setEdit={setEdit} />
                        <ButtonDeleteUser id={user.id} update={deleteUsersCount} />
                    </div>
                </div>
            ))}

            </div>
        </div>

    )

}


export default UsersBoard