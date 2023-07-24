import addActuator from "../../../images/addActuator.png"

const ButtonAddActuator = ({setShowAddModal, setAdd }) => {



    return (
        <>
            <button onClick={() => {
                setShowAddModal(true)
                setAdd("actuator")
            }} >
                +
            </button>
        </>
    )
}

export default ButtonAddActuator;