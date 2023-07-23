// Desc: Modal component for editing user, board, or actuator

import UpdateUser from "./AdminPanel/Users/UpdateUser";
import UpdateBoard from "./AdminPanel/Boards/UpdateBoard";
import UpdateActuator from "./AdminPanel/Actuators/UpdateActuator";

const Modal = ({ edit, setShowModal }) => {
    const id = edit[0]
    const toEdit = edit[1]
    const type = toString(edit[1])
    console.log(type)
    console.log(edit)

    let ComponentToRender;

    switch (toEdit) {
        case 'user':
            ComponentToRender = <UpdateUser id={id} user={toEdit} setShowModal={setShowModal}/>;
            break;
        case 'board':
            ComponentToRender = <UpdateBoard id={id} />;
            break;
        case 'actuator':
            ComponentToRender = <UpdateActuator id={id} />;
            break;
        default:    
            ComponentToRender = null;
    }

    return (
        <div className=" bg-slate-800 text-slate-200 fixed z-10 inset-0 overflow-y-auto" >
            {ComponentToRender}
        </div>
    )
}

export default Modal;