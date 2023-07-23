
const ButtonUpdateUser = ({ id, user, setShowModal, setEdit }) => {



    return (
        <>
            <button onClick={() => {
                setShowModal(true)
                setEdit([id, user])
            }}>
                edit </button>

        </>
    )
}

export default ButtonUpdateUser