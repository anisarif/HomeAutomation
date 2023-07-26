import addUser from "../../../images/addUser.png";

const ButtonAddUser = ({ setShowAddModal, setAdd }) => {


    return (
        <div className="flex w-full justify-end">
            <button className=" bg-slate-300 rounded-full hover:bg-slate-400" onClick={() => {
                setShowAddModal(true)
                setAdd("user")
            }}>
                <img title="Add New User" className=" h-12 w-12" src={addUser} alt="addUser" />
            </button>
        </div>
    )
}

export default ButtonAddUser;