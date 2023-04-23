
import ButtonSwitchState from "../ButtonSwitchState";


const Light = (props) => {
    return (
        <div>
            <h2>{props.name}</h2>
            <ButtonSwitchState lockId={props.id} state={props.state} />
            
        </div>
    )
}

export default Light;