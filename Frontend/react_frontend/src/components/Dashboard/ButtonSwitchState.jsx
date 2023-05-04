import { useContext, useState } from "react";
import { Context } from "../../store/appContext";

const ButtonSwitchState = (props) => {
    const { actions } = useContext(Context)
    const [newState, setNewState]= useState(props.state)


    console.log(props.lockId)

    
    return (
        <>
        { newState === false ? 
            <button  onClick ={() => {
                actions.updateState({lockId:props.lockId, state:true})
                actions.act({lockId:props.lockId, state:true})
                setNewState(true)}}
            > Turn On </button> :
            <button  onClick ={() => {
                actions.updateState({lockId:props.lockId, state:false})
                actions.act({lockId:props.lockId, state:false})
                setNewState(false)}}
            > Turn Off </button>
        }
        </>
    )

}

export default ButtonSwitchState;