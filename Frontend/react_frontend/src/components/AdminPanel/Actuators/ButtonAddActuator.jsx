import addActuator from "../../../images/addActuator.png"

const ButtonAddActuator = ({setShowAddModal, setAdd }) => {



    return (
        <div className="flex w-full justify-end my-2">
        <button className=" bg-slate-400 hover:bg-slate-500 rounded-full" onClick={() => {
                  setShowAddModal(true)
                setAdd("actuator")
            }} >
        <img title="Add New Actuator" className=" h-12 w-12" src={addActuator} alt="addactuator" />
      </button>
    </div>
    )
}

export default ButtonAddActuator;