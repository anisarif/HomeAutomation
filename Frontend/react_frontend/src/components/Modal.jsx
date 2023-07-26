// Desc: Modal component for editing user, board, or actuator

import UpdateUser from "./AdminPanel/Users/UpdateUser";
import UpdateBoard from "./AdminPanel/Boards/UpdateBoard";
import UpdateActuator from "./AdminPanel/Actuators/UpdateActuator";

const Modal = ({ edit, setShowModal, addUsersCount, addBoardsCount, addActuatorsCount, userCount }) => {
    const id = edit[0]
    const toEdit = edit[2]
    const type = edit[1]
    console.log(type)
    console.log(edit)

    let ComponentToRender;

    switch (type) {
        case 'user':
            ComponentToRender = <UpdateUser id={id} user={toEdit} setShowModal={setShowModal} update={addUsersCount}/>;
            break;
        case 'board':
            ComponentToRender = <UpdateBoard id={id} board={toEdit} setShowModal={setShowModal} update={addBoardsCount} userCount={userCount}/>;
            break;
        case 'actuator':
            ComponentToRender = <UpdateActuator id={id} actuator={toEdit} setShowModal={setShowModal} update={addActuatorsCount} />;
            break;
        default:    
            ComponentToRender = null;
    }

    return (
        <div className='fixed inset-0 flex items-center justify-center'>
            <div className="max-w-xs bg-slate-800 text-slate-200 z-10 overflow-y-auto px-2 p-2 rounded-lg ">
                <button className="text-white items-center" onClick={() => { setShowModal(false) }}> X CLOSE</button>
                <div className=" p-10">
                {ComponentToRender}
                </div>
            </div>
        </div>    )
}

export default Modal;