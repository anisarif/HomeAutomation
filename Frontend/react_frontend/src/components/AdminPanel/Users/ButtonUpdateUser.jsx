
const ButtonUpdateUser = ({ id, user, setShowModal, setEdit }) => {


    return (
        <>
            <button onClick={() => {
                console.log(setShowModal);
                setShowModal(true);
                setEdit([id, 'user', user])
            }}>
                edit </button>

        </>
    )
}

export default ButtonUpdateUser