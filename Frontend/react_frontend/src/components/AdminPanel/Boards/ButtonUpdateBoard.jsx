
const ButtonUpdateBoard = ({id, board, setShowModal, setEdit}) => {

  return (
    <>
            <button onClick={() => {
                console.log(setShowModal);
                setShowModal(true);
                setEdit([id, 'board', board])
            }}>
                edit </button>

        </>
    )
}


export default ButtonUpdateBoard;
