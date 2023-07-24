import addBoard from "../../../images/addBoard.png";
const ButtonAddBoard = ({ setAdd, setShowAddModal }) => {

  return (
    <div className="flex w-full justify-end">
      <button className=" hover:bg-slate-300 rounded-full" onClick={() => {
        setShowAddModal(true)
        setAdd("board")
      }}>
        <img title="Add New Board" className=" h-12 w-12" src={addBoard} alt="addBoard" />
      </button>
    </div>
  );
};

export default ButtonAddBoard;
