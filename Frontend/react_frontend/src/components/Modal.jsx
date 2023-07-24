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
        <div className=" bg-slate-800 text-slate-200 fixed z-10 inset-0 overflow-y-auto items-center m-20" >
            {ComponentToRender}
            <button className=" text-white items-center" onClick={ ()=>{setShowModal(false)} }>CLOSE</button>
        </div>
    )
}

export default Modal;