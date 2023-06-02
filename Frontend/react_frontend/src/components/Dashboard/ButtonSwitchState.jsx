import { useContext, useState } from "react";
import { Context } from "../../store/appContext";
import "./ButtonSwitchState.css"

const ButtonSwitchState = (props) => {
    const { actions } = useContext(Context)
    const [newState, setNewState]= useState(props.state)


    console.log(props.lockId)

    
    return (
        <>
        { newState === false ? 
            <button  className="ButtonSwitchState_Off" onClick ={() => {
                actions.updateState({lockId:props.lockId, state:true})
                actions.act({lockId:props.lockId, state:true})
                setNewState(true)}}
            > OFF </button> :
            <button  className="ButtonSwitchState_On" onClick ={() => {
                actions.updateState({lockId:props.lockId, state:false})
                actions.act({lockId:props.lockId, state:false})
                setNewState(false)}}
            > ON </button>
        }
        </>
    )

}

export default ButtonSwitchState;