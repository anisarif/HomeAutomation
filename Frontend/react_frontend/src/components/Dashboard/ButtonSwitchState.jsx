import { useContext, useState } from "react";
import { Context } from "../../store/appContext";
import "./ButtonSwitchState.css"

const ButtonSwitchState = (props) => {
    const { actions } = useContext(Context)
    const [newState, setNewState]= useState(props.state)

    const handleClickTrue = async () => {
        try {
            const res = await actions.updateState({ lockId: props.lockId, state: true });
            if (res===true) 
            {setNewState(true)};
        } catch (error) {
            // Handle any errors that occurred during the API call
            console.error("An error occurred:", error);
        }
    };
    
    const handleClickFalse = async () => {
        try {
            const res = await actions.updateState({ lockId: props.lockId, state: false });
            if (res===true) 
            {setNewState(false)};
        } catch (error) {
            // Handle any errors that occurred during the API call
            console.error("An error occurred:", error);
        }
    };
    

    return (
        <>
        { newState === false ? 
            <button  className="ButtonSwitchState_Off" onClick ={handleClickTrue}
            > OFF </button> :
            <button  className="ButtonSwitchState_On" onClick ={(handleClickFalse)}
            > ON </button>
        }
        </>
    )

}

export default ButtonSwitchState;