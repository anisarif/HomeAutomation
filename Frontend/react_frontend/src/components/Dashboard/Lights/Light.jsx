
import ButtonSwitchState from "../ButtonSwitchState";


const Light = (props) => {
    return (
        <div className="flex justify-between items-center mx-4 ">
            <h2 className="text-center text-2xl font-medium ">{props.name}</h2>
            <ButtonSwitchState lockId={props.id} state={props.state} />
            
        </div>
    )
}

export default Light;