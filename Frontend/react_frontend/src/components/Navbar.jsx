import switchImage from "../images/switch.png";

const Navbar = ({ handleClick }) => {
    return (
        <div className="sticky top-0 flex items-center justify-items-center justify-between h-15 bg-slate-700 rounded-b-xl">
            <div className="object-center mx-40 place-items-center">
                <h1 className="text-slate-300 font-medium">Home Automation</h1>
            </div>
            <div className="mx-20 justify-evenly">
                <button
                    onClick={handleClick}
                    className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-500 hover:text-slate-900"
                >
                    <img className="h-12 w-12" src={switchImage} alt="switch" title="Toggle Admin Panel" />
                </button>
            </div>
        </div>
    );
};

export default Navbar;
