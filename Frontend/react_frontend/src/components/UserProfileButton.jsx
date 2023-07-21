import { Link } from 'react-router-dom';
import userProfile from '../images/userProfile.png';

const UserProfileButton = (id, user) => {
    return (
        <button className="mx-5 rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900">
            <Link user={user} to={`user/profile/${id.id}`}>
                <img className=" h-12 w-12" src={userProfile} alt="userProfile" />
            </Link>
        </button>
    )
}

export default UserProfileButton;