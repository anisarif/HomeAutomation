// Desc: Modal component for editing user, board, or actuator

import AddUser from "./AdminPanel/Users/AddUser";
import AddBoard from "./AdminPanel/Boards/AddBoard";
import AddActuator from "./AdminPanel/Actuators/AddActuator";

const AddModal = ({ add, setShowAddModal, addUsersCount, addBoardsCount, addActuatorsCount, userCount }) => {

    let ComponentToRender;

    switch (add) {
        case 'user':
            ComponentToRender = <AddUser setShowAddModal={setShowAddModal} update={addUsersCount} />;
            break;
        case 'board':
            ComponentToRender = <AddBoard setShowAddModal={setShowAddModal} update={addBoardsCount} userCount={userCount} />;
            break;
        case 'actuator':
            ComponentToRender = <AddActuator setShowAddModal={setShowAddModal} update={addActuatorsCount} />;
            break;
        default:
            ComponentToRender = null;
    }

    return (
        <div className='fixed inset-0 flex items-center justify-center'>
            <div className="max-w-xs bg-slate-800 text-slate-200 z-10 overflow-y-auto px-2 p-2 rounded-lg ">
                <button className="text-white items-center" onClick={() => { setShowAddModal(false) }}> X CLOSE</button>
                <div className=" p-10">
                {ComponentToRender}
                </div>
            </div>
        </div>
    )
}

export default AddModal;