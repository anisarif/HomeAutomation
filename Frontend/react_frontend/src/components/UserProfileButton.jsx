import { Link } from 'react-router-dom';


const UserProfileButton = (id, user) => {
    return (
        <button>
            <Link  user={user} to={`user/profile/${id.id}` }>Profile</Link>
        </button>
    )
}

export default UserProfileButton;