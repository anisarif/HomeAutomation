
const ButtonUpdateActuator = ({id, actuator, setShowModal, setEdit}) => {

    return (
      <>
              <button onClick={() => {
                  console.log(setShowModal);
                  setShowModal(true);
                  setEdit([id, 'actuator', actuator])
              }}>
                  edit </button>
  
          </>
      )
  }
  
  
  export default ButtonUpdateActuator;
  